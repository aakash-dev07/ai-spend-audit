import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendLens — AI Spend Audit",
  description: "Find out where your team is overpaying for AI tools. Free instant audit.",
  openGraph: {
    title: "SpendLens — AI Spend Audit",
    description: "Find out where your team is overpaying for AI tools. Free instant audit.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendLens — AI Spend Audit",
    description: "Free AI spend audit for startups.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=IBM+Plex+Mono:ital,wght@0,400;0,500;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
