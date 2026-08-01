import React, { useEffect, useState } from 'react';
import { PieChart, Users, DollarSign, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

const fallbackSegmentsData = {
  total_customers: 21,
  segments: [
    {
      segment_name: 'Month-to-Month High Risk',
      segment_size: 9,
      pct_of_total: 42.9,
      avg_revenue: 22.8,
      avg_churn_prob: 55.6,
      revenue_at_risk: 114.2,
      description: 'Short-term subscribers with high cancellation sensitivity and support ticket escalations.'
    },
    {
      segment_name: 'Basic Tier Low Engagement',
      segment_size: 5,
      pct_of_total: 23.8,
      avg_revenue: 18.3,
      avg_churn_prob: 60.0,
      revenue_at_risk: 54.3,
      description: 'Entry plan users experiencing value gap issues and high churn drop-off.'
    },
    {
      segment_name: 'Annual Premium Loyalists',
      segment_size: 7,
      pct_of_total: 33.3,
      avg_revenue: 49.5,
      avg_churn_prob: 14.3,
      revenue_at_risk: 48.5,
      description: 'High-LTV annual contract subscribers with strong retention and low complaint rates.'
    }
  ]
};

export default function SegmentsView({ setActiveTab }) {
  const [data, setData] = useState(fallbackSegmentsData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/segments')
      .then(res => {
        if (!res.ok) throw new Error("Offline");
        return res.json();
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Using fallback customer segments data:", err);
        setData(fallbackSegmentsData);
        setLoading(false);
      });
  }, []);

  const { segments, total_customers } = data;

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto bg-[#FBEFEF] text-[#2D1E2F]">
      {/* Header */}
      <div className="pb-4 border-b border-[#F5CBCB]">
        <h1 className="text-xl font-extrabold text-[#2D1E2F] flex items-center gap-2">
          <PieChart className="w-6 h-6 text-[#7A5C77]" />
          Customer Behavioral & Segment Analysis
        </h1>
        <p className="text-xs text-[#7A5C77] font-medium mt-1">
          Behavioral partitioning of customer accounts across contract length, subscription tier, and risk score clusters.
        </p>
      </div>

      {/* Segment Comparison Chart */}
      <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] space-y-4 shadow-sm">
        <h3 className="text-sm font-extrabold text-[#2D1E2F]">Observed Churn Rate by Customer Segment</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={segments}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5CBCB" />
              <XAxis dataKey="segment_name" stroke="#7A5C77" fontSize={11} />
              <YAxis stroke="#7A5C77" fontSize={11} unit="%" />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#F5CBCB', borderRadius: '12px', color: '#2D1E2F' }} />
              <Bar dataKey="avg_churn_prob" radius={[6, 6, 0, 0]} fill="#C5B3D3" name="Avg Churn Rate (%)">
                {segments.map((entry, index) => {
                  const fills = ['#E65B7B', '#E69537', '#3BB28B'];
                  return (
                    <Cell key={`cell-${index}`} fill={fills[index % fills.length]} />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Segment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {segments.map((seg, idx) => {
          const badgeFills = ['bg-[#E65B7B]/15 text-[#E65B7B]', 'bg-[#E69537]/15 text-[#E69537]', 'bg-[#3BB28B]/15 text-[#3BB28B]'];
          return (
            <div key={seg.segment_name} className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#F5CBCB] hover:border-[#C5B3D3] transition-all flex flex-col justify-between space-y-4 shadow-sm">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-[#C5B3D3]"></span>
                    <h3 className="text-base font-extrabold text-[#2D1E2F]">{seg.segment_name}</h3>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${badgeFills[idx % badgeFills.length]}`}>
                    {seg.pct_of_total}%
                  </span>
                </div>
                <p className="text-xs text-[#7A5C77] font-medium mt-2 leading-relaxed">{seg.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#F5CBCB] text-xs font-medium">
                <div>
                  <span className="text-[#7A5C77] text-[10px] font-bold block">Segment Size</span>
                  <span className="font-extrabold text-[#2D1E2F]">{seg.segment_size} Customers</span>
                </div>
                <div>
                  <span className="text-[#7A5C77] text-[10px] font-bold block">Avg Monthly Spend</span>
                  <span className="font-extrabold text-[#2D1E2F]">₹{seg.avg_revenue}</span>
                </div>
                <div>
                  <span className="text-[#7A5C77] text-[10px] font-bold block">Avg Churn Rate</span>
                  <span className={`font-black ${seg.avg_churn_prob > 50 ? 'text-[#E65B7B]' : 'text-[#3BB28B]'}`}>
                    {seg.avg_churn_prob}%
                  </span>
                </div>
                <div>
                  <span className="text-[#7A5C77] text-[10px] font-bold block">Revenue at Risk</span>
                  <span className="font-black text-[#E65B7B]">₹{seg.revenue_at_risk}/mo</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
