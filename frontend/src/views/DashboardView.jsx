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
    { plan: 'Basic', churn_rate: 48.2, total: 7500, churned: 3615 },
    { plan: 'Standard', churn_rate: 38.5, total: 10500, churned: 4042 },
    { plan: 'Premium', churn_rate: 32.1, total: 7000, churned: 2247 }
  ];

  const notebookContractData = [
    { contract: 'Monthly', churn_rate: 52.4, total: 11250, churned: 5895 },
    { contract: 'Annual', churn_rate: 28.6, total: 13750, churned: 3932 }
  ];

  const notebookStateData = [
    { state: 'Karnataka', churn_rate: 42.8 },
    { state: 'Meghalaya', churn_rate: 41.3 },
    { state: 'Telangana', churn_rate: 40.5 },
    { state: 'Delhi', churn_rate: 39.8 },
    { state: 'Uttar Pradesh', churn_rate: 38.2 },
    { state: 'Maharashtra', churn_rate: 37.5 },
    { state: 'Rajasthan', churn_rate: 36.9 },
    { state: 'Kathmandu', churn_rate: 35.4 },
    { state: 'Nagaland', churn_rate: 34.1 }
  ];

  const notebookRiskDistribution = [
    { name: 'Low Risk (<30%)', value: 8500, color: '#3BB28B' },
    { name: 'Medium Risk (31-70%)', value: 9800, color: '#E69537' },
    { name: 'High Risk (>70%)', value: 6700, color: '#E65B7B' }
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
          totalCustomers: 25000,
          churnedCustomers: 9904,
          churnRate: 39.62,
          retentionRate: 60.38,
        }} />

        {/* 3. Dashboard Overview Section */}
        <section id="dashboard-section" className="pt-4 border-t border-[#F5CBCB]">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#2D1E2F]">
              Churn Overview
            </h2>
            <p className="text-sm text-[#7A5C77] mt-1 max-w-xl font-medium">
              Interactive charts visualizing customer churn patterns across plan tiers, contract durations, and risk groups.
            </p>
          </div>

          {/* Main Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Churn Rate by Contract Type */}
            <div className="glass-card p-6 rounded-2xl bg-[#FFFFFF] border border-[#F5CBCB] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#2D1E2F]">Churn Rate by Contract Type</h3>
                  <p className="text-xs text-[#7A5C77] font-medium">Monthly contracts (52.4%) vs Annual contracts (28.6%)</p>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#E65B7B] bg-[#E65B7B]/15 px-2.5 py-1 rounded-full border border-[#E65B7B]/30">
                  1.8x Risk Ratio
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
                  <p className="text-xs text-[#7A5C77] font-medium">Basic (48.2%) vs Standard (38.5%) vs Premium (32.1%)</p>
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
                <p className="text-xs text-[#7A5C77] font-medium">Low / Medium / High Risk tiers</p>
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

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-[#F5CBCB]">
                <div className="p-2 rounded-lg bg-[#FFE2E2] border border-[#F5CBCB]">
                  <span className="block font-black text-[#3BB28B]">8,500</span>
                  <span className="text-[10px] text-[#7A5C77] font-bold">Low Risk</span>
                </div>
                <div className="p-2 rounded-lg bg-[#FFE2E2] border border-[#F5CBCB]">
                  <span className="block font-black text-[#E69537]">9,800</span>
                  <span className="text-[10px] text-[#7A5C77] font-bold">Medium</span>
                </div>
                <div className="p-2 rounded-lg bg-[#FFE2E2] border border-[#F5CBCB]">
                  <span className="block font-black text-[#E65B7B]">6,700</span>
                  <span className="text-[10px] text-[#7A5C77] font-bold">High Risk</span>
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
