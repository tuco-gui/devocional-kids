export default function Home() {
  const today = new Date();
  const todayBr = today.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const devotional = {
    theme: "Deus cuida de você",
    verseRef: "Salmo 56:3",
    verseText: "Em me vindo o temor, hei de confiar em ti.",
    text:
      "Sabe quando dá aquele medo do escuro, ou de errar, ou de ficar sozinho? Deus não briga com você por sentir medo. Ele te convida a confiar. Confiança é segurar na mão de Deus e lembrar: Ele está perto.",
    questions: [
      "O que te deixa com medo às vezes?",
      "Como você pode lembrar que Deus está com você?",
      "Com quem você pode conversar quando estiver com medo?",
    ],
    prayer:
      "Jesus, quando eu sentir medo, me ajuda a confiar em você. Fica pertinho de mim. Amém.",
    activity:
      "Desenhe uma “capa de super-herói da coragem” e escreva nela: “Deus está comigo”.",
  };

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
