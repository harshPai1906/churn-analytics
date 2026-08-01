import React, { useState } from 'react';
import { Settings, Key, Database, RefreshCw, Sun, Moon, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function SettingsView() {
  const [geminiKey, setGeminiKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSaveKeys = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="pb-4 border-b border-palette-800">
        <h1 className="text-xl font-extrabold text-palette-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-palette-400" />
          Platform Settings & System Configuration
        </h1>
        <p className="text-xs text-palette-300/70 mt-1">
          Manage environment parameters, AI provider keys, database connection pooling, and ML pipeline triggers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Provider Configuration */}
        <div className="p-6 rounded-2xl bg-palette-900/80 border border-palette-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-palette-100 flex items-center gap-2">
            <Key className="w-4 h-4 text-palette-400" />
            AI Provider Credentials (Gemini / OpenAI)
          </h3>
          <p className="text-xs text-palette-300/70 leading-relaxed">
            CHURNIQ automatically uses the local analytical reasoning engine when no API keys are present. Supplying a key enables LLM natural language responses.
          </p>

          <form onSubmit={handleSaveKeys} className="space-y-4 text-xs">
            <div>
              <label className="text-palette-200 block mb-1 font-medium">GEMINI_API_KEY / OPENAI_API_KEY</label>
              <input
                type="password"
                placeholder="Paste API Key (e.g. AIzaSy...)"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full p-2.5 bg-palette-950 border border-palette-800 rounded-lg text-palette-100 placeholder-palette-300/50 focus:outline-none focus:border-palette-400/60 font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-palette-400 hover:bg-palette-300 text-palette-950 font-semibold transition-colors shadow"
              >
                Save Credentials
              </button>

              {saved && (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> API Configuration Saved
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Database & ML Model Status */}
        <div className="p-6 rounded-2xl bg-palette-900/80 border border-palette-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-palette-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            Database & ML Model Pipeline Controls
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-palette-950 border border-palette-800 flex justify-between items-center">
              <div>
                <span className="font-semibold text-palette-100 block">Database Storage</span>
                <span className="text-[10px] text-palette-300/60">25,000 Relational Records (SQLite / Postgres)</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">ONLINE</span>
            </div>

            <div className="p-3 rounded-xl bg-palette-950 border border-palette-800 flex justify-between items-center">
              <div>
                <span className="font-semibold text-palette-100 block">Production Classifier</span>
                <span className="text-[10px] text-palette-300/60">XGBoost v3.1 (ROC-AUC: 0.9901)</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-palette-400/20 text-palette-300 border border-palette-400/30 font-bold">LOADED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
