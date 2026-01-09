"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Estrutura do avatar_json (simples e controlada).
 * Você pode expandir depois com mais opções (olhos, cabelo, etc).
 */
type AvatarJson = {
  style?: "bottts" | "adventurer" | "thumbs";
  seed?: string;
  bg?: string;
};

type MeUser = {
  id: string;
  nickname: string;
  avatar_json?: AvatarJson;
};

function randomSeed() {
  return Math.random().toString(36).slice(2, 10);
}

export default function AvatarEditorPage() {
  const router = useRouter();
  const [me, setMe] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [style, setStyle] = useState<AvatarJson["style"]>("adventurer");
  const [seed, setSeed] = useState<string>(randomSeed());
  const [bg, setBg] = useState<string>("#ffffff");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function loadMe() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const j = await res.json();
      if (!res.ok || !j?.ok) {
        router.push("/login");
        return;
      }

      const user: MeUser = j.user;
      setMe(user);

      const a = (user.avatar_json || {}) as AvatarJson;
      setStyle(a.style || "adventurer");
      setSeed(a.seed || randomSeed());
      setBg(a.bg || "#ffffff");
    } catch (e: any) {
      setErr("Erro ao carregar usuário.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const avatarUrl = useMemo(() => {
    // DiceBear HTTP API (sem instalar lib). Funciona bem e rápido.
    // Se você preferir 100% local depois, aí sim trocamos pra @dicebear/core.
    const s = encodeURIComponent(seed || "kids");
    const b = encodeURIComponent(bg.replace("#", ""));
    const st = style || "adventurer";
    return `https://api.dicebear.com/7.x/${st}/svg?seed=${s}&backgroundColor=${b}`;
  }, [seed, style, bg]);

  async function save() {
    setSaving(true);
    setErr(null);

    const avatar_json: AvatarJson = { style, seed, bg };

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ avatar_json }),
      });

      const j = await res.json().catch(() => ({}));

      if (!res.ok || !j?.ok) {
        setErr(j?.error || "Erro ao salvar avatar.");
        return;
      }

      router.push("/perfil");
    } catch (e: any) {
      setErr("Erro ao salvar avatar.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-xl p-6">
        <div className="rounded-2xl border bg-white p-6">
          <div className="text-lg font-semibold">Editar avatar</div>
          <div className="mt-2 text-sm text-gray-600">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <div className="rounded-2xl border bg-white p-6">
        <div className="text-lg font-semibold">Editar avatar</div>
        <div className="mt-1 text-xs text-gray-500">
          Clique em salvar para aplicar no seu perfil.
        </div>

        <div className="mt-6 rounded-2xl border p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div
              className="h-24 w-24 overflow-hidden rounded-full border"
              style={{ background: bg }}
              title={me?.nickname || ""}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatarUrl} alt="avatar" className="h-full w-full" />
            </div>

            <div className="flex flex-1 flex-col gap-3">
              <label className="text-sm">
                <div className="mb-1 font-semibold">Estilo</div>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as any)}
                  className="w-full rounded-xl border px-3 py-2 text-sm"
                >
                  <option value="adventurer">Kids (adventurer)</option>
                  <option value="bottts">Robô (bottts)</option>
                  <option value="thumbs">Cartoon (thumbs)</option>
                </select>
              </label>

              <label className="text-sm">
                <div className="mb-1 font-semibold">Seed (variação)</div>
                <div className="flex gap-2">
                  <input
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2 text-sm"
                    placeholder="ex: maria_helena"
                  />
                  <button
                    type="button"
                    onClick={() => setSeed(randomSeed())}
                    className="rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-gray-50"
                    title="Gerar outra variação"
                  >
                    Trocar
                  </button>
                </div>
              </label>

              <label className="text-sm">
                <div className="mb-1 font-semibold">Fundo</div>
                <input
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="h-10 w-24 rounded border p-1"
                />
              </label>
            </div>
          </div>

          {err && (
            <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          )}

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={save}
              disabled={saving}
              className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>

            <button
              onClick={() => router.push("/perfil/editar")}
              className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              Voltar
            </button>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            Obs: não tem “sortear” e não tem “debug”. Trocar só gera outra variação controlada.
          </div>
        </div>
      </div>
    </div>
  );
}
