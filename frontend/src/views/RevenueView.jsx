import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const fallbackRevenueData = {
  kpis: {
    total_arr: 5400000,
    mrr: 450000,
    revenue_at_risk: 48200,
    revenue_recovered: 16870,
    arpu: 18.0,
    ltv: 780
  },
  revenue_trend: [
    { month: 'Jan', arr: 420000, revenue_at_risk: 3200 },
    { month: 'Feb', arr: 428000, revenue_at_risk: 3500 },
    { month: 'Mar', arr: 436000, revenue_at_risk: 3800 },
    { month: 'Apr', arr: 440000, revenue_at_risk: 4100 },
    { month: 'May', arr: 445000, revenue_at_risk: 4400 },
    { month: 'Jun', arr: 450000, revenue_at_risk: 4800 }
  ],
  revenue_by_subscription: [
    { plan: 'Basic', arr: 1350000 },
    { plan: 'Standard', arr: 2268000 },
    { plan: 'Premium', arr: 1782000 }
  ],
  revenue_by_segment: [
    { segment: 'At Risk', revenue_at_risk: 14500 },
    { segment: 'Lost Customers', revenue_at_risk: 12200 },
    { segment: 'Price Sensitive', revenue_at_risk: 9800 }
  ]
};

export default function RevenueView() {
  const [data, setData] = useState(fallbackRevenueData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/revenue')
      .then(res => {
        if (!res.ok) throw new Error("Offline");
        return res.json();
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Using fallback revenue data:", err);
        setData(fallbackRevenueData);
        setLoading(false);
      });
  }, []);

  const { kpis, revenue_trend, revenue_by_subscription, revenue_by_segment } = data;

  const formatCurrency = (val) => {
    if (val >= 1000000) return `₹${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val}`;
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto bg-[#FBEFEF] text-[#2D1E2F]">
      {/* Header */}
      <div className="pb-4 border-b border-[#F5CBCB]">
        <h1 className="text-xl font-extrabold text-[#2D1E2F] flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-[#3BB28B]" />
          Revenue Protection & Financial Intelligence
        </h1>
        <p className="text-xs text-[#7A5C77] font-medium mt-1">
          Financial analytics monitoring ARR, MRR, revenue at risk, and projected recovery ROI.
        </p>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] shadow-sm">
          <span className="text-xs font-bold text-[#7A5C77]">Total ARR</span>
          <p className="text-xl font-black text-[#2D1E2F] mt-2">{formatCurrency(kpis.total_arr)}</p>
          <span className="text-[10px] font-bold text-[#3BB28B]">Annualized Recurring</span>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] shadow-sm">
          <span className="text-xs font-bold text-[#7A5C77]">Monthly Recurring (MRR)</span>
          <p className="text-xl font-black text-[#2D1E2F] mt-2">{formatCurrency(kpis.mrr)}</p>
          <span className="text-[10px] font-bold text-[#7A5C77]">Active Subscriptions</span>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] shadow-sm">
          <span className="text-xs font-bold text-[#7A5C77]">Revenue at Risk</span>
          <p className="text-xl font-black text-[#E65B7B] mt-2">{formatCurrency(kpis.revenue_at_risk)}</p>
          <span className="text-[10px] font-bold text-[#E65B7B]">High Risk ARR</span>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] shadow-sm">
          <span className="text-xs font-bold text-[#7A5C77]">Projected Recovered</span>
          <p className="text-xl font-black text-[#3BB28B] mt-2">{formatCurrency(kpis.revenue_recovered)}</p>
          <span className="text-[10px] font-bold text-[#3BB28B]">Retention Campaign ROI</span>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] shadow-sm">
          <span className="text-xs font-bold text-[#7A5C77]">ARPU</span>
          <p className="text-xl font-black text-[#2D1E2F] mt-2">₹{kpis.arpu}</p>
          <span className="text-[10px] font-bold text-[#7A5C77]">Avg Monthly / User</span>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] shadow-sm">
          <span className="text-xs font-bold text-[#7A5C77]">Avg CLTV</span>
          <p className="text-xl font-black text-[#2D1E2F] mt-2">₹{kpis.ltv}</p>
          <span className="text-[10px] font-bold text-[#7A5C77]">Lifetime Value</span>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] space-y-4 shadow-sm">
        <h3 className="text-sm font-extrabold text-[#2D1E2F]">Revenue Trend vs. Financial Risk Exposure</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenue_trend}>
              <defs>
                <linearGradient id="arrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3BB28B" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3BB28B" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E65B7B" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#E65B7B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5CBCB" />
              <XAxis dataKey="month" stroke="#7A5C77" fontSize={11} />
              <YAxis stroke="#7A5C77" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#F5CBCB', borderRadius: '12px', color: '#2D1E2F' }} />
              <Legend />
              <Area type="monotone" dataKey="arr" stroke="#3BB28B" fillOpacity={1} fill="url(#arrGrad)" name="Monthly Revenue (₹)" />
              <Area type="monotone" dataKey="revenue_at_risk" stroke="#E65B7B" fillOpacity={1} fill="url(#riskGrad)" name="Revenue at Risk (₹)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] space-y-4 shadow-sm">
          <h3 className="text-sm font-extrabold text-[#2D1E2F]">Revenue Share by Plan Tier</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue_by_subscription}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5CBCB" />
                <XAxis dataKey="plan" stroke="#7A5C77" fontSize={11} />
                <YAxis stroke="#7A5C77" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#F5CBCB', borderRadius: '12px', color: '#2D1E2F' }} />
                <Bar dataKey="arr" fill="#C5B3D3" radius={[6, 6, 0, 0]} name="Total ARR (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] space-y-4 shadow-sm">
          <h3 className="text-sm font-extrabold text-[#2D1E2F]">Revenue at Risk by Segment</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue_by_segment}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5CBCB" />
                <XAxis dataKey="segment" stroke="#7A5C77" fontSize={11} />
                <YAxis stroke="#7A5C77" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#F5CBCB', borderRadius: '12px', color: '#2D1E2F' }} />
                <Bar dataKey="revenue_at_risk" fill="#E65B7B" radius={[6, 6, 0, 0]} name="Revenue at Risk (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
