/**
 * CHURNIQ Static CSV Data Loader for Vercel & Offline Deployment
 * Parses public/churn_data_200_customers.csv directly in browser memory
 * providing seamless client-side searching, filtering, and pagination.
 */

let cachedCustomers = null;
let fetchPromise = null;

function calculateRowPredictions(row) {
  const plan = row.plan_type || 'Standard';
  const contract = row.contract_type || 'Monthly';
  const escalation = row.escalations || 'N';
  const csat = parseFloat(row.csat_score) || 50.0;
  const churnScore = parseInt(row.churn_score, 10) || 30;
  const complaintCount = parseFloat(row.complaint_count) || 1.0;
  const monthlyCharges = parseFloat(row.monthly_charges) || 15.0;
  const reason = row.cancellation_reason || '';

  let prob = 20;
  if (plan === 'Basic') prob += 18;
  else if (plan === 'Standard') prob += 5;
  else if (plan === 'Premium') prob -= 12;

  if (contract === 'Monthly') prob += 24;
  else if (contract === 'Annual') prob -= 10;

  if (escalation === 'Y') prob += 20;
  else prob -= 5;

  if (csat >= 70) prob -= Math.round((csat - 50) * 0.3);
  else if (csat < 30) prob += Math.round((50 - csat) * 0.4);

  prob += Math.round(churnScore * 0.15);
  prob += Math.round(complaintCount * 8);

  if (reason === 'Too expensive') prob += 8;
  else if (reason === 'Switched to competitor') prob += 10;

  const churnProb = Math.min(96, Math.max(4, Math.round(prob)));
  const riskLevel = churnProb >= 60 ? 'HIGH' : churnProb >= 32 ? 'MEDIUM' : 'LOW';
  const revAtRisk = Math.round(monthlyCharges * 12 * (churnProb / 100) * 100) / 100;
  const healthScore = Math.max(5, Math.min(100, 100 - churnProb));

  let action = "Standard quarterly account review & automated renewal sequence.";
  if (riskLevel === 'HIGH') {
    action = "Immediate retention outreach: Annual contract migration offer & dedicated support lead.";
  } else if (riskLevel === 'MEDIUM') {
    action = "Proactive check-in call, feature walkthrough, & loyalty bonus offer.";
  }

  return {
    ...row,
    monthly_charges: monthlyCharges,
    cltv: parseInt(row.cltv, 10) || 640,
    churn_score: churnScore,
    churn_flag: parseInt(row.churn_flag, 10) || 0,
    csat_score: csat,
    complaint_count: complaintCount,
    churn_probability: churnProb,
    risk_level: riskLevel,
    health_score: healthScore,
    revenue_at_risk: revAtRisk,
    recommended_action: action
  };
}

export async function loadStaticCsvCustomers() {
  if (cachedCustomers) return cachedCustomers;
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      const res = await fetch('/churn_data_200_customers.csv');
      if (!res.ok) throw new Error("CSV file not found");
      const text = await res.text();

      const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length <= 1) return [];

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

      const parsed = [];
      for (let i = 1; i < lines.length; i++) {
        // Handle CSV split respecting basic quotes
        const rawRow = lines[i].split(',').map(val => val.trim().replace(/^"|"$/g, ''));
        if (rawRow.length < headers.length) continue;

        const row = {};
        headers.forEach((header, idx) => {
          row[header] = rawRow[idx];
        });

        parsed.push(calculateRowPredictions(row));
      }

      cachedCustomers = parsed;
      return cachedCustomers;
    } catch (err) {
      console.warn("Failed to load static CSV customers:", err);
      return [];
    }
  })();

  return fetchPromise;
}
