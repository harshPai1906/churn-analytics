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
    priority_customers['priority_score'] = (priority_customers['churn_probability'] / 100) * (priority_customers['monthly_spend'] * 12)
    priority_top = priority_customers.sort_values(by='priority_score', ascending=False).head(15)
    
    # Risk by Subscription
    risk_by_sub = []
    for sub in ['Basic', 'Pro', 'Enterprise']:
        sub_df = df[df['subscription_type'] == sub]
        risk_by_sub.append({
            "plan": sub,
            "high_risk": int((sub_df['risk_level'] == 'HIGH').sum()),
            "med_risk": int((sub_df['risk_level'] == 'MEDIUM').sum()),
            "low_risk": int((sub_df['risk_level'] == 'LOW').sum()),
            "revenue_at_risk": round(float(sub_df['revenue_at_risk'].sum()), 2)
        })
        
    # Risk by Geography
    geo_risk = []
    for loc, loc_df in df.groupby('location'):
        geo_risk.append({
            "location": loc,
            "total_customers": len(loc_df),
            "high_risk_count": int((loc_df['risk_level'] == 'HIGH').sum()),
            "avg_churn_prob": round(float(loc_df['churn_probability'].mean()), 1),
            "revenue_at_risk": round(float(loc_df['revenue_at_risk'].sum()), 2)
        })
    geo_risk.sort(key=lambda x: x['revenue_at_risk'], reverse=True)
    
    # Risk by Customer Value (Spend Brackets)
    val_brackets = [
        ("Starter (<₹2k/mo)", df['monthly_spend'] < 2000),
        ("Growth (₹2k-₹10k/mo)", (df['monthly_spend'] >= 2000) & (df['monthly_spend'] < 10000)),
        ("Scale (₹10k-₹20k/mo)", (df['monthly_spend'] >= 10000) & (df['monthly_spend'] < 20000)),
        ("Enterprise (>₹20k/mo)", df['monthly_spend'] >= 20000)
    ]
    
    risk_by_value = []
    for label, mask in val_brackets:
        v_df = df[mask]
        risk_by_value.append({
            "bracket": label,
            "total": len(v_df),
            "high_risk_pct": round(float((v_df['risk_level'] == 'HIGH').mean() * 100), 1),
            "revenue_at_risk": round(float(v_df['revenue_at_risk'].sum()), 2)
        })
        
    return {
        "summary": {
            "high_risk_count": len(high_df),
            "medium_risk_count": len(med_df),
            "low_risk_count": len(low_df),
            "total_revenue_at_risk": round(float(df['revenue_at_risk'].sum()), 2),
            "high_risk_revenue_at_risk": round(float(high_df['revenue_at_risk'].sum()), 2),
            "avg_high_risk_prob": round(float(high_df['churn_probability'].mean()), 1)
        },
        "priority_customers": priority_top.to_dict(orient="records"),
        "risk_by_subscription": risk_by_sub,
        "risk_by_geography": geo_risk,
        "risk_by_value": risk_by_value
    }
