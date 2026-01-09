import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("dk_session")?.value;

  if (!token) {
    return NextResponse.json({ ok: false, error: "Não logado." }, { status: 401 });
  }

  const nowIso = new Date().toISOString();

  const { data: sess } = await supabaseAdmin
    .from("sessions")
    .select("user_id, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (!sess || (sess.expires_at && String(sess.expires_at) < nowIso)) {
    return NextResponse.json({ ok: false, error: "Não logado." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Requisição inválida." }, { status: 400 });

  const display_name = typeof body.display_name === "string" ? body.display_name.trim() : undefined;
  const avatar_json = typeof body.avatar_json === "object" && body.avatar_json ? body.avatar_json : undefined;

  const patch: any = {};
  if (display_name !== undefined) patch.display_name = display_name;
  if (avatar_json !== undefined) patch.avatar_json = avatar_json;

  const { error } = await supabaseAdmin.from("users").update(patch).eq("id", sess.user_id);
  if (error) {
    return NextResponse.json({ ok: false, error: "Erro ao salvar perfil.", debug: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
