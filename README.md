# CHURNIQ — AI-Powered Customer Churn & Retention Intelligence Platform

> **Predict Churn. Protect Revenue. Retain Customers.**  
> *AI-powered SaaS analytics & retention intelligence platform for Data Analyst / Data Scientist portfolio.*

![CHURNIQ Platform Banner](https://img.shields.io/badge/CHURNIQ-Production--Grade-0284c7?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-2.0+-FF6F00?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## 1. Executive Summary & Business Problem

Customer acquisition cost (CAC) in SaaS markets is 5× to 7× higher than customer retention cost. Unidentified churn erodes Annual Recurring Revenue (ARR) and customer lifetime value (LTV).

**CHURNIQ** is an enterprise-grade Customer Churn & Retention Intelligence Platform built to answer 6 critical business questions for Revenue and Customer Success teams:

1. **Which customers are most likely to churn?** (Predicted via Machine Learning probability scores: 0–100%)
2. **Why are they likely to churn?** (Decomposed using local SHAP TreeExplainer feature contributions)
3. **Which customer segments have the highest churn?** (Discovered using K-Means clustering and RFM analysis)
4. **How much revenue is at risk?** (Quantified as `monthly_spend × 12 × churn_probability`)
5. **Which customers should the retention team contact first?** (Ranked via a financial risk matrix: `Churn Probability × ARR`)
6. **What action should be taken for each high-risk customer?** (Triggered via automated rule-based retention playbooks)

---

## 2. Platform Key Features

- **Executive Analytics Dashboard**: Real-time KPI tracking for Total Customers (24,582+), Churn Rate (18.4%), Revenue at Risk (₹18.7M), High-Risk Accounts, and LTV.
- **Searchable Customer Directory**: Multi-filterable directory supporting real-time filtering by Risk Level, Subscription Plan, Location, Tenure, Spend, and Churn Probability.
- **Explainable Customer Profiles**: Deep-dive profile drawers displaying Health Scores (0–100), SHAP waterfall risk factors (e.g. Low usage +32%, Tickets +18%), and activity timelines.
- **Risk Analysis & Revenue Matrix**: Priority customer queue sorting accounts by maximal financial exposure (`Churn Probability × ARR`).
- **Unsupervised Segmentation**: 6 RFM & K-Means clusters (*Champions*, *Loyal Customers*, *Potential Loyalists*, *At Risk*, *Price Sensitive*, *Lost Customers*).
- **ChatGPT-Style AI Analyst**: Natural language dataset assistant ("Ask your data anything") powered by Gemini/OpenAI API with a local analytical engine fallback.
- **Interactive Sandbox Predictor**: Live playground allowing users and recruiters to adjust custom customer parameters and see instant XGBoost predictions & SHAP explanations.
- **ML Governance Dashboard**: Comparative classifier benchmarks (ROC curves, confusion matrices, precision-recall curves, feature importance, and model limitations).

---

## 3. Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI** | React 18, Vite, Tailwind CSS, Recharts, Lucide Icons, JavaScript (ES6+) |
| **Backend API** | Python, FastAPI, Uvicorn, Pydantic, SQLAlchemy, Dotenv |
| **Relational Database** | PostgreSQL / SQLite (Dual-engine configuration out of the box) |
| **Machine Learning** | XGBoost Classifier, Random Forest, Logistic Regression, Scikit-Learn, Joblib |
| **Explainable AI (XAI)**| SHAP (SHapley Additive exPlanations) & Feature Importance Gini Gain |
| **Customer Segmentation**| K-Means Clustering & RFM (Recency, Frequency, Monetary) Analysis |
| **Generative AI** | Gemini 1.5 Flash / OpenAI GPT API with Local Fallback Engine |

---

## 4. Machine Learning Pipeline & Benchmark Results

### Feature Engineering
17 behavioral, transactional, and engagement features:
- `customer_age`, `tenure_months`, `subscription_type` (Basic, Pro, Enterprise), `monthly_spend`, `total_spend`
- `login_frequency`, `avg_session_duration`, `last_active_days`, `product_usage` (Low, Medium, High)
- `support_tickets`, `complaints`, `customer_satisfaction` (1.0–5.0)
- `payment_failures`, `discount_usage`, `contract_length` (1 Month, 1 Year, 2 Year)
- `previous_upgrades`, `previous_downgrades`

### Classifier Benchmarks (25,000 Customer Dataset)

| Model Classifier | ROC-AUC | F1 Score | Precision | Recall | Accuracy | Selection Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **XGBoost Classifier** | **0.9901** | **0.8755** | **0.8690** | **0.8821** | **0.9574** | **PRODUCTION** |
| **Logistic Regression** | 0.9933 | 0.9019 | 0.8920 | 0.9120 | 0.9650 | Benchmark |
| **Random Forest** | 0.9779 | 0.7402 | 0.8350 | 0.6648 | 0.9228 | Benchmark |

The production pipeline automatically selects **XGBoost**, scales preprocessors, and exports trained binary artifacts to `models/xgboost_churn_model.joblib`.

---

## 5. SQL Database Schema & Analytical Queries

The PostgreSQL DDL (`sql/schema.sql`) structures relational data across 7 tables:

```
customers ───< subscriptions
    │
    ├───< customer_activity
    ├───< support_tickets
    ├───< payments
    ├───< predictions
    └───< customer_segments
```

### Top Priority High-Risk Customer Query (`sql/analytical_queries.sql`)
```sql
WITH PriorityMatrix AS (
    SELECT 
        c.customer_id,
        c.customer_name,
        c.location,
        s.subscription_type,
        s.monthly_spend * 12 AS annual_recurring_revenue,
        p.churn_probability,
        p.risk_level,
        p.revenue_at_risk,
        p.recommended_action,
        DENSE_RANK() OVER (ORDER BY p.revenue_at_risk DESC) AS priority_rank
    FROM customers c
    JOIN subscriptions s ON c.customer_id = s.customer_id
    JOIN predictions p ON c.customer_id = p.customer_id
    WHERE p.risk_level = 'HIGH'
)
SELECT * FROM PriorityMatrix WHERE priority_rank <= 15;
```

---

## 6. How This Project Demonstrates Data Science Skills

1. **End-to-End Problem Formulation**: Translated a vague business goal ("reduce churn") into quantifiable financial metrics (`Revenue at Risk`, `Priority Matrix Score`, `Action Playbooks`).
2. **Advanced Machine Learning**: Applied supervised classification (XGBoost, Random Forest) with stratified train-test splits, probability calibration, and hyperparameter optimization.
3. **Model Explainability (XAI)**: Integrated SHAP value decomposition to explain individual customer predictions rather than relying on black-box probabilities.
4. **Unsupervised Segmentation**: Combined RFM features with K-Means clustering to discover actionable customer personas.
5. **Relational Database Design**: Designed third normal form (3NF) relational schemas in PostgreSQL/SQLite with indexed foreign keys and analytical SQL window functions.
6. **Production Engineering**: Built a FastAPI REST microservice backed by pre-trained joblib models, clean error handling, and a React + Vite dashboard.

---

## 7. How to Run Locally

### Prerequisites
- Python 3.11+
- Node.js 18+

### Step 1: Clone & Setup Environment
```bash
git clone https://github.com/your-username/churniq.git
cd churniq
```

### Step 2: Install Backend Dependencies & Run ML Pipeline
```bash
# Install Python packages
pip install -r requirements.txt

# Generate synthetic dataset (25,000 records)
python scripts/generate_data.py

# Train ML models & export artifacts
python scripts/train_ml_pipeline.py

# Seed SQLite database
python scripts/init_db.py
```

### Step 3: Launch FastAPI Backend Server
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
*API docs available at: `http://localhost:8000/docs`*

### Step 4: Launch React Frontend Application
In a second terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Frontend running at: `http://localhost:3000`*

---

## 8. License & Portfolio Usage

Created as a portfolio project showcasing end-to-end Data Science, Machine Learning, and Analytics Engineering.
