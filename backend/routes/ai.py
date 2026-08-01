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
    high_value_at_risk = len(high_risk_df[high_risk_df['monthly_charges'] > 20])
    
    basic_churn = round(float(df[df['plan_type'] == 'Basic']['churn_flag'].mean() * 100), 1)
    monthly_churn = round(float(df[df['contract_type'] == 'Monthly']['churn_flag'].mean() * 100), 1)
    
    cards = [
        {
            "id": "card-1",
            "type": "warning",
            "icon": "AlertTriangle",
            "title": "Churn Spike Detected",
            "description": f"Basic-plan churn at {basic_churn}%. Monthly contracts churn at {monthly_churn}%.",
            "metric": f"{basic_churn}% Basic Churn",
            "action_text": "View Basic Plan Segment"
        },
        {
            "id": "card-2",
            "type": "revenue",
            "icon": "IndianRupee",
            "title": "High Revenue Exposure",
            "description": f"₹{total_rev_risk/1e3:.2f}K annual revenue is associated with high-risk customer accounts.",
            "metric": f"₹{total_rev_risk/1e3:.1f}K at Risk",
            "action_text": "Inspect High Risk Accounts"
        },
        {
            "id": "card-3",
            "type": "opportunity",
            "icon": "Target",
            "title": "Retention Opportunity",
            "description": f"{high_value_at_risk} high-value customers (>₹20/mo spend) currently have >70% churn probability.",
            "metric": f"{high_value_at_risk} High-Value Accounts",
            "action_text": "Trigger Retention Campaign"
        },
        {
            "id": "card-4",
            "type": "engagement",
            "icon": "TrendingDown",
            "title": "Escalation Warning",
            "description": f"Customers with escalation tickets churn significantly more frequently than non-escalated accounts.",
            "metric": "Escalation = High Risk",
            "action_text": "Review Escalation Queue"
        }
    ]
    
    return {"insights": cards}
