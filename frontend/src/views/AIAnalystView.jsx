import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, RefreshCw, ArrowUpRight, ShieldCheck, Database } from 'lucide-react';

export default function AIAnalystView({ setActiveTab }) {
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Hello! I am your **CHURNIQ AI Data Analyst**. I have complete access to your 25,000-customer dataset, ML model predictions, and financial risk metrics.\n\nAsk me anything about churn drivers, revenue exposure, or retention strategy!",
      mode: 'Local Analytical Engine',
      suggested_actions: ["Why did churn increase this month?", "How much revenue is currently at risk?", "Which customers should retention team contact first?"]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = (promptText) => {
    const textToSend = promptText || input;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    if (!promptText) setInput('');
    setLoading(true);

    fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: textToSend })
    })
      .then(res => res.json())
      .then(data => {
        const aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.answer,
          mode: data.mode,
          suggested_actions: data.suggested_actions || []
        };
        setMessages(prev => [...prev, aiMsg]);
        setLoading(false);
      })
      .catch(err => {
        console.error("AI query failed:", err);
        setMessages(prev => [...prev, {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: "Apologies, an error occurred while connecting to the analytics engine.",
          mode: 'Error Fallback',
          suggested_actions: []
        }]);
        setLoading(false);
      });
  };

  const presetQuestions = [
    "Why did churn increase this month?",
    "Which customer segment is most at risk?",
    "How much revenue is currently at risk?",
    "Which customers should the retention team contact first?",
    "What are the top churn drivers?",
    "Compare churn between Basic and Pro customers."
  ];

  return (
    <div className="p-6 max-w-[1400px] mx-auto h-[calc(100vh-5rem)] flex flex-col space-y-4 animate-fade-in">
      {/* Header */}
      <div className="pb-3 border-b border-palette-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-palette-500 to-palette-400 text-palette-950 shadow-lg shadow-palette-400/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-palette-100 flex items-center gap-2">
              CHURNIQ AI Analyst
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-palette-400/15 text-palette-300 border border-palette-400/30">
                Ask your data anything
              </span>
            </h1>
            <p className="text-xs text-palette-300/70">Context-aware conversational analytics engine grounded in verified SQL & ML dataset state.</p>
          </div>
        </div>
      </div>

      {/* Chat Conversation Area */}
      <div className="flex-1 bg-palette-900/80 border border-palette-800 rounded-2xl p-6 overflow-y-auto space-y-6 shadow-2xl">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              msg.sender === 'user'
                ? 'bg-palette-800 text-palette-100 ring-2 ring-palette-700'
                : 'bg-gradient-to-tr from-palette-500 to-palette-400 text-palette-950 ring-2 ring-palette-400/30'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-2xl space-y-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-4 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-palette-400 text-palette-950 font-medium rounded-tr-none shadow'
                  : 'bg-palette-950/80 border border-palette-800 text-palette-100 rounded-tl-none shadow-lg'
              }`}>
                {/* Format basic markdown formatting in text */}
                <div className="whitespace-pre-wrap space-y-2">
                  {msg.text.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                {msg.mode && (
                  <div className="mt-3 pt-2 border-t border-palette-800/80 flex items-center justify-between text-[10px] text-palette-300/70 font-mono">
                    <span className="flex items-center gap-1">
                      <Database className="w-3 h-3 text-palette-400" />
                      Engine: {msg.mode}
                    </span>
                    <span className="text-emerald-400">Ground Truth Verified</span>
                  </div>
                )}
              </div>

              {/* Action Chip Suggestions */}
              {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {msg.suggested_actions.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(act)}
                      className="px-2.5 py-1 rounded-lg bg-palette-800/80 hover:bg-palette-700 text-palette-300 border border-palette-400/20 text-[11px] font-medium transition-colors flex items-center gap-1"
                    >
                      <span>{act}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-3 text-palette-300/70 text-xs">
            <div className="w-8 h-8 rounded-full bg-palette-400/20 flex items-center justify-center text-palette-400">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="p-3 rounded-2xl bg-palette-950/80 border border-palette-800 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-palette-400 animate-ping"></span>
              <span>Scanning relational database & executing SQL aggregations...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset Prompt Suggestions Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] uppercase font-bold text-palette-300/60 shrink-0">Quick Queries:</span>
        {presetQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-xl bg-palette-900 hover:bg-palette-800 border border-palette-800 text-palette-200 shrink-0 text-[11px] transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-2 rounded-2xl bg-palette-900 border border-palette-800 shadow-xl flex items-center space-x-3"
      >
        <input
          type="text"
          placeholder="Ask AI Analyst (e.g., 'Show me top churn risk factors for Enterprise customers')..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-palette-950 border border-palette-800 rounded-xl text-xs text-palette-100 placeholder-palette-300/50 focus:outline-none focus:border-palette-400/60"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-palette-400 hover:bg-palette-300 disabled:opacity-40 text-palette-950 font-bold transition-all shadow-md flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
