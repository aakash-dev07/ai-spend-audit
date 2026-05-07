# METRICS.md

## North Star Metric

**Qualified consultation bookings per week.**

A "qualified" booking = user completed an audit showing ≥$200/month savings AND booked a Credex consultation call.

**Why this, not audit completions or email captures:**
- Audit completions measure top-of-funnel reach, not value
- Email captures measure intent but not action
- Consultation bookings are the closest leading indicator to revenue that the product can directly drive
- It separates the "interesting tool" users from the "we might actually buy" users

We don't use DAU/WAU because this is a tool used once a quarter per team, not daily.

---

## 3 Input Metrics

**1. Audit completion rate**
= Audits completed / Audit forms started

Target: ≥70%. If this drops below 60%, the form is too long or confusing. This is the biggest lever on volume.

**2. Email capture rate (post-audit)**
= Emails submitted / Audits completed

Target: ≥25%. If below 20%, the value shown isn't compelling enough or the ask is too aggressive. Segment by savings tier — users seeing $500+ savings should convert at 40%+.

**3. High-savings audit rate**
= Audits showing ≥$200/month savings / Total audits

Target: ≥40%. This measures whether the tool is reaching the right users (teams that are actually overspending). If this drops, our distribution is reaching the wrong audience (already-optimised teams).

---

## What I'd instrument first

1. Funnel events: `page_view`, `form_started`, `tool_added`, `audit_submitted`, `results_viewed`, `email_submitted`, `consultation_clicked`
2. Per-audit metadata: `total_savings`, `tool_count`, `use_case`, `team_size` (for segmentation)
3. Share URL click tracking: how many audits are opened via share link vs direct
4. Error rate on the Anthropic API fallback (measures reliability)

Implementation: PostHog (open source, self-hostable, GDPR-friendly) with a single `track()` call in each component. No third-party scripts on the initial page load.

---

## Pivot trigger

**If, after 500 audits:**

- High-savings audit rate < 20%: The pricing data is wrong or the target audience isn't reaching the tool. Pivot the distribution to higher-spend teams (50+ people) rather than solo founders.
- Email capture rate < 15%: The value proposition isn't landing. Run A/B test on the results page hero copy. If still below 15% after the test: reconsider the email-after-value model.
- 0 consultation bookings after 1,000 audits: The product-to-Credex handoff is broken. Fix the booking CTA placement before investing further in distribution.

The pivot decision is driven by the funnel, not vanity metrics. 10,000 audit completions with 0 consultation bookings is failure, not success.
