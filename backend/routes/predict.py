"""
CHURNIQ API - Live Churn Sandbox Predictor Route
"""

from fastapi import APIRouter
from pydantic import BaseModel
from backend.ml_service import ml_service

router = APIRouter(prefix="/api/predict", tags=["Live Prediction"])

class CustomerPredictInput(BaseModel):
    age: float = 30.0
    tenure_months: float = 12.0
    plan_type: str = "Standard"
    subscription_type: str = "Organic"
    contract_type: str = "Monthly"
    monthly_charges: float = 15.0
    cltv: float = 640.0
    churn_score: float = 34.0
    escalations: str = "N"
    csat_score: float = 50.0
    complaint_count: float = 1.0
    gender: str = "Male"
    cancellation_reason: str = "Too expensive"

@router.post("")
def predict_churn(input_data: CustomerPredictInput):
    result = ml_service.predict_single(input_data.model_dump())
    return result
