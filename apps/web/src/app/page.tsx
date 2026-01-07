import { mockDevotional } from "@/lib/mockDevotional";

export default function Home() {
  const today = new Date();
  const todayBr = today.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const devotional = mockDevotional;

  return (
    <main className="mx-auto max-w-2xl p-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">Devocional Kids</h1>
        <p className="text-sm text-gray-600">Hoje é {todayBr}</p>
      </header>

      <section className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">{devotional.theme}</h2>

        <div className="mt-4 rounded-xl bg-gray-50 p-4">
          <p className="text-sm font-semibold">{devotional.verseRef}</p>
          <p className="mt-1 italic">“{devotional.verseText}”</p>
        </div>

        <p className="mt-4 leading-relaxed">{devotional.text}</p>

        <h3 className="mt-6 font-semibold">Vamos conversar?</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {devotional.questions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>

        <h3 className="mt-6 font-semibold">Oração</h3>
        <p className="mt-2">{devotional.prayer}</p>

        <h3 className="mt-6 font-semibold">Atividade</h3>
        <p className="mt-2">{devotional.activity}</p>
      </section>
    </main>
  );
}
