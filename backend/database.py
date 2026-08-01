"""
CHURNIQ Backend Database Module
Supports SQLite out-of-the-box and PostgreSQL via DATABASE_URL environment variable.
"""

import os
import sqlite3
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
SQLITE_PATH = os.getenv("SQLITE_PATH", "data/churniq.db")

def get_db_connection():
    if DATABASE_URL and DATABASE_URL.startswith("postgresql"):
        import psycopg2
        import psycopg2.extras
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=psycopg2.extras.RealDictCursor)
        return conn
    else:
        conn = sqlite3.connect(SQLITE_PATH)
        conn.row_factory = sqlite3.Row
        return conn

def query_db(query, params=(), one=False):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query, params)
    rv = cursor.fetchall()
    conn.close()
    
    # Convert Row objects to dict
    results = [dict(row) for row in rv]
    return (results[0] if results else None) if one else results

def get_full_dataset_df():
    csv_path = 'data/churn_processed_predictions.csv'
    if os.path.exists(csv_path):
        return pd.read_csv(csv_path)
    return None
