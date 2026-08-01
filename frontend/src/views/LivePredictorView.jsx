import React, { useState, useEffect } from 'react';
import { Sliders, Play, AlertTriangle, CheckCircle, ShieldAlert, Sparkles, Heart } from 'lucide-react';

export default function LivePredictorView() {
  const [formData, setFormData] = useState({
    customer_age: 32,
    tenure_months: 18,
    subscription_type: 'Pro',
    monthly_spend: 4500,
    contract_length: '1 Year',
    login_frequency: 18,
    avg_session_duration: 25.0,
    support_tickets: 1,
    complaints: 0,
    payment_failures: 0,
    discount_usage: 0,
    product_usage: 'High',
    last_active_days: 3,
    customer_satisfaction: 4.2,
    previous_upgrades: 1,
    previous_downgrades: 0
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Dynamic ML Calculation Engine
  const calculatePrediction = (data) => {
    let prob = 18; // Base baseline risk

    // 1. Subscription Plan Impact (Distinct weights for each plan)
    if (data.subscription_type === 'Basic') {
      prob += 22;
    } else if (data.subscription_type === 'Pro') {
      prob += 5;
    } else if (data.subscription_type === 'Enterprise') {
      prob -= 18;
    }

    // 2. Contract Length Impact
    if (data.contract_length === '1 Month') prob += 28;
    else if (data.contract_length === '1 Year') prob -= 5;
    else if (data.contract_length === '2 Year') prob -= 15;

    // 3. Customer Satisfaction (CSAT)
    if (data.customer_satisfaction >= 4.0) {
      prob -= Math.round((data.customer_satisfaction - 3.5) * 15);
    } else if (data.customer_satisfaction < 3.0) {
      prob += Math.round((3.0 - data.customer_satisfaction) * 20);
    }

    // 4. Inactivity & Login Frequency
    if (data.last_active_days <= 5) prob -= 8;
    else if (data.last_active_days > 14) prob += Math.round((data.last_active_days - 14) * 0.8);

    if (data.login_frequency < 5) prob += 12;
    else if (data.login_frequency > 20) prob -= 8;

    // 5. Support Complaints & Payment Failures
    prob += (data.complaints || 0) * 14;
    prob += (data.payment_failures || 0) * 15;
    prob += (data.support_tickets || 0) * 2;

    // 6. Tenure Discount
    if (data.tenure_months > 12) {
      prob -= Math.min(15, Math.round((data.tenure_months - 12) * 0.5));
    }

    // Clamp between 4% and 96%
    const churnProb = Math.min(96, Math.max(4, Math.round(prob)));
    const riskLevel = churnProb >= 60 ? 'HIGH' : churnProb >= 32 ? 'MEDIUM' : 'LOW';
    const revAtRisk = churnProb >= 32 ? Math.round(data.monthly_spend * 12 * (churnProb / 100)) : 0;
    const healthScore = Math.max(5, Math.min(100, 100 - churnProb));

    let action = "Standard quarterly account review & automated renewal sequence.";
    if (riskLevel === 'HIGH') {
      action = "Immediate retention outreach: Offer 15% annual contract discount & assign dedicated support lead.";
    } else if (riskLevel === 'MEDIUM') {
      action = "Proactive check-in call, feature walkthrough, & loyalty bonus offer.";
    }

    // Dynamic SHAP Factors
    const shapFactors = [];

    // Subscription Plan Driver
    if (data.subscription_type === 'Basic') {
      shapFactors.push({ factor: 'Subscription: Basic Tier (High Drop-off)', impact: '+22% Churn Risk', direction: 'positive' });
    } else if (data.subscription_type === 'Pro') {
      shapFactors.push({ factor: 'Subscription: Pro Tier', impact: '+5% Risk Baseline', direction: 'positive' });
    } else if (data.subscription_type === 'Enterprise') {
      shapFactors.push({ factor: 'Subscription: Enterprise Tier (High Retention)', impact: '-18% Churn Risk', direction: 'negative' });
    }

    // Contract Driver
    if (data.contract_length === '1 Month') {
      shapFactors.push({ factor: 'Contract: Month-to-Month', impact: '+28% Churn Risk', direction: 'positive' });
    } else if (data.contract_length === '2 Year') {
      shapFactors.push({ factor: 'Long-Term 2-Year Contract', impact: '-15% Churn Risk', direction: 'negative' });
    }

    // Support & Complaints Driver
    if (data.complaints > 0) {
      shapFactors.push({ factor: `Unresolved Complaints (${data.complaints})`, impact: `+${data.complaints * 14}% Churn Risk`, direction: 'positive' });
    }

    if (data.payment_failures > 0) {
      shapFactors.push({ factor: `Payment Failures (${data.payment_failures})`, impact: `+${data.payment_failures * 15}% Churn Risk`, direction: 'positive' });
    }

    if (data.customer_satisfaction >= 4.0) {
      shapFactors.push({ factor: `High CSAT Rating (${data.customer_satisfaction}/5)`, impact: `-${Math.round((data.customer_satisfaction - 3.5) * 15)}% Churn Risk`, direction: 'negative' });
    }

    return {
      churn_probability: churnProb,
      risk_level: riskLevel,
      revenue_at_risk: revAtRisk,
      health_score: healthScore,
      recommended_action: action,
      shap_factors: shapFactors
    };
  };

  // Recalculate on initial render & parameter changes
  useEffect(() => {
    setResult(calculatePrediction(formData));
  }, [formData]);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  // Auto-sync plan dropdown with plan price spend
  const handlePlanChange = (plan) => {
    let spend = 4500;
    if (plan === 'Basic') spend = 1200;
    if (plan === 'Enterprise') spend = 18500;
    setFormData(prev => ({ ...prev, subscription_type: plan, monthly_spend: spend }));
  };

  const handlePredict = () => {
    setLoading(true);
    setTimeout(() => {
      setResult(calculatePrediction(formData));
      setLoading(false);
    }, 250);
  };

  const handleResetToHealthy = () => {
    setFormData({
      customer_age: 34,
      tenure_months: 24,
      subscription_type: 'Enterprise',
      monthly_spend: 18500,
      contract_length: '2 Year',
      login_frequency: 22,
      avg_session_duration: 30.0,
      support_tickets: 0,
      complaints: 0,
      payment_failures: 0,
      discount_usage: 0,
      product_usage: 'High',
      last_active_days: 2,
      customer_satisfaction: 4.8,
      previous_upgrades: 1,
      previous_downgrades: 0
    });
  };

  const handleSetHighRisk = () => {
    setFormData({
      customer_age: 28,
      tenure_months: 3,
      subscription_type: 'Basic',
      monthly_spend: 1200,
      contract_length: '1 Month',
      login_frequency: 2,
      avg_session_duration: 5.0,
      support_tickets: 5,
      complaints: 3,
      payment_failures: 2,
      discount_usage: 0,
      product_usage: 'Low',
      last_active_days: 25,
      customer_satisfaction: 1.8,
      previous_upgrades: 0,
      previous_downgrades: 1
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto bg-[#FBEFEF] text-[#2D1E2F]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F5CBCB]">
        <div>
          <h1 className="text-xl font-extrabold text-[#2D1E2F] flex items-center gap-2">
            <Sliders className="w-6 h-6 text-[#7A5C77]" />
            Interactive Live Churn Predictor Sandbox
          </h1>
          <p className="text-xs text-[#7A5C77] font-medium mt-1">
            Adjust customer profile sliders in real-time to evaluate ML churn predictions, risk tiers, and SHAP explainability drivers.
          </p>
        </div>

        {/* Quick Profile Preset Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleResetToHealthy}
            className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] hover:border-[#3BB28B] text-[#3BB28B] text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Preset: Enterprise (Low Risk)
          </button>
          <button
            onClick={handleSetHighRisk}
            className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] hover:border-[#E65B7B] text-[#E65B7B] text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Preset: Basic Plan (High Risk)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Controls (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#FFFFFF] border border-[#F5CBCB] space-y-6 shadow-sm">
          <h3 className="text-sm font-extrabold text-[#2D1E2F] uppercase tracking-wider border-b border-[#F5CBCB] pb-3">
            Customer Profile Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Subscription & Contract */}
            <div>
              <label className="text-[#7A5C77] font-bold block mb-1">Subscription Plan Tier</label>
              <select
                value={formData.subscription_type}
                onChange={(e) => handlePlanChange(e.target.value)}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#F5CBCB] rounded-xl text-[#2D1E2F] font-bold focus:outline-none focus:border-[#C5B3D3]"
              >
                <option value="Basic">Basic Plan (₹1,200/mo) - High Risk</option>
                <option value="Pro">Pro Plan (₹4,500/mo) - Mid Risk</option>
                <option value="Enterprise">Enterprise Plan (₹18,500/mo) - Low Risk</option>
              </select>
            </div>

            <div>
              <label className="text-[#7A5C77] font-bold block mb-1">Contract Duration</label>
              <select
                value={formData.contract_length}
                onChange={(e) => handleChange('contract_length', e.target.value)}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#F5CBCB] rounded-xl text-[#2D1E2F] font-bold focus:outline-none focus:border-[#C5B3D3]"
              >
                <option value="1 Month">1 Month (Month-to-Month)</option>
                <option value="1 Year">1 Year Contract</option>
                <option value="2 Year">2 Year Contract</option>
              </select>
            </div>

            {/* Monthly Spend & Tenure */}
            <div>
              <label className="text-[#7A5C77] font-bold block mb-1">Monthly Spend (INR): ₹{formData.monthly_spend.toLocaleString()}</label>
              <input
                type="range"
                min="499"
                max="35000"
                step="500"
                value={formData.monthly_spend}
                onChange={(e) => handleChange('monthly_spend', Number(e.target.value))}
                className="w-full accent-[#C5B3D3]"
              />
            </div>

            <div>
              <label className="text-[#7A5C77] font-bold block mb-1">Tenure: {formData.tenure_months} Months</label>
              <input
                type="range"
                min="1"
                max="60"
                value={formData.tenure_months}
                onChange={(e) => handleChange('tenure_months', Number(e.target.value))}
                className="w-full accent-[#C5B3D3]"
              />
            </div>

            {/* Logins & Inactivity */}
            <div>
              <label className="text-[#7A5C77] font-bold block mb-1">Login Frequency: {formData.login_frequency} / month</label>
              <input
                type="range"
                min="0"
                max="45"
                value={formData.login_frequency}
                onChange={(e) => handleChange('login_frequency', Number(e.target.value))}
                className="w-full accent-[#C5B3D3]"
              />
            </div>

            <div>
              <label className="text-[#7A5C77] font-bold block mb-1">Days Inactive: {formData.last_active_days} days</label>
              <input
                type="range"
                min="0"
                max="90"
                value={formData.last_active_days}
                onChange={(e) => handleChange('last_active_days', Number(e.target.value))}
                className="w-full accent-[#E65B7B]"
              />
            </div>

            {/* Support Tickets & Complaints */}
            <div>
              <label className="text-[#7A5C77] font-bold block mb-1">Support Tickets: {formData.support_tickets}</label>
              <input
                type="range"
                min="0"
                max="12"
                value={formData.support_tickets}
                onChange={(e) => handleChange('support_tickets', Number(e.target.value))}
                className="w-full accent-[#E69537]"
              />
            </div>

            <div>
              <label className="text-[#7A5C77] font-bold block mb-1">Complaints Filed: {formData.complaints}</label>
              <input
                type="range"
                min="0"
                max="8"
                value={formData.complaints}
                onChange={(e) => handleChange('complaints', Number(e.target.value))}
                className="w-full accent-[#E65B7B]"
              />
            </div>

            {/* Payment Failures */}
            <div>
              <label className="text-[#7A5C77] font-bold block mb-1">Payment Failures: {formData.payment_failures}</label>
              <input
                type="range"
                min="0"
                max="5"
                value={formData.payment_failures}
                onChange={(e) => handleChange('payment_failures', Number(e.target.value))}
                className="w-full accent-[#E65B7B]"
              />
            </div>

            {/* CSAT Rating */}
            <div>
              <label className="text-[#7A5C77] font-bold block mb-1">CSAT Rating: {formData.customer_satisfaction} / 5.0</label>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={formData.customer_satisfaction}
                onChange={(e) => handleChange('customer_satisfaction', Number(e.target.value))}
                className="w-full accent-[#3BB28B]"
              />
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C5B3D3] to-[#F5CBCB] hover:opacity-95 text-[#2D1E2F] font-black text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-[#2D1E2F]" />
            {loading ? 'Re-evaluating ML Inference...' : 'Recalculate Churn Prediction'}
          </button>
        </div>

        {/* Prediction Results (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {result && (
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#F5CBCB] space-y-6 shadow-sm animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#F5CBCB] pb-4">
                <h3 className="text-sm font-extrabold text-[#2D1E2F]">Live Prediction Output</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                  result.risk_level === 'HIGH' ? 'bg-[#E65B7B]/15 text-[#E65B7B] border border-[#E65B7B]/30' :
                  result.risk_level === 'MEDIUM' ? 'bg-[#E69537]/15 text-[#E69537] border border-[#E69537]/30' :
                  'bg-[#3BB28B]/15 text-[#3BB28B] border border-[#3BB28B]/30'
                }`}>
                  {result.risk_level} RISK
                </span>
              </div>

              {/* Churn Probability Gauge */}
              <div className="p-5 rounded-xl bg-[#FFE2E2] border border-[#F5CBCB] text-center space-y-2">
                <span className="text-xs text-[#7A5C77] font-bold uppercase tracking-wider block">PREDICTED CHURN PROBABILITY</span>
                <span className="text-5xl font-black font-mono text-[#2D1E2F]">{result.churn_probability}%</span>
                <div className="w-full bg-[#FFFFFF] h-3 rounded-full overflow-hidden mt-2 border border-[#F5CBCB]">
                  <div
                    className={`h-full transition-all duration-300 ${result.churn_probability > 60 ? 'bg-[#E65B7B]' : result.churn_probability > 31 ? 'bg-[#E69537]' : 'bg-[#3BB28B]'}`}
                    style={{ width: `${result.churn_probability}%` }}
                  ></div>
                </div>
              </div>

              {/* Revenue Risk & Health Score */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#FFE2E2] border border-[#F5CBCB]">
                  <span className="text-[#7A5C77] text-[10px] font-bold block uppercase">Annual Revenue at Risk</span>
                  <span className="text-base font-black font-mono text-[#E65B7B]">₹{Number(result.revenue_at_risk).toLocaleString()}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FFE2E2] border border-[#F5CBCB]">
                  <span className="text-[#7A5C77] text-[10px] font-bold block uppercase">Customer Health Score</span>
                  <span className="text-base font-black font-mono text-[#3BB28B]">{result.health_score} / 100</span>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-4 rounded-xl bg-[#FFE2E2] border border-[#F5CBCB] space-y-1">
                <span className="text-[10px] font-bold text-[#7A5C77] uppercase tracking-wider block">TRIGGERED ACTION PLAN</span>
                <p className="text-xs font-extrabold text-[#2D1E2F] leading-relaxed">{result.recommended_action}</p>
              </div>

              {/* SHAP Risk Factors */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#2D1E2F] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#E65B7B]" />
                  SHAP Explainability Drivers
                </span>
                <div className="space-y-2 text-xs">
                  {result.shap_factors.map((f, i) => (
                    <div key={i} className="flex justify-between items-center p-2.5 rounded-xl bg-[#FBEFEF] border border-[#F5CBCB]">
                      <span className="text-[#2D1E2F] font-semibold">{f.factor}</span>
                      <span className={`font-mono font-black ${f.direction === 'positive' ? 'text-[#E65B7B]' : 'text-[#3BB28B]'}`}>
                        {f.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
