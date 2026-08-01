import React, { useEffect, useState } from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const fallbackData = {
  summary: {
    high_risk_count: 6700,
    high_risk_revenue_at_risk: 48200,
    avg_high_risk_prob: 82.3,
    medium_risk_count: 9800
  },
  priority_customers: [
    { customerid: '0023-UYUPN', 'customer name': 'lalita', plan_type: 'Standard', state: 'Meghalaya', monthly_charges: 94.05, churn_probability: 85, revenue_at_risk: 959.3, recommended_action: 'Assign Dedicated Account Manager & schedule emergency call.' },
    { customerid: '0013-EXCHZ', 'customer name': 'mira', plan_type: 'Basic', state: 'Delhi', monthly_charges: 17.79, churn_probability: 91, revenue_at_risk: 194.2, recommended_action: 'Provide 25% Contract Renewal Discount & Loyalty Incentive.' },
    { customerid: '0020-JDNXP', 'customer name': 'mina', plan_type: 'Premium', state: 'Delhi', monthly_charges: 23.10, churn_probability: 72, revenue_at_risk: 199.6, recommended_action: 'Assign Dedicated Account Manager & schedule emergency call.' },
    { customerid: '0022-TCJCI', 'customer name': 'parvati', plan_type: 'Basic', state: 'Rajasthan', monthly_charges: 20.01, churn_probability: 82, revenue_at_risk: 196.9, recommended_action: 'Trigger Priority Technical Support & Executive Outreach.' },
    { customerid: '0014-BMAQU', 'customer name': 'rishabh', plan_type: 'Standard', state: 'Maharashtra', monthly_charges: 13.37, churn_probability: 88, revenue_at_risk: 141.3, recommended_action: 'Trigger Priority Technical Support & Executive Outreach.' },
    { customerid: '0011-IGKFF', 'customer name': 'raghav', plan_type: 'Basic', state: 'Uttar Pradesh', monthly_charges: 14.21, churn_probability: 78, revenue_at_risk: 132.9, recommended_action: 'Enroll in Annual Contract Migration & 1-on-1 Training.' }
  ],
  risk_by_subscription: [
    { plan: 'Basic', high_risk: 2800, med_risk: 2500, low_risk: 2200 },
    { plan: 'Standard', high_risk: 2400, med_risk: 4200, low_risk: 3900 },
    { plan: 'Premium', high_risk: 1500, med_risk: 3100, low_risk: 2400 }
  ],
  risk_by_geography: [
    { location: 'Delhi', revenue_at_risk: 8500 },
    { location: 'Maharashtra', revenue_at_risk: 7800 },
    { location: 'Karnataka', revenue_at_risk: 7200 },
    { location: 'Uttar Pradesh', revenue_at_risk: 6900 }
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
          Prioritize retention campaigns by ranking accounts using <code className="text-[#2D1E2F] font-mono">Churn Probability &ge; 70%</code>.
        </p>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] shadow-sm">
          <span className="text-xs font-bold text-[#7A5C77]">Total High-Risk Accounts</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#E65B7B]">{summary.high_risk_count?.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-[#E65B7B] font-mono">Prob &ge; 70%</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] shadow-sm">
          <span className="text-xs font-bold text-[#7A5C77]">High-Risk Revenue Exposure</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#E65B7B]">₹{(summary.high_risk_revenue_at_risk / 1000).toFixed(1)}K</span>
            <span className="text-[10px] font-bold text-[#E69537] font-mono">Annual ARR</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] shadow-sm">
          <span className="text-xs font-bold text-[#7A5C77]">Avg High-Risk Churn Prob</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#2D1E2F]">{summary.avg_high_risk_prob}%</span>
            <span className="text-[10px] font-bold text-[#7A5C77]">Target Cohort</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] shadow-sm">
          <span className="text-xs font-bold text-[#7A5C77]">Medium Risk Buffer</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#E69537]">{summary.medium_risk_count?.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-[#E69537] font-mono">31-70% Risk</span>
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
            <p className="text-[11px] text-[#7A5C77] font-medium">Accounts sorted by maximum revenue at risk</p>
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
                <th className="p-3">Churn Prob</th>
                <th className="p-3">Monthly Charges</th>
                <th className="p-3">Recommended Retention Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5CBCB]/60 font-medium">
              {priority_customers.map((c, idx) => (
                <tr
                  key={`${c.customerid}-${idx}`}
                  onClick={() => onSelectCustomer && onSelectCustomer(c.customerid)}
                  className="hover:bg-[#FBEFEF] cursor-pointer transition-colors"
                >
                  <td className="p-3 font-mono font-bold text-[#7A5C77]">#{idx + 1}</td>
                  <td className="p-3 font-mono font-bold text-[#7A5C77]">{c.customerid}</td>
                  <td className="p-3 font-extrabold text-[#2D1E2F] capitalize">{c['customer name']}</td>
                  <td className="p-3 text-[#7A5C77]">{c.plan_type}</td>
                  <td className="p-3 text-[#7A5C77]">{c.state}</td>
                  <td className="p-3 font-mono font-black text-[#E65B7B]">{c.churn_probability}%</td>
                  <td className="p-3 font-mono font-bold text-[#2D1E2F]">₹{typeof c.monthly_charges === 'number' ? c.monthly_charges.toFixed(2) : c.monthly_charges}</td>
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
          <h3 className="text-sm font-extrabold text-[#2D1E2F]">Risk Distribution by Plan Tier</h3>
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
                <Bar dataKey="revenue_at_risk" fill="#C5B3D3" name="Revenue at Risk (₹)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
