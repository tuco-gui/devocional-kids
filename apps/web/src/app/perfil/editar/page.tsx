"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type MeResponse =
  | { ok: true; user: { id: string; nickname: string; avatar_json: any } }
  | { ok: false; error: string };

function dicebearUrl(avatarJson: any) {
  const base = "https://api.dicebear.com/7.x/avataaars/svg";
  const seed = String(avatarJson?.seed || "devocional-kids");
  const params = new URLSearchParams();
  params.set("seed", seed);
  return `${base}?${params.toString()}`;
}

export default function EditarPerfilPage() {
  const router = useRouter();
  const [me, setMe] = useState<MeResponse | null>(null);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/auth/me", { cache: "no-store" });
      const j = (await r.json()) as MeResponse;
      setMe(j);
      if (!j.ok) router.replace("/login");
    })();
  }, [router]);

  const avatarSrc = useMemo(() => {
    if (!me || !me.ok) return "";
    return dicebearUrl(me.user.avatar_json);
  }, [me]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-extrabold">Editar perfil</div>
            <div className="text-sm text-gray-600">Avatar e foto (foto: em seguida com Storage).</div>
          </div>

          <button
            onClick={logout}
            className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            Sair
          </button>
        </div>

        <div id="avatar" className="mt-6 rounded-2xl border p-5">
          <div className="mb-3 text-sm font-bold">Avatar</div>

          <div className="flex flex-wrap items-center gap-5">
            <div className="h-24 w-24 overflow-hidden rounded-full border bg-white">
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarSrc} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl">🙂</div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                onClick={() => alert("Editor de avatar: vamos plugar aqui (o que já estava funcionando).")}
              >
                Editar avatar
              </button>

              <button
                className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                onClick={() => alert("Upload de foto: a gente liga isso em seguida (Supabase Storage).")}
              >
                Carregar foto
              </button>

              <button
                className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                onClick={() => router.back()}
              >
                Voltar
              </button>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            Obs: aqui não tem “sortear” e não tem “debug”. É pra ficar controlado e simples.
          </div>
        </div>
      </div>
    </div>
  );
}
