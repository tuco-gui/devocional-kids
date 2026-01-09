"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type MeResponse =
  | { ok: true; user: { id: string; nickname: string; avatar_json: any } }
  | { ok: false; error: string };

function dicebearUrl(avatarJson: any) {
  // Avataaars (Dicebear v7). Se avatar_json estiver vazio, usa um padrão.
  const base = "https://api.dicebear.com/7.x/avataaars/svg";
  const seed = String(avatarJson?.seed || "devocional-kids");
  const params = new URLSearchParams();
  params.set("seed", seed);

  // Opcional: respeita algumas props se existirem
  if (avatarJson?.style) params.set("style", avatarJson.style);
  if (avatarJson?.top) params.set("top", avatarJson.top);
  if (avatarJson?.hairColor) params.set("hairColor", avatarJson.hairColor);
  if (avatarJson?.skinColor) params.set("skinColor", avatarJson.skinColor);
  if (avatarJson?.eyes) params.set("eyes", avatarJson.eyes);
  if (avatarJson?.mouth) params.set("mouth", avatarJson.mouth);
  if (avatarJson?.accessories) params.set("accessories", avatarJson.accessories);
  if (avatarJson?.clothing) params.set("clothing", avatarJson.clothing);
  if (avatarJson?.clothesColor) params.set("clothesColor", avatarJson.clothesColor);
  if (avatarJson?.backgroundColor) params.set("backgroundColor", avatarJson.backgroundColor);

  return `${base}?${params.toString()}`;
}

function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Fechar" />
      <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white p-4 shadow-xl">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-gray-300" />
        <div className="mb-3 text-center text-sm font-semibold text-gray-700">{title}</div>
        <div className="space-y-2">{children}</div>
      </div>
    </div>
  );
}

export default function PerfilPage() {
  const router = useRouter();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [openAvatarMenu, setOpenAvatarMenu] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

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

  const nickname = me && me.ok ? me.user.nickname : "";

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* topo */}
      <div className="relative bg-gradient-to-b from-[#ff4b6e] to-[#ff6b7f] px-6 pb-10 pt-10 text-white">
        <button
          onClick={() => setOpenSettings(true)}
          className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 hover:bg-white/25"
          aria-label="Configurações"
          title="Configurações"
        >
          ⚙️
        </button>

        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3">
          <div className="text-2xl font-extrabold">{nickname}</div>
          <div className="text-xs opacity-90">@{nickname}</div>

          {/* avatar clicável */}
          <button
            onClick={() => setOpenAvatarMenu(true)}
            className="mt-3 h-28 w-28 overflow-hidden rounded-full border-4 border-white/60 bg-white shadow-lg"
            aria-label="Abrir opções do avatar"
            title="Avatar"
          >
            {avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarSrc} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl">🙂</div>
            )}
          </button>

          {/* stats */}
          <div className="mt-4 flex w-full max-w-3xl gap-4">
            <div className="flex-1 rounded-2xl bg-white/15 p-4 text-left backdrop-blur">
              <div className="text-xs opacity-90">Dias</div>
              <div className="text-2xl font-extrabold">2</div>
            </div>
            <div className="flex-1 rounded-2xl bg-white/15 p-4 text-left backdrop-blur">
              <div className="text-xs opacity-90">XP</div>
              <div className="text-2xl font-extrabold">120</div>
            </div>
          </div>
        </div>
      </div>

      {/* corpo */}
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="text-lg font-bold">Visão geral</div>
          <div className="mt-1 text-sm text-gray-600">
            Aqui a gente vai colocar medalhas, conquistas, amigos e ranking (estilo Duolingo).
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => router.push("/")}
              className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              Voltar pra trilha
            </button>

            <button
              onClick={() => router.push("/perfil/editar")}
              className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              Editar perfil
            </button>
          </div>
        </div>
      </div>

      {/* sheet: avatar */}
      <Sheet open={openAvatarMenu} onClose={() => setOpenAvatarMenu(false)} title="Avatar">
        <button
          className="w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold hover:bg-gray-50"
          onClick={() => {
            setOpenAvatarMenu(false);
            router.push("/perfil/editar#avatar");
          }}
        >
          Editar avatar
        </button>

        <button
          className="w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold hover:bg-gray-50"
          onClick={() => {
            setOpenAvatarMenu(false);
            alert("Upload de foto: a gente liga isso em seguida (Supabase Storage).");
          }}
        >
          Carregar foto
        </button>

        <button
          className="w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
          onClick={logout}
        >
          Sair
        </button>
      </Sheet>

      {/* sheet: configs */}
      <Sheet open={openSettings} onClose={() => setOpenSettings(false)} title="Configurações">
        <button
          className="w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold hover:bg-gray-50"
          onClick={() => {
            setOpenSettings(false);
            router.push("/perfil/editar");
          }}
        >
          Perfil
        </button>

        <button
          className="w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold hover:bg-gray-50"
          onClick={() => {
            setOpenSettings(false);
            alert("Preferências (em breve).");
          }}
        >
          Preferências
        </button>

        <button
          className="w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold hover:bg-gray-50"
          onClick={() => {
            setOpenSettings(false);
            alert("Notificações (em breve).");
          }}
        >
          Notificações
        </button>

        <div className="pt-2" />

        <button
          className="w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
          onClick={logout}
        >
          Sair
        </button>
      </Sheet>
    </div>
  );
}
