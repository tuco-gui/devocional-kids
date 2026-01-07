"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadDoneDates, isDone, dateToISO } from "@/lib/progress";

type DayItem = {
  dateISO: string;
  day: number;
  status: "done" | "today" | "locked" | "open";
};

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function daysInMonth(year: number, monthIndex0: number) {
  return new Date(year, monthIndex0 + 1, 0).getDate();
}

export default function Home() {
  const year = 2026;
  const monthIndex0 = 0; // 0 = janeiro (por enquanto fixo; depois a gente navega mês)
  const monthLabel = "Janeiro";

  const [doneDates, setDoneDates] = useState<string[]>([]);

  useEffect(() => {
    setDoneDates(loadDoneDates());
  }, []);

  const today = startOfDay(new Date());
  const todayISO = dateToISO(today);

  const items: DayItem[] = useMemo(() => {
    const total = daysInMonth(year, monthIndex0);

    const arr: DayItem[] = [];
    for (let d = 1; d <= total; d++) {
      const date = new Date(year, monthIndex0, d);
      const dateISO = dateToISO(date);

      const done = isDone(dateISO, doneDates);

      // Regras:
      // - Passado: open (se não feito) ou done
      // - Hoje: today (se não feito) ou done
      // - Futuro: locked
      let status: DayItem["status"] = "locked";

      if (date < today) status = done ? "done" : "open";
      if (sameDay(date, today)) status = done ? "done" : "today";
      if (date > today) status = "locked";

      arr.push({ dateISO, day: d, status });
    }
    return arr;
  }, [doneDates, monthIndex0, year, today]);

  return (
    <main className="mx-auto max-w-2xl p-6">
      {/* Cabeçalho */}
      <header className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-600">Devocional Kids</p>
          <h1 className="mt-1 text-2xl font-bold">Trilha de {monthLabel}</h1>
          <p className="mt-1 text-sm text-gray-600">
            Toque no dia de hoje para fazer o devocional.
          </p>
        </div>

        {/* botão de perfil (placeholder) */}
        <button className="rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-gray-50">
          Perfil
        </button>
      </header>

      {/* Trilha */}
      <section className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Dias do mês</p>
          <p className="text-xs text-gray-600">Hoje: {todayISO}</p>
        </div>

        <div className="mt-4 space-y-3">
          {items.map((it, idx) => {
            const isClickable = it.status !== "locked";
            const href = `/dia/${it.dateISO}`;

            // “zig-zag” simples: alterna alinhamento
            const align = idx % 2 === 0 ? "justify-start" : "justify-end";

            const label =
              it.status === "done"
                ? "Concluído"
                : it.status === "today"
                ? "Hoje"
                : it.status === "open"
                ? "Disponível"
                : "Bloqueado";

            const bubble = (
              <div className={`flex ${align}`}>
                <div className="flex items-center gap-3">
                  {/* Linha (trilha) */}
                  <div className="h-10 w-1 rounded-full bg-gray-100" />

                  {/* Bolinha */}
                  <div
                    className={[
                      "flex h-12 w-12 items-center justify-center rounded-full border text-sm font-bold",
                      it.status === "done" ? "bg-gray-900 text-white" : "",
                      it.status === "today" ? "bg-white" : "",
                      it.status === "open" ? "bg-white" : "",
                      it.status === "locked" ? "bg-gray-100 text-gray-500" : "",
                    ].join(" ")}
                    aria-label={`Dia ${it.day} - ${label}`}
                    title={`${it.dateISO} • ${label}`}
                  >
                    {it.status === "done" ? "✓" : it.status === "locked" ? "🔒" : it.day}
                  </div>

                  {/* Texto */}
                  <div className="min-w-[140px]">
                    <p className="text-sm font-semibold">Dia {it.day}</p>
                    <p className="text-xs text-gray-600">{label}</p>
                  </div>
                </div>
              </div>
            );

            return isClickable ? (
              <Link key={it.dateISO} href={href} className="block">
                {bubble}
              </Link>
            ) : (
              <div key={it.dateISO} className="opacity-70">
                {bubble}
              </div>
            );
          })}
        </div>
      </section>

      {/* Observação */}
      <p className="mt-6 text-xs text-gray-600">
        Depois a gente vai colocar: navegação por meses, mascote na trilha, XP, medalhas e amigos.
      </p>
    </main>
  );
}



