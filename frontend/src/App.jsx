import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import PortfolioInfoModal from './components/PortfolioInfoModal';
import CustomerDetailModal from './components/CustomerDetailModal';

import DashboardView from './views/DashboardView';
import CustomersView from './views/CustomersView';
import RiskAnalysisView from './views/RiskAnalysisView';
import SegmentsView from './views/SegmentsView';
import RevenueView from './views/RevenueView';
import ModelPerformanceView from './views/ModelPerformanceView';
import LivePredictorView from './views/LivePredictorView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FBEFEF] text-[#2D1E2F] font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openPortfolioModal={() => setIsPortfolioModalOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <TopNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* View Component Renderer */}
        <main className="flex-1 bg-[#FBEFEF]">
          {activeTab === 'dashboard' && (
            <DashboardView
              onSelectCustomer={(id) => setSelectedCustomerId(id)}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersView
              onSelectCustomer={(id) => setSelectedCustomerId(id)}
            />
          )}

          {activeTab === 'risk' && (
            <RiskAnalysisView
              onSelectCustomer={(id) => setSelectedCustomerId(id)}
            />
          )}

          {activeTab === 'segments' && (
            <SegmentsView
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'revenue' && (
            <RevenueView />
          )}

          {activeTab === 'model-performance' && (
            <ModelPerformanceView />
          )}

          {activeTab === 'predict-sandbox' && (
            <LivePredictorView />
          )}
        </main>
      </div>

      {/* Modals & Drawers */}
      <CustomerDetailModal
        customerId={selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
      />

      <PortfolioInfoModal
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
      />
    </div>
  );
}
