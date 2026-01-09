import { NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/server/session";

export async function GET() {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ ok: false, error: "Não logado." }, { status: 401 });
    }

    // Mantém simples por enquanto (dias/xp você já calcula em outro lugar ou deixa fixo até integrar)
    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        nickname: user.nickname,
        avatar_json: user.avatar_json ?? {},
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Erro inesperado.", debug: String(e?.message || e) },
      { status: 500 }
    );
  }
}
