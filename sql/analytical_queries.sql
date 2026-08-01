-- ==========================================
-- CHURNIQ Analytical SQL Queries
-- Demonstrating Advanced Data Analyst / Scientist Queries
-- ==========================================

-- 1. Top 15 Priority High-Risk Customers (Ranked by Revenue at Risk)
WITH PriorityMatrix AS (
    SELECT 
        c.customerid,
        c.customer_name,
        c.state,
        c.country,
        s.plan_type,
        s.contract_type,
        s.monthly_charges,
        s.monthly_charges * 12 AS annual_recurring_revenue,
        p.churn_probability,
        p.risk_level,
        p.revenue_at_risk,
        p.recommended_action,
        DENSE_RANK() OVER (ORDER BY p.revenue_at_risk DESC) AS priority_rank
    FROM customers c
    JOIN subscriptions s ON c.customerid = s.customerid
    JOIN predictions p ON c.customerid = p.customerid
    WHERE p.risk_level = 'HIGH'
)
SELECT * FROM PriorityMatrix
WHERE priority_rank <= 15;


-- 2. Churn Rate & Revenue at Risk Breakdown by Plan Type
SELECT 
    s.plan_type,
    COUNT(c.customerid) AS total_customers,
    ROUND(SUM(CASE WHEN p.churn_flag = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(c.customerid), 2) AS churn_rate_pct,
    ROUND(AVG(p.churn_probability), 2) AS avg_churn_prob_pct,
    ROUND(SUM(p.revenue_at_risk), 2) AS total_revenue_at_risk,
    ROUND(AVG(s.monthly_charges), 2) AS avg_monthly_charges
FROM customers c
JOIN subscriptions s ON c.customerid = s.customerid
JOIN predictions p ON c.customerid = p.customerid
GROUP BY s.plan_type
ORDER BY total_revenue_at_risk DESC;


-- 3. Churn by Contract Type (Monthly vs Annual)
SELECT 
    s.contract_type,
    COUNT(c.customerid) AS total_customers,
    SUM(CASE WHEN p.churn_flag = 1 THEN 1 ELSE 0 END) AS churned_count,
    ROUND(SUM(CASE WHEN p.churn_flag = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(c.customerid), 2) AS churn_rate_pct,
    ROUND(AVG(p.health_score), 1) AS avg_health_score
FROM customers c
JOIN subscriptions s ON c.customerid = s.customerid
JOIN predictions p ON c.customerid = p.customerid
GROUP BY s.contract_type
ORDER BY churn_rate_pct DESC;


-- 4. Customer Segment Performance & Revenue Risk Matrix
SELECT 
    cs.segment_name,
    COUNT(c.customerid) AS segment_size,
    ROUND(AVG(s.monthly_charges), 2) AS avg_monthly_charges,
    ROUND(AVG(comp.csat_score), 1) AS avg_csat_score,
    ROUND(AVG(p.churn_probability), 2) AS avg_churn_prob,
    ROUND(SUM(p.revenue_at_risk), 2) AS segment_revenue_at_risk
FROM customer_segments cs
JOIN customers c ON cs.customerid = c.customerid
JOIN subscriptions s ON c.customerid = s.customerid
JOIN complaints comp ON c.customerid = comp.customerid
JOIN predictions p ON c.customerid = p.customerid
GROUP BY cs.segment_name
ORDER BY segment_revenue_at_risk DESC;


-- 5. Impact of Escalations & Cancellation Reason on Churn
SELECT 
    comp.escalations,
    s.cancellation_reason,
    COUNT(c.customerid) AS customer_count,
    ROUND(AVG(p.churn_probability), 2) AS avg_churn_probability,
    ROUND(AVG(comp.csat_score), 1) AS avg_csat_score
FROM customers c
JOIN complaints comp ON c.customerid = comp.customerid
JOIN subscriptions s ON c.customerid = s.customerid
JOIN predictions p ON c.customerid = p.customerid
GROUP BY comp.escalations, s.cancellation_reason
HAVING COUNT(c.customerid) >= 50
ORDER BY avg_churn_probability DESC;
