import React from 'react';
import { Target, Shield, Zap, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

export default function RetentionRecommendationsSection() {
  const recommendations = [
    {
      id: 1,
      title: 'Incentivize Annual Contract Migrations',
      action: 'Target Month-to-Month Users',
      detail: 'Offer a 15% annual discount or free feature upgrades for monthly subscribers converting to 1-year contracts, reducing monthly contract churn from 55.6% down towards annual baseline (8.3%).',
      icon: Target,
      color: 'border-t-4 border-t-[#C5B3D3]',
      badge: 'High Impact'
    },
    {
      id: 2,
      title: 'Rapid Resolution SLA for Support Escalations',
      action: 'Zero-Escalation Drop-Off Policy',
      detail: 'Set up automated alerts routing any escalated ticket directly to a dedicated retention manager within 2 hours, intercepting 100% escalation churn risk before cancellation.',
      icon: Shield,
      color: 'border-t-4 border-t-[#E65B7B]',
      badge: 'Critical Priority'
    },
    {
      id: 3,
      title: 'Enhance Entry Tier (Basic Plan) Onboarding',
      action: 'Basic Tier Engagement Playbook',
      detail: 'Provide structured feature walkthroughs and usage milestones for Basic plan users to bridge the 60.0% churn gap and boost perceived value early in customer lifecycle.',
      icon: Zap,
      color: 'border-t-4 border-t-[#7A5C77]',
      badge: 'Product Strategy'
    },
    {
      id: 4,
      title: 'Deploy Automated High-Risk Retention Offers',
      action: 'Churn Score >= 70 Interception',
      detail: 'Automatically trigger personalized retention discounts or free consultation check-ins whenever a customer\'s predicted churn score reaches or exceeds 70.',
      icon: Sparkles,
      color: 'border-t-4 border-t-[#3BB28B]',
      badge: 'Automated Retention'
    }
  ];

  return (
    <section id="recommendations-section" className="py-12 border-b border-[#F5CBCB]">
      <div className="mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FFE2E2] border border-[#F5CBCB] text-xs font-bold text-[#2D1E2F] mb-3">
          <CheckCircle className="w-3.5 h-3.5 text-[#3BB28B]" />
          <span>ACTIONABLE RETENTION STRATEGY</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#2D1E2F]">
          Retention Recommendations
        </h2>
        <p className="text-sm text-[#7A5C77] mt-1 max-w-xl font-medium">
          Strategic business recommendations built directly on empirical evidence from the analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((rec) => {
          const IconComp = rec.icon;
          return (
            <div
              key={rec.id}
              className={`glass-card p-5 rounded-2xl bg-[#FFFFFF] border border-[#F5CBCB] ${rec.color} space-y-3 flex flex-col justify-between hover:border-[#C5B3D3] transition-all`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-[#FFE2E2] border border-[#F5CBCB] text-[#7A5C77]">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFE2E2] text-[#2D1E2F] border border-[#F5CBCB]">
                    {rec.badge}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-[#2D1E2F] leading-snug">
                  {rec.title}
                </h3>

                <p className="text-xs text-[#7A5C77] leading-relaxed font-medium">
                  {rec.detail}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F5CBCB] flex items-center justify-between text-[11px] font-bold text-[#2D1E2F]">
                <span>{rec.action}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
