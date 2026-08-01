"""
CHURNIQ - Main FastAPI Application
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.routes.dashboard import router as dashboard_router
from backend.routes.customers import router as customers_router
from backend.routes.risk import router as risk_router
from backend.routes.segments import router as segments_router
from backend.routes.revenue import router as revenue_router
from backend.routes.ai import router as ai_router
from backend.routes.model import router as model_router
from backend.routes.predict import router as predict_router

app = FastAPI(
    title="CHURNIQ API",
    description="AI-Powered Customer Churn & Retention Intelligence Platform API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router)
app.include_router(customers_router)
app.include_router(risk_router)
app.include_router(segments_router)
app.include_router(revenue_router)
app.include_router(ai_router)
app.include_router(model_router)
app.include_router(predict_router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "platform": "CHURNIQ",
        "engine": "FastAPI + XGBoost ML Engine",
        "version": "1.0.0"
    }

# Mount static frontend build if exists
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
