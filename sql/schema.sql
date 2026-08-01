-- ==========================================
-- CHURNIQ Relational PostgreSQL Database Schema
-- Production-ready Customer Churn & Analytics Schema
-- ==========================================

DROP TABLE IF EXISTS customer_segments CASCADE;
DROP TABLE IF EXISTS predictions CASCADE;
DROP TABLE IF EXISTS complaints CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

CREATE TABLE customers (
    customerid VARCHAR(32),
    customer_name VARCHAR(128) NOT NULL,
    country VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    gender VARCHAR(16) NOT NULL,
    dob VARCHAR(16) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscriptions (
    subscription_id SERIAL PRIMARY KEY,
    customerid VARCHAR(32) NOT NULL,
    subscription_start_date VARCHAR(16) NOT NULL,
    subscription_type VARCHAR(32) NOT NULL,
    plan_type VARCHAR(32) NOT NULL,
    contract_type VARCHAR(32) NOT NULL,
    renewal_date VARCHAR(16) NOT NULL,
    cancellation_date VARCHAR(16) NOT NULL,
    cancellation_reason TEXT NOT NULL,
    monthly_charges NUMERIC(10, 2) NOT NULL,
    cltv INTEGER NOT NULL
);

CREATE TABLE complaints (
    complaint_id SERIAL PRIMARY KEY,
    customerid VARCHAR(32) NOT NULL,
    complaint_date VARCHAR(16) NOT NULL,
    escalations VARCHAR(4) NOT NULL,
    csat_score NUMERIC(6, 2) NOT NULL,
    complaint_count NUMERIC(6, 4) NOT NULL
);

CREATE TABLE predictions (
    prediction_id SERIAL PRIMARY KEY,
    customerid VARCHAR(32) NOT NULL,
    churn_score INTEGER NOT NULL,
    churn_flag INTEGER NOT NULL,
    churn_probability NUMERIC(5, 2) NOT NULL,
    risk_level VARCHAR(16) NOT NULL,
    health_score INTEGER NOT NULL,
    revenue_at_risk NUMERIC(12, 2) NOT NULL,
    recommended_action TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_segments (
    segment_id SERIAL PRIMARY KEY,
    customerid VARCHAR(32) NOT NULL,
    segment_name VARCHAR(64) NOT NULL
);

-- Indices for rapid query optimization
CREATE INDEX idx_customers_state ON customers(state);
CREATE INDEX idx_customers_country ON customers(country);
CREATE INDEX idx_subscriptions_plan ON subscriptions(plan_type);
CREATE INDEX idx_subscriptions_contract ON subscriptions(contract_type);
CREATE INDEX idx_predictions_risk ON predictions(risk_level);
CREATE INDEX idx_predictions_prob ON predictions(churn_probability DESC);
CREATE INDEX idx_segments_name ON customer_segments(segment_name);
