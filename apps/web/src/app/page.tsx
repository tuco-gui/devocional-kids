"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadDoneDates, isDone, dateToISO } from "@/lib/progress";

type DayItem = {
  dateISO: string;
  day: number;
  status: "done" | "today" | "locked" | "open";
  x: number; // posição em %
  y: number; // posição em px
  buddy?: string; // emoji placeholder de mascote/personagem
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
  const monthIndex0 = 0; // janeiro
  const monthLabel = "Janeiro";

  const [doneDates, setDoneDates] = useState<string[]>([]);

  useEffect(() => {
    setDoneDates(loadDoneDates());
  }, []);

  const today = startOfDay(new Date());
  const todayISO = dateToISO(today);

  const total = daysInMonth(year, monthIndex0);

  const items: DayItem[] = useMemo(() => {
    // Trilhezinha sinuosa:
    // - y cresce a cada dia
    // - x oscila (seno) para formar “caminho”
    // Ajusta esses números se quiser mais “curva” ou mais “espaço”
    const stepY = 92; // distância vertical entre dias (px)
    const amplitude = 28; // quão para esquerda/direita vai (em %)
    const baseX = 50; // centro

    const buddies = ["🦁", "🐑", "🧢", "🐘", "🦒", "🐧", "🐢", "🦜", "🐬", "🐰"]; // placeholders

    const arr: DayItem[] = [];
    for (let d = 1; d <= total; d++) {
      const date = new Date(year, monthIndex0, d);
      const dateISO = dateToISO(date);

      const done = isDone(dateISO, doneDates);

      let status: DayItem["status"] = "locked";
      if (date < today) status = done ? "done" : "open";
      if (sameDay(date, today)) status = done ? "done" : "today";
      if (date > today) status = "locked";

      const t = (d - 1) / Math.max(1, total - 1); // 0..1
      const wave = Math.sin(t * Math.PI * 3.2); // mais voltas
      const x = baseX + wave * amplitude;
      const y = 120 + (d - 1) * stepY;

      // Coloca “mascote” a cada 5 dias (só pra dar vida)
      const buddy = d % 5 === 0 ? buddies[(d / 5) % buddies.length] : undefined;

      arr.push({ dateISO, day: d, status, x, y, buddy });
    }
    return arr;
  }, [doneDates, monthIndex0, year, today, total]);

  // Altura total do “mapa”
  const mapHeight = useMemo(() => {
    const last = items[items.length - 1];
    return (last?.y ?? 300) + 180;
  }, [items]);

  // Caminho SVG passando “perto” dos pontos
  const pathD = useMemo(() => {
    if (items.length === 0) return "";
    // converte % para um viewport fixo (0..1000)
    const toX = (pct: number) => (pct / 100) * 1000;
    const points = items.map((it) => ({
      x: toX(it.x),
      y: it.y,
    }));

    // Curva suave
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const cur = points[i];
      const midY = (prev.y + cur.y) / 2;
      d += ` C ${prev.x} ${midY}, ${cur.x} ${midY}, ${cur.x} ${cur.y}`;
    }
    return d;
  }, [items]);

  return (
    <main className="mx-auto max-w-2xl p-4 sm:p-6">
      {/* Cabeçalho */}
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-700">Devocional Kids</p>
          <h1 className="mt-1 text-2xl font-extrabold">Trilha de {monthLabel}</h1>
          <p className="mt-1 text-sm text-gray-700">
            Hoje: <span className="font-semibold">{todayISO}</span>
          </p>
        </div>

        {/* Perfil (placeholder) */}
        <button className="rounded-xl border bg-white/70 px-3 py-2 text-sm font-semibold hover:bg-white">
          Perfil
        </button>
      </header>

      {/* MAPA LÚDICO */}
      <section className="mt-5 overflow-hidden rounded-3xl border bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 shadow-sm">
        {/* topo decorativo */}
        <div className="relative px-5 pt-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">Caminho do mês</p>
            <div className="rounded-full bg-white/60 px-3 py-1 text-xs text-gray-800">
              {total} dias
            </div>
          </div>

          {/* nuvens simples */}
          <div className="pointer-events-none absolute left-6 top-10 h-10 w-24 rounded-full bg-white/60 blur-[0.2px]" />
          <div className="pointer-events-none absolute right-10 top-16 h-8 w-20 rounded-full bg-white/50 blur-[0.2px]" />
        </div>

        {/* área do mapa */}
        <div className="relative" style={{ height: mapHeight }}>
          {/* Caminho (estrada) */}
          <svg
            className="absolute inset-0"
            width="100%"
            height={mapHeight}
            viewBox={`0 0 1000 ${mapHeight}`}
            preserveAspectRatio="none"
          >
            {/* “sombra” da estrada */}
            <path
              d={pathD}
              fill="none"
              stroke="rgba(0,0,0,0.10)"
              strokeWidth="36"
              strokeLinecap="round"
            />
            {/* estrada */}
            <path
              d={pathD}
              fill="none"
              stroke="rgba(255,255,255,0.75)"
              strokeWidth="28"
              strokeLinecap="round"
            />
            {/* faixa pontilhada */}
            <path
              d={pathD}
              fill="none"
              stroke="rgba(0,0,0,0.12)"
              strokeWidth="4"
              strokeDasharray="10 14"
              strokeLinecap="round"
            />
          </svg>

          {/* Pontos (dias) */}
          {items.map((it) => {
            const clickable = it.status !== "locked";
            const href = `/dia/${it.dateISO}`;

            const ring =
              it.status === "today"
                ? "ring-4 ring-yellow-300"
                : it.status === "done"
                ? "ring-4 ring-emerald-300"
                : "";

            const bg =
              it.status === "done"
                ? "bg-emerald-500 text-white"
                : it.status === "today"
                ? "bg-white text-gray-900"
                : it.status === "open"
                ? "bg-white text-gray-900"
                : "bg-gray-200 text-gray-500";

            const badge =
              it.status === "done" ? "✓" : it.status === "locked" ? "🔒" : it.day;

            const node = (
              <div
                className="absolute -translate-x-1/2"
                style={{ left: `${it.x}%`, top: it.y }}
              >
                {/* mascote/char aparecendo em alguns pontos */}
                {it.buddy ? (
                  <div className="mb-2 flex justify-center">
                    <div className="rounded-full bg-white/70 px-2 py-1 text-lg shadow-sm">
                      {it.buddy}
                    </div>
                  </div>
                ) : null}

                <div className="flex items-center justify-center">
                  <div
                    className={[
                      "flex h-14 w-14 items-center justify-center rounded-full border font-extrabold shadow-sm",
                      bg,
                      ring,
                      clickable ? "cursor-pointer" : "cursor-not-allowed opacity-80",
                    ].join(" ")}
                    title={`${it.dateISO}`}
                    aria-label={`Dia ${it.day}`}
                  >
                    {badge}
                  </div>
                </div>

                <div className="mt-2 text-center text-xs font-semibold text-gray-800">
                  Dia {it.day}
                </div>

                <div className="mt-0.5 text-center text-[11px] text-gray-700">
                  {it.status === "done"
                    ? "Concluído"
                    : it.status === "today"
                    ? "Hoje"
                    : it.status === "open"
                    ? "Disponível"
                    : "Bloqueado"}
                </div>
              </div>
            );

            return clickable ? (
              <Link key={it.dateISO} href={href}>
                {node}
              </Link>
            ) : (
              <div key={it.dateISO}>{node}</div>
            );
          })}

          {/* “grama” no rodapé */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-emerald-300/70 to-transparent" />
        </div>
      </section>

      <p className="mt-4 text-xs text-gray-600">
        Próximo passo: colocar personagens aparecendo na trilha (em vez de emoji), e a Home já
        mostrar “missão do dia” como no estilo do app que você mandou.
      </p>
    </main>
  );
}




