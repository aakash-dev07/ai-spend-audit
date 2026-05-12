# DEVLOG.md

## Day 1 — 2026-05-06
**Hours worked:** 3

**What I did:** Read the assignment brief in full twice. Sketched the data model on paper — `AuditInput`, `ToolEntry`, `AuditResult`. Set up Next.js with TypeScript and CSS Modules. Created `types.ts` with all pricing constants and the `PRICING_DATA` map. Got the landing page layout to a first draft.

**What I learned:** Next.js App Router metadata API handles OG tags cleanly without a custom `_document.tsx` — `generateMetadata` per route is the right pattern.

**Blockers / what I'm stuck on:** Unsure whether to use a real DB on day 1 or defer it. Leaning toward in-memory for now to stay unblocked.

**Plan for tomorrow:** Build the audit rules engine fully with unit tests before touching the UI.

---

## Day 2 — 2026-05-07
**Hours worked:** 4

**What I did:** Built `audit.ts` — all 8 tool-specific audit functions. Wrote 8 Jest unit tests covering the happy path, edge cases (1-seat Enterprise, API spend thresholds), and the router. All green. Started the audit form UI.

**What I learned:** The Claude Team plan has a minimum 5-seat requirement I almost missed — caught it while verifying against the official pricing page. Matters for the downgrade logic.

**Blockers / what I'm stuck on:** The form with dynamic tool rows and `localStorage` persistence is fiddlier than expected in Next.js App Router with `"use client"`.

**Plan for tomorrow:** Finish form, wire up the `/api/audit` route, and get the happy path working end-to-end.

---

## Day 3 — 2026-05-08
**Hours worked:** 5

**What I did:** Completed the form with persistence. Built `/api/audit` route with rate limiting and honeypot. Wired up `nanoid` for audit IDs. Got end-to-end flow working: form → API → store → redirect to results. Results page renders per-tool breakdown and savings hero.

**What I learned:** `useParams` in Next.js App Router returns a `ReadonlyURLSearchParams` — needed to cast correctly for the `id` param.

**Blockers / what I'm stuck on:** Anthropic API integration — need to handle timeouts and fallback gracefully without blocking the main audit response.

**Plan for tomorrow:** AI summary with fallback, lead capture form, share URL.

---

## Day 4 — 2026-05-09
**Hours worked:** 4

**What I did:** Built `ai.ts` with the Anthropic claude-haiku call and template fallback. Added lead capture API route and the email form on the results page with honeypot. Share URL copy button. Did 2 of the 3 required user interviews (cold DMs on X).

**What I learned:** Wrapping the Anthropic call in a try/catch with a non-awaited Promise timeout is cleaner than AbortController for short timeouts in Next.js API routes.

**Blockers / what I'm stuck on:** Third interview subject hasn't replied. Will try Indie Hackers Slack tomorrow.

**Plan for tomorrow:** Polish UI, write GTM/ECONOMICS/LANDING_COPY, finish user interviews.

---

## Day 5 — 2026-05-10
**Hours worked:** 3

**What I did:** Got third user interview done (Indie Hackers Slack). Wrote GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md. Polished the results page — added Credex CTA card for >$500 savings case and "you're spending well" for optimal case. Added OG tags.

**What I learned:** The user interviews surfaced that founders don't think in "AI tool spend" as a category — they think about it per product. The audit needs to meet them there, not ask them to categorize upfront.

**Blockers / what I'm stuck on:** Lighthouse accessibility score at 87 — need to fix label/input associations and color contrast on muted text.

**Plan for tomorrow:** Accessibility fixes, PRICING_DATA.md, PROMPTS.md, TESTS.md, CI setup.

---

## Day 6 — 2026-05-11
**Hours worked:** 4

**What I did:** Fixed accessibility — all inputs now have proper `htmlFor`/`id` pairs, contrast ratios checked. Wrote PRICING_DATA.md with all sources. Wrote PROMPTS.md. Set up GitHub Actions CI with lint + test. Lighthouse scores now 91/93/91.

**What I learned:** GitHub Actions `ubuntu-latest` runner needs `--passWithNoTests` removed when you have actual tests — otherwise it silently passes on import errors.

**Blockers / what I'm stuck on:** None major.

**Plan for tomorrow:** Final review pass, REFLECTION.md, deploy to Vercel, submit.

---

## Day 7 — 2026-05-12
**Hours worked:** 3

**What I did:** Final code review — cleaned up TODOs, added JSDoc comments to audit functions, double-checked all 5 REFLECTION questions. Deployed to Vercel. Verified live URL. Tested the full end-to-end flow on mobile. Submitted Google Form.

**What I learned:** Vercel environment variable names are case-sensitive in ways that local `.env.local` hides — `ANTHROPIC_API_KEY` must match exactly.

**Blockers / what I'm stuck on:** None.


