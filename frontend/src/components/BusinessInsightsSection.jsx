import React from 'react';
import { Lightbulb } from 'lucide-react';

export default function BusinessInsightsSection() {
  const insights = [
    {
      num: '01',
      title: 'Month-to-month customers show higher churn.',
      body: 'Customers on shorter contracts are 6.7x more likely to leave (55.6% vs 8.3% churn rate for annual contracts), indicating a major opportunity for targeted long-term contract incentives.',
      tag: 'Contract Structure',
      accent: 'border-l-4 border-l-[#E65B7B]'
    },
    {
      num: '02',
      title: 'Basic plan subscribers exhibit elevated drop-off.',
      body: 'Basic tier users experience a 60.0% churn rate compared to 14.3% for Premium subscribers, signaling potential gaps in entry-tier value perception or feature adoption.',
      tag: 'Plan Tiers',
      accent: 'border-l-4 border-l-[#E69537]'
    },
    {
      num: '03',
      title: 'Support escalations serve as an immediate churn trigger.',
      body: '100% of accounts with escalated support tickets churned, highlighting customer support escalation as a critical inflection point where proactive outreach is mandatory.',
      tag: 'Customer Support',
      accent: 'border-l-4 border-l-[#C5B3D3]'
    },
    {
      num: '04',
      title: 'Churn score threshold >= 70 identifies critical drop-off window.',
      body: 'Customers crossing the 70+ churn score boundary exhibit strong cancellation probability, establishing an empirical early-warning trigger for automated retention campaigns.',
      tag: 'Risk Scoring',
      accent: 'border-l-4 border-l-[#7A5C77]'
    }
  ];

  return (
    <section id="insights-section" className="py-12 border-b border-[#F5CBCB]">
      <div className="mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FFE2E2] border border-[#F5CBCB] text-xs font-bold text-[#2D1E2F] mb-3">
          <Lightbulb className="w-3.5 h-3.5 text-[#E69537]" />
          <span>DATA INSIGHTS</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#2D1E2F]">
          Key Business Insights
        </h2>
        <p className="text-sm text-[#7A5C77] mt-1 max-w-xl font-medium">
          Actionable takeaways derived directly from exploratory data analysis in Pandas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((item) => (
          <div
            key={item.num}
            className={`glass-card p-6 rounded-2xl bg-[#FFFFFF] border border-[#F5CBCB] ${item.accent} space-y-3 hover:border-[#C5B3D3] transition-all`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black font-mono text-[#7A5C77]">
                {item.num}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFE2E2] text-[#2D1E2F] border border-[#F5CBCB]">
                {item.tag}
              </span>
            </div>

            <h3 className="text-base font-extrabold text-[#2D1E2F] leading-snug">
              "{item.title}"
            </h3>

            <p className="text-xs text-[#7A5C77] leading-relaxed font-medium">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
