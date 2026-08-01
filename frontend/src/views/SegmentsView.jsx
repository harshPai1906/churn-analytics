import React, { useEffect, useState } from 'react';
import { PieChart, Users, DollarSign, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

const fallbackSegmentsData = {
  total_customers: 25000,
  segments: [
    {
      segment_name: 'Champions',
      segment_size: 5200,
      pct_of_total: 20.8,
      avg_revenue: 48.5,
      avg_churn_prob: 12.3,
      revenue_at_risk: 3640,
      description: 'Highest CLTV & spend with strong CSAT scores and no escalations.'
    },
    {
      segment_name: 'Loyal Customers',
      segment_size: 4800,
      pct_of_total: 19.2,
      avg_revenue: 32.1,
      avg_churn_prob: 22.4,
      revenue_at_risk: 4120,
      description: 'Consistent monthly charges, low complaint frequency, strong retention.'
    },
    {
      segment_name: 'At Risk',
      segment_size: 4200,
      pct_of_total: 16.8,
      avg_revenue: 25.8,
      avg_churn_prob: 65.2,
      revenue_at_risk: 18950,
      description: 'Elevated escalation rates, declining CSAT scores, high ARR exposure.'
    },
    {
      segment_name: 'Lost Customers',
      segment_size: 3800,
      pct_of_total: 15.2,
      avg_revenue: 18.2,
      avg_churn_prob: 82.1,
      revenue_at_risk: 14200,
      description: 'High churn score, escalation flags, imminent churn probability.'
    },
    {
      segment_name: 'Potential Loyalists',
      segment_size: 4000,
      pct_of_total: 16.0,
      avg_revenue: 28.5,
      avg_churn_prob: 35.6,
      revenue_at_risk: 4850,
      description: 'Recent signups with decent engagement; prime candidates for plan upgrades.'
    },
    {
      segment_name: 'Price Sensitive',
      segment_size: 3000,
      pct_of_total: 12.0,
      avg_revenue: 15.8,
      avg_churn_prob: 55.8,
      revenue_at_risk: 6420,
      description: 'High cancellation for "Too expensive" reason, responsive to promotions.'
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
          K-Means behavioral segmentation across CSAT, spend, escalation, and churn probability dimensions.
        </p>
      </div>

      {/* Segment Comparison Chart */}
      <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] space-y-4 shadow-sm">
        <h3 className="text-sm font-extrabold text-[#2D1E2F]">Avg Churn Probability by Customer Segment</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={segments}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5CBCB" />
              <XAxis dataKey="segment_name" stroke="#7A5C77" fontSize={11} />
              <YAxis stroke="#7A5C77" fontSize={11} unit="%" />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#F5CBCB', borderRadius: '12px', color: '#2D1E2F' }} />
              <Bar dataKey="avg_churn_prob" radius={[6, 6, 0, 0]} fill="#C5B3D3" name="Avg Churn Prob (%)">
                {segments.map((entry, index) => {
                  const fills = ['#3BB28B', '#06b6d4', '#E65B7B', '#f43f5e', '#3b82f6', '#8b5cf6'];
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {segments.map((seg, idx) => {
          const badgeFills = [
            'bg-[#3BB28B]/15 text-[#3BB28B]', 'bg-[#06b6d4]/15 text-[#06b6d4]',
            'bg-[#E65B7B]/15 text-[#E65B7B]', 'bg-[#f43f5e]/15 text-[#f43f5e]',
            'bg-[#3b82f6]/15 text-[#3b82f6]', 'bg-[#8b5cf6]/15 text-[#8b5cf6]'
          ];
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
                  <span className="font-extrabold text-[#2D1E2F]">{seg.segment_size.toLocaleString()} Customers</span>
                </div>
                <div>
                  <span className="text-[#7A5C77] text-[10px] font-bold block">Avg Monthly Charges</span>
                  <span className="font-extrabold text-[#2D1E2F]">₹{seg.avg_revenue}</span>
                </div>
                <div>
                  <span className="text-[#7A5C77] text-[10px] font-bold block">Avg Churn Prob</span>
                  <span className={`font-black ${seg.avg_churn_prob > 50 ? 'text-[#E65B7B]' : 'text-[#3BB28B]'}`}>
                    {seg.avg_churn_prob}%
                  </span>
                </div>
                <div>
                  <span className="text-[#7A5C77] text-[10px] font-bold block">Revenue at Risk</span>
                  <span className="font-black text-[#E65B7B]">₹{seg.revenue_at_risk.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
