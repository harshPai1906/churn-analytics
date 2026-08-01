import React, { useEffect, useState } from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { loadStaticCsvCustomers } from '../utils/csvLoader';

export default function RiskAnalysisView({ onSelectCustomer }) {
  const [data, setData] = useState({
    summary: { high_risk_count: 0, high_risk_revenue_at_risk: 0, avg_high_risk_prob: 0, medium_risk_count: 0 },
    priority_customers: [],
    risk_by_subscription: [],
    risk_by_geography: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/risk-analysis')
      .then(res => {
        if (!res.ok) throw new Error("Offline");
        return res.json();
      })
      .then(d => {
        if (d.summary) {
          setData(d);
          setLoading(false);
        } else {
          throw new Error("Invalid API structure");
        }
      })
      .catch(async (err) => {
        console.warn("API offline, computing risk analysis from static CSV:", err);
        const allCsv = await loadStaticCsvCustomers();
        const highRisk = allCsv.filter(c => c.risk_level === 'HIGH');
        const medRisk = allCsv.filter(c => c.risk_level === 'MEDIUM');
        const lowRisk = allCsv.filter(c => c.risk_level === 'LOW');

        const totalHighRevRisk = highRisk.reduce((sum, c) => sum + (c.revenue_at_risk || 0), 0);
        const avgHighProb = highRisk.length > 0 ? (highRisk.reduce((sum, c) => sum + (c.churn_probability || 0), 0) / highRisk.length).toFixed(1) : 0;

        const priorityTop = [...highRisk].sort((a, b) => b.revenue_at_risk - a.revenue_at_risk).slice(0, 15);

        // Subscription breakdown
        const plans = ['Basic', 'Standard', 'Premium'];
        const riskBySub = plans.map(p => {
          const subSet = allCsv.filter(c => c.plan_type === p);
          return {
            plan: p,
            high_risk: subSet.filter(c => c.risk_level === 'HIGH').length,
            med_risk: subSet.filter(c => c.risk_level === 'MEDIUM').length,
            low_risk: subSet.filter(c => c.risk_level === 'LOW').length,
            revenue_at_risk: Math.round(subSet.reduce((sum, c) => sum + (c.revenue_at_risk || 0), 0))
          };
        });

        // Geo breakdown
        const states = [...new Set(allCsv.map(c => c.state))].filter(Boolean);
        const riskByGeo = states.map(st => {
          const stSet = allCsv.filter(c => c.state === st);
          return {
            location: st,
            revenue_at_risk: Math.round(stSet.reduce((sum, c) => sum + (c.revenue_at_risk || 0), 0))
          };
        }).sort((a, b) => b.revenue_at_risk - a.revenue_at_risk);

        setData({
          summary: {
            high_risk_count: highRisk.length,
            high_risk_revenue_at_risk: Math.round(totalHighRevRisk),
            avg_high_risk_prob: Number(avgHighProb),
            medium_risk_count: medRisk.length
          },
          priority_customers: priorityTop,
          risk_by_subscription: riskBySub,
          risk_by_geography: riskByGeo
        });
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
            <span className="text-2xl font-black text-[#E65B7B]">{loading ? '...' : summary.high_risk_count?.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-[#E65B7B] font-mono">Prob &ge; 70%</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] shadow-sm">
          <span className="text-xs font-bold text-[#7A5C77]">High-Risk Revenue Exposure</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#E65B7B]">₹{loading ? '...' : (summary.high_risk_revenue_at_risk / 1000).toFixed(1)}K</span>
            <span className="text-[10px] font-bold text-[#E69537] font-mono">Annual ARR</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] shadow-sm">
          <span className="text-xs font-bold text-[#7A5C77]">Avg High-Risk Churn Prob</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#2D1E2F]">{loading ? '...' : `${summary.avg_high_risk_prob}%`}</span>
            <span className="text-[10px] font-bold text-[#7A5C77]">Target Cohort</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] shadow-sm">
          <span className="text-xs font-bold text-[#7A5C77]">Medium Risk Buffer</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#E69537]">{loading ? '...' : summary.medium_risk_count?.toLocaleString()}</span>
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
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-[#7A5C77]">Loading 25,000 risk cohort...</td>
                </tr>
              ) : priority_customers.map((c, idx) => (
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
