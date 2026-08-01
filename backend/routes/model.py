"""
CHURNIQ API - Model Performance & Explainability Routes
"""

from fastapi import APIRouter
from backend.ml_service import ml_service

router = APIRouter(prefix="/api/model-performance", tags=["Model Performance"])

@router.get("")
def get_model_performance():
    metrics = ml_service.get_metrics()
    if not metrics:
        return {"error": "Model metrics not loaded. Run train_ml_pipeline.py."}
        
    return {
        "models": metrics.get("models", {}),
        "curves": metrics.get("curves", {}),
        "feature_importance": metrics.get("feature_importance", []),
        "selected_model": metrics.get("selected_model", "XGBoost"),
        "dataset_info": metrics.get("dataset_info", {}),
        "model_limitations": [
            "Predictions represent statistical probabilities based on past historical behavior, not guaranteed outcomes.",
            "Changes in macroeconomic conditions or pricing structure may shift ground truth distributions over time.",
            "Predictions should support, not replace, human Customer Success judgment and executive intuition."
        ]
    }
