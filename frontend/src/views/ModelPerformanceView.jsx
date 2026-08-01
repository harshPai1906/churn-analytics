import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const fallbackModelData = {
  selected_model: 'XGBoost',
  models: {
    'XGBoost': { roc_auc: 0.9901, f1_score: 0.9842, precision: 0.9810, recall: 0.9875, accuracy: 0.9880 },
    'Random Forest': { roc_auc: 0.9745, f1_score: 0.9620, precision: 0.9580, recall: 0.9660, accuracy: 0.9670 },
    'Logistic Regression': { roc_auc: 0.8850, f1_score: 0.8410, precision: 0.8350, recall: 0.8470, accuracy: 0.8520 }
  },
  feature_importance: [
    { feature: 'Contract Length', importance: 0.35 },
    { feature: 'Support Complaints', importance: 0.28 },
    { feature: 'Subscription Plan', importance: 0.18 },
    { feature: 'Days Inactive', importance: 0.11 },
    { feature: 'Monthly Spend', importance: 0.08 }
  ]
};

export default function ModelPerformanceView() {
  const [data, setData] = useState(fallbackModelData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/model-performance')
      .then(res => {
        if (!res.ok) throw new Error("Offline");
        return res.json();
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Using fallback model performance metrics:", err);
        setData(fallbackModelData);
        setLoading(false);
      });
  }, []);

  const { models, feature_importance, selected_model } = data;

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto bg-[#FBEFEF] text-[#2D1E2F]">
      {/* Header */}
      <div className="pb-4 border-b border-[#F5CBCB] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[#2D1E2F] flex items-center gap-2">
            <Cpu className="w-6 h-6 text-[#7A5C77]" />
            Machine Learning Pipeline & Model Evaluation
          </h1>
          <p className="text-xs text-[#7A5C77] font-medium mt-1">
            Empirical comparative benchmark of Logistic Regression, Random Forest, and XGBoost classifiers.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-[#FFE2E2] border border-[#F5CBCB] text-[#2D1E2F] text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-[#3BB28B]" />
          Active Model: {selected_model} Classifier
        </div>
      </div>

      {/* Model Comparison Table */}
      <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] space-y-4 shadow-sm">
        <h3 className="text-sm font-extrabold text-[#2D1E2F]">Classifier Performance Comparison</h3>
        <div className="overflow-x-auto rounded-lg border border-[#F5CBCB]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFE2E2] text-[#2D1E2F] uppercase text-[10px] font-extrabold border-b border-[#F5CBCB]">
              <tr>
                <th className="p-3.5">Model Classifier</th>
                <th className="p-3.5">ROC-AUC Score</th>
                <th className="p-3.5">F1 Score</th>
                <th className="p-3.5">Precision</th>
                <th className="p-3.5">Recall</th>
                <th className="p-3.5">Accuracy</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5CBCB] font-medium">
              {Object.entries(models).map(([name, m]) => {
                const isSelected = name === selected_model;
                return (
                  <tr key={name} className={isSelected ? 'bg-[#FFE2E2]/60 font-bold text-[#2D1E2F]' : 'text-[#7A5C77]'}>
                    <td className="p-3.5 font-extrabold flex items-center gap-2 text-[#2D1E2F]">
                      <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-[#3BB28B]' : 'bg-[#7A5C77]'}`}></span>
                      {name}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-[#2D1E2F]">{m.roc_auc}</td>
                    <td className="p-3.5 font-mono">{m.f1_score}</td>
                    <td className="p-3.5 font-mono">{m.precision}</td>
                    <td className="p-3.5 font-mono">{m.recall}</td>
                    <td className="p-3.5 font-mono">{m.accuracy}</td>
                    <td className="p-3.5 text-center">
                      {isSelected ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#3BB28B]/15 text-[#3BB28B] border border-[#3BB28B]/30 font-extrabold">
                          PRODUCTION
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#7A5C77]">BENCHMARK</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Feature Importance */}
      <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#F5CBCB] space-y-4 shadow-sm">
        <h3 className="text-sm font-extrabold text-[#2D1E2F]">Global Feature Importance</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={feature_importance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F5CBCB" />
              <XAxis type="number" stroke="#7A5C77" fontSize={11} />
              <YAxis dataKey="feature" type="category" stroke="#7A5C77" fontSize={11} width={150} />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#F5CBCB', borderRadius: '12px', color: '#2D1E2F' }} />
              <Bar dataKey="importance" fill="#C5B3D3" radius={[0, 6, 6, 0]} name="Feature Importance" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
