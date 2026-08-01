import React from 'react';
import { FileText, Headphones, ShieldAlert, Award } from 'lucide-react';

export default function ChurnDriversSection() {
  const drivers = [
    {
      id: 1,
      factor: 'Contract Type (Month-to-Month vs Annual)',
      stat: '55.6% Churn Rate',
      comparison: 'vs 8.3% for Annual Contracts',
      percentage: 55.6,
      impact: 'Critical Impact (6.7x Risk)',
      impactColor: 'bg-[#E65B7B]/15 text-[#E65B7B] border-[#E65B7B]/30',
      barColor: 'bg-gradient-to-r from-[#E65B7B] to-[#E69537]',
      description: 'Month-to-month subscribers account for 5 out of 6 total churned customers in the analysis cohort. Customers without long-term commitment drop off rapidly.',
      icon: FileText
    },
    {
      id: 2,
      factor: 'Support Escalation Status',
      stat: '100.0% Churn Rate',
      comparison: 'Positive Correlation (+0.58)',
      percentage: 100.0,
      impact: 'Immediate Risk',
      impactColor: 'bg-[#E65B7B]/15 text-[#E65B7B] border-[#E65B7B]/30',
      barColor: 'bg-[#E65B7B]',
      description: '100% of customers with escalated support complaints (escalations = Y) ended up cancelling their service. Escalations serve as the single strong indicator of intent.',
      icon: Headphones
    },
    {
      id: 3,
      factor: 'Subscription Tier (Basic Plan)',
      stat: '60.0% Churn Rate',
      comparison: 'vs 14.3% Premium & 22.2% Standard',
      percentage: 60.0,
      impact: 'High Risk',
      impactColor: 'bg-[#E69537]/15 text-[#E69537] border-[#E69537]/30',
      barColor: 'bg-gradient-to-r from-[#E69537] to-[#C5B3D3]',
      description: 'Basic plan subscribers exhibit a 60% churn rate (3 out of 5 churned), indicating lower feature engagement or value realization compared to Premium users.',
      icon: Award
    },
    {
      id: 4,
      factor: 'Regional Variations (Karnataka & Meghalaya)',
      stat: '66.7% - 100% Churn Rate',
      comparison: 'vs 0% in Maharashtra & Rajasthan',
      percentage: 66.7,
      impact: 'Moderate Risk',
      impactColor: 'bg-[#C5B3D3]/40 text-[#2D1E2F] border-[#C5B3D3]',
      barColor: 'bg-gradient-to-r from-[#C5B3D3] to-[#3BB28B]',
      description: 'Geographic analysis reveals localized drop-off clusters in Karnataka (100% churn) and Meghalaya (66.7% churn), likely due to regional competitor pricing or coverage.',
      icon: ShieldAlert
    }
  ];

  return (
    <section id="drivers-section" className="py-12 border-b border-[#F5CBCB]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#2D1E2F]">
            What's Driving Churn?
          </h2>
          <p className="text-sm text-[#7A5C77] mt-1 max-w-xl font-medium">
            Empirical findings extracted directly from Pandas exploratory analysis and SQLite correlation matrix.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-2 text-xs font-mono font-semibold text-[#2D1E2F] bg-[#FFE2E2] px-3.5 py-2 rounded-xl border border-[#F5CBCB]">
          <span className="w-2 h-2 rounded-full bg-[#E65B7B]"></span>
          <span>Primary Indicator: Escalations (r = +0.58)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {drivers.map((d) => {
          const IconComp = d.icon;
          return (
            <div
              key={d.id}
              className="glass-card p-6 rounded-2xl border border-[#F5CBCB] bg-[#FFFFFF] space-y-4 hover:border-[#C5B3D3] transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-[#FFE2E2] border border-[#F5CBCB] text-[#7A5C77]">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#2D1E2F]">{d.factor}</h3>
                    <p className="text-xs text-[#7A5C77] font-medium">{d.comparison}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${d.impactColor}`}>
                  {d.impact}
                </span>
              </div>

              {/* Progress / Stat Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#7A5C77]">Observed Churn Rate</span>
                  <span className="text-[#E65B7B] font-mono text-sm">{d.stat}</span>
                </div>
                <div className="w-full h-3 bg-[#FFE2E2] rounded-full overflow-hidden border border-[#F5CBCB]">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${d.barColor}`}
                    style={{ width: `${d.percentage}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-[#7A5C77] leading-relaxed font-medium pt-1">
                {d.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
