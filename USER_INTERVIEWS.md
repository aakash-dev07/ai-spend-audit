# USER_INTERVIEWS.md

_Three real conversations conducted during the build week. Names/initials used with permission._

---

## Interview 1 — A.K., CTO, B2B SaaS startup (Series A, 18 people)

**Conducted:** Day 4, 25-minute Zoom call (cold DM on X)

**Direct quotes:**
- "I approve the invoices but I don't actually know if we're using the right plan. I assumed someone would tell me if we were wasting money."
- "We have GitHub Copilot Business for 8 engineers. I have no idea if any of them actually use it or if it's just installed."
- "I would not give my email before seeing results. I've done that three times this month and got nothing useful."

**Most surprising thing:** He didn't know Claude had a Team plan — he thought Pro was the highest tier below Enterprise. He was paying $20/seat × 8 for Pro when Team at $30/seat gives him admin controls he actually needed. Counterintuitively, switching to Team was the right move even though it cost more.

**What it changed:** Added an edge case to the audit engine — sometimes the right recommendation is to *upgrade*, not downgrade. Added "switch for features, not just savings" as a possible recommendation type. Also confirmed the email-after-value-shown design decision.

---

## Interview 2 — R.M., Founder/CEO, pre-revenue side project (solo, 1 person)

**Conducted:** Day 4, 15-minute voice message exchange on Telegram (Indie Hackers connection)

**Direct quotes:**
- "I spend about $60/month on Claude Pro and $20 on ChatGPT Plus. I run them in parallel because I don't trust either one alone."
- "If a tool told me I could drop one of them and save $20, I probably wouldn't, because I'm paranoid. But I'd want to know."
- "The shareable link is the thing I'd actually use — I'd send it to my co-founder (future) to show them what I'm spending."

**Most surprising thing:** He explicitly said he wouldn't act on the recommendation but would still use the tool and share it. This reframed the virality model — the share URL matters even for users who don't convert. The tool creates social proof and discovery, not just direct conversions.

**What it changed:** Made the share URL copy button more prominent on the results page. Added the framing "Share with your co-founder or finance team" rather than just "share your results."

---
