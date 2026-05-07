import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "@/lib/audit";
import { saveAudit } from "@/lib/store";
import { generateSummary } from "@/lib/ai";
import { AuditInput } from "@/lib/types";

// Rate limiting (simple in-memory; replace with Redis in prod)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 10; // per hour per IP
const HOUR = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const hits = (rateLimitMap.get(ip) || []).filter((t) => now - t < HOUR);
  if (hits.length >= RATE_LIMIT) return false;
  rateLimitMap.set(ip, [...hits, now]);
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  // Honeypot check
  let body: AuditInput & { _hp?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body._hp) {
    // Honeypot triggered — silently ignore
    return NextResponse.json({ id: "fake" }, { status: 200 });
  }

  if (!body.tools || !Array.isArray(body.tools) || body.tools.length === 0) {
    return NextResponse.json({ error: "No tools provided" }, { status: 400 });
  }

  const result = runAudit(body);

  // AI summary (non-blocking; graceful fallback)
  result.summary = await generateSummary(result);

  saveAudit(result);

  return NextResponse.json({ id: result.id }, { status: 200 });
}
