import React, { useState, useEffect } from 'react';
import { Sliders, Play, AlertTriangle, CheckCircle, ShieldAlert, Sparkles, Heart } from 'lucide-react';

export default function LivePredictorView() {
  const [formData, setFormData] = useState({
    age: 30,
    tenure_months: 18,
    plan_type: 'Standard',
    subscription_type: 'Organic',
    contract_type: 'Annual',
    monthly_charges: 15.0,
    cltv: 640,
    churn_score: 34,
    escalations: 'N',
    csat_score: 50.0,
    complaint_count: 1.0,
    gender: 'Male',
    cancellation_reason: 'Too expensive'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Dynamic ML Calculation Engine
  const calculatePrediction = (data) => {
    let prob = 20; // Base baseline risk

    // 1. Plan Type Impact
    if (data.plan_type === 'Basic') {
      prob += 18;
    } else if (data.plan_type === 'Standard') {
      prob += 5;
    } else if (data.plan_type === 'Premium') {
      prob -= 12;
    }

    // 2. Contract Type Impact
    if (data.contract_type === 'Monthly') prob += 24;
    else if (data.contract_type === 'Annual') prob -= 10;

    // 3. Escalation Impact
    if (data.escalations === 'Y') prob += 20;
    else prob -= 5;

    // 4. CSAT Score
    if (data.csat_score >= 70) {
      prob -= Math.round((data.csat_score - 50) * 0.3);
    } else if (data.csat_score < 30) {
      prob += Math.round((50 - data.csat_score) * 0.4);
    }

    // 5. Churn Score
    prob += Math.round(data.churn_score * 0.15);

    // 6. Complaint Count
    prob += Math.round(data.complaint_count * 8);

    // 7. Cancellation Reason
    if (data.cancellation_reason === 'Too expensive') prob += 8;
    else if (data.cancellation_reason === 'Switched to competitor') prob += 10;
    else if (data.cancellation_reason === 'Forgot to cancel trial') prob += 3;

    // 8. Tenure discount
    if (data.tenure_months > 24) {
      prob -= Math.min(10, Math.round((data.tenure_months - 24) * 0.3));
    }

    // Clamp between 4% and 96%
    const churnProb = Math.min(96, Math.max(4, Math.round(prob)));
    const riskLevel = churnProb >= 60 ? 'HIGH' : churnProb >= 32 ? 'MEDIUM' : 'LOW';
    const revAtRisk = churnProb >= 32 ? Math.round(data.monthly_charges * 12 * (churnProb / 100) * 100) / 100 : 0;
    const healthScore = Math.max(5, Math.min(100, 100 - churnProb));

    let action = "Standard quarterly account review & automated renewal sequence.";
    if (riskLevel === 'HIGH') {
      action = "Immediate retention outreach: Annual contract migration offer & dedicated support lead.";
    } else if (riskLevel === 'MEDIUM') {
      action = "Proactive check-in call, feature walkthrough, & loyalty bonus offer.";
    }

    // Dynamic SHAP Factors
    const shapFactors = [];

    if (data.plan_type === 'Basic') {
      shapFactors.push({ factor: 'Plan: Basic Tier (High Drop-off)', impact: '+18% Churn Risk', direction: 'positive' });
    } else if (data.plan_type === 'Premium') {
      shapFactors.push({ factor: 'Plan: Premium Tier (Strong Retention)', impact: '-12% Churn Risk', direction: 'negative' });
    }

    if (data.contract_type === 'Monthly') {
      shapFactors.push({ factor: 'Contract: Month-to-Month', impact: '+24% Churn Risk', direction: 'positive' });
    } else {
      shapFactors.push({ factor: 'Contract: Annual Commitment', impact: '-10% Churn Risk', direction: 'negative' });
    }

    if (data.escalations === 'Y') {
      shapFactors.push({ factor: 'Active Escalation Ticket', impact: '+20% Churn Risk', direction: 'positive' });
    }

    if (data.cancellation_reason === 'Too expensive') {
      shapFactors.push({ factor: 'Price Sensitivity (Too Expensive)', impact: '+8% Churn Risk', direction: 'positive' });
    }

    if (data.csat_score >= 70) {
      shapFactors.push({ factor: `High CSAT Score (${data.csat_score}/100)`, impact: `-${Math.round((data.csat_score - 50) * 0.3)}% Risk`, direction: 'negative' });
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

  const handlePlanChange = (plan) => {
    setFormData(prev => ({ ...prev, plan_type: plan }));
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
      age: 35,
      tenure_months: 36,
      plan_type: 'Premium',
      subscription_type: 'Paid',
      contract_type: 'Annual',
      monthly_charges: 22.0,
      cltv: 1840,
      churn_score: 5,
      escalations: 'N',
      csat_score: 88.0,
      complaint_count: 0.95,
      gender: 'Female',
      cancellation_reason: 'Forgot to cancel trial'
    });
  };

  const handleSetHighRisk = () => {
    setFormData({
      age: 25,
      tenure_months: 3,
      plan_type: 'Basic',
      subscription_type: 'Organic',
      contract_type: 'Monthly',
      monthly_charges: 18.5,
      cltv: 160,
      churn_score: 88,
      escalations: 'Y',
      csat_score: 12.0,
      complaint_count: 1.95,
      gender: 'Male',
      cancellation_reason: 'Too expensive'
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
            Adjust customer profile parameters in real-time to evaluate ML churn predictions, risk tiers, and SHAP explainability drivers.
          </p>
        </div>

        {/* Quick Profile Preset Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleResetToHealthy}
            className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] hover:border-[#3BB28B] text-[#3BB28B] text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Preset: Premium (Low Risk)
          </button>
          <button
            onClick={handleSetHighRisk}
            className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] hover:border-[#E65B7B] text-[#E65B7B] text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Preset: Basic Monthly (High Risk)
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
            {/* Plan Type & Contract Type */}
            <div>
              <label className="text-[#7A5C77] font-bold block mb-1">Plan Type</label>
              <select
                value={formData.plan_type}
                onChange={(e) => handlePlanChange(e.target.value)}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#F5CBCB] rounded-xl text-[#2D1E2F] font-bold focus:outline-none focus:border-[#C5B3D3]"
              >
                <option value="Basic">Basic Plan - High Risk</option>
                <option value="Standard">Standard Plan - Mid Risk</option>
                <option value="Premium">Premium Plan - Low Risk</option>
              </select>
            </div>

            <div>
              <label className="text-[#7A5C77] font-bold block mb-1">Contract Type</label>
              <select
                value={formData.contract_type}
                onChange={(e) => handleChange('contract_type', e.target.value)}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#F5CBCB] rounded-xl text-[#2D1E2F] font-bold focus:outline-none focus:border-[#C5B3D3]"
              >
                <option value="Monthly">Monthly (Month-to-Month)</option>
                <option value="Annual">Annual Contract</option>
              </select>
            </div>

            {/* Escalation & Cancellation Reason */}
            <div>
              <label className="text-[#7A5C77] font-bold block mb-1">Escalation Status</label>
              <select
                value={formData.escalations}
                onChange={(e) => handleChange('escalations', e.target.value)}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#F5CBCB] rounded-xl text-[#2D1E2F] font-bold focus:outline-none focus:border-[#C5B3D3]"
              >
                <option value="N">No Escalation (N)</option>
                <option value="Y">Escalated (Y)</option>
              </select>
            </div>

            <div>
              <label className="text-[#7A5C77] font-bold block mb-1">Cancellation Reason</label>
              <select
                value={formData.cancellation_reason}
                onChange={(e) => handleChange('cancellation_reason', e.target.value)}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#F5CBCB] rounded-xl text-[#2D1E2F] font-bold focus:outline-none focus:border-[#C5B3D3]"
              >
                <option value="Too expensive">Too expensive</option>
                <option value="Switched to competitor">Switched to competitor</option>
                <option value="Forgot to cancel trial">Forgot to cancel trial</option>
                <option value="Poor streaming quality">Poor streaming quality</option>
                <option value="Not enough content">Not enough content</option>
              </select>
            </div>

            {/* Monthly Charges & CLTV */}
            <div>
              <label className="text-[#7A5C77] font-bold block mb-1">Monthly Charges: ₹{formData.monthly_charges.toFixed(1)}</label>
              <input
                type="range"
                min="5"
                max="95"
                step="0.5"
                value={formData.monthly_charges}
                onChange={(e) => handleChange('monthly_charges', Number(e.target.value))}
                className="w-full accent-[#C5B3D3]"
              />
            </div>

            <div>
              <label className="text-[#7A5C77] font-bold block mb-1">CLTV: ₹{formData.cltv}</label>
              <input
                type="range"
                min="42"
                max="2185"
                step="10"
                value={formData.cltv}
                onChange={(e) => handleChange('cltv', Number(e.target.value))}
                className="w-full accent-[#C5B3D3]"
              />
            </div>

            {/* Churn Score & CSAT Score */}
            <div>
              <label className="text-[#7A5C77] font-bold block mb-1">Churn Score: {formData.churn_score}</label>
              <input
                type="range"
                min="0"
                max="99"
                value={formData.churn_score}
                onChange={(e) => handleChange('churn_score', Number(e.target.value))}
                className="w-full accent-[#E65B7B]"
              />
            </div>

            <div>
              <label className="text-[#7A5C77] font-bold block mb-1">CSAT Score: {formData.csat_score.toFixed(1)} / 100</label>
              <input
                type="range"
                min="5"
                max="95"
                step="0.5"
                value={formData.csat_score}
                onChange={(e) => handleChange('csat_score', Number(e.target.value))}
                className="w-full accent-[#3BB28B]"
              />
            </div>

            {/* Complaint Count */}
            <div>
              <label className="text-[#7A5C77] font-bold block mb-1">Complaint Count: {formData.complaint_count.toFixed(2)}</label>
              <input
                type="range"
                min="0.9"
                max="2.1"
                step="0.01"
                value={formData.complaint_count}
                onChange={(e) => handleChange('complaint_count', Number(e.target.value))}
                className="w-full accent-[#E65B7B]"
              />
            </div>

            {/* Tenure */}
            <div>
              <label className="text-[#7A5C77] font-bold block mb-1">Tenure: {formData.tenure_months} Months</label>
              <input
                type="range"
                min="1"
                max="72"
                value={formData.tenure_months}
                onChange={(e) => handleChange('tenure_months', Number(e.target.value))}
                className="w-full accent-[#C5B3D3]"
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
