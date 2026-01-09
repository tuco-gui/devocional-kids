"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type MeUser = {
  id: string;
  nickname: string;
  avatar_json?: any;
};

export default function EditarPerfilPage() {
  const router = useRouter();
  const [me, setMe] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadMe() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const j = await res.json();
      if (!res.ok || !j?.ok) {
        router.push("/login");
        return;
      }
      setMe(j.user);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-xl p-6">
        <div className="rounded-2xl border bg-white p-6">
          <div className="text-lg font-semibold">Editar perfil</div>
          <div className="mt-2 text-sm text-gray-600">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <div className="rounded-2xl border bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Editar perfil</div>
            <div className="mt-1 text-xs text-gray-500">
              Avatar e foto (foto: em breve via Supabase Storage).
            </div>
          </div>

          <button
            onClick={logout}
            className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            Sair
          </button>
        </div>

        <div className="mt-6 rounded-2xl border p-5">
          <div className="text-sm font-semibold">Avatar</div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="h-20 w-20 overflow-hidden rounded-full border bg-white">
              {/* Preview simples: se vier SVG/base64 no futuro, troca aqui.
                  Por enquanto só mostra um placeholder limpo (sem emoji). */}
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                avatar
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => router.push("/perfil/avatar")}
                className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                Editar avatar
              </button>

              <button
                onClick={() => alert("Upload de foto: a gente liga isso em seguida (Supabase Storage).")}
                className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                Carregar foto
              </button>

              <button
                onClick={() => router.back()}
                className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
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
