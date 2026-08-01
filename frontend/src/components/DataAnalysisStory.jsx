import React from 'react';
import { Database, Sparkles, Code2, LineChart, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';

export default function DataAnalysisStory() {
  const steps = [
    {
      step: '01',
      title: 'DATA INGESTION',
      desc: 'Extracted relational tables (db_customer, db_subscription, db_support) from SQLite database.',
      icon: Database,
      color: 'border-[#C5B3D3] text-[#7A5C77]'
    },
    {
      step: '02',
      title: 'CLEANING & MERGING',
      desc: 'Handled missing values, standardized dates, imputed missing countries, deduplicated support tickets.',
      icon: Sparkles,
      color: 'border-[#F5CBCB] text-[#7A5C77]'
    },
    {
      step: '03',
      title: 'ANALYTICAL QUERIES',
      desc: 'Formulated query logic to evaluate churn metrics across contract types and plan tiers.',
      icon: Code2,
      color: 'border-[#C5B3D3] text-[#7A5C77]'
    },
    {
      step: '04',
      title: 'EXPLORATORY ANALYSIS',
      desc: 'Computed correlation matrix in Pandas, analyzed plan distributions and risk scores.',
      icon: LineChart,
      color: 'border-[#E69537] text-[#E69537]'
    },
    {
      step: '05',
      title: 'BUSINESS INSIGHTS',
      desc: 'Identified month-to-month contracts (55.6% churn) and support escalations (100% churn) as key drivers.',
      icon: Lightbulb,
      color: 'border-[#E65B7B] text-[#E65B7B]'
    },
    {
      step: '06',
      title: 'RECOMMENDATIONS',
      desc: 'Formulated annual migration incentives and rapid support SLA playbooks to boost retention.',
      icon: CheckCircle2,
      color: 'border-[#3BB28B] text-[#3BB28B]'
    }
  ];

  return (
    <section id="workflow-section" className="py-12 border-b border-[#F5CBCB]">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FFE2E2] border border-[#F5CBCB] text-xs font-bold text-[#2D1E2F] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#7A5C77]" />
          <span>PROJECT WORKFLOW</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#2D1E2F]">
          Data Analysis Story
        </h2>
        <p className="text-sm text-[#7A5C77] font-medium mt-1">
          End-to-end analytical methodology from raw database ingestion to executive decision making.
        </p>
      </div>

      {/* Visual Horizontal / Grid Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative">
        {steps.map((s, idx) => {
          const IconComp = s.icon;
          return (
            <div
              key={s.step}
              className="glass-card p-4 rounded-2xl bg-[#FFFFFF] border border-[#F5CBCB] space-y-2 relative flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black font-mono text-[#7A5C77]">
                    {s.step}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-[#FFE2E2] border ${s.color}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-xs font-extrabold text-[#2D1E2F] tracking-wider uppercase">
                  {s.title}
                </h3>

                <p className="text-[11px] text-[#7A5C77] font-medium leading-relaxed">
                  {s.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-4 h-4 text-[#7A5C77]/60" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
