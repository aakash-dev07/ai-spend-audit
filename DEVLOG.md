# DEVLOG.md

## Day 1 — 2026-05-06
**Hours worked:** 3

**What I did:** Read the assignment brief in full twice. Sketched the data model on paper — `AuditInput`, `ToolEntry`, `AuditResult`. Set up Next.js with TypeScript and CSS Modules. Created `types.ts` with all pricing constants and the `PRICING_DATA` map. Got the landing page layout to a first draft.

**What I learned:** Next.js App Router metadata API handles OG tags cleanly without a custom `_document.tsx` — `generateMetadata` per route is the right pattern.

**Blockers / what I'm stuck on:** Unsure whether to use a real DB on day 1 or defer it. Leaning toward in-memory for now to stay unblocked.

**Plan for tomorrow:** Build the audit rules engine fully with unit tests before touching the UI.

---

## Day 2 — 2026-05-07
**Hours worked:** 5

**What I did:** Built `audit.ts` — all 8 tool-specific audit functions. Wrote 8 Jest unit tests covering the happy path, edge cases (1-seat Enterprise, API spend thresholds), and the router. All green. Started the audit form UI.

**What I learned:** The Claude Team plan has a minimum 5-seat requirement I almost missed — caught it while verifying against the official pricing page. Matters for the downgrade logic.

**Blockers / what I'm stuck on:** The form with dynamic tool rows and `localStorage` persistence is fiddlier than expected in Next.js App Router with `"use client"`.

**Plan for tomorrow:** Finish form, wire up the `/api/audit` route, and get the happy path working end-to-end.

---
