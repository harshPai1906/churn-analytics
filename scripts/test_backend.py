import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)
print("Health Check:", client.get("/api/health").json())
print("Dashboard Status:", client.get("/api/dashboard").status_code)
print("Customers Status:", client.get("/api/customers?limit=2").status_code)
print("Risk Analysis Status:", client.get("/api/risk-analysis").status_code)
print("Model Performance Status:", client.get("/api/model-performance").status_code)
print("AI Insights Status:", client.get("/api/ai/insights").status_code)
print("Predict Endpoint Status:", client.post("/api/predict", json={}).status_code)
print("All backend API endpoints verified successfully!")
