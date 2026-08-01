"""
CHURNIQ - Synthetic Customer Churn Data Generator
Generates a realistic 25,000-customer dataset matching the CSV column format
from churn_data_200_customers.csv with authentic business logic, correlations,
and Indian/Nepali customer profiles.
"""

import numpy as np
import pandas as pd
import random
import os
import string
from datetime import datetime, timedelta

def generate_dataset(num_samples=25000, random_seed=42):
    np.random.seed(random_seed)
    random.seed(random_seed)

    # --- Customer ID Pool (reusable IDs like in original CSV) ---
    id_prefixes = [
        '0002-ORFBO', '0003-MKNFE', '0004-TLHLJ', '0011-IGKFF', '0013-EXCHZ',
        '0013-MHZWF', '0013-SMEOE', '0014-BMAQU', '0015-UOCOJ', '0016-QLJIS',
        '0017-DINOC', '0017-IUDMW', '0018-NYROU', '0019-EFAEP', '0019-GFNTW',
        '0020-INWCK', '0020-JDNXP', '0021-IKXGC', '0022-TCJCI', '0023-HGHWL',
        '0023-UYUPN'
    ]
    # Generate more unique IDs to cover 25,000 rows
    extra_ids = []
    for i in range(500):
        prefix = f"{random.randint(0, 99):04d}"
        suffix = ''.join(random.choices(string.ascii_uppercase, k=5))
        extra_ids.append(f"{prefix}-{suffix}")
    all_ids = id_prefixes + extra_ids
    customer_ids = [random.choice(all_ids) for _ in range(num_samples)]

    # --- Customer Names (lowercase single first names, matching CSV) ---
    indian_names = [
        'mina', 'chitra', 'parvati', 'arjun', 'mohan', 'lalita', 'sudevi',
        'raghvendra', 'shiva', 'raghav', 'rishabh', 'madan', 'durga', 'maya',
        'mira', 'keshav', 'raju', 'rangadevi', 'rikim', 'vishakha', 'Madhav',
        'aarav', 'priya', 'sneha', 'kavya', 'tanvi', 'meera', 'diya', 'isha',
        'neha', 'rohan', 'dev', 'kabir', 'siddharth', 'rahul', 'karan',
        'ananya', 'pooja', 'amit', 'swati', 'tarun', 'divya', 'sanjay',
        'simran', 'vikram', 'aditya', 'rohit', 'deepak', 'sunita', 'geeta',
        'ramesh', 'suresh', 'manish', 'nisha', 'rekha', 'vijay', 'santosh',
        'padma', 'laxmi', 'ganesh', 'bharat', 'savita', 'rajesh', 'kamala'
    ]
    customer_names = [random.choice(indian_names) for _ in range(num_samples)]

    # --- Country & State ---
    countries = []
    states = []
    state_options = ['Delhi', 'Rajasthan', 'Maharashtra', 'Karnataka', 'Uttar Pradesh',
                     'Meghalaya', 'Nagaland', 'Telangana', 'Kathmandu']
    for _ in range(num_samples):
        if random.random() < 0.88:
            countries.append('India')
        else:
            countries.append('Nepal')
        states.append(random.choice(state_options))

    # --- Gender ---
    genders = np.random.choice(['Male', 'Female'], size=num_samples, p=[0.42, 0.58])

    # --- Date of Birth (ages 20-50) ---
    base_date = datetime(2025, 1, 1)
    dobs = []
    for _ in range(num_samples):
        age_years = random.randint(20, 50)
        dob = base_date - timedelta(days=age_years * 365 + random.randint(0, 364))
        dobs.append(dob.strftime('%d-%m-%Y'))

    # --- Subscription Start Date (2019-2023) ---
    start_dates_raw = []
    start_date_options = [
        '10-05-2019', '11-11-2019', '14-02-2020', '23-06-2020', '01-08-2020',
        '09-10-2020', '15-03-2021', '07-07-2021', '30-09-2021', '01-12-2021',
        '19-01-2022', '03-04-2022', '18-06-2022', '25-08-2022', '20-11-2022',
        '31-12-2022', '05-01-2023', '17-03-2023', '06-05-2023', '22-07-2023',
        '14-09-2023'
    ]
    for _ in range(num_samples):
        start_dates_raw.append(random.choice(start_date_options))

    # --- Subscription Type ---
    subscription_types = np.random.choice(
        ['Organic', 'Paid', 'Refferal'],
        size=num_samples,
        p=[0.40, 0.35, 0.25]
    )

    # --- Plan Type ---
    plan_types = np.random.choice(
        ['Basic', 'Standard', 'Premium'],
        size=num_samples,
        p=[0.30, 0.42, 0.28]
    )

    # --- Contract Type ---
    contract_types = np.random.choice(
        ['Monthly', 'Annual'],
        size=num_samples,
        p=[0.45, 0.55]
    )

    # --- Renewal Date (2024-2025) ---
    renewal_date_options = [
        '19-01-2024', '17-03-2024', '14-09-2024', '22-07-2024', '30-09-2024',
        '01-08-2024', '05-01-2024', '20-11-2025', '01-12-2025', '31-12-2025',
        '06-05-2025', '14-02-2025', '15-03-2025', '03-04-2025', '10-05-2025',
        '18-06-2025', '07-07-2025', '25-08-2024', '23-06-2025', '09-10-2025',
        '11-11-2025'
    ]
    renewal_dates = [random.choice(renewal_date_options) for _ in range(num_samples)]

    # --- Cancellation Date ---
    cancel_date_options = [
        '28-02-2024', '01-05-2024', '10-09-2024', '14-09-2024', '31-10-2024',
        '15-11-2024'
    ]
    cancellation_dates = [random.choice(cancel_date_options) for _ in range(num_samples)]

    # --- Cancellation Reason ---
    cancellation_reasons = np.random.choice(
        ['Too expensive', 'Switched to competitor', 'Forgot to cancel trial',
         'Poor streaming quality', 'Not enough content'],
        size=num_samples,
        p=[0.25, 0.30, 0.15, 0.15, 0.15]
    )

    # --- Monthly Charges (5 to 95 range) ---
    monthly_charges = []
    for plan in plan_types:
        if plan == 'Basic':
            charge = np.random.uniform(5.0, 25.0)
        elif plan == 'Standard':
            charge = np.random.uniform(6.0, 25.0)
        else:  # Premium
            charge = np.random.uniform(5.0, 25.0)
        monthly_charges.append(round(charge, 8))
    # Add some high outlier charges (like 91-94 in original data)
    for i in random.sample(range(num_samples), int(num_samples * 0.04)):
        monthly_charges[i] = round(np.random.uniform(87.0, 95.0), 8)
    monthly_charges = np.array(monthly_charges)

    # --- CLTV (Customer Lifetime Value) ---
    cltv_options = [42, 160, 195, 210, 230, 240, 270, 335, 550, 627, 640,
                    720, 790, 840, 980, 1150, 1610, 1725, 1840, 1955, 2185]
    cltv = [random.choice(cltv_options) for _ in range(num_samples)]

    # --- Churn Score (0-99) ---
    churn_scores = np.random.choice(
        [3, 5, 7, 8, 12, 14, 19, 22, 27, 34, 41, 47, 58, 62, 76, 79, 83, 88, 91, 99],
        size=num_samples
    )

    # --- Escalations ---
    escalations = np.random.choice(['Y', 'N'], size=num_samples, p=[0.50, 0.50])

    # --- CSAT Score (0-100 float) ---
    csat_scores = np.round(np.random.uniform(6.0, 94.0, size=num_samples), 8)

    # --- Complaint Count (0-2 float range) ---
    complaint_counts = np.round(np.random.uniform(0.94, 2.06, size=num_samples), 9)

    # --- Complaint Date ---
    complaint_date_options = [
        '20-01-2024', '10-04-2024', '14-09-2024', '27-09-2024', '01-11-2024',
        '28-08-2024', '18-03-2025'
    ]
    complaint_dates = [random.choice(complaint_date_options) for _ in range(num_samples)]

    # --- Churn Flag (with realistic correlations) ---
    # Higher churn for: Monthly contracts, Basic plans, escalations=Y, low CSAT, high churn_score
    log_odds = (
        - 1.5
        + 0.60 * (contract_types == 'Monthly')
        + 0.45 * (plan_types == 'Basic')
        - 0.30 * (plan_types == 'Premium')
        + 0.40 * (escalations == 'Y')
        + 0.012 * churn_scores
        - 0.008 * csat_scores
        + 0.25 * (cancellation_reasons == 'Too expensive')
        + 0.15 * complaint_counts
    )
    probabilities = 1 / (1 + np.exp(-log_odds))
    probabilities = np.clip(probabilities + np.random.normal(0, 0.06, size=num_samples), 0.02, 0.98)
    churn_flags = (probabilities > 0.42).astype(int)

    # --- Build DataFrame ---
    df = pd.DataFrame({
        'customerid': customer_ids,
        'subscription_start_date': start_dates_raw,
        'subscription_type': subscription_types,
        'renewal_date': renewal_dates,
        'plan_type': plan_types,
        'contract_type': contract_types,
        'cancellation_date': cancellation_dates,
        'cancellation_reason': cancellation_reasons,
        'monthly_charges': monthly_charges,
        'cltv': cltv,
        'churn_score': churn_scores,
        'churn_flag': churn_flags,
        'customer name': customer_names,
        'country': countries,
        'state': states,
        'gender': genders,
        'dob': dobs,
        'complaint_date': complaint_dates,
        'escalations': escalations,
        'csat_score': csat_scores,
        'complaint_count': complaint_counts
    })

    return df

if __name__ == '__main__':
    print("Generating CHURNIQ dataset (25,000 customers)...")
    os.makedirs('data', exist_ok=True)
    df = generate_dataset(25000)
    output_path = 'data/churn_dataset.csv'
    df.to_csv(output_path, index=False)
    print(f"Dataset generated successfully! Saved to {output_path}")
    print(f"Dataset shape: {df.shape}")
    print(f"Overall churn rate: {df['churn_flag'].mean() * 100:.2f}%")
    print(f"Columns: {list(df.columns)}")

    # Also save to frontend public folder
    frontend_path = os.path.join('frontend', 'public', 'churn_data_200_customers.csv')
    df.to_csv(frontend_path, index=False)
    print(f"Also saved to {frontend_path}")
