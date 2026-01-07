import type { Devotional } from "./types";
import { characters, mascots } from "./cast";

export const mockDevotional: Devotional = {
  dateISO: "2026-02-06",
  dateLabel: "6 de fevereiro",
  bibleReadingRef: "Mateus 4:20–22",
  title: "Os discípulos obedecem ao chamado",

  storyArcId: "arc-2026-turma-01",
  episodeNumber: 37,
  recap: "Ontem, a turma descobriu que Jesus chama pessoas comuns para coisas incríveis.",
  storyText:
    "No dia seguinte, as crianças pediram para Davi continuar contando sobre os discípulos de Jesus.\n\n" +
    "“Quando Jesus falou com Simão Pedro e André, eles largaram as redes e foram com Ele na hora!”, explicou Davi.\n\n" +
    "Depois, Jesus viu dois irmãos, Tiago e João, consertando as redes no barco com o pai. “E sabe o que aconteceu? Jesus também chamou os dois… e eles deixaram tudo imediatamente para segui-lo!”, contou Davi com os olhos brilhando.\n\n" +
    "“Uau… eles foram muito corajosos!”, disse Ayla.\n\n" +
    "“Sim”, respondeu Sofia. “Eles confiaram em Jesus sem ficar presos ao medo ou à preocupação.”\n\n" +
    "Caio completou: “Quando Jesus chama, obedecer é a melhor escolha. Seguir Jesus muda a nossa vida para melhor.”\n\n" +
    "Kenji sorriu e falou baixinho: “Então, quando eu sentir dúvida… eu posso lembrar que obedecer a Jesus é seguro.”",

  talkAbout: [
    "Qual parte da história te deixou mais impressionado?",
    "O que pode atrapalhar a gente de obedecer rápido a Jesus?",
    "Qual é uma atitude de obediência que você pode praticar hoje?"
  ],
  prayer:
    "Jesus, me ajuda a ouvir sua voz e a obedecer com alegria. Quero confiar em você como os discípulos confiaram. Amém.",
  activity:
    "Escreva em um papel: “Eu posso obedecer a Jesus hoje!”. Depois, escolha uma atitude (ajudar alguém, dizer a verdade, pedir perdão) e pratique.",

  character: characters.find(c => c.id === "davi")!,
  mascot: mascots.find(m => m.id === "capivara")!
};
