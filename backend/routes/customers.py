"""
CHURNIQ API - Customer Intelligence Routes
"""

from fastapi import APIRouter, Query
from backend.database import get_full_dataset_df
from backend.ml_service import ml_service
import pandas as pd
import numpy as np

router = APIRouter(prefix="/api/customers", tags=["Customers"])

@router.get("")
def get_customers(
    search: str = "",
    risk: str = "ALL",
    plan: str = "ALL",
    state: str = "ALL",
    contract: str = "ALL",
    sort_by: str = "revenue_at_risk",
    order: str = "desc",
    page: int = 1,
    limit: int = 20
):
    df = get_full_dataset_df()
    if df is None or df.empty:
        return {"total": 0, "customers": []}
        
    filtered = df.copy()
    
    # Search filter (name or ID)
    if search:
        s = search.lower().strip()
        filtered = filtered[
            filtered['customer name'].str.lower().str.contains(s) |
            filtered['customerid'].str.lower().str.contains(s)
        ]
        
    # Risk filter
    if risk != "ALL":
        filtered = filtered[filtered['risk_level'] == risk.upper()]
        
    # Plan filter
    if plan != "ALL":
        filtered = filtered[filtered['plan_type'] == plan]
        
    # State filter
    if state != "ALL":
        filtered = filtered[filtered['state'] == state]

    # Contract filter
    if contract != "ALL":
        filtered = filtered[filtered['contract_type'] == contract]
        
    # Sorting
    ascending = (order.lower() == "asc")
    valid_sort_cols = {
        "customerid": "customerid",
        "customer_name": "customer name",
        "churn_probability": "churn_probability",
        "revenue_at_risk": "revenue_at_risk",
        "monthly_charges": "monthly_charges",
        "churn_score": "churn_score",
        "health_score": "health_score",
        "csat_score": "csat_score"
    }
    col = valid_sort_cols.get(sort_by, "revenue_at_risk")
    filtered = filtered.sort_values(by=col, ascending=ascending)
    
    total_count = len(filtered)
    
    # Pagination
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paginated_df = filtered.iloc[start_idx:end_idx]
    
    records = paginated_df.to_dict(orient="records")
    
    return {
        "total": total_count,
        "page": page,
        "limit": limit,
        "total_pages": int(np.ceil(total_count / limit)) if limit > 0 else 1,
        "customers": records
    }

@router.get("/{customer_id}")
def get_customer_detail(customer_id: str):
    df = get_full_dataset_df()
    if df is None or df.empty:
        return {"error": "Dataset not found"}
        
    cust_df = df[df['customerid'] == customer_id]
    if cust_df.empty:
        return {"error": f"Customer {customer_id} not found"}
        
    row = cust_df.iloc[0].to_dict()
    
    # Generate SHAP factor breakdown
    shap_factors = ml_service.calculate_shap_factors(row)
    
    # Generate realistic activity timeline
    escalation = row.get('escalations', 'N')
    plan = row.get('plan_type', 'Standard')
    
    timeline = [
        {"event": "Subscription Started", "date": row.get('subscription_start_date', 'N/A'), "type": "upgrade"},
        {"event": f"Subscribed to {plan} Plan", "date": row.get('subscription_start_date', 'N/A'), "type": "payment"},
    ]
    
    if escalation == 'Y':
        timeline.append({"event": "Support Escalation Filed", "date": row.get('complaint_date', 'N/A'), "type": "ticket"})
    
    reason = row.get('cancellation_reason', '')
    if reason:
        timeline.append({"event": f"Cancellation Reason: {reason}", "date": row.get('cancellation_date', 'N/A'), "type": "warning"})
    
    row['shap_factors'] = shap_factors
    row['timeline'] = timeline
    
    return row
