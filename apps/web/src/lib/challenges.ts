export type ChallengeType = "criativo" | "leitura" | "acao" | "reflexao";

export type Challenge = {
  dateISO: string;
  type: ChallengeType;
  title: string;
  description: string;
  points: number;
  cta: "anexar_foto" | "escrever" | "marcar_feito";
};

// bem infantil e direto (a gente melhora depois com ligação ao tema do devocional)
const POOL: Omit<Challenge, "dateISO">[] = [
  {
    type: "acao",
    title: "Desafio do dia: Bilhete do bem",
    description:
      "Escreva um bilhete bem curto para alguém da sua casa: “Deus te ama e eu gosto de você!” Depois entregue com um sorriso. 😊",
    points: 50,
    cta: "anexar_foto",
  },
  {
    type: "criativo",
    title: "Desafio do dia: Desenho da coragem",
    description:
      "Desenhe você sendo corajoso(a) com Jesus do seu lado. Pode ser bem simples. Depois tire foto e envie aqui.",
    points: 50,
    cta: "anexar_foto",
  },
  {
    type: "leitura",
    title: "Desafio do dia: Caça ao versículo",
    description:
      "Pegue uma Bíblia e encontre o versículo do devocional de hoje. Leia em voz alta para alguém (ou para você).",
    points: 40,
    cta: "marcar_feito",
  },
  {
    type: "reflexao",
    title: "Desafio do dia: Minha escolha de hoje",
    description:
      "Escreva uma frase: “Hoje eu vou ______ porque Jesus me ajuda.” (Ex.: obedecer, ter paciência, falar a verdade).",
    points: 40,
    cta: "escrever",
  },
];

function hashDate(dateISO: string) {
  // hash simples e determinístico
  let h = 0;
  for (let i = 0; i < dateISO.length; i++) h = (h * 31 + dateISO.charCodeAt(i)) >>> 0;
  return h;
}

export function getChallengeByDate(dateISO: string): Challenge {
  const idx = hashDate(dateISO) % POOL.length;
  return { dateISO, ...POOL[idx] };
}
