-- ==========================================
-- CHURNIQ Analytical SQL Queries
-- Demonstrating Advanced Data Analyst / Scientist Queries
-- ==========================================

-- 1. Top 15 Priority High-Risk Customers (Ranked by Revenue at Risk)
WITH PriorityMatrix AS (
    SELECT 
        c.customer_id,
        c.customer_name,
        c.location,
        s.subscription_type,
        s.monthly_spend,
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
SELECT * FROM PriorityMatrix
WHERE priority_rank <= 15;


-- 2. Churn Rate & Revenue at Risk Breakdown by Subscription Plan
SELECT 
    s.subscription_type,
    COUNT(c.customer_id) AS total_customers,
    ROUND(SUM(CASE WHEN p.churn_target = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(c.customer_id), 2) AS churn_rate_pct,
    ROUND(AVG(p.churn_probability), 2) AS avg_churn_prob_pct,
    ROUND(SUM(p.revenue_at_risk), 2) AS total_revenue_at_risk_inr,
    ROUND(AVG(s.monthly_spend), 2) AS avg_monthly_spend_inr
FROM customers c
JOIN subscriptions s ON c.customer_id = s.customer_id
JOIN predictions p ON c.customer_id = p.customer_id
GROUP BY s.subscription_type
ORDER BY total_revenue_at_risk_inr DESC;


-- 3. Customer Retention Cohort Analysis by Tenure Bracket
SELECT 
    CASE 
        WHEN a.tenure_months <= 6 THEN '0-6 Months'
        WHEN a.tenure_months <= 12 THEN '6-12 Months'
        WHEN a.tenure_months <= 24 THEN '1-2 Years'
        ELSE '2+ Years'
    END AS tenure_bracket,
    COUNT(c.customer_id) AS cohort_size,
    SUM(CASE WHEN p.churn_target = 1 THEN 1 ELSE 0 END) AS churned_count,
    ROUND(SUM(CASE WHEN p.churn_target = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(c.customer_id), 2) AS churn_rate_pct,
    ROUND(AVG(p.health_score), 1) AS avg_health_score
FROM customers c
JOIN customer_activity a ON c.customer_id = a.customer_id
JOIN predictions p ON c.customer_id = p.customer_id
GROUP BY tenure_bracket
ORDER BY MIN(a.tenure_months);


-- 4. Customer Segment Performance & Revenue Risk Matrix
SELECT 
    cs.segment_name,
    COUNT(c.customer_id) AS segment_size,
    ROUND(AVG(s.monthly_spend), 2) AS avg_monthly_spend,
    ROUND(AVG(a.tenure_months), 1) AS avg_tenure_months,
    ROUND(AVG(p.churn_probability), 2) AS avg_churn_prob,
    ROUND(SUM(p.revenue_at_risk), 2) AS segment_revenue_at_risk
FROM customer_segments cs
JOIN customers c ON cs.customer_id = c.customer_id
JOIN subscriptions s ON c.customer_id = s.customer_id
JOIN customer_activity a ON c.customer_id = a.customer_id
JOIN predictions p ON c.customer_id = p.customer_id
GROUP BY cs.segment_name
ORDER BY segment_revenue_at_risk DESC;


-- 5. Impact of Support Complaints & Payment Failures on Churn Probability
SELECT 
    st.complaints_count,
    pm.payment_failures,
    COUNT(c.customer_id) AS customer_count,
    ROUND(AVG(p.churn_probability), 2) AS avg_churn_probability,
    ROUND(AVG(st.customer_satisfaction), 1) AS avg_satisfaction
FROM customers c
JOIN support_tickets st ON c.customer_id = st.customer_id
JOIN payments pm ON c.customer_id = pm.customer_id
JOIN predictions p ON c.customer_id = p.customer_id
GROUP BY st.complaints_count, pm.payment_failures
HAVING COUNT(c.customer_id) >= 50
ORDER BY avg_churn_probability DESC;
