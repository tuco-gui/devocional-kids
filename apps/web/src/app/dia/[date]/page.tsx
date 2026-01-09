import Link from "next/link";
import { notFound } from "next/navigation";
import { getDevotionalByDate } from "@/lib/devotionals";
import DevotionalActions from "./DevotionalActions";

function isValidISODate(s: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function formatDateBRFromISO(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  return date.toLocaleDateString("pt-BR");
}

export default async function DayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;

  if (!isValidISODate(date)) return notFound();

  const devotional = await getDevotionalByDate(date);

  if (!devotional) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100">
        <div className="mx-auto max-w-2xl p-6">
          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <h1 className="text-2xl font-bold">Devocional ainda não disponível</h1>
            <p className="mt-2 text-gray-700">Esse dia ainda não foi gerado.</p>
            <p className="mt-2 text-sm text-gray-600">Data: {formatDateBRFromISO(date)}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100">
      <div className="mx-auto max-w-2xl p-4 sm:p-6">
        {/* Top bar */}
        <header className="flex items-start justify-between gap-4">
          <Link href="/" className="rounded-xl border bg-white/70 px-3 py-2 text-sm font-semibold hover:bg-white">← Voltar</Link>

          <div className="rounded-2xl border bg-white/70 px-4 py-3 shadow-sm">
            <p className="text-xs text-gray-600">Devocional do dia</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {formatDateBRFromISO(devotional.dateISO)}
            </p>
          </div>

          <div className="rounded-2xl border bg-white/70 px-4 py-3 text-right shadow-sm">
            <p className="text-xs text-gray-600">Leitura bíblica</p>
            <p className="text-base font-semibold">{devotional.bibleReadingRef}</p>
          </div>
        </header>

        {/* Card principal */}
        <section className="mt-4 rounded-3xl border bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-extrabold">{devotional.title}</h1>

          {devotional.recap ? (
            <div className="mt-4 rounded-2xl bg-gray-50 p-4">
              <p className="text-sm font-semibold">Relembrando</p>
              <p className="mt-1 text-sm">{devotional.recap}</p>
            </div>
          ) : null}

          <h2 className="mt-5 text-lg font-semibold">A historinha de hoje</h2>
          <p className="mt-2 whitespace-pre-line leading-relaxed">{devotional.storyText}</p>

          <div className="mt-6 rounded-2xl border bg-gray-50 p-4">
            <h3 className="font-semibold">Oração</h3>
            <p className="mt-2">{devotional.prayer}</p>
          </div>

          <div className="mt-6 rounded-2xl border p-4">
            <h3 className="font-semibold">Atividade</h3>
            <p className="mt-2">{devotional.activity}</p>
          </div>

          {/* Ações / respostas */}
          <DevotionalActions dateISO={devotional.dateISO} questions={devotional.talkAbout} />

          {/* Ilustrações embaixo (como você pediu) */}
          <div className="mt-6 rounded-2xl border bg-gray-50 p-4">
            <p className="text-xs text-gray-600">Ilustrações</p>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border bg-white p-3">
                <p className="text-xs text-gray-600">Personagem do dia</p>
                <p className="mt-1 text-sm font-semibold">{devotional.character.name}</p>
                <p className="text-xs text-gray-600">{devotional.character.description}</p>
                <div className="mt-3 flex items-center justify-center rounded-xl border bg-gray-50 p-8">
                  <span className="text-sm text-gray-500">(imagem do personagem)</span>
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-3">
                <p className="text-xs text-gray-600">Mascote do dia</p>
                <p className="mt-1 text-sm font-semibold">{devotional.mascot.name}</p>
                <div className="mt-3 flex items-center justify-center rounded-xl border bg-gray-50 p-8">
                  <span className="text-sm text-gray-500">(imagem do mascote)</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
