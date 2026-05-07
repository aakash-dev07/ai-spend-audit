"use client";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Background glow */}
      <div className={styles.glow1} />
      <div className={styles.glow2} />

      <div className="container">
        {/* Nav */}
        <nav className={styles.nav}>
          <span className={styles.logo}>SpendLens</span>
          <span className="tag green">Free Tool</span>
        </nav>

        {/* Hero */}
        <section className={`${styles.hero} fade-up`}>
          <p className={`tag ${styles.kicker}`}>AI Spend Audit for Startups</p>
          <h1 className={styles.headline}>
            Stop paying retail<br />
            for AI you&apos;re<br />
            <em>barely using.</em>
          </h1>
          <p className={styles.sub}>
            Input your team&apos;s AI tools. Get an instant audit — what to downgrade,
            what to switch, and exactly how much you&apos;re leaving on the table every month.
          </p>
          <div className={styles.ctaRow}>
            <Link href="/audit" className={styles.ctaBtn}>
              Start Free Audit →
            </Link>
            <span className={styles.ctaNote}>No login required · takes 2 min</span>
          </div>
        </section>

        {/* Stats */}
        <section className={`${styles.stats} fade-up fade-up-2`}>
          {[
            { num: "$18K", label: "avg annual AI overspend per 10-person team" },
            { num: "73%", label: "of startups are on the wrong plan" },
            { num: "2 min", label: "to complete a full audit" },
          ].map((s) => (
            <div key={s.num} className={styles.stat}>
              <span className={styles.statNum}>{s.num}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section className={`${styles.howSection} fade-up fade-up-3`}>
          <p className={styles.sectionLabel}>// how it works</p>
          <div className={styles.steps}>
            {[
              { n: "01", t: "Input your stack", d: "Tell us which AI tools you pay for, which plan, and how many seats." },
              { n: "02", t: "Instant audit", d: "Our rules engine checks every tool against current pricing and your actual use case." },
              { n: "03", t: "See your savings", d: "Per-tool breakdown with exact reasoning. Monthly + annual savings, big and clear." },
              { n: "04", t: "Share or save", d: "Get a unique URL to share with your co-founder or finance team." },
            ].map((s) => (
              <div key={s.n} className={styles.step}>
                <span className={styles.stepNum}>{s.n}</span>
                <div>
                  <p className={styles.stepTitle}>{s.t}</p>
                  <p className={styles.stepDesc}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA bottom */}
        <section className={`${styles.ctaBottom} fade-up fade-up-4`}>
          <h2>Find out in 2 minutes.</h2>
          <Link href="/audit" className={styles.ctaBtn}>
            Run My Free Audit →
          </Link>
        </section>

        <footer className={styles.footer}>
          <span>SpendLens by <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer">Credex</a></span>
          <span className={styles.footerNote}>Pricing data verified weekly from official vendor pages.</span>
        </footer>
      </div>
    </main>
  );
}
