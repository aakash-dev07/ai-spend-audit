# TESTS.md

## Running tests

```bash
npm test
```

All tests are in `audit.test.ts` at the repo root, covering `src/lib/audit.ts`.

---

## Test inventory

| File | Test name | What it covers | How to run |
|---|---|---|---|
| audit.test.ts | Cursor Business at 3 seats recommends downgrade to Pro | Downgrade logic: Business → Pro when seats ≤ 3 | `npm test` |
| audit.test.ts | Cursor Pro for coding team is marked optimal | Optimal case: no false positives for correct plan | `npm test` |
| audit.test.ts | GitHub Copilot Enterprise at 10 seats recommends downgrade to Business | Enterprise downgrade at small team size | `npm test` |
| audit.test.ts | Claude Max at 3 seats recommends downgrade to Team | Claude-specific: Max → Team saves $70/seat | `npm test` |
| audit.test.ts | Anthropic API spend over $500 surfaces savings recommendation | API usage threshold logic (high spend) | `npm test` |
| audit.test.ts | Anthropic API spend under $500 is optimal | API usage threshold logic (low spend — no false positive) | `npm test` |
| audit.test.ts | runAudit sums total monthly and annual savings | Integration: multi-tool totals computed correctly | `npm test` |
| audit.test.ts | runAudit skips incomplete tool entries | Input validation: empty/incomplete entries filtered | `npm test` |

---

## Coverage focus

All 8 tests cover the audit engine (`audit.ts`) specifically, as required. The engine is pure functions with no I/O dependencies — no mocking required. Tests run in ~200ms with `ts-jest`.
