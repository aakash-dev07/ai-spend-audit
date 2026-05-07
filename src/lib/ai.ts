import { AuditResult, TOOL_LABELS, PLAN_LABELS } from "./types";

function buildPrompt(result: AuditResult): string {
  const { input, results, totalMonthlySavings } = result;
  const toolSummary = results.map((r) => {
    const tLabel = TOOL_LABELS[r.tool] || r.tool;
    const pLabel = PLAN_LABELS[r.tool]?.[r.plan] || r.plan;
    return `${tLabel} (${pLabel}, $${r.currentMonthlySpend}/mo) → ${r.recommendation.action}: save $${r.recommendation.monthlySavings}/mo. Reason: ${r.recommendation.reason}`;
  }).join("\n");

  return `You are a concise, financially-literate SaaS advisor writing a personalised audit summary for a startup team.

Context:
- Team size: ${input.teamSize} people
- Primary use case: ${input.useCase}
- Total potential monthly savings: $${totalMonthlySavings}

Per-tool findings:
${toolSummary}

Write a single paragraph of exactly 80–110 words addressed directly to the team ("your team", "you"). Be specific — mention actual tools and savings numbers. Be honest: if savings are small, say so. End with one actionable next step. Do not use bullet points. Do not use markdown. Plain prose only.`;
}

function fallbackSummary(result: AuditResult): string {
  const { totalMonthlySavings, input, results } = result;
  if (totalMonthlySavings === 0) {
    return `Your team of ${input.teamSize} is spending well on AI tools. Based on your current stack and ${input.useCase} use case, all plans appear well-matched. No immediate changes recommended — revisit when your team grows or use cases shift.`;
  }
  const topSaving = results.reduce((best, r) => r.recommendation.monthlySavings > best.recommendation.monthlySavings ? r : best, results[0]);
  const tLabel = TOOL_LABELS[topSaving.tool] || topSaving.tool;
  return `Your team of ${input.teamSize} could save $${totalMonthlySavings}/month ($${totalMonthlySavings * 12}/year) on AI tools. The biggest opportunity is ${tLabel} — ${topSaving.recommendation.reason} Start there and work through each recommendation in order of savings impact.`;
}

export async function generateSummary(result: AuditResult): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return fallbackSummary(result);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        messages: [{ role: "user", content: buildPrompt(result) }],
      }),
    });

    if (!res.ok) throw new Error(`Anthropic API ${res.status}`);
    const data = await res.json();
    const text = data.content?.[0]?.text?.trim();
    if (!text) throw new Error("Empty response");
    return text;
  } catch (e) {
    console.warn("AI summary failed, using fallback:", e);
    return fallbackSummary(result);
  }
}
