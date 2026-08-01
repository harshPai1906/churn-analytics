import React from 'react';
import { 
  LayoutDashboard, Users, ShieldAlert, PieChart, TrendingUp, 
  Cpu, Info, Sliders, ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, openPortfolioModal }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'customers', label: 'Customer Database', icon: Users },
    { id: 'risk', label: 'Risk Matrix', icon: ShieldAlert },
    { id: 'segments', label: 'Segments Deep Dive', icon: PieChart },
    { id: 'revenue', label: 'Revenue Exposure', icon: TrendingUp },
    { id: 'model-performance', label: 'Model Performance', icon: Cpu },
    { id: 'predict-sandbox', label: 'Live Predictor', icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-[#FFE2E2] border-r border-[#F5CBCB] flex flex-col h-screen sticky top-0 select-none z-40">
      {/* Brand Header with Custom Logo */}
      <div className="p-4 border-b border-[#F5CBCB]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] p-1 shadow-sm flex items-center justify-center">
            <img src="/logo.png" alt="Churn Analytics Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-extrabold text-[#2D1E2F] tracking-tight text-sm leading-tight">Churn Analytics</h1>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-[#7A5C77] tracking-wider uppercase">
          Navigation Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-[#C5B3D3] text-[#2D1E2F] shadow-sm'
                  : 'text-[#7A5C77] hover:text-[#2D1E2F] hover:bg-[#F5CBCB]/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#2D1E2F]' : 'text-[#7A5C77]'}`} />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Showcase Trigger */}
      <div className="p-3 border-t border-[#F5CBCB] bg-[#FFE2E2]">
        <button
          onClick={openPortfolioModal}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FBEFEF] border border-[#F5CBCB] text-[#2D1E2F] text-xs font-semibold transition-all"
        >
          <div className="flex items-center space-x-2.5">
            <Info className="w-4 h-4 text-[#7A5C77]" />
            <span>Methodology</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#7A5C77]" />
        </button>
      </div>
    </aside>
  );
}
