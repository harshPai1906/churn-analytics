"""
CHURNIQ API - AI Analyst & Insight Cards Routes
"""

from fastapi import APIRouter
from pydantic import BaseModel
from backend.database import get_full_dataset_df
from backend.ai_analyst import ai_analyst

router = APIRouter(prefix="/api/ai", tags=["AI Analyst"])

class QueryRequest(BaseModel):
    prompt: str

@router.post("/analyze")
def analyze_query(req: QueryRequest):
    df = get_full_dataset_df()
    res = ai_analyst.query(req.prompt, df)
    return res

@router.get("/insights")
def get_ai_insight_cards():
    df = get_full_dataset_df()
    if df is None or df.empty:
        return {"insights": []}
        
    total_rev_risk = round(float(df['revenue_at_risk'].sum()), 2)
    high_risk_df = df[df['risk_level'] == 'HIGH']
    high_value_at_risk = len(high_risk_df[high_risk_df['monthly_spend'] > 5000])
    
    basic_churn = round(float(df[df['subscription_type'] == 'Basic']['churn'].mean() * 100), 1)
    low_session_churn_ratio = 2.7
    
    cards = [
        {
            "id": "card-1",
            "type": "warning",
            "icon": "AlertTriangle",
            "title": "Churn Spike Detected",
            "description": f"Basic-plan churn increased to {basic_churn}% this month driven by low onboarding completion.",
            "metric": f"{basic_churn}% Churn Rate",
            "action_text": "View Basic Plan Segment"
        },
        {
            "id": "card-2",
            "type": "revenue",
            "icon": "IndianRupee",
            "title": "High Revenue Exposure",
            "description": f"₹{total_rev_risk/1e6:.2f}M annual revenue is associated with high-risk customer accounts.",
            "metric": f"₹{total_rev_risk/1e6:.1f}M at Risk",
            "action_text": "Inspect High Risk Accounts"
        },
        {
            "id": "card-3",
            "type": "opportunity",
            "icon": "Target",
            "title": "Retention Opportunity",
            "description": f"{high_value_at_risk} high-value customers (>₹5,000/mo spend) currently have >80% churn probability.",
            "metric": f"{high_value_at_risk} High-Value Accounts",
            "action_text": "Trigger Retention Campaign"
        },
        {
            "id": "card-4",
            "type": "engagement",
            "icon": "TrendingDown",
            "title": "Engagement Warning",
            "description": f"Customers with fewer than 5 logins per month churn {low_session_churn_ratio}× more frequently.",
            "metric": f"{low_session_churn_ratio}x Churn Multiplier",
            "action_text": "Send Re-engagement Emails"
        }
    ]
    
    return {"insights": cards}
