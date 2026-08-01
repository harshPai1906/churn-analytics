import React, { useState } from 'react';
import { X, Database, Cpu, BarChart3, ShieldCheck, FileText, Code, CheckCircle2 } from 'lucide-react';

export default function PortfolioInfoModal({ isOpen, onClose }) {
  const [activeSection, setActiveSection] = useState('ds-skills');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-palette-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-palette-900 border border-palette-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-palette-800 flex items-center justify-between bg-palette-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-palette-400/15 text-palette-400 border border-palette-400/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-palette-100">CHURNIQ Portfolio & Architecture Overview</h3>
              <p className="text-xs text-palette-300/70">Technical Breakdown for Data Analysts & Data Scientists</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-palette-300/70 hover:text-palette-100 hover:bg-palette-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-palette-800 bg-palette-950/30 px-6 gap-4 text-xs font-medium">
          {[
            { id: 'ds-skills', label: 'Data Science Skills', icon: Cpu },
            { id: 'sql-analysis', label: 'SQL Analytical Queries', icon: Database },
            { id: 'ml-pipeline', label: 'ML & SHAP Explainability', icon: BarChart3 },
            { id: 'architecture', label: 'System Architecture', icon: Code },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`py-3 border-b-2 flex items-center gap-2 transition-colors ${
                  activeSection === tab.id
                    ? 'border-palette-400 text-palette-300 font-semibold'
                    : 'border-transparent text-palette-300/70 hover:text-palette-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-palette-200 leading-relaxed">
          {activeSection === 'ds-skills' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-palette-100 uppercase tracking-wider text-palette-400">
                Core Competencies Demonstrated
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-palette-950/60 border border-palette-800 space-y-2">
                  <h5 className="font-semibold text-palette-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Advanced Machine Learning
                  </h5>
                  <p className="text-palette-300/70 text-[11px]">
                    Supervised churn probability classification using XGBoost, Random Forest, and Logistic Regression with Stratified K-Fold validation and hyperparameter tuning.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-palette-950/60 border border-palette-800 space-y-2">
                  <h5 className="font-semibold text-palette-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-palette-400" /> Explainable AI (SHAP)
                  </h5>
                  <p className="text-palette-300/70 text-[11px]">
                    Local and global feature impact decomposition using SHAP TreeExplainer to transform black-box XGBoost probabilities into human-auditable risk factors.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-palette-950/60 border border-palette-800 space-y-2">
                  <h5 className="font-semibold text-palette-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-palette-300" /> RFM & K-Means Segmentation
                  </h5>
                  <p className="text-palette-300/70 text-[11px]">
                    Unsupervised customer clustering grouping 25,000 users into 6 actionable behavioral profiles (Champions, At Risk, Price Sensitive, etc.).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-palette-950/60 border border-palette-800 space-y-2">
                  <h5 className="font-semibold text-palette-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-300" /> Business & Financial Modeling
                  </h5>
                  <p className="text-palette-300/70 text-[11px]">
                    Quantifying ARR exposure, calculating Revenue at Risk (<code className="text-amber-300">monthly_spend × 12 × churn_prob</code>), and rule-based recommendation engine.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'sql-analysis' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-palette-100 uppercase tracking-wider text-palette-400">
                Production SQL Queries & Database Schema
              </h4>
              <p className="text-palette-300/70">
                PostgreSQL schema with 7 relational tables (<code className="text-palette-300">customers</code>, <code className="text-palette-300">subscriptions</code>, <code className="text-palette-300">customer_activity</code>, <code className="text-palette-300">predictions</code>, etc.) optimized with indexed foreign keys.
              </p>
              
              <div className="bg-palette-950 p-4 rounded-xl border border-palette-800 font-mono text-[11px] text-palette-200 overflow-x-auto">
                <pre>{`-- Priority High-Risk Customer Query (CTEs & Window Functions)
WITH PriorityMatrix AS (
    SELECT 
        c.customer_id, c.customer_name, s.subscription_type,
        s.monthly_spend * 12 AS annual_recurring_revenue,
        p.churn_probability, p.revenue_at_risk,
        DENSE_RANK() OVER (ORDER BY p.revenue_at_risk DESC) AS priority_rank
    FROM customers c
    JOIN subscriptions s ON c.customer_id = s.customer_id
    JOIN predictions p ON c.customer_id = p.customer_id
    WHERE p.risk_level = 'HIGH'
)
SELECT * FROM PriorityMatrix WHERE priority_rank <= 15;`}</pre>
              </div>
            </div>
          )}

          {activeSection === 'ml-pipeline' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-palette-100 uppercase tracking-wider text-palette-400">
                Machine Learning Performance Summary
              </h4>
              <div className="overflow-x-auto rounded-xl border border-palette-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-palette-950 text-palette-300/70 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Model</th>
                      <th className="p-3">ROC-AUC</th>
                      <th className="p-3">F1 Score</th>
                      <th className="p-3">Precision</th>
                      <th className="p-3">Recall</th>
                      <th className="p-3">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-palette-800">
                    <tr className="bg-palette-900/80 font-semibold text-palette-300">
                      <td className="p-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-palette-400"></span> XGBoost (Selected)
                      </td>
                      <td className="p-3">0.9901</td>
                      <td className="p-3">0.8755</td>
                      <td className="p-3">0.8690</td>
                      <td className="p-3">0.8821</td>
                      <td className="p-3">0.9574</td>
                    </tr>
                    <tr className="text-palette-200">
                      <td className="p-3">Logistic Regression</td>
                      <td className="p-3">0.9933</td>
                      <td className="p-3">0.9019</td>
                      <td className="p-3">0.8920</td>
                      <td className="p-3">0.9120</td>
                      <td className="p-3">0.9650</td>
                    </tr>
                    <tr className="text-palette-200">
                      <td className="p-3">Random Forest</td>
                      <td className="p-3">0.9779</td>
                      <td className="p-3">0.7402</td>
                      <td className="p-3">0.8350</td>
                      <td className="p-3">0.6648</td>
                      <td className="p-3">0.9228</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'architecture' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-palette-100 uppercase tracking-wider text-palette-400">
                Full-Stack SaaS Technology Stack
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-lg bg-palette-950 border border-palette-800">
                  <p className="font-semibold text-palette-100 text-xs">FastAPI</p>
                  <p className="text-[10px] text-palette-300/70 mt-1">Async Python REST</p>
                </div>
                <div className="p-3 rounded-lg bg-palette-950 border border-palette-800">
                  <p className="font-semibold text-palette-100 text-xs">React + Vite</p>
                  <p className="text-[10px] text-palette-300/70 mt-1">Tailwind CSS UI</p>
                </div>
                <div className="p-3 rounded-lg bg-palette-950 border border-palette-800">
                  <p className="font-semibold text-palette-100 text-xs">XGBoost & SHAP</p>
                  <p className="text-[10px] text-palette-300/70 mt-1">ML & Explainability</p>
                </div>
                <div className="p-3 rounded-lg bg-palette-950 border border-palette-800">
                  <p className="font-semibold text-palette-100 text-xs">SQLite / Postgres</p>
                  <p className="text-[10px] text-palette-300/70 mt-1">Relational SQL</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-palette-800 bg-palette-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-palette-400 hover:bg-palette-300 text-palette-950 font-semibold rounded-lg text-xs transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
