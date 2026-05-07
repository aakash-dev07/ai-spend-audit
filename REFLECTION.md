# REFLECTION.md

## 1. Hardest bug

The hardest bug was a silent failure in the results page where the audit would load correctly on the first visit but return `404` on any page refresh. The symptoms: `GET /api/audit/:id` returned 404 after a hard refresh, but the in-memory store clearly had the record when the server started.

My first hypothesis was a Next.js App Router caching issue — the route handler was being cached before the store was populated. I added `export const dynamic = 'force-dynamic'` to the route, which changed nothing.

Second hypothesis: the `Map` instance in `store.ts` was being re-created on each serverless invocation. This turned out to be correct. In development, Next.js runs as a persistent Node process so the Map survives across requests. In production (and in `next build` preview), each API route invocation can spin up a fresh module context — clearing the Map.

The fix: I moved the Map into a module-level singleton guarded by `globalThis` (a common Next.js pattern for dev/prod consistency), and added a clear comment that in production this must be replaced with Supabase. The bug taught me that "it works in dev" is not sufficient for stateful in-process storage in serverless environments.

## 2. A decision I reversed

My original design captured email before showing results — a soft gate. My reasoning was that lead quality would be higher if users committed before seeing the audit.

I reversed this on Day 4 after the second user interview. The interviewee (a CTO at a 12-person Series A) said: "I would close this tab immediately if you asked for my email before showing me anything. I've been burned by tools that promise insight and deliver a sales pitch."

The second reason was conversion math. An email-gated tool that 60% of visitors abandon before seeing results has a lower lead count than a tool where 80% complete the audit and 30% of those give their email. 80% × 30% = 24% conversion > 40% × 60% = 24% — it's a wash at best, and worse for brand perception.

I moved email capture to after the results page, with the framing "email me this report." Conversion to the email form is now predicated on the user having seen value, which means the leads who convert are more likely to take a consultation call.

## 3. What I'd build in week 2

Week 2 priority: a real persistence layer and the embeddable widget.

The persistence layer (Supabase) is a prerequisite for the benchmark feature — "your AI spend per developer is $X, companies your size average $Y." Without historical audit data, the benchmark is made up. With 500 audits, you can run a real median. The table schema is simple (`id, result JSONB, team_size INT, use_case TEXT, total_monthly_spend NUMERIC, created_at TIMESTAMPTZ`) and the query is a window function.

The embeddable widget is the distribution mechanism I'm most excited about. A `<script>` tag that bloggers and SaaS newsletters can drop in, triggering a modal audit flow, means SpendLens can appear in context — an article about AI tool costs embeds the audit widget inline. This is a distribution channel most tools don't have.

## 4. How I used AI tools

I used Claude (claude.ai) and GitHub Copilot throughout the week.

**Claude** was most useful for: drafting the GTM.md and ECONOMICS.md structure (I wrote the actual numbers and reasoning, Claude helped organize the narrative), generating the first draft of CSS that I then edited heavily, and debugging the serverless singleton issue (I described the symptom and it suggested globalThis immediately).

**Copilot** handled: boilerplate (API route handlers, CSS module stubs), TypeScript type completions, and test scaffolding.

**What I didn't trust them with:** The audit logic itself. The per-tool savings calculations and the reasoning text are entirely hand-written. An LLM generating "Cursor Business at 3 seats saves $X" would be non-deterministic and hard to audit against real pricing. The rules engine is readable, testable, and traceable to a specific pricing page URL.

**One time the AI was wrong:** When I asked Claude to suggest the rate-limit implementation, it suggested using `res.headers.get('x-real-ip')` as the IP source. In Next.js 14 App Router, the correct header is `x-forwarded-for` (Vercel sets this, not `x-real-ip`). My tests caught the issue because the rate limit was never triggering — the IP was always `null`. I verified against Next.js docs and corrected it.

## 5. Self-ratings

| Dimension | Rating | Reason |
|---|---|---|
| Discipline | 7/10 | Commits spread across 6 of 7 days; Day 1 was lighter than I'd have liked |
| Code quality | 7/10 | Audit engine is clean and well-typed; the results page component is longer than I'd keep in a real codebase |
| Design sense | 8/10 | The dark monospace aesthetic is intentional and distinctive; mobile layout needs more love |
| Problem-solving | 8/10 | Serverless singleton bug and the email-gate reversal were both solved through structured hypothesis testing |
| Entrepreneurial thinking | 7/10 | GTM and user interviews are real and specific; ECONOMICS.md math is rough but directionally honest |
