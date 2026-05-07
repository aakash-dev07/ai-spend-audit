# ARCHITECTURE.md

## System Diagram

```mermaid
graph TD
    A[User lands on /] -->|clicks audit| B[/audit — Spend Input Form]
    B -->|POST /api/audit| C[Audit Engine]
    C --> D[Rules Engine<br/>audit.ts]
    C --> E[Anthropic API<br/>claude-haiku]
    D --> F[AuditResult]
    E -->|summary text| F
    F --> G[In-memory store<br/>store.ts]
    G -->|id| H[redirect /results/:id]
    H -->|GET /api/audit/:id| I[Results Page]
    I -->|email submitted| J[POST /api/lead]
    J --> K[Lead store<br/>→ Supabase in prod]
```

## Data Flow

1. **User fills form** (`/audit`) — tool, plan, seats, monthly spend, team size, use case. State persisted to `localStorage` across reloads.
2. **POST `/api/audit`** — rate-limit check (10 req/hr/IP, in-memory). Honeypot field checked. `runAudit()` called synchronously (pure functions, fast). Anthropic API called for a ~100-word summary (async; falls back to template on failure/timeout). Result stored in memory map keyed by `nanoid(10)`.
3. **Redirect to `/results/:id`** — client fetches `GET /api/audit/:id`. Results rendered. OG meta tags are served by Next.js `generateMetadata` for proper social previews.
4. **Lead capture** — `POST /api/lead` stores {email, auditId, company, role}. In production, this triggers a Resend transactional email and writes to Supabase.

## Why this stack

| Choice | Reason |
|---|---|
| **Next.js 14 (App Router)** | SSR for OG tags per audit ID; API routes co-located; Vercel deploy in <2 min |
| **TypeScript** | Audit engine has complex branching logic — types prevent silent failures in plan/savings calculations |
| **CSS Modules** | Zero runtime overhead vs styled-components; no purge config needed; scoping prevents conflicts |
| **In-memory store** | Removes DB setup from the critical path for MVP; swap is isolated to `store.ts` |
| **No UI library** | Forced distinctive design; no fighting component defaults; Lighthouse score easier to control |

## What I'd change for 10k audits/day

1. **Replace in-memory store with Supabase** (`store.ts` is the only file to change). Add a `audits` table with `id TEXT PK, result JSONB, created_at TIMESTAMPTZ`.
2. **Redis rate limiting** (Upstash) — in-memory rate limit doesn't work across serverless instances.
3. **Queue AI summary generation** — move Anthropic API call to a background job (Inngest / QStash). Return audit result immediately, poll for summary.
4. **CDN cache `/api/audit/:id`** — audit results are immutable once created. Add `Cache-Control: public, max-age=86400` header.
5. **Add Cloudflare WAF** in front of lead capture endpoint.
