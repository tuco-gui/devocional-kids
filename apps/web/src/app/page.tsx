"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadDoneDates, isDone, dateToISO } from "@/lib/progress";

type Status = "done" | "today" | "open" | "locked";

type Tile =
  | { kind: "day"; dateISO: string; day: number; status: Status }
  | { kind: "extra"; id: string; title: string; side: "left" | "right"; locked: boolean };

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function daysInMonth(year: number, monthIndex0: number) {
  return new Date(year, monthIndex0 + 1, 0).getDate();
}

function monthLabelPt(monthIndex0: number) {
  const date = new Date(2026, monthIndex0, 1);
  return date.toLocaleDateString("pt-BR", { month: "long" });
}

export default function Home() {
  const year = 2026;
  const monthIndex0 = 0; // janeiro (por enquanto fixo; depois colocamos navegação por mês)
  const totalDays = daysInMonth(year, monthIndex0);

  // janela de 15 dias (tipo Duolingo ~18)
  const PAGE_SIZE = 15;
  const [pageStartDay, setPageStartDay] = useState(1); // 1..totalDays
  const [doneDates, setDoneDates] = useState<string[]>([]);

  useEffect(() => {
    setDoneDates(loadDoneDates());
  }, []);

  const today = startOfDay(new Date());
  const todayISO = dateToISO(today);

  function clampStartDay(n: number) {
    const maxStart = Math.max(1, totalDays - PAGE_SIZE + 1);
    return Math.min(Math.max(1, n), maxStart);
  }

  const tiles: Tile[] = useMemo(() => {
    const start = clampStartDay(pageStartDay);
    const end = Math.min(totalDays, start + PAGE_SIZE - 1);

    const arr: Tile[] = [];
    let sideFlip: "left" | "right" = "right";

    for (let d = start; d <= end; d++) {
      const date = new Date(year, monthIndex0, d);
      const dateISO = dateToISO(date);

      const done = isDone(dateISO, doneDates);
      let status: Status = "locked";

      if (date < today) status = done ? "done" : "open";
      if (sameDay(date, today)) status = done ? "done" : "today";
      if (date > today) status = "locked";

      arr.push({ kind: "day", day: d, dateISO, status });

      // a cada 4 dias, coloca um desafio extra (igual você descreveu)
      if (d % 4 === 0 && d !== end) {
        // trava o desafio se o último dia anterior ainda estiver locked (ou seja, futuro)
        const locked = date > today; // simples por agora
        arr.push({
          kind: "extra",
          id: `extra-${year}-${monthIndex0 + 1}-${d}`,
          title: "Desafio extra",
          side: sideFlip,
          locked,
        });
        sideFlip = sideFlip === "right" ? "left" : "right";
      }
    }

    return arr;
  }, [pageStartDay, doneDates, totalDays, monthIndex0, year, today]);

  const monthLabel = monthLabelPt(monthIndex0);

  // UI helpers
  function DayButton({ day, dateISO, status }: { day: number; dateISO: string; status: Status }) {
    const clickable = status !== "locked";
    const href = `/dia/${dateISO}`;

    const base =
      "flex h-14 w-14 items-center justify-center rounded-full border text-sm font-extrabold shadow-sm transition active:scale-95";

    const cls =
      status === "done"
        ? `${base} bg-emerald-500 text-white border-emerald-600`
        : status === "today"
        ? `${base} bg-white text-gray-900 ring-4 ring-yellow-300`
        : status === "open"
        ? `${base} bg-white text-gray-900`
        : `${base} bg-gray-200 text-gray-500 border-gray-300`;

    const label =
      status === "done" ? "✓" : status === "locked" ? "🔒" : day;

    const content = <div className={cls} title={dateISO} aria-label={`Dia ${day}`}>{label}</div>;

    return clickable ? <Link href={href}>{content}</Link> : content;
  }

  function ExtraCard({ side, locked }: { side: "left" | "right"; locked: boolean }) {
    const align = side === "right" ? "justify-end" : "justify-start";
    const cls =
      "w-[240px] rounded-2xl border bg-white/70 p-4 shadow-sm " +
      (locked ? "opacity-60" : "hover:bg-white");

    // Por enquanto não clica (a gente cria depois /desafio/[id])
    return (
      <div className={`flex ${align}`}>
        <Link
          href={`/desafio/${locked ? "bloqueado" : "missao-" + Date.now()}`}
          className={cls}
        >
          <p className="text-xs text-gray-600">Extra</p>
          <p className="mt-1 text-sm font-bold">Desafio do dia</p>
          <p className="mt-1 text-xs text-gray-700">
            {locked ? "Bloqueado por enquanto" : "Toque para abrir"}
          </p>
    
          <div className="mt-3 flex items-center gap-2">
            <div className="rounded-xl bg-gray-100 px-2 py-1 text-xs">🎨 desenho</div>
            <div className="rounded-xl bg-gray-100 px-2 py-1 text-xs">📖 leitura</div>
            <div className="rounded-xl bg-gray-100 px-2 py-1 text-xs">🤝 bondade</div>
          </div>
        </Link>
      </div>
    );
    
    return (
      <div className={`flex ${align}`}>
        <div className={cls}>
          <p className="text-xs text-gray-600">Extra</p>
          <p className="mt-1 text-sm font-bold">Desafio do dia</p>
          <p className="mt-1 text-xs text-gray-700">
            {locked ? "Bloqueado por enquanto" : "Toque para abrir (em breve)"}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <div className="rounded-xl bg-gray-100 px-2 py-1 text-xs">🎨 desenho</div>
            <div className="rounded-xl bg-gray-100 px-2 py-1 text-xs">📖 leitura</div>
            <div className="rounded-xl bg-gray-100 px-2 py-1 text-xs">🤝 bondade</div>
          </div>
        </div>
      </div>
    );
  }

  // Zigue-zague Duolingo: alterna alinhamento de cada item
  function rowAlign(i: number) {
    return i % 2 === 0 ? "justify-start" : "justify-end";
  }

  const startShown = clampStartDay(pageStartDay);
  const endShown = Math.min(totalDays, startShown + PAGE_SIZE - 1);

  return (
    <main className="mx-auto max-w-2xl p-4 sm:p-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-700">Devocional Kids</p>
          <h1 className="mt-1 text-2xl font-extrabold capitalize">{monthLabel} de {year}</h1>
          <p className="mt-1 text-sm text-gray-700">
            Hoje: <span className="font-semibold">{todayISO}</span>
          </p>
        </div>

        <button className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50">
          Perfil
        </button>
      </header>

      {/* Controles (janela de 15 dias) */}
      <section className="mt-4 flex items-center justify-between rounded-2xl border bg-white p-3 shadow-sm">
        <button
          className="rounded-xl border px-3 py-2 text-sm font-semibold disabled:opacity-50"
          disabled={startShown === 1}
          onClick={() => setPageStartDay((s) => clampStartDay(s - PAGE_SIZE))}
        >
          ← Anterior
        </button>

        <div className="text-center">
          <p className="text-xs text-gray-600">Mostrando</p>
          <p className="text-sm font-semibold">
            Dias {startShown} – {endShown}
          </p>
        </div>

        <button
          className="rounded-xl border px-3 py-2 text-sm font-semibold disabled:opacity-50"
          disabled={endShown === totalDays}
          onClick={() => setPageStartDay((s) => clampStartDay(s + PAGE_SIZE))}
        >
          Próximo →
        </button>
      </section>

      {/* Trilha “botões” (Duolingo-like) */}
      <section className="mt-5 rounded-3xl border bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 p-5 shadow-sm">
        <div className="space-y-4">
          {tiles.map((t, idx) => (
            <div key={t.kind === "day" ? t.dateISO : t.id} className={`flex ${rowAlign(idx)}`}>
              {t.kind === "day" ? (
                <div className="flex items-center gap-3">
                  {/* bolinha */}
                  <DayButton day={t.day} dateISO={t.dateISO} status={t.status} />
                  {/* label pequeno */}
                  <div className="min-w-[160px]">
                    <p className="text-sm font-semibold">Dia {t.day}</p>
                    <p className="text-xs text-gray-700">
                      {t.status === "done"
                        ? "Concluído"
                        : t.status === "today"
                        ? "Hoje"
                        : t.status === "open"
                        ? "Disponível"
                        : "Bloqueado"}
                    </p>
                  </div>
                </div>
              ) : (
                <ExtraCard side={t.side} locked={t.locked} />
              )}
            </div>
          ))}
        </div>
      </section>

      <p className="mt-4 text-xs text-gray-600">
        Próximo passo: swipe (arrastar) em vez de botões, e “Desafio extra” abrindo uma tela com missão.
      </p>
    </main>
  );
}





