import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

function getToken(cookieHeader: string | null) {
  if (!cookieHeader) return null;
  const m = cookieHeader.match(/(?:^|;\s*)dk_session=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  const token = getToken(cookieHeader);

  let sess: any = null;
  let sessErr: any = null;

  if (token) {
    const r = await supabaseAdmin
      .from("sessions")
      .select("token, user_id, expires_at")
      .eq("token", token)
      .maybeSingle();
    sess = r.data;
    sessErr = r.error ? { message: r.error.message } : null;
  }

  return NextResponse.json({
    ok: true,
    cookieHeaderPreview: cookieHeader ? cookieHeader.slice(0, 120) : null,
    tokenPreview: token ? token.slice(0, 12) + "..." : null,
    sessionFound: !!sess,
    session: sess,
    sessionError: sessErr,
  });
}
