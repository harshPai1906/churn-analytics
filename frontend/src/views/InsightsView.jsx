import React, { useEffect, useState } from 'react';
import { Sparkles, AlertTriangle, TrendingDown, Target, IndianRupee, ArrowUpRight } from 'lucide-react';

export default function InsightsView({ setActiveTab, onSelectCustomer }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ai/insights')
      .then(res => res.json())
      .then(d => {
        setInsights(d.insights || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load insights:", err);
        setLoading(false);
      });
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'revenue': return IndianRupee;
      case 'opportunity': return Target;
      default: return TrendingDown;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      <div className="pb-4 border-b border-palette-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-palette-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-palette-400" />
            Automated AI Insight Cards
          </h1>
          <p className="text-xs text-palette-300/70 mt-1">
            Real-time anomaly detection, pattern recognition, and churn alert triggers automatically derived from dataset telemetry.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 flex items-center justify-center min-h-[50vh]">
          <div className="w-10 h-10 border-4 border-palette-400/20 border-t-palette-400 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((card) => {
            const Icon = getIcon(card.type);
            return (
              <div 
                key={card.id}
                className="p-6 rounded-2xl bg-palette-900/90 border border-palette-800 hover:border-palette-400/30 transition-all shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-xl bg-palette-400/15 text-palette-400 border border-palette-400/30">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-palette-100">{card.title}</h3>
                      <span className="text-[10px] font-mono font-semibold text-palette-300 bg-palette-950 px-2 py-0.5 rounded">
                        {card.metric}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-palette-200 leading-relaxed">
                  {card.description}
                </p>

                <div className="pt-3 border-t border-palette-800 flex items-center justify-between">
                  <span className="text-[10px] text-palette-300/50 font-mono">Automated Telemetry Scan</span>
                  <button 
                    onClick={() => setActiveTab('customers')}
                    className="px-3 py-1.5 rounded-lg bg-palette-800 hover:bg-palette-700 text-palette-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {card.action_text}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
