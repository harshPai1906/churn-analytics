import React, { useEffect, useState } from 'react';

const fallbackCustomers = [
  { customer_id: '0002-ORFBO', customer_name: 'Keshav', subscription_type: 'Basic', location: 'Maharashtra', tenure_months: 12, monthly_spend: 15.5, product_usage: 'Medium', support_tickets: 1, churn_probability: 35, risk_level: 'LOW', revenue_at_risk: 0, recommended_action: 'Standard renewal reminder' },
  { customer_id: '0003-MKNFE', customer_name: 'Raghav', subscription_type: 'Basic', location: 'Karnataka', tenure_months: 4, monthly_spend: 19.8, product_usage: 'Low', support_tickets: 4, churn_probability: 82, risk_level: 'HIGH', revenue_at_risk: 19.8, recommended_action: 'Technical support audit & contract upgrade offer' },
  { customer_id: '0004-TLHLJ', customer_name: 'Lalita', subscription_type: 'Basic', location: 'Delhi', tenure_months: 5, monthly_spend: 20.1, product_usage: 'Low', support_tickets: 3, churn_probability: 78, risk_level: 'HIGH', revenue_at_risk: 20.1, recommended_action: 'Proactive support outreach' },
  { customer_id: '0011-IGKFF', customer_name: 'Mohan', subscription_type: 'Premium', location: 'Nagaland', tenure_months: 24, monthly_spend: 45.0, product_usage: 'High', support_tickets: 0, churn_probability: 22, risk_level: 'LOW', revenue_at_risk: 0, recommended_action: 'Vip loyalty reward' },
  { customer_id: '0013-EXCHZ', customer_name: 'Mira', subscription_type: 'Basic', location: 'Delhi', tenure_months: 3, monthly_spend: 18.2, product_usage: 'Low', support_tickets: 5, churn_probability: 91, risk_level: 'HIGH', revenue_at_risk: 18.2, recommended_action: 'Immediate retention call & annual contract incentive' },
  { customer_id: '0014-CBKSB', customer_name: 'Rohit', subscription_type: 'Standard', location: 'Maharashtra', tenure_months: 18, monthly_spend: 29.5, product_usage: 'High', support_tickets: 1, churn_probability: 41, risk_level: 'LOW', revenue_at_risk: 0, recommended_action: 'Feature update newsletter' },
  { customer_id: '0015-UOANM', customer_name: 'Ananya', subscription_type: 'Basic', location: 'Karnataka', tenure_months: 2, monthly_spend: 17.9, product_usage: 'Low', support_tickets: 4, churn_probability: 88, risk_level: 'HIGH', revenue_at_risk: 17.9, recommended_action: 'Resolve support escalation & feature onboarding' },
  { customer_id: '0016-FBBAZ', customer_name: 'Priya', subscription_type: 'Standard', location: 'Meghalaya', tenure_months: 6, monthly_spend: 31.0, product_usage: 'Low', support_tickets: 3, churn_probability: 75, risk_level: 'HIGH', revenue_at_risk: 31.0, recommended_action: 'Regional coverage review' },
  { customer_id: '0017-WMJ12', customer_name: 'Aditya', subscription_type: 'Standard', location: 'Telangana', tenure_months: 5, monthly_spend: 33.2, product_usage: 'Low', support_tickets: 4, churn_probability: 79, risk_level: 'HIGH', revenue_at_risk: 33.2, recommended_action: 'Executive check-in call & SLA guarantee' },
  { customer_id: '0018-BSZGE', customer_name: 'Neha', subscription_type: 'Premium', location: 'Meghalaya', tenure_months: 30, monthly_spend: 52.0, product_usage: 'High', support_tickets: 0, churn_probability: 28, risk_level: 'LOW', revenue_at_risk: 0, recommended_action: 'Annual contract auto-renew' }
];

export default function CustomersView({ onSelectCustomer }) {
  const [customers, setCustomers] = useState(fallbackCustomers);

  useEffect(() => {
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => {
        if (data.customers && data.customers.length > 0) {
          setCustomers(data.customers);
        }
      })
      .catch(err => {
        console.warn("Using fallback customers cohort data:", err);
      });
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto bg-[#FBEFEF] text-[#2D1E2F]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F5CBCB]">
        <div>
          <h1 className="text-xl font-extrabold text-[#2D1E2F]">Customer Intelligence Directory</h1>
          <p className="text-xs text-[#7A5C77] font-medium mt-0.5">
            Overview and churn risk predictions for customer accounts.
          </p>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="rounded-xl border border-[#F5CBCB] bg-[#FFFFFF] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#7A5C77]">
            <thead className="bg-[#FFE2E2] text-[#2D1E2F] uppercase text-[10px] font-extrabold tracking-wider border-b border-[#F5CBCB]">
              <tr>
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Plan</th>
                <th className="p-3.5">State</th>
                <th className="p-3.5">Tenure</th>
                <th className="p-3.5">Monthly Spend</th>
                <th className="p-3.5 text-center">Tickets</th>
                <th className="p-3.5">Churn Score</th>
                <th className="p-3.5">Risk Tier</th>
                <th className="p-3.5">Action Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5CBCB]/60 font-medium">
              {customers.map((c) => (
                <tr
                  key={c.customer_id}
                  onClick={() => onSelectCustomer && onSelectCustomer(c.customer_id)}
                  className="hover:bg-[#FBEFEF] cursor-pointer transition-colors"
                >
                  <td className="p-3.5 font-mono text-[#7A5C77] font-bold">{c.customer_id}</td>
                  <td className="p-3.5 font-extrabold text-[#2D1E2F]">{c.customer_name}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFE2E2] text-[#2D1E2F] border border-[#F5CBCB]">
                      {c.subscription_type}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#7A5C77]">{c.location}</td>
                  <td className="p-3.5 text-[#7A5C77]">{c.tenure_months}m</td>
                  <td className="p-3.5 font-mono font-bold text-[#2D1E2F]">
                    ₹{c.monthly_spend}
                  </td>
                  <td className="p-3.5 text-center font-mono">{c.support_tickets}</td>
                  <td className="p-3.5 font-black font-mono text-[#2D1E2F]">{c.churn_probability}%</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.risk_level === 'HIGH' ? 'bg-[#E65B7B]/15 text-[#E65B7B] border border-[#E65B7B]/30' :
                      'bg-[#3BB28B]/15 text-[#3BB28B] border border-[#3BB28B]/30'
                    }`}>
                      {c.risk_level}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#2D1E2F]">{c.recommended_action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
