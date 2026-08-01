import React, { useState, useEffect, useMemo } from 'react';
import { RotateCcw, Users, UserX, Percent, ShieldCheck } from 'lucide-react';
import { loadStaticCsvCustomers } from '../utils/csvLoader';

export default function CustomerSegmentsSection() {
  const [cohortData, setCohortData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    contract: 'All',
    plan: 'All',
    gender: 'All',
    escalations: 'All',
    risk: 'All'
  });

  useEffect(() => {
    fetch('/api/customers?limit=25000')
      .then(res => {
        if (!res.ok) throw new Error("Offline or static deployment");
        return res.json();
      })
      .then(data => {
        if (data.customers && data.customers.length > 0) {
          const mapped = data.customers.map(c => ({
            id: c.customerid,
            name: c['customer name'],
            state: c.state,
            gender: c.gender,
            plan: c.plan_type,
            contract: c.contract_type,
            churn: c.churn_flag,
            escalations: c.escalations,
            churnScore: c.churn_score,
            risk: c.risk_level ? c.risk_level.toLowerCase() : 'low',
            monthlyCharges: c.monthly_charges
          }));
          setCohortData(mapped);
          setLoading(false);
        } else {
          throw new Error("Empty API response");
        }
      })
      .catch(async () => {
        // Fallback for Vercel deployment: load directly from public CSV
        const csvCustomers = await loadStaticCsvCustomers();
        const mapped = csvCustomers.map(c => ({
          id: c.customerid,
          name: c['customer name'],
          state: c.state,
          gender: c.gender,
          plan: c.plan_type,
          contract: c.contract_type,
          churn: c.churn_flag,
          escalations: c.escalations,
          churnScore: c.churn_score,
          risk: c.risk_level ? c.risk_level.toLowerCase() : 'low',
          monthlyCharges: c.monthly_charges
        }));
        setCohortData(mapped);
        setLoading(false);
      });
  }, []);

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
  }, [filters, cohortData]);

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
            Slice and dice the entire 25,000-customer cohort across contract, plan tier, gender, escalation, and risk dimensions.
          </p>
        </div>

        <button
          onClick={resetFilters}
          className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-xs font-bold text-[#2D1E2F] hover:text-[#7A5C77] bg-[#FFFFFF] px-3.5 py-2 rounded-xl border border-[#F5CBCB] hover:border-[#C5B3D3] shadow-sm transition-all focus:outline-none cursor-pointer"
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
            Plan Type
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
            Escalation Status
          </label>
          <select
            value={filters.escalations}
            onChange={(e) => setFilters({ ...filters, escalations: e.target.value })}
            className="w-full bg-[#FFFFFF] border border-[#F5CBCB] text-xs font-semibold text-[#2D1E2F] rounded-lg px-3 py-2 focus:outline-none focus:border-[#C5B3D3]"
          >
            <option value="All">All Statuses</option>
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
            <option value="medium">Medium Risk (31-70)</option>
            <option value="low">Low Risk (&lt;30)</option>
          </select>
        </div>
      </div>

      {/* Dynamic Segment KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#7A5C77]">Selected Cohort Size</p>
            <p className="text-2xl font-black text-[#2D1E2F]">{loading ? 'Loading...' : total.toLocaleString()}</p>
          </div>
          <Users className="w-5 h-5 text-[#7A5C77]" />
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#7A5C77]">Segment Cancellations</p>
            <p className="text-2xl font-black text-[#E65B7B]">{loading ? '...' : churned.toLocaleString()}</p>
          </div>
          <UserX className="w-5 h-5 text-[#E65B7B]" />
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#7A5C77]">Segment Churn Rate</p>
            <p className="text-2xl font-black text-[#E65B7B]">{loading ? '...' : `${churnRate}%`}</p>
          </div>
          <Percent className="w-5 h-5 text-[#E65B7B]" />
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#7A5C77]">Segment Retention</p>
            <p className="text-2xl font-black text-[#3BB28B]">{loading ? '...' : `${retentionRate}%`}</p>
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
            {loading ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-[#7A5C77]">
                  Loading live 25,000 customer dataset...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-[#7A5C77]">
                  No customer records match the selected filters.
                </td>
              </tr>
            ) : (
              filteredData.slice(0, 10).map((item, idx) => (
                <tr key={`${item.id}-${idx}`} className="hover:bg-[#FBEFEF] transition-colors">
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
