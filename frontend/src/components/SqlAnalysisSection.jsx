import React, { useState } from 'react';
import { Database, ChevronDown, ChevronUp, Copy, Check, Code2 } from 'lucide-react';

export default function SqlAnalysisSection() {
  const [expandedId, setExpandedId] = useState(1);
  const [copiedId, setCopiedId] = useState(null);

  const sqlQueries = [
    {
      id: 1,
      question: "Which contract type has the highest churn rate?",
      subtitle: "Group by contract type to evaluate churn percentage across monthly vs annual subscriptions.",
      query: `-- Contract Type Churn Rate Query
SELECT 
    contract_type,
    COUNT(customerid) AS total_customers,
    SUM(churn_flag) AS churned_customers,
    ROUND(AVG(churn_flag) * 100.0, 2) AS churn_rate_pct
FROM db_subscription
GROUP BY contract_type
ORDER BY churn_rate_pct DESC;`
    },
    {
      id: 2,
      question: "Top 15 Priority High-Risk Customers Ranked by Revenue at Risk",
      subtitle: "Filter active customers with high churn risk and order by total monthly spend to prioritize retention outreach.",
      query: `-- High-Risk Priority Matrix
WITH PriorityMatrix AS (
    SELECT 
        c.customerid,
        c.name,
        c.state,
        s.subscription_type,
        s.monthly_charges,
        s.churn_score,
        DENSE_RANK() OVER (ORDER BY s.monthly_charges DESC) AS priority_rank
    FROM db_customer c
    JOIN db_subscription s ON c.customerid = s.customerid
    WHERE s.churn_score >= 70 AND s.cancellation_date IS NULL
)
SELECT * FROM PriorityMatrix
WHERE priority_rank <= 15;`
    },
    {
      id: 3,
      question: "What is the impact of support escalations on customer churn?",
      subtitle: "Analyze correlation between support complaint escalations and cancellation flags.",
      query: `-- Support Escalation Impact Analysis
SELECT 
    st.escalations,
    COUNT(s.customerid) AS total_customers,
    SUM(s.churn_flag) AS total_churned,
    ROUND(AVG(s.churn_flag) * 100.0, 2) AS escalation_churn_rate_pct
FROM db_subscription s
JOIN db_support st ON s.customerid = st.customerid
GROUP BY st.escalations;`
    },
    {
      id: 4,
      question: "Churn Rate and Total Revenue at Risk Breakdown by Plan Type",
      subtitle: "Aggregates revenue at risk and average churn rate per subscription tier (Basic, Standard, Premium).",
      query: `-- Revenue at Risk per Subscription Tier
SELECT 
    plan_type,
    COUNT(customerid) AS total_subscribers,
    SUM(CASE WHEN churn_flag = 1 THEN monthly_charges ELSE 0 END) AS revenue_at_risk,
    ROUND(AVG(churn_flag) * 100.0, 2) AS churn_rate_pct
FROM db_subscription
GROUP BY plan_type
ORDER BY revenue_at_risk DESC;`
    }
  ];

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="sql-section" className="py-12 border-b border-[#263449]">
      <div className="mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#172033] border border-[#263449] text-xs font-semibold text-[#8B5CF6] mb-3">
          <Database className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>SQL ANALYTICAL QUERIES</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#F8FAFC]">
          SQL Analysis & Queries
        </h2>
        <p className="text-sm text-[#94A3B8] mt-1 max-w-xl">
          Relational query logic executed against the SQLite database (`customer_churn.db`) to uncover churn insights.
        </p>
      </div>

      <div className="space-y-4">
        {sqlQueries.map((item) => {
          const isExpanded = expandedId === item.id;
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              className="rounded-2xl bg-[#172033]/90 border border-[#263449] overflow-hidden transition-all shadow-md hover:border-[#8B5CF6]/40"
            >
              {/* Header / Question Bar */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="p-5 flex items-center justify-between cursor-pointer select-none hover:bg-[#263449]/30 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-[#0B1120] border border-[#263449] text-[#8B5CF6] mt-0.5">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-[#8B5CF6] uppercase tracking-wider">
                      Question {item.id}
                    </span>
                    <h3 className="text-base font-bold text-[#F8FAFC] leading-snug">
                      {item.question}
                    </h3>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(isExpanded ? null : item.id);
                    }}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#0B1120] border border-[#263449] text-xs font-semibold text-[#22D3EE] hover:bg-[#263449]/50 transition-colors"
                  >
                    <span>{isExpanded ? 'Hide SQL' : 'View Query'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Code Expand Drawer */}
              {isExpanded && (
                <div className="border-t border-[#263449] bg-[#0B1120] p-4 relative">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#263449]/60">
                    <span className="text-[11px] font-mono text-[#94A3B8]">
                      SQLite Query Syntax
                    </span>
                    <button
                      onClick={() => handleCopy(item.id, item.query)}
                      className="inline-flex items-center space-x-1.5 text-xs text-[#94A3B8] hover:text-[#22D3EE] px-2.5 py-1 rounded bg-[#172033] border border-[#263449] transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#34D399]" />
                          <span className="text-[#34D399]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy SQL</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="font-mono text-xs text-[#34D399] overflow-x-auto p-3 rounded-xl bg-[#090d18] border border-[#263449] leading-relaxed">
                    <code>{item.query}</code>
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
