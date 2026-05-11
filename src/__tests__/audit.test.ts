/**
 * TESTS.md — Audit Engine Unit Tests
 * Run with: npm test
 * All tests cover src/lib/audit.ts
 */



import { auditTool, runAudit } from "../lib/audit";
import { AuditInput, ToolEntry } from "../lib/types";

// ─── Helper ──────────────────────────────────────────────────────────────────
const entry = (overrides: Partial<ToolEntry>): ToolEntry => ({
  tool: "cursor",
  plan: "pro",
  monthlySpend: 100,
  seats: 5,
  ...overrides,
});

// ─── Test 1: Cursor Business at low seat count recommends downgrade ───────────
test("Cursor Business at 3 seats recommends downgrade to Pro", () => {
  const result = auditTool(entry({ tool: "cursor", plan: "business", seats: 3, monthlySpend: 120 }), "coding", 3);
  expect(result.recommendation.action).toBe("downgrade");
  expect(result.recommendation.monthlySavings).toBe(3 * (40 - 20)); // $60
  expect(result.recommendation.suggestedPlan).toBe("pro");
});

// ─── Test 2: Cursor Pro for coding is optimal ────────────────────────────────
test("Cursor Pro for coding team is marked optimal", () => {
  const result = auditTool(entry({ tool: "cursor", plan: "pro", seats: 5, monthlySpend: 100 }), "coding", 10);
  expect(result.recommendation.action).toBe("optimal");
  expect(result.recommendation.monthlySavings).toBe(0);
});

// ─── Test 3: GitHub Copilot Enterprise at small team recommends downgrade ─────
test("GitHub Copilot Enterprise at 10 seats recommends downgrade to Business", () => {
  const result = auditTool(entry({ tool: "github_copilot", plan: "enterprise", seats: 10, monthlySpend: 390 }), "coding", 10);
  expect(result.recommendation.action).toBe("downgrade");
  expect(result.recommendation.monthlySavings).toBe(10 * (39 - 19)); // $200
});


// ─── Test 4: Claude Max at multiple seats recommends downgrade to Team ────────
test("Claude Max at 3 seats recommends downgrade to Team", () => {
  const result = auditTool(entry({ tool: "claude", plan: "max", seats: 3, monthlySpend: 300 }), "mixed", 15);
  expect(result.recommendation.action).toBe("downgrade");
  expect(result.recommendation.monthlySavings).toBe(3 * (100 - 30)); // $210
  expect(result.recommendation.suggestedPlan).toBe("team");
});


