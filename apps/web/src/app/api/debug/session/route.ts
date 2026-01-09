import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("dk_session")?.value ?? null;

  let found = false;
  if (token) {
    const { data } = await supabaseAdmin
      .from("sessions")
      .select("token, user_id, expires_at")
      .eq("token", token)
      .maybeSingle();
    found = !!data;
  }

  return NextResponse.json({
    ok: true,
    tokenPreview: token ? token.slice(0, 12) + "..." : null,
    sessionFound: found,
  });
}
