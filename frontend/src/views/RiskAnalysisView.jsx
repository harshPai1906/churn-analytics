import React, { useEffect, useState } from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const fallbackData = {
  summary: {
    high_risk_count: 6,
    high_risk_revenue_at_risk: 73940,
    avg_high_risk_prob: 83.5,
    medium_risk_count: 0
  },
  priority_customers: [
    { customer_id: '0013-EXCHZ', customer_name: 'Mira', subscription_type: 'Basic', location: 'Delhi', monthly_spend: 18.2, churn_probability: 91, revenue_at_risk: 18.2, recommended_action: 'Immediate retention call & annual contract incentive' },
    { customer_id: '0015-UOANM', customer_name: 'Ananya', subscription_type: 'Basic', location: 'Karnataka', monthly_spend: 17.9, churn_probability: 88, revenue_at_risk: 17.9, recommended_action: 'Resolve support escalation & feature onboarding' },
    { customer_id: '0003-MKNFE', customer_name: 'Raghav', subscription_type: 'Basic', location: 'Karnataka', monthly_spend: 19.8, churn_probability: 82, revenue_at_risk: 19.8, recommended_action: 'Technical support audit & contract upgrade offer' },
    { customer_id: '0017-WMJ12', customer_name: 'Aditya', subscription_type: 'Standard', location: 'Telangana', monthly_spend: 33.2, churn_probability: 79, revenue_at_risk: 33.2, recommended_action: 'Executive check-in call & SLA guarantee' },
    { customer_id: '0004-TLHLJ', customer_name: 'Lalita', subscription_type: 'Basic', location: 'Delhi', monthly_spend: 20.1, churn_probability: 78, revenue_at_risk: 20.1, recommended_action: 'Proactive support outreach' },
    { customer_id: '0016-FBBAZ', customer_name: 'Priya', subscription_type: 'Standard', location: 'Meghalaya', monthly_spend: 31.0, churn_probability: 75, revenue_at_risk: 31.0, recommended_action: 'Regional coverage review' }
  ],
  risk_by_subscription: [
    { plan: 'Basic', high_risk: 4, med_risk: 0, low_risk: 1 },
    { plan: 'Standard', high_risk: 2, med_risk: 0, low_risk: 7 },
    { plan: 'Premium', high_risk: 0, med_risk: 0, low_risk: 7 }
  ],
  risk_by_geography: [
    { location: 'Delhi', revenue_at_risk: 38.3 },
    { location: 'Karnataka', revenue_at_risk: 37.7 },
    { location: 'Telangana', revenue_at_risk: 33.2 },
    { location: 'Meghalaya', revenue_at_risk: 31.0 }
  ]
};

export default function RiskAnalysisView({ onSelectCustomer }) {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/risk-analysis')
      .then(res => {
        if (!res.ok) throw new Error("Offline");
        return res.json();
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Using fallback risk analysis cohort data:", err);
        setData(fallbackData);
        setLoading(false);
      });
  }, []);

  const { summary, priority_customers, risk_by_subscription, risk_by_geography } = data;

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto bg-[#FBEFEF] text-[#2D1E2F]">
      {/* Header */}
      <div className="pb-4 border-b border-[#F5CBCB]">
        <h1 className="text-xl font-extrabold text-[#2D1E2F] flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-[#E65B7B]" />
          Revenue Risk & Churn Threat Intelligence
        </h1>
        <p className="text-xs text-[#7A5C77] font-medium mt-1">
          Prioritize retention campaigns by ranking accounts using <code className="text-[#2D1E2F] font-mono">Churn Score &ge; 70</code>.
        </p>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] shadow-sm">
          <span className="text-xs font-bold text-[#7A5C77]">Total High-Risk Accounts</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#E65B7B]">{summary.high_risk_count}</span>
            <span className="text-[10px] font-bold text-[#E65B7B] font-mono">Score &ge; 70</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] shadow-sm">
          <span className="text-xs font-bold text-[#7A5C77]">High-Risk Revenue Exposure</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#E65B7B]">₹73.94/mo</span>
            <span className="text-[10px] font-bold text-[#E69537] font-mono">Monthly ARR</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] shadow-sm">
          <span className="text-xs font-bold text-[#7A5C77]">Avg High-Risk Churn Score</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#2D1E2F]">{summary.avg_high_risk_prob}%</span>
            <span className="text-[10px] font-bold text-[#7A5C77]">Target Cohort</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] shadow-sm">
          <span className="text-xs font-bold text-[#7A5C77]">Retained Customer Buffer</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#3BB28B]">15</span>
            <span className="text-[10px] font-bold text-[#3BB28B] font-mono">Low Risk (&lt;50)</span>
          </div>
        </div>
      </div>

      {/* Priority Retention Queue */}
      <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-[#2D1E2F] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#E65B7B]" />
              Priority Retention Queue (High-Risk Accounts to Contact First)
            </h3>
            <p className="text-[11px] text-[#7A5C77] font-medium">Accounts sorted by maximum churn score risk</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#F5CBCB]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFE2E2] text-[#2D1E2F] uppercase text-[10px] font-extrabold border-b border-[#F5CBCB]">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Customer ID</th>
                <th className="p-3">Customer Name</th>
                <th className="p-3">Plan</th>
                <th className="p-3">State</th>
                <th className="p-3">Churn Score</th>
                <th className="p-3">Monthly Spend</th>
                <th className="p-3">Recommended Retention Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5CBCB]/60 font-medium">
              {priority_customers.map((c, idx) => (
                <tr
                  key={c.customer_id}
                  onClick={() => onSelectCustomer && onSelectCustomer(c.customer_id)}
                  className="hover:bg-[#FBEFEF] cursor-pointer transition-colors"
                >
                  <td className="p-3 font-mono font-bold text-[#7A5C77]">#{idx + 1}</td>
                  <td className="p-3 font-mono font-bold text-[#7A5C77]">{c.customer_id}</td>
                  <td className="p-3 font-extrabold text-[#2D1E2F]">{c.customer_name}</td>
                  <td className="p-3 text-[#7A5C77]">{c.subscription_type}</td>
                  <td className="p-3 text-[#7A5C77]">{c.location}</td>
                  <td className="p-3 font-mono font-black text-[#E65B7B]">{c.churn_probability}%</td>
                  <td className="p-3 font-mono font-bold text-[#2D1E2F]">₹{c.monthly_spend}</td>
                  <td className="p-3 text-[#2D1E2F]">{c.recommended_action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] space-y-4 shadow-sm">
          <h3 className="text-sm font-extrabold text-[#2D1E2F]">Risk Distribution by Subscription Tier</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={risk_by_subscription}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5CBCB" />
                <XAxis dataKey="plan" stroke="#7A5C77" fontSize={11} />
                <YAxis stroke="#7A5C77" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#F5CBCB', borderRadius: '12px', color: '#2D1E2F' }} />
                <Legend />
                <Bar dataKey="high_risk" fill="#E65B7B" name="High Risk" />
                <Bar dataKey="low_risk" fill="#3BB28B" name="Low Risk" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] space-y-4 shadow-sm">
          <h3 className="text-sm font-extrabold text-[#2D1E2F]">Top Revenue at Risk by State</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={risk_by_geography}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5CBCB" />
                <XAxis dataKey="location" stroke="#7A5C77" fontSize={11} />
                <YAxis stroke="#7A5C77" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#F5CBCB', borderRadius: '12px', color: '#2D1E2F' }} />
                <Bar dataKey="revenue_at_risk" fill="#C5B3D3" name="Monthly Spend (₹)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
