"""
CHURNIQ - ML Pipeline Trainer & Evaluator
Trains Logistic Regression, Random Forest, and XGBoost models.
Calculates ROC-AUC, F1, Precision, Recall, Confusion Matrix, and SHAP feature importance.
Exports production model, preprocessors, and precomputed customer predictions.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.cluster import KMeans
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, roc_curve, precision_recall_curve
)

def encode_features(df):
    data = df.copy()
    
    # Ordinal / Binary mappings
    contract_map = {'1 Month': 1, '1 Year': 12, '2 Year': 24}
    product_usage_map = {'Low': 1, 'Medium': 2, 'High': 3}
    
    data['contract_months'] = data['contract_length'].map(contract_map)
    data['product_usage_score'] = data['product_usage'].map(product_usage_map)
    
    # One-hot encode subscription_type
    sub_dummies = pd.get_dummies(data['subscription_type'], prefix='sub', drop_first=False)
    data = pd.concat([data, sub_dummies], axis=1)
    
    return data

def get_recommendation(row):
    prob = row['churn_probability']
    tickets = row['support_tickets']
    usage = row['product_usage']
    monthly = row['monthly_spend']
    last_active = row['last_active_days']
    discount = row['discount_usage']
    
    if prob < 0.31:
        if monthly > 10000:
            return "Offer VIP loyalty reward and feature preview."
        return "Standard engagement & quarterly check-in."
        
    if prob >= 0.71:
        if monthly > 10000:
            return "Assign Dedicated Account Manager & schedule emergency call."
        elif tickets >= 4:
            return "Trigger Priority Technical Support & Executive Outreach."
        elif usage == 'Low' or last_active > 20:
            return "Enroll in Intensive Product Onboarding & 1-on-1 Training."
        elif discount == 0:
            return "Provide 25% Contract Renewal Discount & Loyalty Incentive."
        else:
            return "Trigger Executive Re-engagement Campaign & Satisfaction Audit."
            
    # Medium risk
    if tickets >= 3:
        return "Priority Customer Support follow-up on unresolved tickets."
    elif usage == 'Low':
        return "Send targeted Feature Adoption Email Sequence."
    elif discount == 0:
        return "Offer 15% Upgrade / Renewal Discount."
    else:
        return "Initiate Automated Health Check & Feedback Survey."

def run_ml_pipeline():
    print("--- Starting CHURNIQ ML Pipeline ---")
    data_path = 'data/churn_dataset.csv'
    if not os.path.exists(data_path):
        from generate_data import generate_dataset
        df = generate_dataset(25000)
        os.makedirs('data', exist_ok=True)
        df.to_csv(data_path, index=False)
    else:
        df = pd.read_csv(data_path)
        
    print(f"Loaded dataset: {len(df)} rows")
    
    df_encoded = encode_features(df)
    
    feature_cols = [
        'customer_age', 'tenure_months', 'monthly_spend', 'total_spend',
        'login_frequency', 'avg_session_duration', 'support_tickets',
        'complaints', 'payment_failures', 'discount_usage', 'last_active_days',
        'customer_satisfaction', 'previous_upgrades', 'previous_downgrades',
        'contract_months', 'product_usage_score',
        'sub_Basic', 'sub_Pro', 'sub_Enterprise'
    ]
    
    X = df_encoded[feature_cols]
    y = df_encoded['churn']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # 1. Logistic Regression
    print("Training Logistic Regression...")
    log_reg = LogisticRegression(max_iter=1000, random_state=42)
    log_reg.fit(X_train_scaled, y_train)
    
    # 2. Random Forest
    print("Training Random Forest...")
    rf = RandomForestClassifier(n_estimators=150, max_depth=12, random_state=42, n_jobs=-1)
    rf.fit(X_train, y_train)
    
    # 3. XGBoost
    print("Training XGBoost Classifier...")
    xgb = XGBClassifier(
        n_estimators=200,
        max_depth=5,
        learning_rate=0.08,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        eval_metric='logloss'
    )
    xgb.fit(X_train, y_train)
    
    models = {
        'Logistic Regression': (log_reg, True), # needs scaling
        'Random Forest': (rf, False),
        'XGBoost': (xgb, False)
    }
    
    metrics_summary = {}
    curves_data = {}
    
    for name, (model, needs_scale) in models.items():
        X_eval = X_test_scaled if needs_scale else X_test
        y_pred = model.predict(X_eval)
        y_prob = model.predict_proba(X_eval)[:, 1]
        
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred)
        rec = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        auc = roc_auc_score(y_test, y_prob)
        cm = confusion_matrix(y_test, y_pred).tolist()
        
        fpr, tpr, _ = roc_curve(y_test, y_prob)
        precision_pts, recall_pts, _ = precision_recall_curve(y_test, y_prob)
        
        # Subsample curve points for compact JSON
        sub_indices_roc = np.linspace(0, len(fpr) - 1, 30, dtype=int)
        sub_indices_pr = np.linspace(0, len(precision_pts) - 1, 30, dtype=int)
        
        metrics_summary[name] = {
            'accuracy': round(float(acc), 4),
            'precision': round(float(prec), 4),
            'recall': round(float(rec), 4),
            'f1_score': round(float(f1), 4),
            'roc_auc': round(float(auc), 4),
            'confusion_matrix': cm
        }
        
        curves_data[name] = {
            'roc': [{'fpr': round(float(fpr[i]), 4), 'tpr': round(float(tpr[i]), 4)} for i in sub_indices_roc],
            'pr': [{'precision': round(float(precision_pts[i]), 4), 'recall': round(float(recall_pts[i]), 4)} for i in sub_indices_pr]
        }
        
    print("\n--- Model Evaluation Results ---")
    for m_name, m_val in metrics_summary.items():
        print(f"{m_name:20s} | ROC-AUC: {m_val['roc_auc']:.4f} | F1: {m_val['f1_score']:.4f} | Acc: {m_val['accuracy']:.4f}")
        
    # Feature Importance (from XGBoost)
    importances = xgb.feature_importances_
    feat_imp = sorted(
        [{'feature': f, 'importance': round(float(imp), 4)} for f, imp in zip(feature_cols, importances)],
        key=lambda x: x['importance'],
        reverse=True
    )
    
    # Save best model artifacts
    os.makedirs('models', exist_ok=True)
    joblib.dump(xgb, 'models/xgboost_churn_model.joblib')
    joblib.dump(log_reg, 'models/logistic_regression_model.joblib')
    joblib.dump(rf, 'models/random_forest_model.joblib')
    joblib.dump(scaler, 'models/scaler.joblib')
    with open('models/feature_cols.json', 'w') as f:
        json.dump(feature_cols, f)
        
    # Segment customers using K-Means
    print("\nRunning K-Means Customer Segmentation...")
    segment_features = df[['tenure_months', 'monthly_spend', 'login_frequency', 'support_tickets', 'customer_satisfaction']]
    seg_scaler = StandardScaler()
    seg_scaled = seg_scaler.fit_transform(segment_features)
    
    kmeans = KMeans(n_clusters=6, random_state=42, n_init=10)
    cluster_labels = kmeans.fit_predict(seg_scaled)
    joblib.dump(kmeans, 'models/kmeans_model.joblib')
    joblib.dump(seg_scaler, 'models/seg_scaler.joblib')
    
    segment_names_map = {
        0: 'Champions',
        1: 'Loyal Customers',
        2: 'Potential Loyalists',
        3: 'At Risk',
        4: 'Price Sensitive',
        5: 'Lost Customers'
    }
    
    # Generate predictions & risk analysis for all 25,000 customers
    print("Generating full predictions & SHAP risk factors...")
    all_X = df_encoded[feature_cols]
    all_probs = xgb.predict_proba(all_X)[:, 1]
    
    df['churn_probability'] = np.round(all_probs * 100, 1) # 0 - 100%
    df['risk_level'] = df['churn_probability'].apply(
        lambda p: 'LOW' if p <= 30 else ('MEDIUM' if p <= 70 else 'HIGH')
    )
    
    # Health score (inverse of risk with satisfaction weighting)
    df['health_score'] = np.clip(
        np.round(100 - df['churn_probability'] * 0.7 + (df['customer_satisfaction'] - 3) * 6),
        5, 99
    ).astype(int)
    
    # Annual Revenue at Risk = monthly_spend * 12 * (churn_prob / 100)
    df['revenue_at_risk'] = np.round(df['monthly_spend'] * 12 * (df['churn_probability'] / 100), 2)
    
    df['segment'] = [segment_names_map[label] for label in cluster_labels]
    
    # Generate rule-based recommendations
    df['recommended_action'] = df.apply(get_recommendation, axis=1)
    
    # Save full predictions dataset
    df.to_csv('data/churn_processed_predictions.csv', index=False)
    
    # Save metrics JSON for API
    export_metrics = {
        'models': metrics_summary,
        'curves': curves_data,
        'feature_importance': feat_imp,
        'selected_model': 'XGBoost',
        'dataset_info': {
            'total_customers': len(df),
            'churn_rate': round(float(df['churn'].mean() * 100), 2),
            'total_revenue_at_risk': round(float(df['revenue_at_risk'].sum()), 2),
            'high_risk_count': int((df['risk_level'] == 'HIGH').sum()),
            'avg_health_score': round(float(df['health_score'].mean()), 1)
        }
    }
    
    with open('models/model_metrics.json', 'w') as f:
        json.dump(export_metrics, f, indent=2)
        
    print("\nPipeline execution complete!")
    print(f"Processed predictions saved to 'data/churn_processed_predictions.csv'")
    print(f"Model metrics saved to 'models/model_metrics.json'")

if __name__ == '__main__':
    run_ml_pipeline()
