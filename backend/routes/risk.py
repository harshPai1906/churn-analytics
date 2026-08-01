"""
CHURNIQ API - Risk Intelligence Routes
"""

from fastapi import APIRouter
from backend.database import get_full_dataset_df
import numpy as np

router = APIRouter(prefix="/api/risk-analysis", tags=["Risk Analysis"])

@router.get("")
def get_risk_analysis():
    df = get_full_dataset_df()
    if df is None or df.empty:
        return {"error": "Dataset not found"}
        
    low_df = df[df['risk_level'] == 'LOW']
    med_df = df[df['risk_level'] == 'MEDIUM']
    high_df = df[df['risk_level'] == 'HIGH']
    
    # Priority Customers (Ranked by Churn Probability * Revenue)
    priority_customers = df.copy()
    priority_customers['priority_score'] = (priority_customers['churn_probability'] / 100) * (priority_customers['monthly_charges'] * 12)
    priority_top = priority_customers.sort_values(by='priority_score', ascending=False).head(15)
    
    # Risk by Plan Type
    risk_by_plan = []
    for plan in ['Basic', 'Standard', 'Premium']:
        sub_df = df[df['plan_type'] == plan]
        risk_by_plan.append({
            "plan": plan,
            "high_risk": int((sub_df['risk_level'] == 'HIGH').sum()),
            "med_risk": int((sub_df['risk_level'] == 'MEDIUM').sum()),
            "low_risk": int((sub_df['risk_level'] == 'LOW').sum()),
            "revenue_at_risk": round(float(sub_df['revenue_at_risk'].sum()), 2)
        })
        
    # Risk by State (Geography)
    geo_risk = []
    for state, loc_df in df.groupby('state'):
        geo_risk.append({
            "location": state,
            "total_customers": len(loc_df),
            "high_risk_count": int((loc_df['risk_level'] == 'HIGH').sum()),
            "avg_churn_prob": round(float(loc_df['churn_probability'].mean()), 1),
            "revenue_at_risk": round(float(loc_df['revenue_at_risk'].sum()), 2)
        })
    geo_risk.sort(key=lambda x: x['revenue_at_risk'], reverse=True)
    
    # Risk by Contract Type
    risk_by_contract = []
    for contract in ['Monthly', 'Annual']:
        c_df = df[df['contract_type'] == contract]
        risk_by_contract.append({
            "contract": contract,
            "total": len(c_df),
            "high_risk_pct": round(float((c_df['risk_level'] == 'HIGH').mean() * 100), 1),
            "revenue_at_risk": round(float(c_df['revenue_at_risk'].sum()), 2)
        })
        
    return {
        "summary": {
            "high_risk_count": len(high_df),
            "medium_risk_count": len(med_df),
            "low_risk_count": len(low_df),
            "total_revenue_at_risk": round(float(df['revenue_at_risk'].sum()), 2),
            "high_risk_revenue_at_risk": round(float(high_df['revenue_at_risk'].sum()), 2),
            "avg_high_risk_prob": round(float(high_df['churn_probability'].mean()), 1) if len(high_df) > 0 else 0
        },
        "priority_customers": priority_top.to_dict(orient="records"),
        "risk_by_subscription": risk_by_plan,
        "risk_by_geography": geo_risk,
        "risk_by_contract": risk_by_contract
    }
