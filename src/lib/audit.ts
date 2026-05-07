import {
  AuditInput,
  AuditResult,
  ToolAuditResult,
  Recommendation,
  ToolEntry,
  PRICING,
} from "./types";
import { nanoid } from "nanoid";

// ─── Per-tool audit logic ─────────────────────────────────────────────────────

function auditCursor(entry: ToolEntry, useCase: string, teamSize: number): Recommendation {
  const { plan, seats, monthlySpend } = entry;

  if (plan === "business" && seats <= 3) {
    const saving = seats * (40 - 20);
    return {
      action: "downgrade",
      suggestedPlan: "pro",
      monthlySavings: saving,
      reason: `Business plan at ${seats} seats is overkill — Pro ($20/seat) covers individual and small-team usage without admin overhead.`,
    };
  }

  if (plan === "enterprise" && seats <= 10) {
    const saving = seats * (40 - 20);
    return {
      action: "downgrade",
      suggestedPlan: "business",
      monthlySavings: saving,
      reason: `Enterprise for ${seats} seats adds SSO/policy features most teams never configure. Business plan covers you at the same seat price with less lock-in.`,
    };
  }

  if (useCase === "writing" || useCase === "research") {
    return {
      action: "switch",
      suggestedTool: "claude",
      suggestedPlan: "pro",
      monthlySavings: Math.max(0, monthlySpend - seats * 20),
      reason: `Cursor is IDE-first. For ${useCase}, Claude Pro ($20/seat) delivers better long-context reasoning at lower cost with no IDE dependency.`,
    };
  }

  return { action: "optimal", monthlySavings: 0, reason: "Cursor Pro/Business is cost-competitive for coding-heavy teams at your seat count." };
}

function auditGithubCopilot(entry: ToolEntry, useCase: string, teamSize: number): Recommendation {
  const { plan, seats, monthlySpend } = entry;

  if (plan === "enterprise" && seats <= 15) {
    const saving = seats * (39 - 19);
    return {
      action: "downgrade",
      suggestedPlan: "business",
      monthlySavings: saving,
      reason: `Enterprise adds policy management and audit logs — valuable at 50+ seats, premature at ${seats}. Business saves you $20/seat/month.`,
    };
  }

  if (useCase === "coding" && (plan === "business" || plan === "individual")) {
    return { action: "optimal", monthlySavings: 0, reason: "GitHub Copilot Business is the market-rate baseline for coding teams. No cheaper alternative with comparable IDE integration." };
  }

  if (useCase !== "coding") {
    const saving = Math.max(0, monthlySpend - seats * 20);
    return {
      action: "switch",
      suggestedTool: "claude",
      suggestedPlan: "pro",
      monthlySavings: saving,
      reason: `Copilot is optimised for code completion. For ${useCase} tasks your team would get more value from Claude Pro's stronger reasoning and document handling.`,
    };
  }

  return { action: "optimal", monthlySavings: 0, reason: "Plan matches team size and use case." };
}

function auditClaude(entry: ToolEntry, useCase: string, teamSize: number): Recommendation {
  const { plan, seats, monthlySpend } = entry;

  if (plan === "max" && seats > 1) {
    const saving = seats * (100 - 30);
    return {
      action: "downgrade",
      suggestedPlan: "team",
      monthlySavings: saving,
      reason: `Claude Max ($100/seat) is designed for power-users doing 5x+ usage. Team plan ($30/seat) is sufficient for most org-level workflows and saves $70/seat/month.`,
    };
  }

  if (plan === "team" && seats <= 2) {
    const saving = seats * (30 - 20);
    return {
      action: "downgrade",
      suggestedPlan: "pro",
      monthlySavings: saving,
      reason: `Team plan requires 5+ seats minimum per Anthropic policy. At ${seats} seats, Pro ($20/seat) gives identical model access.`,
    };
  }

  return { action: "optimal", monthlySavings: 0, reason: "Claude plan aligns with your team size and use case. Strong reasoning model for mixed workloads." };
}

function auditChatGPT(entry: ToolEntry, useCase: string, teamSize: number): Recommendation {
  const { plan, seats, monthlySpend } = entry;

  if (plan === "enterprise" && seats <= 10) {
    const saving = seats * (60 - 30);
    return {
      action: "downgrade",
      suggestedPlan: "team",
      monthlySavings: saving,
      reason: `ChatGPT Enterprise at ${seats} seats is priced for 150+ seat deployments. Team plan provides GPT-4o access with admin controls at half the per-seat cost.`,
    };
  }

  if (plan === "plus" && seats >= 5) {
    const saving = seats * (20 - 20); // team is also $25 but per-seat
    return {
      action: "switch",
      suggestedTool: "claude",
      suggestedPlan: "team",
      monthlySavings: Math.max(0, monthlySpend - seats * 20),
      reason: `At ${seats}+ seats, Claude Team offers comparable capability with better document handling and longer context at the same price point — worth evaluating.`,
    };
  }

  return { action: "optimal", monthlySavings: 0, reason: "ChatGPT plan is cost-competitive for your seat count." };
}

function auditAPIUsage(entry: ToolEntry, useCase: string): Recommendation {
  const { monthlySpend, tool } = entry;

  if (monthlySpend > 500) {
    return {
      action: "switch",
      suggestedTool: tool === "anthropic_api" ? "claude" : "chatgpt",
      suggestedPlan: "team",
      monthlySavings: Math.round(monthlySpend * 0.15),
      reason: `API direct spend of $${monthlySpend}/mo suggests heavy usage. Credex credits for the same API can yield 15–30% savings on equivalent compute. Consult to verify exact discount.`,
    };
  }

  return { action: "optimal", monthlySavings: 0, reason: "API spend is modest. Direct pricing is fine at this volume." };
}

function auditGemini(entry: ToolEntry, useCase: string, teamSize: number): Recommendation {
  const { plan, seats, monthlySpend } = entry;

  if (plan === "ultra") {
    return {
      action: "switch",
      suggestedTool: "claude",
      suggestedPlan: "team",
      monthlySavings: Math.max(0, monthlySpend - seats * 30),
      reason: `Gemini Ultra ($250/workspace) is priced for deep Google Workspace integration. If you're not in that ecosystem, Claude Team delivers better long-context reasoning per dollar.`,
    };
  }

  return { action: "optimal", monthlySavings: 0, reason: "Gemini Pro is competitively priced for Google-heavy workflows." };
}

function auditWindsurf(entry: ToolEntry, useCase: string, teamSize: number): Recommendation {
  const { plan, seats, monthlySpend } = entry;

  if (plan === "team" && seats <= 3) {
    return {
      action: "downgrade",
      suggestedPlan: "pro",
      monthlySavings: seats * (35 - 15),
      reason: `Windsurf Team at ${seats} seats includes billing admin overhead not needed at this scale. Pro ($15/seat) provides the same AI code-generation capability.`,
    };
  }

  if (useCase !== "coding") {
    return {
      action: "switch",
      suggestedTool: "claude",
      suggestedPlan: "pro",
      monthlySavings: Math.max(0, monthlySpend - seats * 20),
      reason: `Windsurf is an AI IDE. For ${useCase} workflows, Claude Pro is a better fit with native document and reasoning support.`,
    };
  }

  return { action: "optimal", monthlySavings: 0, reason: "Windsurf Pro is competitively priced for coding-centric teams." };
}

// ─── Main audit router ────────────────────────────────────────────────────────

export function auditTool(entry: ToolEntry, useCase: string, teamSize: number): ToolAuditResult {
  let rec: Recommendation;

  switch (entry.tool) {
    case "cursor":        rec = auditCursor(entry, useCase, teamSize); break;
    case "github_copilot":rec = auditGithubCopilot(entry, useCase, teamSize); break;
    case "claude":        rec = auditClaude(entry, useCase, teamSize); break;
    case "chatgpt":       rec = auditChatGPT(entry, useCase, teamSize); break;
    case "anthropic_api":
    case "openai_api":    rec = auditAPIUsage(entry, useCase); break;
    case "gemini":        rec = auditGemini(entry, useCase, teamSize); break;
    case "windsurf":      rec = auditWindsurf(entry, useCase, teamSize); break;
    default:
      rec = { action: "optimal", monthlySavings: 0, reason: "No specific audit rule — plan appears reasonable for stated use case." };
  }

  return {
    tool: entry.tool,
    plan: entry.plan,
    currentMonthlySpend: entry.monthlySpend,
    recommendation: rec,
  };
}

export function runAudit(input: AuditInput): AuditResult {
  const results = input.tools
    .filter((t) => t.tool && t.plan)
    .map((entry) => auditTool(entry, input.useCase, input.teamSize));

  const totalMonthlySavings = results.reduce((sum, r) => sum + r.recommendation.monthlySavings, 0);

  return {
    id: nanoid(10),
    input,
    results,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    createdAt: new Date().toISOString(),
  };
}
