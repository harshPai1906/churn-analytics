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
    subscription: str = "ALL",
    location: str = "ALL",
    tenure: str = "ALL",
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
            filtered['customer_name'].str.lower().str.contains(s) |
            filtered['customer_id'].str.lower().str.contains(s)
        ]
        
    # Risk filter
    if risk != "ALL":
        filtered = filtered[filtered['risk_level'] == risk.upper()]
        
    # Subscription filter
    if subscription != "ALL":
        filtered = filtered[filtered['subscription_type'] == subscription]
        
    # Location filter
    if location != "ALL":
        filtered = filtered[filtered['location'] == location]
        
    # Tenure filter
    if tenure == "0-6":
        filtered = filtered[filtered['tenure_months'] <= 6]
    elif tenure == "6-12":
        filtered = filtered[(filtered['tenure_months'] > 6) & (filtered['tenure_months'] <= 12)]
    elif tenure == "12-24":
        filtered = filtered[(filtered['tenure_months'] > 12) & (filtered['tenure_months'] <= 24)]
    elif tenure == "24+":
        filtered = filtered[filtered['tenure_months'] > 24]
        
    # Sorting
    ascending = (order.lower() == "asc")
    valid_sort_cols = {
        "customer_id": "customer_id",
        "customer_name": "customer_name",
        "churn_probability": "churn_probability",
        "revenue_at_risk": "revenue_at_risk",
        "monthly_spend": "monthly_spend",
        "tenure_months": "tenure_months",
        "health_score": "health_score"
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
        
    cust_df = df[df['customer_id'] == customer_id]
    if cust_df.empty:
        return {"error": f"Customer {customer_id} not found"}
        
    row = cust_df.iloc[0].to_dict()
    
    # Generate SHAP factor breakdown
    shap_factors = ml_service.calculate_shap_factors(row)
    
    # Generate realistic activity timeline
    tenure = int(row['tenure_months'])
    tickets = int(row['support_tickets'])
    last_active = int(row['last_active_days'])
    
    timeline = [
        {"event": "Account Created & Subscription Activated", "date": f"{tenure} months ago", "type": "upgrade"},
        {"event": f"Subscribed to {row['subscription_type']} Plan", "date": f"{min(tenure, 12)} months ago", "type": "payment"},
    ]
    
    if tickets > 0:
        timeline.append({"event": f"Submitted Support Ticket (#{1040 + tickets})", "date": "14 days ago", "type": "ticket"})
    if row['payment_failures'] > 0:
        timeline.append({"event": "Payment Retry Warning Issued", "date": "8 days ago", "type": "warning"})
    if last_active > 7:
        timeline.append({"event": f"Inactivity Flag: {last_active} days since last session", "date": f"{last_active} days ago", "type": "warning"})
    else:
        timeline.append({"event": "User logged into Dashboard", "date": f"{last_active} days ago", "type": "login"})
        
    row['shap_factors'] = shap_factors
    row['timeline'] = timeline
    
    return row
