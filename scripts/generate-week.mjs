import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(
  process.cwd(),
  "apps",
  "web",
  "src",
  "lib",
  "data",
  "devotionals"
);

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function dateLabelPt(date) {
  const day = date.getDate();
  const month = date.toLocaleDateString("pt-BR", { month: "long" });
  return `${day} de ${month}`;
}

const characters = [
  { id: "davi", name: "Davi", age: 10, description: "Curioso e cheio de perguntas.", imageAlt: "" },
  { id: "caio", name: "Caio", age: 11, description: "Líder gentil e corajoso.", imageAlt: "" },
  { id: "kenji", name: "Kenji", age: 9, description: "Observador e tranquilo.", imageAlt: "" },
  { id: "livia", name: "Lívia", age: 10, description: "Corajosa e verdadeira.", imageAlt: "" },
  { id: "ayla", name: "Ayla", age: 9, description: "Criativa e alegre.", imageAlt: "" },
  { id: "sofia", name: "Sofia", age: 11, description: "Organizada e cuidadosa.", imageAlt: "" },
];

const mascots = [
  { id: "leao", name: "Leão", imageAlt: "" },
  { id: "ovelha", name: "Ovelhinha", imageAlt: "" },
  { id: "capivara", name: "Capivara", imageAlt: "" },
  { id: "elefante", name: "Elefante", imageAlt: "" },
  { id: "girafa", name: "Girafa", imageAlt: "" },
  { id: "pinguim", name: "Pinguim", imageAlt: "" },
];

function pick(arr, i) {
  return arr[i % arr.length];
}

const startISO = process.argv[2];
if (!startISO || !/^\d{4}-\d{2}-\d{2}$/.test(startISO)) {
  console.log("Uso: node scripts/generate-week.mjs AAAA-MM-DD");
  process.exit(1);
}

const startDate = new Date(`${startISO}T00:00:00`);
if (Number.isNaN(startDate.getTime())) {
  console.log("Data inválida.");
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

let prevTitle = null;

for (let i = 0; i < 7; i++) {
  const date = addDays(startDate, i);
  const dateISO = toISO(date);

  const devotional = {
    dateISO,
    dateLabel: dateLabelPt(date),
    bibleReadingRef: "Mateus 4:20–22",
    title: i === 0 ? "Começando o ano com Jesus" : "Um passo de obediência por dia",
    storyArcId: "arc-2026-turma-01",
    episodeNumber: i + 1,
    recap: prevTitle ? `Ontem aprendemos sobre: ${prevTitle.toLowerCase()}.` : "Hoje começa nossa jornada com Jesus.",
    storyText:
      "Hoje a turma aprendeu que Jesus chama pessoas comuns para viver coisas extraordinárias.\n\n" +
      "Obedecer nem sempre é fácil, mas Deus nos ajuda quando a gente dá o primeiro passo.\n\n" +
      "Pense: qual pequeno passo de obediência você pode dar hoje?",
    talkAbout: [
      "O que significa obedecer a Jesus?",
      "Qual é um pequeno passo que você pode dar hoje?",
      "Quem pode te ajudar a obedecer a Deus?"
    ],
    prayer: "Jesus, me ajuda a ouvir sua voz e obedecer com alegria. Amém.",
    activity: "Faça um desenho do seu ‘primeiro passo’ com Jesus e escreva uma frase de coragem.",
    character: pick(characters, i),
    mascot: pick(mascots, i),
  };

  fs.writeFileSync(
    path.join(OUT_DIR, `${dateISO}.json`),
    JSON.stringify(devotional, null, 2),
    "utf-8"
  );

  prevTitle = devotional.title;
}

console.log("Semana gerada em:", OUT_DIR);
