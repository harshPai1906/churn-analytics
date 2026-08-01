import React from 'react';

export default function TopNav({ activeTab, setActiveTab }) {
  const scrollToSection = (sectionId, tabName = 'dashboard') => {
    if (setActiveTab) setActiveTab(tabName);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <header className="h-16 bg-[#FBEFEF]/90 backdrop-blur-md border-b border-[#F5CBCB] px-4 md:px-8 flex items-center justify-between sticky top-0 z-50 transition-all">
      {/* Brand & Status Indicator */}
      <div className="flex items-center space-x-4 md:space-x-6">
        <button 
          onClick={() => scrollToSection('hero-section', 'dashboard')}
          className="flex items-center space-x-2 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] border border-[#F5CBCB] p-0.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
            <img src="/logo.png" alt="Churn Analytics Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-base font-extrabold tracking-tight text-[#2D1E2F]">
            Churn Analytics
          </span>
        </button>

        {/* Animated Status Indicator */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FFE2E2] border border-[#F5CBCB]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3BB28B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3BB28B]"></span>
          </span>
          <span className="text-xs font-semibold text-[#2D1E2F]">Analysis Complete</span>
        </div>
      </div>

      {/* Center Nav Items */}
      <nav className="hidden md:flex items-center space-x-1 bg-[#FFE2E2]/70 p-1 rounded-xl border border-[#F5CBCB]">
        <button
          onClick={() => scrollToSection('dashboard-section', 'dashboard')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'dashboard'
              ? 'bg-[#C5B3D3] text-[#2D1E2F] shadow-sm'
              : 'text-[#7A5C77] hover:text-[#2D1E2F] hover:bg-[#F5CBCB]/40'
          }`}
        >
          Dashboard
        </button>

        <button
          onClick={() => scrollToSection('drivers-section', 'dashboard')}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#7A5C77] hover:text-[#2D1E2F] hover:bg-[#F5CBCB]/40 transition-all"
        >
          Analysis
        </button>

        <button
          onClick={() => scrollToSection('segments-section', 'dashboard')}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#7A5C77] hover:text-[#2D1E2F] hover:bg-[#F5CBCB]/40 transition-all"
        >
          Segments
        </button>
      </nav>
    </header>
  );
}
