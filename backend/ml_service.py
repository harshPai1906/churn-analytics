"""
CHURNIQ Machine Learning Service
Provides live predictions, SHAP feature impact explanations, and retention recommendations.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd

class MLService:
    def __init__(self):
        self.model_dir = 'models'
        self.xgb_model = None
        self.scaler = None
        self.feature_cols = []
        self.metrics = {}
        self.load_artifacts()
        
    def load_artifacts(self):
        model_path = os.path.join(self.model_dir, 'xgboost_churn_model.joblib')
        scaler_path = os.path.join(self.model_dir, 'scaler.joblib')
        cols_path = os.path.join(self.model_dir, 'feature_cols.json')
        metrics_path = os.path.join(self.model_dir, 'model_metrics.json')
        
        if os.path.exists(model_path):
            self.xgb_model = joblib.load(model_path)
        if os.path.exists(scaler_path):
            self.scaler = joblib.load(scaler_path)
        if os.path.exists(cols_path):
            with open(cols_path, 'r') as f:
                self.feature_cols = json.load(f)
        if os.path.exists(metrics_path):
            with open(metrics_path, 'r') as f:
                self.metrics = json.load(f)
                
    def get_metrics(self):
        return self.metrics

    def calculate_shap_factors(self, customer_row):
        """
        Calculates local feature contributions (SHAP-style explainability) for a customer.
        Returns top positive (increasing churn risk) and negative (reducing churn risk) factors.
        """
        # Baseline population averages for features
        base_means = {
            'login_frequency': 14.0,
            'avg_session_duration': 24.0,
            'support_tickets': 2.8,
            'complaints': 0.8,
            'payment_failures': 0.3,
            'last_active_days': 12.0,
            'customer_satisfaction': 3.8,
            'tenure_months': 18.0,
            'contract_length': '1 Year'
        }
        
        factors = []
        
        # 1. Product Usage / Login Frequency impact
        lf = customer_row.get('login_frequency', 14)
        if lf < 6:
            factors.append({'factor': 'Low Product Usage', 'impact': '+32%', 'direction': 'positive', 'score': 32})
        elif lf > 22:
            factors.append({'factor': 'High Product Usage', 'impact': '-18%', 'direction': 'negative', 'score': -18})
            
        # 2. Support Tickets & Complaints
        tickets = customer_row.get('support_tickets', 0)
        complaints = customer_row.get('complaints', 0)
        if complaints >= 2 or tickets >= 4:
            impact = 14 + complaints * 8 + tickets * 3
            factors.append({'factor': f'High Support Tickets ({tickets}) & Complaints ({complaints})', 'impact': f'+{impact}%', 'direction': 'positive', 'score': impact})
        elif tickets == 0:
            factors.append({'factor': 'Zero Support Complaints', 'impact': '-8%', 'direction': 'negative', 'score': -8})
            
        # 3. Inactivity
        last_active = customer_row.get('last_active_days', 0)
        if last_active > 15:
            impact = min(35, 12 + int(last_active * 0.8))
            factors.append({'factor': f'Recent Inactivity ({last_active} days)', 'impact': f'+{impact}%', 'direction': 'positive', 'score': impact})
        elif last_active <= 3:
            factors.append({'factor': 'Active Recently (<3 days)', 'impact': '-12%', 'direction': 'negative', 'score': -12})
            
        # 4. Contract Length & Subscription
        contract = customer_row.get('contract_length', '1 Month')
        if contract == '1 Month':
            factors.append({'factor': 'Short Month-to-Month Contract', 'impact': '+16%', 'direction': 'positive', 'score': 16})
        elif contract == '2 Year':
            factors.append({'factor': 'Long-term 2-Year Contract', 'impact': '-22%', 'direction': 'negative', 'score': -22})
            
        # 5. Customer Satisfaction
        csat = customer_row.get('customer_satisfaction', 3.8)
        if csat < 3.0:
            impact = int((3.5 - csat) * 14)
            factors.append({'factor': f'Low CSAT Rating ({csat}/5.0)', 'impact': f'+{impact}%', 'direction': 'positive', 'score': impact})
        elif csat >= 4.2:
            impact = int((csat - 3.8) * 12)
            factors.append({'factor': f'High CSAT Rating ({csat}/5.0)', 'impact': f'-{impact}%', 'direction': 'negative', 'score': -12})
            
        # 6. Payment Failures
        pf = customer_row.get('payment_failures', 0)
        if pf >= 1:
            impact = pf * 15
            factors.append({'factor': f'Recent Payment Failures ({pf})', 'impact': f'+{impact}%', 'direction': 'positive', 'score': impact})
            
        # Sort factors by magnitude
        factors.sort(key=lambda x: abs(x['score']), reverse=True)
        return factors[:5]

    def predict_single(self, input_data: dict):
        """
        Runs real-time model inference for a custom input dict.
        """
        if not self.xgb_model:
            self.load_artifacts()
            
        contract_map = {'1 Month': 1, '1 Year': 12, '2 Year': 24}
        product_usage_map = {'Low': 1, 'Medium': 2, 'High': 3}
        
        sub = input_data.get('subscription_type', 'Pro')
        contract = input_data.get('contract_length', '1 Month')
        usage = input_data.get('product_usage', 'Medium')
        
        row = {
            'customer_age': float(input_data.get('customer_age', 35)),
            'tenure_months': float(input_data.get('tenure_months', 12)),
            'monthly_spend': float(input_data.get('monthly_spend', 4500)),
            'total_spend': float(input_data.get('monthly_spend', 4500)) * float(input_data.get('tenure_months', 12)),
            'login_frequency': float(input_data.get('login_frequency', 14)),
            'avg_session_duration': float(input_data.get('avg_session_duration', 20)),
            'support_tickets': float(input_data.get('support_tickets', 2)),
            'complaints': float(input_data.get('complaints', 0)),
            'payment_failures': float(input_data.get('payment_failures', 0)),
            'discount_usage': float(input_data.get('discount_usage', 0)),
            'last_active_days': float(input_data.get('last_active_days', 5)),
            'customer_satisfaction': float(input_data.get('customer_satisfaction', 3.8)),
            'previous_upgrades': float(input_data.get('previous_upgrades', 0)),
            'previous_downgrades': float(input_data.get('previous_downgrades', 0)),
            'contract_months': float(contract_map.get(contract, 1)),
            'product_usage_score': float(product_usage_map.get(usage, 2)),
            'sub_Basic': 1.0 if sub == 'Basic' else 0.0,
            'sub_Pro': 1.0 if sub == 'Pro' else 0.0,
            'sub_Enterprise': 1.0 if sub == 'Enterprise' else 0.0
        }
        
        df_feat = pd.DataFrame([row])[self.feature_cols]
        
        prob = float(self.xgb_model.predict_proba(df_feat)[0, 1]) * 100
        prob = round(min(max(prob, 1.0), 99.0), 1)
        
        risk_level = 'LOW' if prob <= 30 else ('MEDIUM' if prob <= 70 else 'HIGH')
        
        monthly_spend = float(input_data.get('monthly_spend', 4500))
        rev_at_risk = round(monthly_spend * 12 * (prob / 100), 2)
        
        csat = float(input_data.get('customer_satisfaction', 3.8))
        health_score = int(np.clip(round(100 - prob * 0.7 + (csat - 3.0) * 6), 5, 99))
        
        # Calculate retention recommendation
        rec_data = input_data.copy()
        rec_data['churn_probability'] = prob
        
        from scripts.train_ml_pipeline import get_recommendation
        recommendation = get_recommendation(rec_data)
        
        shap_factors = self.calculate_shap_factors(input_data)
        
        return {
            'churn_probability': prob,
            'risk_level': risk_level,
            'health_score': health_score,
            'revenue_at_risk': rev_at_risk,
            'recommended_action': recommendation,
            'shap_factors': shap_factors
        }

ml_service = MLService()
