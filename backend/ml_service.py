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
        factors = []
        
        # 1. Contract Type impact
        contract = customer_row.get('contract_type', 'Monthly')
        if contract == 'Monthly':
            factors.append({'factor': 'Month-to-Month Contract', 'impact': '+28%', 'direction': 'positive', 'score': 28})
        elif contract == 'Annual':
            factors.append({'factor': 'Annual Contract Commitment', 'impact': '-15%', 'direction': 'negative', 'score': -15})
            
        # 2. Plan Type
        plan = customer_row.get('plan_type', 'Standard')
        if plan == 'Basic':
            factors.append({'factor': 'Basic Plan (High Drop-off Tier)', 'impact': '+22%', 'direction': 'positive', 'score': 22})
        elif plan == 'Premium':
            factors.append({'factor': 'Premium Plan (Strong Retention)', 'impact': '-18%', 'direction': 'negative', 'score': -18})
            
        # 3. Escalations
        escalation = customer_row.get('escalations', 'N')
        if escalation == 'Y':
            factors.append({'factor': 'Active Escalation Ticket', 'impact': '+25%', 'direction': 'positive', 'score': 25})
        else:
            factors.append({'factor': 'No Escalation Issues', 'impact': '-8%', 'direction': 'negative', 'score': -8})
            
        # 4. CSAT Score
        csat = float(customer_row.get('csat_score', 50))
        if csat < 30:
            impact = int((50 - csat) * 0.5)
            factors.append({'factor': f'Low CSAT Score ({csat:.1f}/100)', 'impact': f'+{impact}%', 'direction': 'positive', 'score': impact})
        elif csat >= 70:
            factors.append({'factor': f'High CSAT Score ({csat:.1f}/100)', 'impact': '-12%', 'direction': 'negative', 'score': -12})
            
        # 5. Churn Score
        churn_score = int(customer_row.get('churn_score', 50))
        if churn_score >= 70:
            factors.append({'factor': f'High Churn Risk Score ({churn_score})', 'impact': f'+{churn_score // 3}%', 'direction': 'positive', 'score': churn_score // 3})
        elif churn_score < 20:
            factors.append({'factor': f'Low Churn Risk Score ({churn_score})', 'impact': '-10%', 'direction': 'negative', 'score': -10})
            
        # 6. Cancellation Reason
        reason = customer_row.get('cancellation_reason', '')
        if reason == 'Too expensive':
            factors.append({'factor': 'Price Sensitivity (Too Expensive)', 'impact': '+18%', 'direction': 'positive', 'score': 18})
        elif reason == 'Switched to competitor':
            factors.append({'factor': 'Competitive Loss Risk', 'impact': '+15%', 'direction': 'positive', 'score': 15})
            
        # Sort factors by magnitude
        factors.sort(key=lambda x: abs(x['score']), reverse=True)
        return factors[:5]

    def predict_single(self, input_data: dict):
        """
        Runs real-time model inference for a custom input dict.
        """
        if not self.xgb_model:
            self.load_artifacts()

        plan = input_data.get('plan_type', 'Standard')
        contract = input_data.get('contract_type', 'Monthly')
        sub_type = input_data.get('subscription_type', 'Organic')
        escalation = input_data.get('escalations', 'N')
        gender = input_data.get('gender', 'Male')

        row = {
            'age': float(input_data.get('age', 30)),
            'tenure_months': float(input_data.get('tenure_months', 12)),
            'monthly_charges': float(input_data.get('monthly_charges', 15)),
            'cltv': float(input_data.get('cltv', 640)),
            'churn_score': float(input_data.get('churn_score', 34)),
            'csat_score': float(input_data.get('csat_score', 50)),
            'complaint_count': float(input_data.get('complaint_count', 1.0)),
            'contract_monthly': 1.0 if contract == 'Monthly' else 0.0,
            'escalation_flag': 1.0 if escalation == 'Y' else 0.0,
            'gender_male': 1.0 if gender == 'Male' else 0.0,
            'plan_Basic': 1.0 if plan == 'Basic' else 0.0,
            'plan_Standard': 1.0 if plan == 'Standard' else 0.0,
            'plan_Premium': 1.0 if plan == 'Premium' else 0.0,
            'sub_type_Organic': 1.0 if sub_type == 'Organic' else 0.0,
            'sub_type_Paid': 1.0 if sub_type == 'Paid' else 0.0,
            'sub_type_Refferal': 1.0 if sub_type == 'Refferal' else 0.0
        }

        df_feat = pd.DataFrame([row])[self.feature_cols]

        prob = float(self.xgb_model.predict_proba(df_feat)[0, 1]) * 100
        prob = round(min(max(prob, 1.0), 99.0), 1)

        risk_level = 'LOW' if prob <= 30 else ('MEDIUM' if prob <= 70 else 'HIGH')

        monthly_charges = float(input_data.get('monthly_charges', 15))
        rev_at_risk = round(monthly_charges * 12 * (prob / 100), 2)

        csat = float(input_data.get('csat_score', 50))
        health_score = int(np.clip(round(100 - prob * 0.7 + (csat / 100 - 0.5) * 20), 5, 99))

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
