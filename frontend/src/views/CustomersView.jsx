import React, { useEffect, useState, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X, Filter, RotateCcw } from 'lucide-react';
import { loadStaticCsvCustomers } from '../utils/csvLoader';

export default function CustomersView({ onSelectCustomer }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter & Search State
  const [search, setSearch] = useState('');
  const [risk, setRisk] = useState('ALL');
  const [plan, setPlan] = useState('ALL');
  const [contract, setContract] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('revenue_at_risk');
  const [order, setOrder] = useState('desc');

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [jumpPageInput, setJumpPageInput] = useState('');

  const fetchCustomers = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      search: search.trim(),
      risk,
      plan,
      contract,
      state: stateFilter,
      sort_by: sortBy,
      order,
      page: page.toString(),
      limit: limit.toString()
    });

    fetch(`/api/customers?${params.toString()}`)
      .then(res => {
        if (!res.ok) throw new Error("API Offline");
        return res.json();
      })
      .then(data => {
        if (data.customers && data.customers.length >= 0) {
          setCustomers(data.customers);
          setTotalCount(data.total || 0);
          setTotalPages(data.total_pages || 1);
          setLoading(false);
        } else {
          throw new Error("Invalid API response format");
        }
      })
      .catch(async () => {
        // Fallback for Vercel static deployment: load and filter CSV directly in browser
        const allCsv = await loadStaticCsvCustomers();
        let filtered = [...allCsv];

        // Search
        if (search.trim()) {
          const s = search.toLowerCase().trim();
          filtered = filtered.filter(c =>
            (c['customer name'] && c['customer name'].toLowerCase().includes(s)) ||
            (c.customerid && c.customerid.toLowerCase().includes(s))
          );
        }

        // Risk filter
        if (risk !== 'ALL') {
          filtered = filtered.filter(c => c.risk_level === risk.toUpperCase());
        }

        // Plan filter
        if (plan !== 'ALL') {
          filtered = filtered.filter(c => c.plan_type === plan);
        }

        // Contract filter
        if (contract !== 'ALL') {
          filtered = filtered.filter(c => c.contract_type === contract);
        }

        // State filter
        if (stateFilter !== 'ALL') {
          filtered = filtered.filter(c => c.state === stateFilter);
        }

        // Sorting
        filtered.sort((a, b) => {
          let valA = a[sortBy];
          let valB = b[sortBy];

          if (typeof valA === 'string') valA = valA.toLowerCase();
          if (typeof valB === 'string') valB = valB.toLowerCase();

          if (valA < valB) return order === 'asc' ? -1 : 1;
          if (valA > valB) return order === 'asc' ? 1 : -1;
          return 0;
        });

        const total = filtered.length;
        const pages = Math.ceil(total / limit) || 1;
        const start = (page - 1) * limit;
        const end = start + limit;

        setCustomers(filtered.slice(start, end));
        setTotalCount(total);
        setTotalPages(pages);
        setLoading(false);
      });
  }, [search, risk, plan, contract, stateFilter, sortBy, order, page, limit]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setRisk('ALL');
    setPlan('ALL');
    setContract('ALL');
    setStateFilter('ALL');
    setSortBy('revenue_at_risk');
    setOrder('desc');
    setPage(1);
    setLimit(25);
  };

  const handleJumpPage = (e) => {
    e.preventDefault();
    const p = parseInt(jumpPageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setPage(p);
      setJumpPageInput('');
    }
  };

  const startRecord = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, totalCount);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto bg-[#FBEFEF] text-[#2D1E2F]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F5CBCB]">
        <div>
          <h1 className="text-xl font-extrabold text-[#2D1E2F] flex items-center gap-2">
            Customer Intelligence Directory
          </h1>
          <p className="text-xs text-[#7A5C77] font-medium mt-0.5">
            Search, filter, and browse all customer records with real-time ML churn risk analytics.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-[#FFE2E2] text-[#2D1E2F] border border-[#F5CBCB]">
            {totalCount.toLocaleString()} Total Records
          </span>
          <button
            onClick={handleResetFilters}
            className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] hover:border-[#C5B3D3] text-[#2D1E2F] text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Search & Filter Controls Panel */}
      <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#F5CBCB] space-y-4 shadow-sm">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#7A5C77] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleFilterChange(setSearch, e.target.value)}
            placeholder="Search by customer name or ID (e.g. 'mina', '0020-JDNXP')..."
            className="w-full pl-10 pr-10 py-2.5 bg-[#FFE2E2]/50 border border-[#F5CBCB] rounded-xl text-xs font-bold text-[#2D1E2F] placeholder-[#7A5C77] focus:outline-none focus:border-[#C5B3D3] transition-all"
          />
          {search && (
            <button
              onClick={() => handleFilterChange(setSearch, '')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A5C77] hover:text-[#2D1E2F]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-extrabold text-[#7A5C77] uppercase tracking-wider mb-1">
              Risk Tier
            </label>
            <select
              value={risk}
              onChange={(e) => handleFilterChange(setRisk, e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#F5CBCB] text-xs font-bold text-[#2D1E2F] rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#C5B3D3]"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="HIGH">High Risk (&ge;70%)</option>
              <option value="MEDIUM">Medium Risk (31-70%)</option>
              <option value="LOW">Low Risk (&lt;30%)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-[#7A5C77] uppercase tracking-wider mb-1">
              Plan Tier
            </label>
            <select
              value={plan}
              onChange={(e) => handleFilterChange(setPlan, e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#F5CBCB] text-xs font-bold text-[#2D1E2F] rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#C5B3D3]"
            >
              <option value="ALL">All Plans</option>
              <option value="Basic">Basic Plan</option>
              <option value="Standard">Standard Plan</option>
              <option value="Premium">Premium Plan</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-[#7A5C77] uppercase tracking-wider mb-1">
              Contract Type
            </label>
            <select
              value={contract}
              onChange={(e) => handleFilterChange(setContract, e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#F5CBCB] text-xs font-bold text-[#2D1E2F] rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#C5B3D3]"
            >
              <option value="ALL">All Contracts</option>
              <option value="Monthly">Monthly</option>
              <option value="Annual">Annual</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-[#7A5C77] uppercase tracking-wider mb-1">
              State
            </label>
            <select
              value={stateFilter}
              onChange={(e) => handleFilterChange(setStateFilter, e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#F5CBCB] text-xs font-bold text-[#2D1E2F] rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#C5B3D3]"
            >
              <option value="ALL">All States</option>
              <option value="Delhi">Delhi</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Telangana">Telangana</option>
              <option value="Kathmandu">Kathmandu</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-[#7A5C77] uppercase tracking-wider mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#F5CBCB] text-xs font-bold text-[#2D1E2F] rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#C5B3D3]"
            >
              <option value="revenue_at_risk">Revenue at Risk</option>
              <option value="churn_probability">Churn Probability</option>
              <option value="monthly_charges">Monthly Charges</option>
              <option value="churn_score">Churn Score</option>
              <option value="csat_score">CSAT Score</option>
              <option value="customer_name">Customer Name</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-[#7A5C77] uppercase tracking-wider mb-1">
              Per Page
            </label>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="w-full bg-[#FFFFFF] border border-[#F5CBCB] text-xs font-bold text-[#2D1E2F] rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#C5B3D3]"
            >
              <option value="15">15 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="rounded-xl border border-[#F5CBCB] bg-[#FFFFFF] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#7A5C77]">
            <thead className="bg-[#FFE2E2] text-[#2D1E2F] uppercase text-[10px] font-extrabold tracking-wider border-b border-[#F5CBCB]">
              <tr>
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Plan</th>
                <th className="p-3.5">Contract</th>
                <th className="p-3.5">State</th>
                <th className="p-3.5">Monthly Charges</th>
                <th className="p-3.5 text-center">Escalation</th>
                <th className="p-3.5">Churn Score</th>
                <th className="p-3.5">Churn Prob</th>
                <th className="p-3.5">Risk Tier</th>
                <th className="p-3.5">Action Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5CBCB]/60 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="11" className="p-8 text-center text-[#7A5C77] text-xs">
                    <div className="inline-flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#C5B3D3]"></div>
                      <span>Loading customer directory records...</span>
                    </div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="11" className="p-8 text-center text-[#7A5C77] text-xs">
                    No customer records found matching the current search & filters.
                  </td>
                </tr>
              ) : (
                customers.map((c, idx) => (
                  <tr
                    key={`${c.customerid}-${idx}`}
                    onClick={() => onSelectCustomer && onSelectCustomer(c.customerid)}
                    className="hover:bg-[#FBEFEF] cursor-pointer transition-colors"
                  >
                    <td className="p-3.5 font-mono text-[#7A5C77] font-bold">{c.customerid}</td>
                    <td className="p-3.5 font-extrabold text-[#2D1E2F] capitalize">{c['customer name']}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFE2E2] text-[#2D1E2F] border border-[#F5CBCB]">
                        {c.plan_type}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#7A5C77]">{c.contract_type}</td>
                    <td className="p-3.5 text-[#7A5C77]">{c.state}</td>
                    <td className="p-3.5 font-mono font-bold text-[#2D1E2F]">
                      ₹{typeof c.monthly_charges === 'number' ? c.monthly_charges.toFixed(2) : c.monthly_charges}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.escalations === 'Y' ? 'bg-[#E65B7B]/15 text-[#E65B7B]' : 'bg-[#FFE2E2] text-[#7A5C77]'
                      }`}>
                        {c.escalations}
                      </span>
                    </td>
                    <td className="p-3.5 font-black font-mono text-[#2D1E2F]">{c.churn_score}</td>
                    <td className="p-3.5 font-black font-mono text-[#E65B7B]">{c.churn_probability}%</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.risk_level === 'HIGH' ? 'bg-[#E65B7B]/15 text-[#E65B7B] border border-[#E65B7B]/30' :
                        c.risk_level === 'MEDIUM' ? 'bg-[#E69537]/15 text-[#E69537] border border-[#E69537]/30' :
                        'bg-[#3BB28B]/15 text-[#3BB28B] border border-[#3BB28B]/30'
                      }`}>
                        {c.risk_level}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#2D1E2F] truncate max-w-xs">{c.recommended_action}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-[#FFE2E2]/60 border-t border-[#F5CBCB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#7A5C77]">
          {/* Status info */}
          <div>
            Showing <span className="text-[#2D1E2F] font-mono">{startRecord}</span> to <span className="text-[#2D1E2F] font-mono">{endRecord}</span> of <span className="text-[#2D1E2F] font-mono">{totalCount.toLocaleString()}</span> customers
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-1.5">
            {/* First Page */}
            <button
              onClick={() => setPage(1)}
              disabled={page === 1 || loading}
              className="p-2 rounded-lg bg-[#FFFFFF] border border-[#F5CBCB] disabled:opacity-40 hover:bg-[#FBEFEF] text-[#2D1E2F] transition-all cursor-pointer"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Previous Page */}
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="p-2 rounded-lg bg-[#FFFFFF] border border-[#F5CBCB] disabled:opacity-40 hover:bg-[#FBEFEF] text-[#2D1E2F] transition-all cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {getPageNumbers().map((pNum) => (
                <button
                  key={pNum}
                  onClick={() => setPage(pNum)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                    page === pNum
                      ? 'bg-[#2D1E2F] text-[#FFFFFF]'
                      : 'bg-[#FFFFFF] text-[#2D1E2F] border border-[#F5CBCB] hover:bg-[#FBEFEF]'
                  }`}
                >
                  {pNum}
                </button>
              ))}
            </div>

            {/* Next Page */}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="p-2 rounded-lg bg-[#FFFFFF] border border-[#F5CBCB] disabled:opacity-40 hover:bg-[#FBEFEF] text-[#2D1E2F] transition-all cursor-pointer flex items-center gap-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Last Page */}
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages || loading}
              className="p-2 rounded-lg bg-[#FFFFFF] border border-[#F5CBCB] disabled:opacity-40 hover:bg-[#FBEFEF] text-[#2D1E2F] transition-all cursor-pointer"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>

          {/* Direct Jump to Page Form */}
          <form onSubmit={handleJumpPage} className="flex items-center space-x-2">
            <span className="text-[11px] font-bold">Go to page:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={jumpPageInput}
              onChange={(e) => setJumpPageInput(e.target.value)}
              placeholder={`${page}`}
              className="w-14 px-2 py-1 bg-[#FFFFFF] border border-[#F5CBCB] rounded-lg font-mono font-bold text-center text-[#2D1E2F] focus:outline-none focus:border-[#C5B3D3]"
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-[#FFFFFF] border border-[#F5CBCB] hover:bg-[#FBEFEF] rounded-lg text-xs font-bold text-[#2D1E2F] cursor-pointer"
            >
              Go
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
