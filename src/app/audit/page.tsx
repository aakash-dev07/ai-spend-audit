"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuditInput, ToolEntry, UseCase, TOOL_LABELS, PLAN_LABELS } from "@/lib/types";
import styles from "./audit.module.css";

const TOOLS = Object.keys(TOOL_LABELS);
const EMPTY_TOOL: ToolEntry = { tool: "", plan: "", monthlySpend: 0, seats: 1 };
const STORAGE_KEY = "spendlens_form_state";

export default function AuditPage() {
  const router = useRouter();
  const [tools, setTools] = useState<ToolEntry[]>([{ ...EMPTY_TOOL }]);
  const [teamSize, setTeamSize] = useState(5);
  const [useCase, setUseCase] = useState<UseCase>("mixed");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Persist form state
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tools) setTools(parsed.tools);
        if (parsed.teamSize) setTeamSize(parsed.teamSize);
        if (parsed.useCase) setUseCase(parsed.useCase);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tools, teamSize, useCase }));
    } catch {}
  }, [tools, teamSize, useCase]);

  const addTool = () => setTools((t) => [...t, { ...EMPTY_TOOL }]);
  const removeTool = (i: number) => setTools((t) => t.filter((_, idx) => idx !== i));
  const updateTool = (i: number, field: keyof ToolEntry, value: string | number) => {
    setTools((prev) => {
      const next = [...prev];
      if (field === "tool") {
        next[i] = { ...next[i], tool: value as string, plan: "" };
      } else {
        (next[i] as Record<string, unknown>)[field] = value;
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    const valid = tools.filter((t) => t.tool && t.plan && t.monthlySpend >= 0);
    if (valid.length === 0) { setError("Add at least one tool to audit."); return; }
    setError("");
    setLoading(true);
    try {
      const body: AuditInput = { tools: valid, teamSize, useCase };
      const res = await fetch("/api/audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Audit failed");
      router.push(`/results/${data.id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.glow} />
      <div className="container">
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>SpendLens</Link>
          <span className="tag">Step 1 of 2</span>
        </nav>

        <div className={`${styles.header} fade-up`}>
          <h1>Your AI Stack</h1>
          <p>Add every AI tool your team pays for. We&apos;ll tell you what to do with each one.</p>
        </div>

        {/* Global settings */}
        <div className={`${styles.globalCard} fade-up fade-up-1`}>
          <div className={styles.row2}>
            <label className={styles.field}>
              <span className={styles.label}>Team size (total headcount)</span>
              <input type="number" min={1} max={10000} value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Primary use case</span>
              <select value={useCase} onChange={(e) => setUseCase(e.target.value as UseCase)}>
                <option value="coding">Coding / Engineering</option>
                <option value="writing">Writing / Content</option>
                <option value="data">Data / Analytics</option>
                <option value="research">Research</option>
                <option value="mixed">Mixed</option>
              </select>
            </label>
          </div>
        </div>

        {/* Tool rows */}
        <div className={`${styles.toolList} fade-up fade-up-2`}>
          {tools.map((t, i) => (
            <div key={i} className={styles.toolCard}>
              <div className={styles.toolHeader}>
                <span className={styles.toolNum}>Tool {i + 1}</span>
                {tools.length > 1 && (
                  <button className={styles.removeBtn} onClick={() => removeTool(i)}>✕ Remove</button>
                )}
              </div>
              <div className={styles.row3}>
                <label className={styles.field}>
                  <span className={styles.label}>Tool</span>
                  <select value={t.tool} onChange={(e) => updateTool(i, "tool", e.target.value)}>
                    <option value="">— Select tool —</option>
                    {TOOLS.map((tk) => (
                      <option key={tk} value={tk}>{TOOL_LABELS[tk]}</option>
                    ))}
                  </select>
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Plan</span>
                  <select value={t.plan} onChange={(e) => updateTool(i, "plan", e.target.value)} disabled={!t.tool}>
                    <option value="">— Select plan —</option>
                    {t.tool && PLAN_LABELS[t.tool] && Object.entries(PLAN_LABELS[t.tool]).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Seats</span>
                  <input type="number" min={1} max={10000} value={t.seats} onChange={(e) => updateTool(i, "seats", Number(e.target.value))} />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Monthly spend (USD)</span>
                  <input type="number" min={0} step={0.01} value={t.monthlySpend} onChange={(e) => updateTool(i, "monthlySpend", Number(e.target.value))} placeholder="0.00" />
                </label>
              </div>
            </div>
          ))}
        </div>

        <button className={styles.addBtn} onClick={addTool}>+ Add another tool</button>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.submitRow}>
          <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
            {loading ? "Running audit…" : "Run My Audit →"}
          </button>
          <span className={styles.submitNote}>Results appear instantly. No email required yet.</span>
        </div>
      </div>
    </main>
  );
}
