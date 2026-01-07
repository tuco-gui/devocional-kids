"use client";

import { mockDevotional } from "@/lib/mockDevotional";

export default function Home() {
  const devotional = mockDevotional;

  return (
    <main className="mx-auto max-w-2xl p-6">
      <header className="flex items-start justify-between gap-4">
        {/* Data (esquerda) */}
        <div>
          <p className="text-sm text-gray-600">Devocional do dia</p>
          <h1 className="text-2xl font-bold">{devotional.dateLabel}</h1>
          <p className="text-sm text-gray-600">2026</p>
        </div>

        {/* Leitura bíblica (direita) */}
        <div className="text-right">
          <p className="text-sm text-gray-600">Leitura bíblica</p>
          <p className="text-lg font-semibold">{devotional.bibleReadingRef}</p>
        </div>
      </header>

      {/* Card principal */}
      <section className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        {/* Título */}
        <h2 className="text-xl font-semibold">{devotional.title}</h2>

        {/* Slots de imagem (placeholder) */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-gray-50 p-3">
            <p className="text-xs text-gray-600">Imagem do personagem (placeholder)</p>
            <p className="mt-1 text-sm font-semibold">{devotional.character.name}</p>
            <p className="text-xs text-gray-600">{devotional.character.description}</p>
          </div>

          <div className="rounded-xl border bg-gray-50 p-3 text-right">
            <p className="text-xs text-gray-600">Mascote do dia (placeholder)</p>
            <p className="mt-1 text-sm font-semibold">{devotional.mascot.name}</p>
          </div>
        </div>

        {/* Recap opcional */}
        {devotional.recap ? (
          <div className="mt-4 rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-semibold">Relembrando</p>
            <p className="mt-1 text-sm">{devotional.recap}</p>
          </div>
        ) : null}

        {/* Historinha (maior) */}
        <h3 className="mt-6 font-semibold">A historinha de hoje</h3>
        <p className="mt-2 whitespace-pre-line leading-relaxed">{devotional.storyText}</p>

        {/* Vamos conversar */}
        <h3 className="mt-6 font-semibold">Vamos conversar?</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {devotional.talkAbout.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>

        {/* Oração */}
        <h3 className="mt-6 font-semibold">Oração</h3>
        <p className="mt-2">{devotional.prayer}</p>

        {/* Atividade */}
        <h3 className="mt-6 font-semibold">Atividade</h3>
        <p className="mt-2">{devotional.activity}</p>
      </section>
    </main>
  );
}
