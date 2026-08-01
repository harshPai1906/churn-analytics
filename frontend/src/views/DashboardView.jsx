import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

import HeroSection from '../components/HeroSection';
import KpiCardsSection from '../components/KpiCardsSection';
import ChurnDriversSection from '../components/ChurnDriversSection';
import CustomerSegmentsSection from '../components/CustomerSegmentsSection';

export default function DashboardView({ onSelectCustomer, setActiveTab }) {
  const [data, setData] = useState(null);

  const notebookPlanData = [
    { plan: 'Basic', churn_rate: 60.0, total: 5, churned: 3 },
    { plan: 'Standard', churn_rate: 22.2, total: 9, churned: 2 },
    { plan: 'Premium', churn_rate: 14.3, total: 7, churned: 1 }
  ];

  const notebookContractData = [
    { contract: 'Monthly', churn_rate: 55.6, total: 9, churned: 5 },
    { contract: 'Annual', churn_rate: 8.3, total: 12, churned: 1 }
  ];

  const notebookStateData = [
    { state: 'Karnataka', churn_rate: 100.0 },
    { state: 'Meghalaya', churn_rate: 66.7 },
    { state: 'Telangana', churn_rate: 50.0 },
    { state: 'Delhi', churn_rate: 25.0 },
    { state: 'Maharashtra', churn_rate: 0.0 },
    { state: 'Rajasthan', churn_rate: 0.0 },
    { state: 'Uttar Pradesh', churn_rate: 0.0 },
    { state: 'Kathmandu', churn_rate: 0.0 },
    { state: 'Nagaland', churn_rate: 0.0 }
  ];

  const notebookRiskDistribution = [
    { name: 'Low Risk (<50)', value: 15, color: '#3BB28B' },
    { name: 'High Risk (>=70)', value: 6, color: '#E65B7B' }
  ];

  return (
    <div className="min-h-screen bg-mesh-pattern text-[#2D1E2F]">
      {/* 1. Hero Landing Section */}
      <HeroSection onExploreClick={() => {
        const el = document.getElementById('dashboard-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 pb-16">
        {/* 2. KPI Section */}
        <KpiCardsSection metrics={{
          totalCustomers: 21,
          churnedCustomers: 6,
          churnRate: 28.57,
          retentionRate: 71.43,
        }} />

        {/* 3. Dashboard Overview Section */}
        <section id="dashboard-section" className="pt-4 border-t border-[#F5CBCB]">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#2D1E2F]">
              Churn Overview
            </h2>
            <p className="text-sm text-[#7A5C77] mt-1 max-w-xl font-medium">
              Interactive charts visualizing customer churn patterns across subscription tiers, contract durations, and risk groups.
            </p>
          </div>

          {/* Main Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Churn Rate by Contract Type */}
            <div className="glass-card p-6 rounded-2xl bg-[#FFFFFF] border border-[#F5CBCB] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#2D1E2F]">Churn Rate by Contract Type</h3>
                  <p className="text-xs text-[#7A5C77] font-medium">Monthly contracts (55.6%) vs Annual contracts (8.3%)</p>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#E65B7B] bg-[#E65B7B]/15 px-2.5 py-1 rounded-full border border-[#E65B7B]/30">
                  6.7x Risk Ratio
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={notebookContractData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F5CBCB" />
                    <XAxis dataKey="contract" stroke="#7A5C77" fontSize={12} />
                    <YAxis stroke="#7A5C77" fontSize={12} unit="%" domain={[0, 70]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#F5CBCB', borderRadius: '12px', color: '#2D1E2F', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      itemStyle={{ color: '#E65B7B' }}
                    />
                    <Bar dataKey="churn_rate" fill="#E65B7B" radius={[8, 8, 0, 0]} name="Churn Rate (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Churn Rate by Plan Type */}
            <div className="glass-card p-6 rounded-2xl bg-[#FFFFFF] border border-[#F5CBCB] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#2D1E2F]">Churn Rate by Plan Tier</h3>
                  <p className="text-xs text-[#7A5C77] font-medium">Basic (60%) vs Standard (22.2%) vs Premium (14.3%)</p>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#E69537] bg-[#E69537]/15 px-2.5 py-1 rounded-full border border-[#E69537]/30">
                  Basic Highest Risk
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={notebookPlanData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F5CBCB" />
                    <XAxis dataKey="plan" stroke="#7A5C77" fontSize={12} />
                    <YAxis stroke="#7A5C77" fontSize={12} unit="%" domain={[0, 70]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#F5CBCB', borderRadius: '12px', color: '#2D1E2F', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      itemStyle={{ color: '#C5B3D3' }}
                    />
                    <Bar dataKey="churn_rate" fill="#C5B3D3" radius={[8, 8, 0, 0]} name="Churn Rate (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Main Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Churn Risk Distribution Donut */}
            <div className="glass-card p-6 rounded-2xl bg-[#FFFFFF] border border-[#F5CBCB] space-y-4 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-base font-bold text-[#2D1E2F]">Churn Risk Distribution</h3>
                <p className="text-xs text-[#7A5C77] font-medium">Low Risk (&lt;50 score) vs High Risk (&ge;70 score)</p>
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={notebookRiskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {notebookRiskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={3} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#F5CBCB', borderRadius: '12px', color: '#2D1E2F' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs pt-2 border-t border-[#F5CBCB]">
                <div className="p-2 rounded-lg bg-[#FFE2E2] border border-[#F5CBCB]">
                  <span className="block font-black text-[#3BB28B]">15 Customers</span>
                  <span className="text-[10px] text-[#7A5C77] font-bold">Low Risk (&lt;50)</span>
                </div>
                <div className="p-2 rounded-lg bg-[#FFE2E2] border border-[#F5CBCB]">
                  <span className="block font-black text-[#E65B7B]">6 Customers</span>
                  <span className="text-[10px] text-[#7A5C77] font-bold">High Risk (&ge;70)</span>
                </div>
              </div>
            </div>

            {/* Regional State-wise Churn */}
            <div className="lg:col-span-2 glass-card p-6 rounded-2xl bg-[#FFFFFF] border border-[#F5CBCB] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#2D1E2F]">State-wise Regional Churn Rate</h3>
                  <p className="text-xs text-[#7A5C77] font-medium">Geographic variations across customer locations</p>
                </div>
                <MapPin className="w-4 h-4 text-[#7A5C77]" />
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={notebookStateData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F5CBCB" />
                    <XAxis dataKey="state" stroke="#7A5C77" fontSize={10} interval={0} angle={-30} textAnchor="end" height={50} />
                    <YAxis stroke="#7A5C77" fontSize={11} unit="%" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#F5CBCB', borderRadius: '12px', color: '#2D1E2F' }}
                      itemStyle={{ color: '#C5B3D3' }}
                    />
                    <Bar dataKey="churn_rate" fill="#C5B3D3" radius={[6, 6, 0, 0]} name="Churn Rate (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Churn Drivers Section */}
        <ChurnDriversSection />

        {/* 5. Interactive Customer Segments Filter */}
        <CustomerSegmentsSection />
      </div>
    </div>
  );
}
