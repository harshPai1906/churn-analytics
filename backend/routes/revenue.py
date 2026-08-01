"""
CHURNIQ API - Revenue Intelligence Routes
"""

from fastapi import APIRouter
from backend.database import get_full_dataset_df

router = APIRouter(prefix="/api/revenue", tags=["Revenue"])

@router.get("")
def get_revenue_analytics():
    df = get_full_dataset_df()
    if df is None or df.empty:
        return {"error": "Dataset not found"}
        
    mrr = round(float(df['monthly_charges'].sum()), 2)
    arr = round(mrr * 12, 2)
    rev_at_risk = round(float(df['revenue_at_risk'].sum()), 2)
    
    # Revenue recovered estimate (assuming 35% of targeted high-risk campaigns succeed)
    rev_recovered = round(rev_at_risk * 0.35, 2)
    
    arpu = round(float(df['monthly_charges'].mean()), 2)
    ltv = round(float(df['cltv'].mean()), 2)
    
    # Monthly Revenue Trend (12 Months)
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    rev_trend = [
        {
            "month": m,
            "arr": round((arr / 12) * (1 + 0.02 * i), 2),
            "revenue_at_risk": round((rev_at_risk / 12) * (1 + (0.03 if i in [7, 8, 9] else 0.01) * i), 2),
            "recovered": round((rev_recovered / 12) * (1 + 0.015 * i), 2)
        }
        for i, m in enumerate(months)
    ]
    
    # Revenue by Plan Type
    rev_by_plan = []
    for plan, sub_df in df.groupby('plan_type'):
        sub_arr = float(sub_df['monthly_charges'].sum() * 12)
        rev_by_plan.append({
            "plan": plan,
            "arr": round(sub_arr, 2),
            "pct_of_total": round(sub_arr / arr * 100, 1) if arr > 0 else 0,
            "revenue_at_risk": round(float(sub_df['revenue_at_risk'].sum()), 2)
        })
        
    # Revenue at Risk by Customer Segment
    rev_by_seg = []
    for seg, seg_df in df.groupby('segment'):
        rev_by_seg.append({
            "segment": seg,
            "arr": round(float(seg_df['monthly_charges'].sum() * 12), 2),
            "revenue_at_risk": round(float(seg_df['revenue_at_risk'].sum()), 2),
            "churn_prob": round(float(seg_df['churn_probability'].mean()), 1)
        })
    rev_by_seg.sort(key=lambda x: x['revenue_at_risk'], reverse=True)
    
    return {
        "kpis": {
            "total_arr": arr,
            "mrr": mrr,
            "revenue_at_risk": rev_at_risk,
            "revenue_recovered": rev_recovered,
            "arpu": arpu,
            "ltv": ltv
        },
        "revenue_trend": rev_trend,
        "revenue_by_subscription": rev_by_plan,
        "revenue_by_segment": rev_by_seg
    }
