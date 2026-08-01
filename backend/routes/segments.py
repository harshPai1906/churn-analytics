"""
CHURNIQ API - Customer Segmentation Routes
"""

from fastapi import APIRouter
from backend.database import get_full_dataset_df

router = APIRouter(prefix="/api/segments", tags=["Segments"])

@router.get("")
def get_segments():
    df = get_full_dataset_df()
    if df is None or df.empty:
        return {"error": "Dataset not found"}
        
    segments_summary = []
    
    colors = {
        'Champions': '#10b981',
        'Loyal Customers': '#06b6d4',
        'Potential Loyalists': '#3b82f6',
        'At Risk': '#f59e0b',
        'Price Sensitive': '#8b5cf6',
        'Lost Customers': '#f43f5e'
    }
    
    descriptions = {
        'Champions': 'Highest tenure & spend with daily engagement and perfect CSAT.',
        'Loyal Customers': 'Consistent monthly spend, low ticket frequency, strong retention.',
        'Potential Loyalists': 'Recent signups with high usage; prime candidates for plan upgrades.',
        'At Risk': 'Decreasing login frequency, elevated support complaints, high ARR exposure.',
        'Price Sensitive': 'High discount usage, basic subscription, responsive to promotions.',
        'Lost Customers': 'High inactivity (>30 days), payment failures, imminent churn probability.'
    }
    
    for seg_name, seg_df in df.groupby('segment'):
        segments_summary.append({
            "segment_name": seg_name,
            "segment_size": len(seg_df),
            "pct_of_total": round(float(len(seg_df) / len(df) * 100), 1),
            "avg_revenue": round(float(seg_df['monthly_spend'].mean()), 2),
            "avg_tenure": round(float(seg_df['tenure_months'].mean()), 1),
            "avg_churn_prob": round(float(seg_df['churn_probability'].mean()), 1),
            "churn_rate": round(float(seg_df['churn'].mean() * 100), 1),
            "revenue_at_risk": round(float(seg_df['revenue_at_risk'].sum()), 2),
            "color": colors.get(seg_name, '#64748b'),
            "description": descriptions.get(seg_name, '')
        })
        
    segments_summary.sort(key=lambda x: x['segment_size'], reverse=True)
    
    return {
        "total_customers": len(df),
        "segments": segments_summary
    }
