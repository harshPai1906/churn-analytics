import React from 'react';
import { ArrowDown } from 'lucide-react';

export default function HeroSection({ onExploreClick }) {
  const handleScrollToDashboard = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const el = document.getElementById('dashboard-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="hero-section" className="relative py-20 md:py-28 px-4 md:px-8 bg-mesh-pattern overflow-hidden border-b border-[#F5CBCB]">
      {/* Soft Ambient Floating Background Light Waves */}
      <div className="absolute -top-16 left-1/4 w-[550px] h-[550px] bg-[#C5B3D3]/30 rounded-full blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#FFE2E2]/70 rounded-full blur-3xl pointer-events-none animate-float-slow" style={{ animationDelay: '4s' }} />

      <div className="max-w-6xl mx-auto text-center relative z-10 space-y-8 animate-fade-in">
        {/* Extra Big Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#2D1E2F] leading-none pt-2">
          Customer Churn Analytics
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-2xl text-[#7A5C77] max-w-3xl mx-auto font-medium leading-relaxed">
          Turning customer data into actionable retention insights using Python, Pandas, and interactive visualization.
        </p>

        {/* Technical Stack Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs md:text-sm font-bold text-[#7A5C77]">
          <span className="px-4 py-1.5 rounded-xl bg-[#FFFFFF]/80 backdrop-blur-md border border-[#F5CBCB] flex items-center gap-2 shadow-sm hover:border-[#C5B3D3] transition-all">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5B3D3]"></span> Python & Pandas
          </span>
          <span className="px-4 py-1.5 rounded-xl bg-[#FFFFFF]/80 backdrop-blur-md border border-[#F5CBCB] flex items-center gap-2 shadow-sm hover:border-[#F5CBCB] transition-all">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5CBCB]"></span> Database Ingestion
          </span>
          <span className="px-4 py-1.5 rounded-xl bg-[#FFFFFF]/80 backdrop-blur-md border border-[#F5CBCB] flex items-center gap-2 shadow-sm hover:border-[#3BB28B] transition-all">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3BB28B]"></span> Statistical Correlation
          </span>
          <span className="px-4 py-1.5 rounded-xl bg-[#FFFFFF]/80 backdrop-blur-md border border-[#F5CBCB] flex items-center gap-2 shadow-sm hover:border-[#E65B7B] transition-all">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E65B7B]"></span> Executive Insights
          </span>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <button
            onClick={handleScrollToDashboard}
            className="inline-flex items-center space-x-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C5B3D3] to-[#F5CBCB] text-[#2D1E2F] font-black text-sm md:text-base hover:opacity-95 transition-all shadow-md hover:scale-[1.02] active:scale-95 group focus:outline-none cursor-pointer"
          >
            <span>Explore Dashboard</span>
            <ArrowDown className="w-5 h-5 text-[#2D1E2F] group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
