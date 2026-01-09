import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const store = await cookies();
  const all = store.getAll().map(c => ({ name: c.name, valuePreview: (c.value || "").slice(0, 12) + "..." }));
  return NextResponse.json({ ok: true, cookies: all });
}
