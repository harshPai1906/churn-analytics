"""
CHURNIQ - Synthetic Customer Churn Data Generator
Generates a realistic 25,000-customer dataset with authentic business logic, 
correlations, noise, Indian/global customer names, and churn labels.
"""

import numpy as np
import pandas as pd
import random
import os

def generate_dataset(num_samples=25000, random_seed=42):
    np.random.seed(random_seed)
    random.seed(random_seed)
    
    first_names_in = ['Aarav', 'Ananya', 'Rohan', 'Priya', 'Aditya', 'Sneha', 'Vikram', 'Neha', 'Kabir', 'Diya',
                      'Arjun', 'Isha', 'Dev', 'Kavya', 'Siddharth', 'Tanvi', 'Rahul', 'Anushka', 'Karan', 'Meera']
    last_names_in = ['Sharma', 'Verma', 'Patel', 'Rao', 'Gupta', 'Singh', 'Reddy', 'Joshi', 'Nair', 'Kumar',
                     'Iyer', 'Deshmukh', 'Mehta', 'Chopra', 'Bhasin', 'Kulkarni', 'Agarwal', 'Chatterjee']
    
    first_names_gl = ['Alex', 'Sarah', 'Michael', 'Emma', 'David', 'Olivia', 'James', 'Sophia', 'Daniel', 'Ava',
                      'Liam', 'Mia', 'Noah', 'Charlotte', 'Ethan', 'Amelia', 'Lucas', 'Harper', 'Benjamin', 'Evelyn']
    last_names_gl = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                     'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson']
    
    locations = ['Mumbai', 'Bengaluru', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai', 
                 'San Francisco', 'London', 'Singapore', 'New York', 'Toronto', 'Sydney']
    
    plans = ['Basic', 'Pro', 'Enterprise']
    plan_weights = [0.45, 0.40, 0.15]
    
    customer_ids = [f"C{1000 + i}" for i in range(num_samples)]
    
    names = []
    loc_list = []
    for _ in range(num_samples):
        if random.random() < 0.65:
            name = f"{random.choice(first_names_in)} {random.choice(last_names_in)}"
            loc = random.choice(locations[:6])
        else:
            name = f"{random.choice(first_names_gl)} {random.choice(last_names_gl)}"
            loc = random.choice(locations[6:])
        names.append(name)
        loc_list.append(loc)
        
    subscription_types = np.random.choice(plans, size=num_samples, p=plan_weights)
    
    # Generate realistic values per plan
    monthly_spend = []
    for plan in subscription_types:
        if plan == 'Basic':
            spend = np.random.normal(1200, 300) # INR
        elif plan == 'Pro':
            spend = np.random.normal(4500, 800)
        else:
            spend = np.random.normal(18500, 3500)
        monthly_spend.append(round(max(499, spend), -1))
    monthly_spend = np.array(monthly_spend)
    
    tenure_months = np.random.exponential(scale=18, size=num_samples).astype(int) + 1
    tenure_months = np.clip(tenure_months, 1, 60)
    
    customer_age = np.random.normal(36, 9, size=num_samples).astype(int)
    customer_age = np.clip(customer_age, 21, 68)
    
    total_spend = monthly_spend * tenure_months * np.random.uniform(0.9, 1.05, size=num_samples)
    total_spend = np.round(total_spend, 2)
    
    # Contract length
    contract_options = ['1 Month', '1 Year', '2 Year']
    contract_length = np.random.choice(contract_options, size=num_samples, p=[0.55, 0.35, 0.10])
    
    # Support tickets & complaints (correlated with dissatisfaction)
    support_tickets = np.random.poisson(lam=2.8, size=num_samples)
    complaints = np.clip(np.random.poisson(lam=support_tickets * 0.4), 0, 8)
    
    payment_failures = np.random.choice([0, 1, 2, 3, 4], size=num_samples, p=[0.70, 0.18, 0.08, 0.03, 0.01])
    discount_usage = np.random.choice([0, 1], size=num_samples, p=[0.60, 0.40])
    
    # Usage metrics
    login_frequency = np.random.poisson(lam=14, size=num_samples)
    login_frequency = np.clip(login_frequency, 0, 45)
    
    avg_session_duration = np.random.gamma(shape=3.0, scale=8.0, size=num_samples) # minutes
    avg_session_duration = np.round(np.clip(avg_session_duration, 2.0, 90.0), 1)
    
    last_active_days = np.random.exponential(scale=12, size=num_samples).astype(int)
    last_active_days = np.clip(last_active_days, 0, 90)
    
    product_usage = []
    for lf in login_frequency:
        if lf < 5:
            product_usage.append('Low')
        elif lf < 20:
            product_usage.append('Medium')
        else:
            product_usage.append('High')
            
    customer_satisfaction = np.round(np.random.normal(3.8, 0.9, size=num_samples), 1)
    customer_satisfaction = np.clip(customer_satisfaction, 1.0, 5.0)
    
    previous_upgrades = np.random.choice([0, 1, 2], size=num_samples, p=[0.75, 0.20, 0.05])
    previous_downgrades = np.random.choice([0, 1, 2], size=num_samples, p=[0.85, 0.12, 0.03])
    
    # Calculate non-linear churn risk score
    # Higher churn score -> higher probability of churn
    log_odds = (
        - 1.2
        - 0.04 * (tenure_months - 12)
        + 0.65 * (contract_length == '1 Month')
        - 0.50 * (contract_length == '2 Year')
        + 0.35 * complaints
        + 0.22 * support_tickets
        + 0.40 * payment_failures
        + 0.035 * last_active_days
        - 0.08 * login_frequency
        - 0.02 * avg_session_duration
        - 0.45 * (customer_satisfaction - 3.0)
        + 0.35 * (subscription_types == 'Basic')
        - 0.25 * (subscription_types == 'Enterprise')
        + 0.30 * previous_downgrades
        - 0.20 * previous_upgrades
    )
    
    # Sigmoid function to convert log_odds to probability
    probabilities = 1 / (1 + np.exp(-log_odds))
    
    # Add business noise
    probabilities = np.clip(probabilities + np.random.normal(0, 0.05, size=num_samples), 0.01, 0.99)
    
    churn = (probabilities > 0.46).astype(int)
    
    df = pd.DataFrame({
        'customer_id': customer_ids,
        'customer_name': names,
        'location': loc_list,
        'customer_age': customer_age,
        'tenure_months': tenure_months,
        'subscription_type': subscription_types,
        'monthly_spend': monthly_spend,
        'total_spend': total_spend,
        'contract_length': contract_length,
        'login_frequency': login_frequency,
        'avg_session_duration': avg_session_duration,
        'support_tickets': support_tickets,
        'complaints': complaints,
        'payment_failures': payment_failures,
        'discount_usage': discount_usage,
        'product_usage': product_usage,
        'last_active_days': last_active_days,
        'customer_satisfaction': customer_satisfaction,
        'previous_upgrades': previous_upgrades,
        'previous_downgrades': previous_downgrades,
        'churn_probability_ground_truth': np.round(probabilities, 4),
        'churn': churn
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
    print(f"Overall churn rate: {df['churn'].mean() * 100:.2f}%")
