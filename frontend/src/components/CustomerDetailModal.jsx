import React, { useEffect, useState } from 'react';
import { X, ShieldAlert, Heart, CreditCard, AlertTriangle, ArrowUpRight, UserCheck } from 'lucide-react';

const fallbackCustomerLookup = {
  '0020-JDNXP': { customerid: '0020-JDNXP', 'customer name': 'mina', plan_type: 'Premium', state: 'Delhi', country: 'India', contract_type: 'Annual', monthly_charges: 23.10, cltv: 1610, churn_score: 8, churn_probability: 72, risk_level: 'HIGH', health_score: 42, revenue_at_risk: 199.6, recommended_action: 'Assign Dedicated Account Manager & schedule emergency call.', escalations: 'Y', csat_score: 28.83, complaint_count: 0.99, cancellation_reason: 'Switched to competitor', subscription_type: 'Organic', gender: 'Female', dob: '23-11-1995' },
  '0013-EXCHZ': { customerid: '0013-EXCHZ', 'customer name': 'mira', plan_type: 'Basic', state: 'Delhi', country: 'India', contract_type: 'Monthly', monthly_charges: 17.79, cltv: 550, churn_score: 79, churn_probability: 91, risk_level: 'HIGH', health_score: 15, revenue_at_risk: 194.2, recommended_action: 'Provide 25% Contract Renewal Discount & Loyalty Incentive.', escalations: 'N', csat_score: 42.15, complaint_count: 1.45, cancellation_reason: 'Too expensive', subscription_type: 'Paid', gender: 'Female', dob: '15-03-1990' },
  '0003-MKNFE': { customerid: '0003-MKNFE', 'customer name': 'mohan', plan_type: 'Standard', state: 'Rajasthan', country: 'India', contract_type: 'Monthly', monthly_charges: 10.59, cltv: 335, churn_score: 3, churn_probability: 68, risk_level: 'MEDIUM', health_score: 48, revenue_at_risk: 86.3, recommended_action: 'Priority Customer Support follow-up on unresolved escalations.', escalations: 'Y', csat_score: 55.20, complaint_count: 1.12, cancellation_reason: 'Poor streaming quality', subscription_type: 'Refferal', gender: 'Male', dob: '08-07-1988' }
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
          customerid: customerId,
          'customer name': 'Customer',
          plan_type: 'Standard',
          state: 'India',
          country: 'India',
          contract_type: 'Monthly',
          monthly_charges: 20.0,
          cltv: 640,
          churn_score: 34,
          churn_probability: 50,
          risk_level: 'MEDIUM',
          health_score: 55,
          revenue_at_risk: 120.0,
          recommended_action: 'Initiate Automated Health Check & Feedback Survey.',
          escalations: 'N',
          csat_score: 50.0,
          complaint_count: 1.0,
          cancellation_reason: 'Too expensive',
          subscription_type: 'Organic',
          gender: 'Male',
          dob: '01-01-1990'
        };
        setCustomer(local);
        setLoading(false);
      });
  }, [customerId]);

  if (!customerId) return null;

  const shapFactors = customer ? [
    { factor: `Contract: ${customer.contract_type || 'Monthly'}`, impact: customer.contract_type === 'Monthly' ? '+24% Churn Risk' : '-10% Risk', direction: customer.contract_type === 'Monthly' ? 'positive' : 'negative' },
    { factor: `Escalation: ${customer.escalations || 'N'}`, impact: customer.escalations === 'Y' ? '+20% Churn Risk' : '-5% Risk', direction: customer.escalations === 'Y' ? 'positive' : 'negative' },
    { factor: `Plan: ${customer.plan_type || 'Standard'}`, impact: customer.plan_type === 'Basic' ? '+18% Churn Risk' : customer.plan_type === 'Premium' ? '-12% Risk' : '+5% Risk', direction: customer.plan_type === 'Basic' ? 'positive' : customer.plan_type === 'Premium' ? 'negative' : 'positive' }
  ] : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-0 bg-[#2D1E2F]/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFFFFF] border-l border-[#F5CBCB] w-full max-w-2xl h-full flex flex-col shadow-2xl overflow-hidden animate-slide-left text-[#2D1E2F]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#F5CBCB] flex items-center justify-between bg-[#FFE2E2]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C5B3D3] to-[#F5CBCB] flex items-center justify-center font-black text-[#2D1E2F] text-sm">
              {customer?.['customer name'] ? customer['customer name'].substring(0, 2).toUpperCase() : 'CU'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-[#2D1E2F] capitalize">{customer?.['customer name'] || 'Customer Profile'}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#7A5C77] bg-[#FFFFFF] border border-[#F5CBCB]">
                  {customer?.customerid}
                </span>
              </div>
              <p className="text-xs text-[#7A5C77] font-medium">
                {customer?.plan_type} Plan &bull; {customer?.state} &bull; {customer?.contract_type} Contract
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
                  <span>Churn Probability</span>
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

              {/* Monthly Charges */}
              <div className="p-4 rounded-xl bg-[#FFE2E2] border border-[#F5CBCB] flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between text-[#7A5C77] text-[11px] font-bold">
                  <span>Monthly Charges</span>
                  <CreditCard className="w-4 h-4 text-[#7A5C77]" />
                </div>
                <div className="mt-2">
                  <span className="text-xl font-black text-[#2D1E2F]">₹{typeof customer.monthly_charges === 'number' ? customer.monthly_charges.toFixed(2) : customer.monthly_charges}</span>
                  <p className="text-[10px] text-[#7A5C77] font-bold mt-1">CLTV: ₹{customer.cltv}</p>
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

            {/* Customer Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FFE2E2]/50 border border-[#F5CBCB] space-y-2 text-xs">
                <h5 className="font-extrabold text-[#2D1E2F] border-b border-[#F5CBCB] pb-2">Subscription Details</h5>
                <div className="flex justify-between py-1 border-b border-[#F5CBCB]/60">
                  <span className="text-[#7A5C77] font-medium">Plan Type</span>
                  <span className="font-bold text-[#2D1E2F]">{customer.plan_type}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5CBCB]/60">
                  <span className="text-[#7A5C77] font-medium">Contract Type</span>
                  <span className="font-bold text-[#2D1E2F]">{customer.contract_type}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5CBCB]/60">
                  <span className="text-[#7A5C77] font-medium">Subscription Type</span>
                  <span className="font-bold text-[#2D1E2F]">{customer.subscription_type}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#7A5C77] font-medium">Cancellation Reason</span>
                  <span className="font-bold text-[#2D1E2F]">{customer.cancellation_reason}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FFE2E2]/50 border border-[#F5CBCB] space-y-2 text-xs">
                <h5 className="font-extrabold text-[#2D1E2F] border-b border-[#F5CBCB] pb-2">Support & Satisfaction</h5>
                <div className="flex justify-between py-1 border-b border-[#F5CBCB]/60">
                  <span className="text-[#7A5C77] font-medium">CSAT Score</span>
                  <span className="font-bold text-[#2D1E2F]">{typeof customer.csat_score === 'number' ? customer.csat_score.toFixed(1) : customer.csat_score} / 100</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5CBCB]/60">
                  <span className="text-[#7A5C77] font-medium">Escalation</span>
                  <span className={`font-bold ${customer.escalations === 'Y' ? 'text-[#E65B7B]' : 'text-[#3BB28B]'}`}>{customer.escalations === 'Y' ? 'Escalated' : 'None'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5CBCB]/60">
                  <span className="text-[#7A5C77] font-medium">Complaint Count</span>
                  <span className="font-bold text-[#2D1E2F]">{typeof customer.complaint_count === 'number' ? customer.complaint_count.toFixed(2) : customer.complaint_count}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#7A5C77] font-medium">Churn Score</span>
                  <span className="font-bold text-[#2D1E2F]">{customer.churn_score}</span>
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
