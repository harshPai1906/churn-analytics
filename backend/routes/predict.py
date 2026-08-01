"""
CHURNIQ API - Live Churn Sandbox Predictor Route
"""

from fastapi import APIRouter
from pydantic import BaseModel
from backend.ml_service import ml_service

router = APIRouter(prefix="/api/predict", tags=["Live Prediction"])

class CustomerPredictInput(BaseModel):
    customer_age: float = 35.0
    tenure_months: float = 12.0
    subscription_type: str = "Pro"
    monthly_spend: float = 4500.0
    contract_length: str = "1 Month"
    login_frequency: float = 14.0
    avg_session_duration: float = 20.0
    support_tickets: float = 2.0
    complaints: float = 0.0
    payment_failures: float = 0.0
    discount_usage: float = 0.0
    product_usage: str = "Medium"
    last_active_days: float = 5.0
    customer_satisfaction: float = 3.8
    previous_upgrades: float = 0.0
    previous_downgrades: float = 0.0

@router.post("")
def predict_churn(input_data: CustomerPredictInput):
    result = ml_service.predict_single(input_data.model_dump())
    return result
