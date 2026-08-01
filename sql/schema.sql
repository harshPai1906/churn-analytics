-- ==========================================
-- CHURNIQ Relational PostgreSQL Database Schema
-- Production-ready Customer Churn & Analytics Schema
-- ==========================================

DROP TABLE IF EXISTS customer_segments CASCADE;
DROP TABLE IF EXISTS predictions CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS customer_activity CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

CREATE TABLE customers (
    customer_id VARCHAR(32) PRIMARY KEY,
    customer_name VARCHAR(128) NOT NULL,
    location VARCHAR(64) NOT NULL,
    customer_age INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscriptions (
    subscription_id SERIAL PRIMARY KEY,
    customer_id VARCHAR(32) REFERENCES customers(customer_id) ON DELETE CASCADE,
    subscription_type VARCHAR(32) NOT NULL,
    monthly_spend NUMERIC(10, 2) NOT NULL,
    total_spend NUMERIC(12, 2) NOT NULL,
    contract_length VARCHAR(32) NOT NULL,
    status VARCHAR(16) DEFAULT 'Active'
);

CREATE TABLE customer_activity (
    activity_id SERIAL PRIMARY KEY,
    customer_id VARCHAR(32) REFERENCES customers(customer_id) ON DELETE CASCADE,
    tenure_months INT NOT NULL,
    login_frequency INT NOT NULL,
    avg_session_duration NUMERIC(6, 2) NOT NULL,
    product_usage VARCHAR(16) NOT NULL,
    last_active_days INT NOT NULL
);

CREATE TABLE support_tickets (
    ticket_id SERIAL PRIMARY KEY,
    customer_id VARCHAR(32) REFERENCES customers(customer_id) ON DELETE CASCADE,
    support_tickets_count INT NOT NULL DEFAULT 0,
    complaints_count INT NOT NULL DEFAULT 0,
    customer_satisfaction NUMERIC(3, 1) NOT NULL
);

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    customer_id VARCHAR(32) REFERENCES customers(customer_id) ON DELETE CASCADE,
    payment_failures INT NOT NULL DEFAULT 0,
    discount_usage INT NOT NULL DEFAULT 0,
    previous_upgrades INT NOT NULL DEFAULT 0,
    previous_downgrades INT NOT NULL DEFAULT 0
);

CREATE TABLE predictions (
    prediction_id SERIAL PRIMARY KEY,
    customer_id VARCHAR(32) REFERENCES customers(customer_id) ON DELETE CASCADE,
    churn_probability NUMERIC(5, 2) NOT NULL,
    risk_level VARCHAR(16) NOT NULL,
    health_score INT NOT NULL,
    revenue_at_risk NUMERIC(12, 2) NOT NULL,
    recommended_action TEXT NOT NULL,
    churn_target INT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_segments (
    segment_id SERIAL PRIMARY KEY,
    customer_id VARCHAR(32) REFERENCES customers(customer_id) ON DELETE CASCADE,
    segment_name VARCHAR(64) NOT NULL
);

-- Indices for rapid query optimization
CREATE INDEX idx_customers_location ON customers(location);
CREATE INDEX idx_subscriptions_type ON subscriptions(subscription_type);
CREATE INDEX idx_predictions_risk ON predictions(risk_level);
CREATE INDEX idx_predictions_prob ON predictions(churn_probability DESC);
CREATE INDEX idx_segments_name ON customer_segments(segment_name);
