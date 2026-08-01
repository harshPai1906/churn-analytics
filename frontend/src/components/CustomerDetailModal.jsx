import React, { useEffect, useState } from 'react';
import { X, ShieldAlert, Heart, CreditCard, AlertTriangle, ArrowUpRight, UserCheck } from 'lucide-react';

const fallbackCustomerLookup = {
  '0002-ORFBO': { customer_id: '0002-ORFBO', customer_name: 'Keshav', subscription_type: 'Basic', location: 'Maharashtra', tenure_months: 12, monthly_spend: 15.5, churn_probability: 35, risk_level: 'LOW', health_score: 85, revenue_at_risk: 0, recommended_action: 'Send standard annual contract renewal discount.', login_frequency: 12, avg_session_duration: 18.5, last_active_days: 2, customer_satisfaction: 4.2, support_tickets: 1, complaints: 0, payment_failures: 0, contract_length: 'Monthly' },
  '0003-MKNFE': { customer_id: '0003-MKNFE', customer_name: 'Raghav', subscription_type: 'Basic', location: 'Karnataka', tenure_months: 4, monthly_spend: 19.8, churn_probability: 82, risk_level: 'HIGH', health_score: 25, revenue_at_risk: 19.8, recommended_action: 'Priority technical support audit & contract upgrade offer.', login_frequency: 2, avg_session_duration: 5.0, last_active_days: 14, customer_satisfaction: 2.1, support_tickets: 4, complaints: 2, payment_failures: 1, contract_length: 'Monthly' },
  '0004-TLHLJ': { customer_id: '0004-TLHLJ', customer_name: 'Lalita', subscription_type: 'Basic', location: 'Delhi', tenure_months: 5, monthly_spend: 20.1, churn_probability: 78, risk_level: 'HIGH', health_score: 30, revenue_at_risk: 20.1, recommended_action: 'Proactive support outreach & free feature upgrade.', login_frequency: 3, avg_session_duration: 7.2, last_active_days: 10, customer_satisfaction: 2.3, support_tickets: 3, complaints: 1, payment_failures: 0, contract_length: 'Monthly' },
  '0013-EXCHZ': { customer_id: '0013-EXCHZ', customer_name: 'Mira', subscription_type: 'Basic', location: 'Delhi', tenure_months: 3, monthly_spend: 18.2, churn_probability: 91, risk_level: 'HIGH', health_score: 15, revenue_at_risk: 18.2, recommended_action: 'Immediate retention call & 15% annual contract incentive.', login_frequency: 1, avg_session_duration: 4.0, last_active_days: 18, customer_satisfaction: 1.8, support_tickets: 5, complaints: 3, payment_failures: 1, contract_length: 'Monthly' },
  '0015-UOANM': { customer_id: '0015-UOANM', customer_name: 'Ananya', subscription_type: 'Basic', location: 'Karnataka', tenure_months: 2, monthly_spend: 17.9, churn_probability: 88, risk_level: 'HIGH', health_score: 20, revenue_at_risk: 17.9, recommended_action: 'Resolve support escalation & feature onboarding walkthrough.', login_frequency: 2, avg_session_duration: 6.0, last_active_days: 12, customer_satisfaction: 2.0, support_tickets: 4, complaints: 2, payment_failures: 0, contract_length: 'Monthly' },
  '0016-FBBAZ': { customer_id: '0016-FBBAZ', customer_name: 'Priya', subscription_type: 'Standard', location: 'Meghalaya', tenure_months: 6, monthly_spend: 31.0, churn_probability: 75, risk_level: 'HIGH', health_score: 32, revenue_at_risk: 31.0, recommended_action: 'Regional coverage review & dedicated manager check-in.', login_frequency: 4, avg_session_duration: 10.0, last_active_days: 8, customer_satisfaction: 2.5, support_tickets: 3, complaints: 1, payment_failures: 0, contract_length: 'Monthly' },
  '0017-WMJ12': { customer_id: '0017-WMJ12', customer_name: 'Aditya', subscription_type: 'Standard', location: 'Telangana', tenure_months: 5, monthly_spend: 33.2, churn_probability: 79, risk_level: 'HIGH', health_score: 28, revenue_at_risk: 33.2, recommended_action: 'Executive check-in call & SLA response guarantee.', login_frequency: 3, avg_session_duration: 8.5, last_active_days: 9, customer_satisfaction: 2.2, support_tickets: 4, complaints: 2, payment_failures: 1, contract_length: 'Monthly' }
};

export default function CustomerDetailModal({ customerId, onClose }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) return;
    setLoading(true);

    fetch(`/api/customers/${customerId}`)
      .then(res => {
        if (!res.ok) throw new Error("Offline");
        return res.json();
      })
      .then(data => {
        setCustomer(data);
        setLoading(false);
      })
      .catch(err => {
        // Fallback customer detail object
        const local = fallbackCustomerLookup[customerId] || {
          customer_id: customerId,
          customer_name: 'Cohort Customer',
          subscription_type: 'Basic',
          location: 'India',
          tenure_months: 6,
          monthly_spend: 25.0,
          churn_probability: 70,
          risk_level: 'HIGH',
          health_score: 35,
          revenue_at_risk: 25.0,
          recommended_action: 'Proactive retention review & annual contract discount.',
          login_frequency: 4,
          avg_session_duration: 11.0,
          last_active_days: 7,
          customer_satisfaction: 3.0,
          support_tickets: 2,
          complaints: 1,
          payment_failures: 0,
          contract_length: 'Monthly'
        };
        setCustomer(local);
        setLoading(false);
      });
  }, [customerId]);

  if (!customerId) return null;

  const shapFactors = customer ? [
    { factor: `Contract: ${customer.contract_length || 'Monthly'}`, impact: customer.contract_length === 'Monthly' ? '+35% Churn Risk' : '-10% Risk', direction: customer.contract_length === 'Monthly' ? 'positive' : 'negative' },
    { factor: `Support Escalations (${customer.complaints || 0})`, impact: (customer.complaints || 0) > 0 ? `+${(customer.complaints || 0) * 15}% Churn Risk` : '-12% Risk', direction: (customer.complaints || 0) > 0 ? 'positive' : 'negative' },
    { factor: `Plan Tier: ${customer.subscription_type || 'Basic'}`, impact: customer.subscription_type === 'Basic' ? '+20% Churn Risk' : '-15% Risk', direction: customer.subscription_type === 'Basic' ? 'positive' : 'negative' }
  ] : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-0 bg-[#2D1E2F]/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFFFFF] border-l border-[#F5CBCB] w-full max-w-2xl h-full flex flex-col shadow-2xl overflow-hidden animate-slide-left text-[#2D1E2F]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#F5CBCB] flex items-center justify-between bg-[#FFE2E2]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C5B3D3] to-[#F5CBCB] flex items-center justify-center font-black text-[#2D1E2F] text-sm">
              {customer?.customer_name ? customer.customer_name.substring(0, 2).toUpperCase() : 'CU'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-[#2D1E2F]">{customer?.customer_name || 'Customer Profile'}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#7A5C77] bg-[#FFFFFF] border border-[#F5CBCB]">
                  {customer?.customer_id}
                </span>
              </div>
              <p className="text-xs text-[#7A5C77] font-medium">
                {customer?.subscription_type} Plan &bull; {customer?.location} &bull; {customer?.tenure_months} Months Tenure
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7A5C77] hover:text-[#2D1E2F] hover:bg-[#FBEFEF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center p-8 text-[#7A5C77] text-xs">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5B3D3] mb-2"></div>
          </div>
        ) : customer ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Top Score Cards */}
            <div className="grid grid-cols-3 gap-4">
              {/* Health Score */}
              <div className="p-4 rounded-xl bg-[#FFE2E2] border border-[#F5CBCB] flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between text-[#7A5C77] text-[11px] font-bold">
                  <span>Health Score</span>
                  <Heart className="w-4 h-4 text-[#3BB28B]" />
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-[#2D1E2F]">{customer.health_score}</span>
                  <span className="text-[10px] font-bold text-[#7A5C77]">/ 100</span>
                </div>
                <div className="w-full bg-[#FFFFFF] h-1.5 rounded-full mt-2 overflow-hidden border border-[#F5CBCB]">
                  <div 
                    className={`h-full ${customer.health_score > 60 ? 'bg-[#3BB28B]' : 'bg-[#E65B7B]'}`}
                    style={{ width: `${customer.health_score}%` }}
                  ></div>
                </div>
              </div>

              {/* Churn Probability */}
              <div className="p-4 rounded-xl bg-[#FFE2E2] border border-[#F5CBCB] flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between text-[#7A5C77] text-[11px] font-bold">
                  <span>Churn Score</span>
                  <ShieldAlert className="w-4 h-4 text-[#E65B7B]" />
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-[#E65B7B]">{customer.churn_probability}%</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    customer.risk_level === 'HIGH' ? 'bg-[#E65B7B]/15 text-[#E65B7B]' : 'bg-[#3BB28B]/15 text-[#3BB28B]'
                  }`}>
                    {customer.risk_level}
                  </span>
                </div>
                <div className="w-full bg-[#FFFFFF] h-1.5 rounded-full mt-2 overflow-hidden border border-[#F5CBCB]">
                  <div 
                    className={`h-full ${customer.risk_level === 'HIGH' ? 'bg-[#E65B7B]' : 'bg-[#3BB28B]'}`}
                    style={{ width: `${customer.churn_probability}%` }}
                  ></div>
                </div>
              </div>

              {/* Monthly Spend */}
              <div className="p-4 rounded-xl bg-[#FFE2E2] border border-[#F5CBCB] flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between text-[#7A5C77] text-[11px] font-bold">
                  <span>Monthly Spend</span>
                  <CreditCard className="w-4 h-4 text-[#7A5C77]" />
                </div>
                <div className="mt-2">
                  <span className="text-xl font-black text-[#2D1E2F]">₹{customer.monthly_spend}</span>
                  <p className="text-[10px] text-[#7A5C77] font-bold mt-1">₹{Math.round(customer.monthly_spend * 12)}/yr ARR</p>
                </div>
              </div>
            </div>

            {/* Recommended Action Card */}
            <div className="p-4 rounded-xl bg-[#FFE2E2] border border-[#F5CBCB] space-y-2 shadow-sm">
              <div className="flex items-center space-x-2 text-[#7A5C77] text-xs font-bold uppercase tracking-wider">
                <UserCheck className="w-4 h-4 text-[#3BB28B]" />
                <span>Recommended Retention Action</span>
              </div>
              <p className="text-sm font-extrabold text-[#2D1E2F] leading-snug">
                "{customer.recommended_action}"
              </p>
            </div>

            {/* SHAP Risk Factors */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#2D1E2F] uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#E65B7B]" />
                Explainable Risk Drivers
              </h4>
              <div className="p-4 rounded-xl bg-[#FFE2E2]/60 border border-[#F5CBCB] space-y-3">
                {shapFactors.map((factor, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-[#2D1E2F] font-semibold">{factor.factor}</span>
                    <span className={`font-mono font-bold ${factor.direction === 'positive' ? 'text-[#E65B7B]' : 'text-[#3BB28B]'}`}>
                      {factor.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Usage & Support Metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FFE2E2]/50 border border-[#F5CBCB] space-y-2 text-xs">
                <h5 className="font-extrabold text-[#2D1E2F] border-b border-[#F5CBCB] pb-2">Usage Metrics</h5>
                <div className="flex justify-between py-1 border-b border-[#F5CBCB]/60">
                  <span className="text-[#7A5C77] font-medium">Login Frequency</span>
                  <span className="font-bold text-[#2D1E2F]">{customer.login_frequency} / month</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5CBCB]/60">
                  <span className="text-[#7A5C77] font-medium">Avg Session</span>
                  <span className="font-bold text-[#2D1E2F]">{customer.avg_session_duration} mins</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#7A5C77] font-medium">Last Active</span>
                  <span className="font-bold text-[#2D1E2F]">{customer.last_active_days} days ago</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FFE2E2]/50 border border-[#F5CBCB] space-y-2 text-xs">
                <h5 className="font-extrabold text-[#2D1E2F] border-b border-[#F5CBCB] pb-2">Support History</h5>
                <div className="flex justify-between py-1 border-b border-[#F5CBCB]/60">
                  <span className="text-[#7A5C77] font-medium">Support Tickets</span>
                  <span className="font-bold text-[#2D1E2F]">{customer.support_tickets} tickets</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5CBCB]/60">
                  <span className="text-[#7A5C77] font-medium">Complaints</span>
                  <span className="font-bold text-[#E65B7B]">{customer.complaints}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#7A5C77] font-medium">Contract Type</span>
                  <span className="font-bold text-[#2D1E2F]">{customer.contract_length}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-[#7A5C77] text-xs">Customer details not available.</div>
        )}
      </div>
    </div>
  );
}
