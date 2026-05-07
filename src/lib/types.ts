// ─── Tool & Plan Types ───────────────────────────────────────────────────────

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export interface ToolEntry {
  tool: string;
  plan: string;
  monthlySpend: number; // user-reported, USD
  seats: number;
}

export interface AuditInput {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCase;
}

export interface Recommendation {
  action: "downgrade" | "switch" | "optimal" | "reduce_seats";
  suggestedTool?: string;
  suggestedPlan?: string;
  monthlySavings: number;
  reason: string;
}

export interface ToolAuditResult {
  tool: string;
  plan: string;
  currentMonthlySpend: number;
  recommendation: Recommendation;
}

export interface AuditResult {
  id: string;
  input: AuditInput;
  results: ToolAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  summary?: string; // AI-generated
  createdAt: string;
}

// ─── Pricing Data ────────────────────────────────────────────────────────────
// Source: PRICING_DATA.md — all prices USD/user/month unless noted

export const PRICING: Record<string, Record<string, number>> = {
  cursor: {
    hobby: 0,
    pro: 20,
    business: 40,
    enterprise: 40, // custom; use 40 as floor
  },
  github_copilot: {
    individual: 10,
    business: 19,
    enterprise: 39,
  },
  claude: {
    free: 0,
    pro: 20,
    max: 100,
    team: 30,
    enterprise: 60, // floor estimate
    api_direct: 0, // usage-based; user enters spend
  },
  chatgpt: {
    free: 0,
    plus: 20,
    team: 30,
    enterprise: 60, // floor estimate
    api_direct: 0,
  },
  anthropic_api: {
    api_direct: 0,
  },
  openai_api: {
    api_direct: 0,
  },
  gemini: {
    free: 0,
    pro: 19.99,
    ultra: 249.99, // one-time monthly; per workspace
    api_direct: 0,
  },
  windsurf: {
    free: 0,
    pro: 15,
    team: 35,
    enterprise: 35,
  },
};

export const TOOL_LABELS: Record<string, string> = {
  cursor: "Cursor",
  github_copilot: "GitHub Copilot",
  claude: "Claude (Anthropic)",
  chatgpt: "ChatGPT (OpenAI)",
  anthropic_api: "Anthropic API Direct",
  openai_api: "OpenAI API Direct",
  gemini: "Google Gemini",
  windsurf: "Windsurf",
};

export const PLAN_LABELS: Record<string, Record<string, string>> = {
  cursor: { hobby: "Hobby (Free)", pro: "Pro", business: "Business", enterprise: "Enterprise" },
  github_copilot: { individual: "Individual", business: "Business", enterprise: "Enterprise" },
  claude: { free: "Free", pro: "Pro", max: "Max", team: "Team", enterprise: "Enterprise", api_direct: "API Direct" },
  chatgpt: { free: "Free", plus: "Plus", team: "Team", enterprise: "Enterprise", api_direct: "API Direct" },
  anthropic_api: { api_direct: "API Direct" },
  openai_api: { api_direct: "API Direct" },
  gemini: { free: "Free", pro: "Pro (Google One AI Premium)", ultra: "Ultra / Workspace AI", api_direct: "API Direct" },
  windsurf: { free: "Free", pro: "Pro", team: "Team", enterprise: "Enterprise" },
};
