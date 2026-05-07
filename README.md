# SpendLens — AI Spend Audit

SpendLens is a free tool for startup founders and engineering managers to audit their team's AI tool spend in under 2 minutes. It identifies over-provisioned plans, wrong-tier subscriptions, and switching opportunities — giving an instant monthly + annual savings estimate with defensible, per-tool reasoning.

Built as the Round 1 submission for Credex's Web Dev Intern assignment.

---

## Screenshots

> _Add 3+ screenshots or a Loom/YouTube 30-second recording here._
> Example: `![Audit Form](./docs/screenshot-form.png)`

---

## Quick start

### Prerequisites
- Node.js 18+
- npm or yarn

### Install & run locally

```bash
git clone https://github.com/YOUR_USERNAME/ai-spend-audit
cd ai-spend-audit
npm install
cp .env.example .env.local  # add ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Set `ANTHROPIC_API_KEY` in Vercel environment variables.

### Run tests

```bash
npm test
```

### Run lint

```bash
npm run lint
```

---

## Deployed URL

> https://your-deployment.vercel.app _(replace after deploy)_

---

## Decisions

1. **Next.js App Router over plain React SPA** — SSR gives us dynamic OG meta tags per audit ID for proper social sharing. A SPA would require a meta-tag injection hack that breaks crawlers.

2. **In-memory store instead of a DB for MVP** — Supabase requires 5-min setup and an account; in-memory lets the audit engine and share URLs work end-to-end immediately. Swap in 1 file (`src/lib/store.ts`). Documented in ARCHITECTURE.md.

3. **Hardcoded rules for audit logic, LLM only for summary** — LLM output for financial recommendations is non-deterministic and hard to test. A rules engine produces auditable, citeable reasoning a CFO can verify. The LLM adds personality on top, not correctness.

4. **IBM Plex Mono + Syne over common sans-serif** — Monospace signals technical credibility to the engineer audience. Syne is used for headings only, keeping the data-dense content scannable without sacrificing brand identity.

5. **Email captured after results, not before** — "Email wall before value" kills conversion on tools like this. Showing savings first means users have a reason to give their email. This is validated by every major PLG study.
