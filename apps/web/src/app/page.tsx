"use client";

import { useEffect, useMemo, useState } from "react";
import { mockDevotional } from "@/lib/mockDevotional";
import {
  dateToISO,
  daysInYear,
  isDone,
  loadDoneDates,
  saveDoneDates,
  toggleDone,
} from "@/lib/progress";

export default function Home() {
  const year = 2026;

  const devotional = mockDevotional;

  // Data de hoje (para progresso)
  const today = new Date();
  const todayISO = dateToISO(today);

  // Progresso (salvo no navegador)
  const [doneDates, setDoneDates] = useState<string[]>([]);
  const totalDays = useMemo(() => daysInYear(year), [year]);
  const doneCount = doneDates.filter((d) => d.startsWith(`${year}-`)).length;
  const remaining = Math.max(0, totalDays - doneCount);
  const percent = totalDays === 0 ? 0 : Math.round((doneCount / totalDays) * 100);

  const doneToday = isDone(todayISO, doneDates);

  useEffect(() => {
    setDoneDates(loadDoneDates());
  }, []);

  function handleToggleToday() {
    const updated = toggleDone(todayISO, doneDates);
    setDoneDates(updated);
    saveDoneDates(updated);
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      {/* TOPO: data (esq) + leitura bíblica (dir) */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-gray-600">Devocional do dia</p>
          <div className="mt-1">
            {/* Dia bem grande */}
            <p className="text-4xl font-extrabold leading-none">
              {devotional.dateLabel.split(" ")[0]}
            </p>
            {/* Mês abaixo */}
            <p className="text-sm font-semibold text-gray-700">
              {devotional.dateLabel
                .replace(devotional.dateLabel.split(" ")[0], "")
                .trim()}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-600">Leitura bíblica</p>
          <p className="text-base font-semibold">{devotional.bibleReadingRef}</p>
        </div>
      </header>

      {/* Progresso simples (em cima, discreto) */}
      <section className="mt-4 rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Progresso em {year}</p>
            <p className="mt-1 text-xs text-gray-600">
              Feitos: <span className="font-semibold">{doneCount}</span> • Faltam:{" "}
              <span className="font-semibold">{remaining}</span>
            </p>
          </div>

          <button
            onClick={handleToggleToday}
            className="rounded-xl border px-3 py-2 text-xs font-semibold hover:bg-gray-50"
          >
            {doneToday ? "Desmarcar hoje" : "Marcar como feito"}
          </button>
        </div>

        <div className="mt-3">
          <div className="h-3 w-full rounded-full bg-gray-100">
            <div
              className="h-3 rounded-full bg-gray-900"
              style={{ width: `${percent}%` }}
              aria-label={`Progresso ${percent}%`}
            />
          </div>
          <p className="mt-2 text-[11px] text-gray-600">{percent}% concluído</p>
        </div>
      </section>

      {/* TÍTULO */}
      <h1 className="mt-5 text-2xl font-bold">{devotional.title}</h1>

      {/* HISTORINHA PRIMEIRO (texto vem antes das imagens) */}
      <section className="mt-4 rounded-2xl border bg-white p-5 shadow-sm">
        {devotional.recap ? (
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-semibold">Relembrando</p>
            <p className="mt-1 text-sm">{devotional.recap}</p>
          </div>
        ) : null}

        <h2 className="mt-5 text-lg font-semibold">A historinha de hoje</h2>
        <p className="mt-2 whitespace-pre-line leading-relaxed">
          {devotional.storyText}
        </p>

        {/* Vamos conversar */}
        <h3 className="mt-6 font-semibold">Vamos conversar?</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {devotional.talkAbout.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>

        {/* Oração (cartão destacado) */}
        <div className="mt-6 rounded-2xl border bg-gray-50 p-4">
          <h3 className="font-semibold">Oração</h3>
          <p className="mt-2">{devotional.prayer}</p>
        </div>

        {/* Atividade */}
        <div className="mt-6 rounded-2xl border p-4">
          <h3 className="font-semibold">Atividade</h3>
          <p className="mt-2">{devotional.activity}</p>
        </div>
      </section>

      {/* IMAGENS BEM EMBAIXO (rodapé visual / placeholder) */}
      <section className="mt-6 rounded-2xl border bg-gray-50 p-4">
        <p className="text-xs text-gray-600">Ilustrações (placeholder)</p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border bg-white p-3">
            <p className="text-xs text-gray-600">Personagem do dia</p>
            <p className="mt-1 text-sm font-semibold">{devotional.character.name}</p>
            <p className="text-xs text-gray-600">{devotional.character.description}</p>
            <div className="mt-3 flex items-center justify-center rounded-xl border bg-gray-50 p-8">
              <p className="text-sm text-gray-600">(imagem do personagem aqui)</p>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-3">
            <p className="text-xs text-gray-600">Mascote do dia</p>
            <p className="mt-1 text-sm font-semibold">{devotional.mascot.name}</p>
            <div className="mt-3 flex items-center justify-center rounded-xl border bg-gray-50 p-8">
              <p className="text-sm text-gray-600">(imagem do mascote aqui)</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center rounded-xl border bg-white p-10">
          <p className="text-sm text-gray-600">
            (ilustração grande do dia — pode ficar aqui como “rodapé”)
          </p>
        </div>
      </section>
    </main>
  );
}


