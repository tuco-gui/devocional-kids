"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getChallengeByDate } from "@/lib/challenges";
import {
  getChallengeData,
  setChallengeDone,
  setChallengePhoto,
  setChallengeText,
} from "@/lib/challengeStore";

async function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ""));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export default function ChallengeClient({ dateISO }: { dateISO: string }) {
  const router = useRouter();

  const challenge = useMemo(() => getChallengeByDate(dateISO), [dateISO]);
  const [data, setData] = useState(() => ({
    done: false,
    photoDataUrl: "",
    textAnswer: "",
  }));

  useEffect(() => {
    const d = getChallengeData(dateISO);
    setData({
      done: !!d.done,
      photoDataUrl: d.photoDataUrl ?? "",
      textAnswer: d.textAnswer ?? "",
    });
  }, [dateISO]);

  function toggleDone() {
    const next = !data.done;
    setData((p) => ({ ...p, done: next }));
    setChallengeDone(dateISO, next);
  }

  async function onPickPhoto(file: File | null) {
    if (!file) return;
    const url = await readFileAsDataURL(file);
    setData((p) => ({ ...p, photoDataUrl: url }));
    setChallengePhoto(dateISO, url);
  }

  function saveText() {
    setChallengeText(dateISO, data.textAnswer);
  }

  const typeLabel =
    challenge.type === "acao"
      ? "🤝 Ação"
      : challenge.type === "criativo"
      ? "🎨 Criativo"
      : challenge.type === "leitura"
      ? "📖 Leitura"
      : "💭 Reflexão";

  return (
    <main className="mx-auto max-w-2xl p-4 sm:p-6">
      <header className="flex items-center justify-between gap-3">
        <button
          onClick={() => router.back()}
          className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50"
        >
          ← Voltar
        </button>

        <Link
          href={`/dia/${dateISO}`}
          className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50"
        >
          Ver devocional
        </Link>
      </header>

      <section className="mt-4 rounded-3xl border bg-gradient-to-b from-amber-100 via-yellow-50 to-white p-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-600">{typeLabel}</p>
        <h1 className="mt-1 text-2xl font-extrabold">{challenge.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-800">
          {challenge.description}
        </p>

        <div className="mt-4 flex items-center justify-between rounded-2xl border bg-white p-3">
          <div>
            <p className="text-xs text-gray-600">Pontos</p>
            <p className="text-lg font-extrabold">{challenge.points} XP</p>
          </div>

          <button
            onClick={toggleDone}
            className={[
              "rounded-xl px-3 py-2 text-sm font-semibold border transition active:scale-95",
              data.done
                ? "bg-emerald-500 text-white border-emerald-600"
                : "bg-white hover:bg-gray-50",
            ].join(" ")}
          >
            {data.done ? "Feito ✓" : "Marcar como feito"}
          </button>
        </div>

        {challenge.cta === "anexar_foto" ? (
          <div className="mt-4 rounded-2xl border bg-white p-4">
            <p className="text-sm font-semibold">Anexar foto</p>
            <p className="mt-1 text-xs text-gray-600">
              Tire uma foto do que você fez e envie aqui.
            </p>
            <input
              className="mt-3 w-full"
              type="file"
              accept="image/*"
              onChange={(e) => onPickPhoto(e.target.files?.[0] ?? null)}
            />
            {data.photoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.photoDataUrl}
                alt="Foto do desafio"
                className="mt-3 w-full rounded-2xl border bg-white"
              />
            ) : null}
          </div>
        ) : null}

        {challenge.cta === "escrever" ? (
          <div className="mt-4 rounded-2xl border bg-white p-4">
            <p className="text-sm font-semibold">Escrever resposta</p>
            <textarea
              className="mt-3 h-32 w-full rounded-xl border p-3 text-sm"
              placeholder="Escreva aqui..."
              value={data.textAnswer}
              onChange={(e) =>
                setData((p) => ({ ...p, textAnswer: e.target.value }))
              }
            />
            <button
              onClick={saveText}
              className="mt-3 w-full rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Salvar resposta
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
