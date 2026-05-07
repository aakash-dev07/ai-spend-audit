import { NextRequest, NextResponse } from "next/server";

// In production, store in Supabase/Firebase and send via Resend
const leads: { email: string; auditId: string; company?: string; role?: string; createdAt: string }[] = [];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, auditId, company, role, _hp } = body;

  if (_hp) return NextResponse.json({ ok: true }); // honeypot
  if (!email || !email.includes("@")) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  leads.push({ email, auditId, company, role, createdAt: new Date().toISOString() });

  // TODO: send via Resend/Postmark
  // await sendEmail({ to: email, subject: "Your SpendLens Audit", ... })

  return NextResponse.json({ ok: true });
}
