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
    
    cursor.execute("PRAGMA foreign_keys = OFF;")
    
    # Drop existing tables
    cursor.executescript("""
    DROP TABLE IF EXISTS customer_segments;
    DROP TABLE IF EXISTS predictions;
    DROP TABLE IF EXISTS complaints;
    DROP TABLE IF EXISTS subscriptions;
    DROP TABLE IF EXISTS customers;
    
    CREATE TABLE customers (
        customerid TEXT,
        customer_name TEXT NOT NULL,
        country TEXT NOT NULL,
        state TEXT NOT NULL,
        gender TEXT NOT NULL,
        dob TEXT NOT NULL
    );

    CREATE TABLE subscriptions (
        subscription_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerid TEXT NOT NULL,
        subscription_start_date TEXT NOT NULL,
        subscription_type TEXT NOT NULL,
        plan_type TEXT NOT NULL,
        contract_type TEXT NOT NULL,
        renewal_date TEXT NOT NULL,
        cancellation_date TEXT NOT NULL,
        cancellation_reason TEXT NOT NULL,
        monthly_charges REAL NOT NULL,
        cltv INTEGER NOT NULL
    );

    CREATE TABLE complaints (
        complaint_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerid TEXT NOT NULL,
        complaint_date TEXT NOT NULL,
        escalations TEXT NOT NULL,
        csat_score REAL NOT NULL,
        complaint_count REAL NOT NULL
    );

    CREATE TABLE predictions (
        prediction_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerid TEXT NOT NULL,
        churn_score INTEGER NOT NULL,
        churn_flag INTEGER NOT NULL,
        churn_probability REAL NOT NULL,
        risk_level TEXT NOT NULL,
        health_score INTEGER NOT NULL,
        revenue_at_risk REAL NOT NULL,
        recommended_action TEXT NOT NULL
    );

    CREATE TABLE customer_segments (
        segment_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerid TEXT NOT NULL,
        segment_name TEXT NOT NULL
    );
    """)
    
    print("Preparing bulk record insertions...")
    
    cust_data = df[['customerid', 'customer name', 'country', 'state', 'gender', 'dob']].values.tolist()
    cursor.executemany("INSERT INTO customers VALUES (?, ?, ?, ?, ?, ?)", cust_data)
    
    sub_data = df[['customerid', 'subscription_start_date', 'subscription_type', 'plan_type', 'contract_type',
                    'renewal_date', 'cancellation_date', 'cancellation_reason', 'monthly_charges', 'cltv']].values.tolist()
    cursor.executemany(
        "INSERT INTO subscriptions (customerid, subscription_start_date, subscription_type, plan_type, contract_type, renewal_date, cancellation_date, cancellation_reason, monthly_charges, cltv) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        sub_data
    )
    
    comp_data = df[['customerid', 'complaint_date', 'escalations', 'csat_score', 'complaint_count']].values.tolist()
    cursor.executemany(
        "INSERT INTO complaints (customerid, complaint_date, escalations, csat_score, complaint_count) VALUES (?, ?, ?, ?, ?)",
        comp_data
    )
    
    pred_data = df[['customerid', 'churn_score', 'churn_flag', 'churn_probability', 'risk_level',
                     'health_score', 'revenue_at_risk', 'recommended_action']].values.tolist()
    cursor.executemany(
        "INSERT INTO predictions (customerid, churn_score, churn_flag, churn_probability, risk_level, health_score, revenue_at_risk, recommended_action) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        pred_data
    )
    
    seg_data = df[['customerid', 'segment']].values.tolist()
    cursor.executemany("INSERT INTO customer_segments (customerid, segment_name) VALUES (?, ?)", seg_data)
    
    cursor.execute("PRAGMA foreign_keys = ON;")
    conn.commit()
    conn.close()
    print("Database populated successfully!")

if __name__ == '__main__':
    init_sqlite_db()
