import React, { useState, useEffect } from 'react';
import { Users, UserX, TrendingDown, ShieldCheck } from 'lucide-react';

export default function KpiCardsSection({ metrics }) {
  const totalCust = metrics?.totalCustomers || 25000;
  const churnedCust = metrics?.churnedCustomers || 9904;
  const churnRate = metrics?.churnRate !== undefined ? metrics.churnRate : 39.62;
  const retentionRate = metrics?.retentionRate !== undefined ? metrics.retentionRate : 60.38;

  const [animatedValues, setAnimatedValues] = useState({
    total: 0,
    churned: 0,
    churnRate: 0,
    retentionRate: 0
  });

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const steps = 30;
    const interval = duration / steps;

    const timer = setInterval(() => {
      start++;
      const progress = start / steps;
      setAnimatedValues({
        total: Math.round(totalCust * progress),
        churned: Math.round(churnedCust * progress),
        churnRate: (churnRate * progress).toFixed(1),
        retentionRate: (retentionRate * progress).toFixed(1)
      });

      if (start >= steps) {
        clearInterval(timer);
        setAnimatedValues({
          total: totalCust,
          churned: churnedCust,
          churnRate: churnRate.toFixed(2),
          retentionRate: retentionRate.toFixed(2)
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [totalCust, churnedCust, churnRate, retentionRate]);

  const cards = [
    {
      id: 'total',
      title: 'Total Customers',
      value: animatedValues.total.toLocaleString(),
      suffix: '',
      subtext: 'Full generated dataset',
      icon: Users,
      color: 'text-[#7A5C77]',
      border: 'hover:border-[#C5B3D3]',
      badge: '25,000 Records',
      badgeColor: 'bg-[#FFE2E2] text-[#2D1E2F]'
    },
    {
      id: 'churned',
      title: 'Churned Customers',
      value: animatedValues.churned.toLocaleString(),
      suffix: '',
      subtext: 'Predicted cancellations',
      icon: UserX,
      color: 'text-[#E65B7B]',
      border: 'hover:border-[#E65B7B]',
      badge: 'Cancellations',
      badgeColor: 'bg-[#E65B7B]/15 text-[#E65B7B]'
    },
    {
      id: 'rate',
      title: 'Churn Rate',
      value: animatedValues.churnRate,
      suffix: '%',
      subtext: 'Overall churn percentage',
      icon: TrendingDown,
      color: 'text-[#E65B7B]',
      border: 'hover:border-[#E65B7B]',
      badge: `${churnRate}% Baseline`,
      badgeColor: 'bg-[#E65B7B]/15 text-[#E65B7B]'
    },
    {
      id: 'retention',
      title: 'Retention Rate',
      value: animatedValues.retentionRate,
      suffix: '%',
      subtext: 'Active retained customer base',
      icon: ShieldCheck,
      color: 'text-[#3BB28B]',
      border: 'hover:border-[#3BB28B]',
      badge: `${retentionRate}% Retained`,
      badgeColor: 'bg-[#3BB28B]/15 text-[#3BB28B]'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 my-8">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className={`glass-card p-5 rounded-2xl border border-[#F5CBCB] bg-[#FFFFFF] transition-all duration-300 transform hover:-translate-y-1 ${card.border}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#7A5C77] uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl bg-[#FFE2E2] border border-[#F5CBCB] ${card.color}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-baseline space-x-1 mb-1">
              <span className="text-3xl md:text-4xl font-black text-[#2D1E2F] tracking-tight">
                {card.value}
              </span>
              {card.suffix && (
                <span className={`text-xl font-bold ${card.color}`}>
                  {card.suffix}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F5CBCB]">
              <span className="text-[11px] font-medium text-[#7A5C77]">
                {card.subtext}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
