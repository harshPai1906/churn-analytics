"""
CHURNIQ - Database Initializer & Seeder
Reads processed dataset and inserts records into relational SQLite / PostgreSQL database.
"""

import os
import sqlite3
import pandas as pd

def init_sqlite_db(db_path='data/churniq.db', csv_path='data/churn_processed_predictions.csv'):
    print(f"Initializing SQLite database at '{db_path}'...")
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Processed predictions CSV not found at {csv_path}. Run train_ml_pipeline.py first.")
        
    df = pd.read_csv(csv_path)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Enable Foreign Keys
    cursor.execute("PRAGMA foreign_keys = ON;")
    
    # Drop existing tables
    cursor.executescript("""
    DROP TABLE IF EXISTS customer_segments;
    DROP TABLE IF EXISTS predictions;
    DROP TABLE IF EXISTS payments;
    DROP TABLE IF EXISTS support_tickets;
    DROP TABLE IF EXISTS customer_activity;
    DROP TABLE IF EXISTS subscriptions;
    DROP TABLE IF EXISTS customers;
    
    CREATE TABLE customers (
        customer_id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        location TEXT NOT NULL,
        customer_age INTEGER NOT NULL
    );

    CREATE TABLE subscriptions (
        subscription_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id TEXT NOT NULL,
        subscription_type TEXT NOT NULL,
        monthly_spend REAL NOT NULL,
        total_spend REAL NOT NULL,
        contract_length TEXT NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    );

    CREATE TABLE customer_activity (
        activity_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id TEXT NOT NULL,
        tenure_months INTEGER NOT NULL,
        login_frequency INTEGER NOT NULL,
        avg_session_duration REAL NOT NULL,
        product_usage TEXT NOT NULL,
        last_active_days INTEGER NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    );

    CREATE TABLE support_tickets (
        ticket_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id TEXT NOT NULL,
        support_tickets_count INTEGER NOT NULL,
        complaints_count INTEGER NOT NULL,
        customer_satisfaction REAL NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    );

    CREATE TABLE payments (
        payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id TEXT NOT NULL,
        payment_failures INTEGER NOT NULL,
        discount_usage INTEGER NOT NULL,
        previous_upgrades INTEGER NOT NULL,
        previous_downgrades INTEGER NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    );

    CREATE TABLE predictions (
        prediction_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id TEXT NOT NULL,
        churn_probability REAL NOT NULL,
        risk_level TEXT NOT NULL,
        health_score INTEGER NOT NULL,
        revenue_at_risk REAL NOT NULL,
        recommended_action TEXT NOT NULL,
        churn_target INTEGER NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    );

    CREATE TABLE customer_segments (
        segment_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id TEXT NOT NULL,
        segment_name TEXT NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    );
    """)
    
    print("Preparing bulk record insertions...")
    
    cust_data = df[['customer_id', 'customer_name', 'location', 'customer_age']].values.tolist()
    cursor.executemany("INSERT INTO customers VALUES (?, ?, ?, ?)", cust_data)
    
    sub_data = df[['customer_id', 'subscription_type', 'monthly_spend', 'total_spend', 'contract_length']].values.tolist()
    cursor.executemany("INSERT INTO subscriptions (customer_id, subscription_type, monthly_spend, total_spend, contract_length) VALUES (?, ?, ?, ?, ?)", sub_data)
    
    act_data = df[['customer_id', 'tenure_months', 'login_frequency', 'avg_session_duration', 'product_usage', 'last_active_days']].values.tolist()
    cursor.executemany("INSERT INTO customer_activity (customer_id, tenure_months, login_frequency, avg_session_duration, product_usage, last_active_days) VALUES (?, ?, ?, ?, ?, ?)", act_data)
    
    sup_data = df[['customer_id', 'support_tickets', 'complaints', 'customer_satisfaction']].values.tolist()
    cursor.executemany("INSERT INTO support_tickets (customer_id, support_tickets_count, complaints_count, customer_satisfaction) VALUES (?, ?, ?, ?)", sup_data)
    
    pay_data = df[['customer_id', 'payment_failures', 'discount_usage', 'previous_upgrades', 'previous_downgrades']].values.tolist()
    cursor.executemany("INSERT INTO payments (customer_id, payment_failures, discount_usage, previous_upgrades, previous_downgrades) VALUES (?, ?, ?, ?, ?)", pay_data)
    
    pred_data = df[['customer_id', 'churn_probability', 'risk_level', 'health_score', 'revenue_at_risk', 'recommended_action', 'churn']].values.tolist()
    cursor.executemany("INSERT INTO predictions (customer_id, churn_probability, risk_level, health_score, revenue_at_risk, recommended_action, churn_target) VALUES (?, ?, ?, ?, ?, ?, ?)", pred_data)
    
    seg_data = df[['customer_id', 'segment']].values.tolist()
    cursor.executemany("INSERT INTO customer_segments (customer_id, segment_name) VALUES (?, ?)", seg_data)
    
    conn.commit()
    conn.close()
    print("Database populated successfully!")

if __name__ == '__main__':
    init_sqlite_db()
