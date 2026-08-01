import React, { useState, useMemo } from 'react';
import { RotateCcw, Users, UserX, Percent, ShieldCheck } from 'lucide-react';

const cohortData = [
  { id: '0002-ORFBO', name: 'keshav', state: 'Maharashtra', gender: 'Male', plan: 'Basic', contract: 'Monthly', churn: 0, escalations: 'N', churnScore: 35, risk: 'low', monthlySpend: 15.5 },
  { id: '0003-MKNFE', name: 'raghav', state: 'Karnataka', gender: 'Male', plan: 'Basic', contract: 'Monthly', churn: 1, escalations: 'Y', churnScore: 82, risk: 'high', monthlySpend: 19.8 },
  { id: '0004-TLHLJ', name: 'lalita', state: 'Delhi', gender: 'Female', plan: 'Basic', contract: 'Monthly', churn: 1, escalations: 'Y', churnScore: 78, risk: 'high', monthlySpend: 20.1 },
  { id: '0011-IGKFF', name: 'mohan', state: 'Nagaland', gender: 'Male', plan: 'Premium', contract: 'Annual', churn: 0, escalations: 'N', churnScore: 22, risk: 'low', monthlySpend: 45.0 },
  { id: '0013-EXCHZ', name: 'mira', state: 'Delhi', gender: 'Female', plan: 'Basic', contract: 'Monthly', churn: 1, escalations: 'Y', churnScore: 91, risk: 'high', monthlySpend: 18.2 },
  { id: '0014-CBKSB', name: 'rohit', state: 'Maharashtra', gender: 'Male', plan: 'Standard', contract: 'Annual', churn: 0, escalations: 'N', churnScore: 41, risk: 'low', monthlySpend: 29.5 },
  { id: '0015-UOANM', name: 'ananya', state: 'Karnataka', gender: 'Female', plan: 'Basic', contract: 'Monthly', churn: 1, escalations: 'Y', churnScore: 88, risk: 'high', monthlySpend: 17.9 },
  { id: '0016-FBBAZ', name: 'priya', state: 'Meghalaya', gender: 'Female', plan: 'Standard', contract: 'Monthly', churn: 1, escalations: 'Y', churnScore: 75, risk: 'high', monthlySpend: 31.0 },
  { id: '0017-WMJ12', name: 'aditya', state: 'Telangana', gender: 'Male', plan: 'Standard', contract: 'Monthly', churn: 1, escalations: 'Y', churnScore: 79, risk: 'high', monthlySpend: 33.2 },
  { id: '0018-BSZGE', name: 'neha', state: 'Meghalaya', gender: 'Female', plan: 'Premium', contract: 'Annual', churn: 0, escalations: 'N', churnScore: 28, risk: 'low', monthlySpend: 52.0 },
  { id: '0019-YOZ99', name: 'vikram', state: 'Meghalaya', gender: 'Male', plan: 'Standard', contract: 'Monthly', churn: 0, escalations: 'N', churnScore: 48, risk: 'low', monthlySpend: 28.0 },
  { id: '0020-FUPRO', name: 'simran', state: 'Uttar Pradesh', gender: 'Female', plan: 'Premium', contract: 'Annual', churn: 0, escalations: 'N', churnScore: 19, risk: 'low', monthlySpend: 49.0 },
  { id: '0021-AVJPB', name: 'tarun', state: 'Uttar Pradesh', gender: 'Male', plan: 'Standard', contract: 'Annual', churn: 0, escalations: 'N', churnScore: 33, risk: 'low', monthlySpend: 27.5 },
  { id: '0022-[#K23', name: 'divya', state: 'Rajasthan', gender: 'Female', plan: 'Premium', contract: 'Annual', churn: 0, escalations: 'N', churnScore: 15, risk: 'low', monthlySpend: 55.0 },
  { id: '0023-VZP23', name: 'kavita', state: 'Rajasthan', gender: 'Female', plan: 'Standard', contract: 'Annual', churn: 0, escalations: 'N', churnScore: 38, risk: 'low', monthlySpend: 30.0 },
  { id: '0024-[#V92', name: 'sanjay', state: 'Telangana', gender: 'Male', plan: 'Premium', contract: 'Annual', churn: 0, escalations: 'N', churnScore: 24, risk: 'low', monthlySpend: 48.5 },
  { id: '0025-[#X01', name: 'pooja', state: 'Kathmandu', gender: 'Female', plan: 'Standard', contract: 'Annual', churn: 0, escalations: 'N', churnScore: 30, risk: 'low', monthlySpend: 26.0 },
  { id: '0026-[#Y02', name: 'amit', state: 'Kathmandu', gender: 'Male', plan: 'Premium', contract: 'Annual', churn: 0, escalations: 'N', churnScore: 21, risk: 'low', monthlySpend: 50.0 },
  { id: '0027-[#Z03', name: 'sneha', state: 'Delhi', gender: 'Female', plan: 'Standard', contract: 'Annual', churn: 0, escalations: 'N', churnScore: 31, risk: 'low', monthlySpend: 32.0 },
  { id: '0028-[#A04', name: 'rahul', state: 'Delhi', gender: 'Male', plan: 'Premium', contract: 'Monthly', churn: 0, escalations: 'N', churnScore: 44, risk: 'low', monthlySpend: 46.0 },
  { id: '0029-[#B05', name: 'swati', state: 'Maharashtra', gender: 'Female', plan: 'Standard', contract: 'Annual', churn: 0, escalations: 'N', churnScore: 27, risk: 'low', monthlySpend: 29.0 }
];

export default function CustomerSegmentsSection() {
  const [filters, setFilters] = useState({
    contract: 'All',
    plan: 'All',
    gender: 'All',
    escalations: 'All',
    risk: 'All'
  });

  const resetFilters = () => {
    setFilters({
      contract: 'All',
      plan: 'All',
      gender: 'All',
      escalations: 'All',
      risk: 'All'
    });
  };

  const filteredData = useMemo(() => {
    return cohortData.filter(item => {
      if (filters.contract !== 'All' && item.contract !== filters.contract) return false;
      if (filters.plan !== 'All' && item.plan !== filters.plan) return false;
      if (filters.gender !== 'All' && item.gender !== filters.gender) return false;
      if (filters.escalations !== 'All' && item.escalations !== filters.escalations) return false;
      if (filters.risk !== 'All' && item.risk !== filters.risk) return false;
      return true;
    });
  }, [filters]);

  const total = filteredData.length;
  const churned = filteredData.filter(i => i.churn === 1).length;
  const churnRate = total > 0 ? ((churned / total) * 100).toFixed(1) : '0.0';
  const retentionRate = total > 0 ? (((total - churned) / total) * 100).toFixed(1) : '100.0';

  return (
    <section id="segments-section" className="py-12 border-b border-[#F5CBCB]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#2D1E2F]">
            Customer Segments & Cohort Filter
          </h2>
          <p className="text-sm text-[#7A5C77] mt-1 max-w-xl font-medium">
            Slice and dice the analysis cohort across contract, tier, gender, escalation, and risk dimensions.
          </p>
        </div>

        <button
          onClick={resetFilters}
          className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-xs font-bold text-[#2D1E2F] hover:text-[#7A5C77] bg-[#FFFFFF] px-3.5 py-2 rounded-xl border border-[#F5CBCB] hover:border-[#C5B3D3] shadow-sm transition-all focus:outline-none"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Filter Control Panel */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4 rounded-2xl bg-[#FFE2E2] border border-[#F5CBCB] mb-6">
        <div>
          <label className="block text-[11px] font-bold text-[#7A5C77] uppercase tracking-wider mb-1.5">
            Contract Type
          </label>
          <select
            value={filters.contract}
            onChange={(e) => setFilters({ ...filters, contract: e.target.value })}
            className="w-full bg-[#FFFFFF] border border-[#F5CBCB] text-xs font-semibold text-[#2D1E2F] rounded-lg px-3 py-2 focus:outline-none focus:border-[#C5B3D3]"
          >
            <option value="All">All Contracts</option>
            <option value="Monthly">Monthly</option>
            <option value="Annual">Annual</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#7A5C77] uppercase tracking-wider mb-1.5">
            Subscription Plan
          </label>
          <select
            value={filters.plan}
            onChange={(e) => setFilters({ ...filters, plan: e.target.value })}
            className="w-full bg-[#FFFFFF] border border-[#F5CBCB] text-xs font-semibold text-[#2D1E2F] rounded-lg px-3 py-2 focus:outline-none focus:border-[#C5B3D3]"
          >
            <option value="All">All Plans</option>
            <option value="Basic">Basic</option>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#7A5C77] uppercase tracking-wider mb-1.5">
            Gender
          </label>
          <select
            value={filters.gender}
            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            className="w-full bg-[#FFFFFF] border border-[#F5CBCB] text-xs font-semibold text-[#2D1E2F] rounded-lg px-3 py-2 focus:outline-none focus:border-[#C5B3D3]"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#7A5C77] uppercase tracking-wider mb-1.5">
            Escalation Ticket
          </label>
          <select
            value={filters.escalations}
            onChange={(e) => setFilters({ ...filters, escalations: e.target.value })}
            className="w-full bg-[#FFFFFF] border border-[#F5CBCB] text-xs font-semibold text-[#2D1E2F] rounded-lg px-3 py-2 focus:outline-none focus:border-[#C5B3D3]"
          >
            <option value="All">All Tickets</option>
            <option value="Y">Escalated (Y)</option>
            <option value="N">Not Escalated (N)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#7A5C77] uppercase tracking-wider mb-1.5">
            Risk Tier
          </label>
          <select
            value={filters.risk}
            onChange={(e) => setFilters({ ...filters, risk: e.target.value })}
            className="w-full bg-[#FFFFFF] border border-[#F5CBCB] text-xs font-semibold text-[#2D1E2F] rounded-lg px-3 py-2 focus:outline-none focus:border-[#C5B3D3]"
          >
            <option value="All">All Risk Tiers</option>
            <option value="high">High Risk (&ge;70)</option>
            <option value="low">Low Risk (&lt;50)</option>
          </select>
        </div>
      </div>

      {/* Dynamic Segment KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#7A5C77]">Selected Cohort Size</p>
            <p className="text-2xl font-black text-[#2D1E2F]">{total}</p>
          </div>
          <Users className="w-5 h-5 text-[#7A5C77]" />
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#7A5C77]">Segment Cancellations</p>
            <p className="text-2xl font-black text-[#E65B7B]">{churned}</p>
          </div>
          <UserX className="w-5 h-5 text-[#E65B7B]" />
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#7A5C77]">Segment Churn Rate</p>
            <p className="text-2xl font-black text-[#E65B7B]">{churnRate}%</p>
          </div>
          <Percent className="w-5 h-5 text-[#E65B7B]" />
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#7A5C77]">Segment Retention</p>
            <p className="text-2xl font-black text-[#3BB28B]">{retentionRate}%</p>
          </div>
          <ShieldCheck className="w-5 h-5 text-[#3BB28B]" />
        </div>
      </div>

      {/* Filtered Sample Table */}
      <div className="overflow-x-auto rounded-xl border border-[#F5CBCB] bg-[#FFFFFF] shadow-sm">
        <table className="w-full text-left text-xs text-[#7A5C77]">
          <thead className="bg-[#FFE2E2] text-[#2D1E2F] uppercase text-[10px] font-extrabold tracking-wider border-b border-[#F5CBCB]">
            <tr>
              <th className="px-4 py-3">Customer ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Contract</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Escalated</th>
              <th className="px-4 py-3">Churn Score</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5CBCB]/60 font-medium">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-[#7A5C77]">
                  No customer records match the selected filters.
                </td>
              </tr>
            ) : (
              filteredData.slice(0, 8).map((item) => (
                <tr key={item.id} className="hover:bg-[#FBEFEF] transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[#7A5C77]">{item.id}</td>
                  <td className="px-4 py-3 text-[#2D1E2F] capitalize font-bold">{item.name}</td>
                  <td className="px-4 py-3">{item.plan}</td>
                  <td className="px-4 py-3">{item.contract}</td>
                  <td className="px-4 py-3">{item.state}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.escalations === 'Y' ? 'bg-[#E65B7B]/15 text-[#E65B7B]' : 'bg-[#FFE2E2] text-[#7A5C77]'
                    }`}>
                      {item.escalations}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-[#2D1E2F]">{item.churnScore}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.churn === 1 ? 'bg-[#E65B7B]/15 text-[#E65B7B]' : 'bg-[#3BB28B]/15 text-[#3BB28B]'
                    }`}>
                      {item.churn === 1 ? 'Churned' : 'Retained'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
