"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AuditResult, TOOL_LABELS, PLAN_LABELS } from "@/lib/types";
import styles from "./results.module.css";

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
    fetch(`/api/audit/${id}`)
      .then((r) => r.json())
      .then((data) => { setAudit(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleLeadSubmit = async () => {
    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, company, role, auditId: id }),
    });
    setSubmitted(true);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.loading}>
          <span className={styles.loadingDot} />
          <p>Running audit…</p>
        </div>
      </div>
    </main>
  );

  if (!audit || "error" in audit) return (
    <main className={styles.main}>
      <div className="container">
        <p className={styles.notFound}>Audit not found. <Link href="/audit">Run a new one →</Link></p>
      </div>
    </main>
  );

  const { results, totalMonthlySavings, totalAnnualSavings, summary, input } = audit;
  const isHighSavings = totalMonthlySavings >= 500;
  const isOptimal = totalMonthlySavings < 50;

  return (
    <main className={styles.main}>
      <div className={styles.glow} />
      <div className="container">
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>SpendLens</Link>
          <button className={styles.shareBtn} onClick={copyLink}>
            {copied ? "✓ Copied!" : "⬡ Copy link"}
          </button>
        </nav>

        {/* Hero savings */}
        <section className={`${styles.hero} fade-up`}>
          <p className="tag">Audit complete · {results.length} tool{results.length !== 1 ? "s" : ""} reviewed</p>
          {isOptimal ? (
            <>
              <h1 className={styles.heroTitle}>You&apos;re spending well.</h1>
              <p className={styles.heroBig} style={{ color: "var(--accent)" }}>Optimised</p>
              <p className={styles.heroSub}>No material savings found. Your plans match your team size and use case.</p>
            </>
          ) : (
            <>
              <h1 className={styles.heroTitle}>Potential savings found.</h1>
              <div className={styles.savingsRow}>
                <div className={styles.savingsBig}>
                  <span className={styles.savingsLabel}>Monthly</span>
                  <span className={styles.savingsNum}>${totalMonthlySavings.toLocaleString()}</span>
                </div>
                <div className={styles.savingsDivider}>/</div>
                <div className={styles.savingsBig}>
                  <span className={styles.savingsLabel}>Annual</span>
                  <span className={styles.savingsNum} style={{ color: "var(--accent)" }}>
                    ${totalAnnualSavings.toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          )}
        </section>

        {/* AI Summary */}
        {summary && (
          <div className={`${styles.summaryCard} fade-up fade-up-1`}>
            <p className={styles.summaryLabel}>// AI-generated summary</p>
            <p className={styles.summaryText}>{summary}</p>
          </div>
        )}

        {/* Per-tool results */}
        <section className={`${styles.toolSection} fade-up fade-up-2`}>
          <p className={styles.sectionLabel}>// per-tool breakdown</p>
          {results.map((r, i) => {
            const tLabel = TOOL_LABELS[r.tool] || r.tool;
            const pLabel = PLAN_LABELS[r.tool]?.[r.plan] || r.plan;
            const isOptimalTool = r.recommendation.action === "optimal";
            return (
              <div key={i} className={`${styles.toolCard} ${isOptimalTool ? styles.toolOptimal : styles.toolSave}`}>
                <div className={styles.toolTop}>
                  <div>
                    <p className={styles.toolName}>{tLabel}</p>
                    <p className={styles.toolPlan}>{pLabel} · ${r.currentMonthlySpend}/mo</p>
                  </div>
                  <div className={styles.toolRight}>
                    {isOptimalTool ? (
                      <span className="tag green">Optimal</span>
                    ) : (
                      <span className={styles.toolSaving}>−${r.recommendation.monthlySavings}/mo</span>
                    )}
                  </div>
                </div>
                <div className={styles.toolAction}>
                  {!isOptimalTool && (
                    <span className={`tag ${r.recommendation.action === "switch" ? "orange" : ""}`}>
                      {r.recommendation.action === "downgrade" && "↓ Downgrade"}
                      {r.recommendation.action === "switch" && "⇄ Switch"}
                      {r.recommendation.action === "reduce_seats" && "↓ Reduce seats"}
                      {r.recommendation.suggestedTool && ` to ${TOOL_LABELS[r.recommendation.suggestedTool] || r.recommendation.suggestedTool}`}
                      {r.recommendation.suggestedPlan && ` ${r.recommendation.suggestedPlan}`}
                    </span>
                  )}
                </div>
                <p className={styles.toolReason}>{r.recommendation.reason}</p>
              </div>
            );
          })}
        </section>

        {/* Credex CTA for high-savings */}
        {isHighSavings && (
          <div className={`${styles.credexCard} fade-up fade-up-3`}>
            <div className={styles.credexLeft}>
              <p className={styles.credexTag}>Powered by Credex</p>
              <h2 className={styles.credexTitle}>Capture more of that ${totalMonthlySavings}/mo</h2>
              <p className={styles.credexText}>
                Credex sells discounted AI infrastructure credits — Cursor, Claude, ChatGPT Enterprise — 
                sourced from companies that overforecast. The discount is real and substantial. 
                Book a free 15-min consultation to see your exact savings.
              </p>
              <a href="https://credex.rocks" className={styles.credexBtn} target="_blank" rel="noopener noreferrer">
                Book free consultation →
              </a>
            </div>
          </div>
        )}

        {/* Lead capture */}
        <div className={`${styles.leadCard} fade-up fade-up-4`}>
          {submitted ? (
            <div className={styles.leadSuccess}>
              <span className={styles.leadSuccessIcon}>✓</span>
              <div>
                <p className={styles.leadSuccessTitle}>Report sent.</p>
                <p className={styles.leadSuccessText}>Check your inbox. We&apos;ll reach out if we spot new savings opportunities for your stack.</p>
              </div>
            </div>
          ) : (
            <>
              <p className={styles.leadTitle}>
                {isOptimal ? "Notify me when new optimisations apply to my stack" : "Email me this report"}
              </p>
              {/* Honeypot */}
              <input type="text" name="_hp" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
              <div className={styles.leadRow}>
                <input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="text" placeholder="Company (optional)" value={company} onChange={(e) => setCompany(e.target.value)} />
                <input type="text" placeholder="Role (optional)" value={role} onChange={(e) => setRole(e.target.value)} />
                <button className={styles.leadBtn} onClick={handleLeadSubmit} disabled={!email}>
                  Send report →
                </button>
              </div>
              <p className={styles.leadNote}>No spam. Unsubscribe any time.</p>
            </>
          )}
        </div>

        {/* Share */}
        <div className={`${styles.shareSection} fade-up`}>
          <p className={styles.shareLabel}>Share this audit with your co-founder or finance team:</p>
          <div className={styles.shareUrl}>
            <span>{shareUrl}</span>
            <button onClick={copyLink} className={styles.copyBtn}>{copied ? "Copied!" : "Copy"}</button>
          </div>
        </div>

        <div className={styles.newAuditRow}>
          <Link href="/audit" className={styles.newAuditLink}>← Run a new audit</Link>
        </div>
      </div>
    </main>
  );
}
