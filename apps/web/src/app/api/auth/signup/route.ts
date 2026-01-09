import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import {
  hashPassword,
  newSessionToken,
  setSessionCookie,
  validateNickname,
  validatePassword,
} from "@/lib/server/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const nickname = String(body.nickname || "").trim();
    const password = String(body.password || "");

    const nickErr = validateNickname(nickname);
    if (nickErr) return NextResponse.json({ ok: false, error: nickErr }, { status: 400 });

    const pwErr = validatePassword(password);
    if (pwErr) return NextResponse.json({ ok: false, error: pwErr }, { status: 400 });

    const passwordHash = await hashPassword(password);

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .insert({
        nickname,
        pin_hash: passwordHash, // legado
        avatar_json: {},
      })
      .select("id, nickname")
      .single();

    if (error) {
      const msg = String(error.message || "");
      if (msg.toLowerCase().includes("duplicate")) {
        return NextResponse.json({ ok: false, error: "Esse nickname já existe." }, { status: 409 });
      }
      return NextResponse.json({ ok: false, error: "Erro ao criar usuário.", debug: msg }, { status: 500 });
    }

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

    const res = NextResponse.json({ ok: true, user });
    setSessionCookie(res, token, 30);
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Requisição inválida.", debug: String(e?.message || e) },
      { status: 400 }
    );
  }
}
