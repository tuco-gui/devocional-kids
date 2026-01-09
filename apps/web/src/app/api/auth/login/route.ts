import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { newSessionToken, setSessionCookie, verifyPassword } from "@/lib/server/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const nickname = String(body.nickname || "").trim();
    const password = String(body.password || "");

    if (!nickname || !password) {
      return NextResponse.json({ ok: false, error: "Informe nickname e senha." }, { status: 400 });
    }

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, nickname, pin_hash")
      .eq("nickname", nickname)
      .single();

    if (error || !user) {
      return NextResponse.json({ ok: false, error: "Nickname ou senha inválidos." }, { status: 401 });
    }

    const ok = await verifyPassword(password, user.pin_hash);
    if (!ok) return NextResponse.json({ ok: false, error: "Nickname ou senha inválidos." }, { status: 401 });

    const token = newSessionToken();
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();

    const { error: sErr } = await supabaseAdmin
      .from("sessions")
      .insert({ token, user_id: user.id, expires_at: expires });

    if (sErr) {
      return NextResponse.json(
        { ok: false, error: "Erro ao criar sessão.", debug: String(sErr.message || sErr) },
        { status: 500 }
      );
    }

    const res = NextResponse.json({ ok: true, user: { id: user.id, nickname: user.nickname } });
    setSessionCookie(res, token, 30);
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Requisição inválida.", debug: String(e?.message || e) },
      { status: 400 }
    );
  }
}
