export type Character = {
  id: string;
  name: string;
  age: number;
  description: string;
  // espaço para imagem depois (IA)
  imageAlt: string;
};

export type Mascot = {
  id: string;
  name: string; // "Capivara", "Leão"...
  imageAlt: string;
};

export type Devotional = {
  dateISO: string;          // "2026-02-06"
  dateLabel: string;        // "6 de fevereiro" (para UI)
  bibleReadingRef: string;  // "Mateus 4:20–22" (somente referência)
  title: string;            // "Os discípulos obedecem ao chamado"

  storyArcId: string;       // "arc-2026-turma-01"
  episodeNumber: number;    // 1..365
  recap?: string;           // 1-2 frases do dia anterior (opcional)
  storyText: string;        // historinha maior (principal)

  talkAbout: string[];      // "Vamos conversar?"
  prayer: string;
  activity: string;

  character: Character;     // personagem humano do dia
  mascot: Mascot;           // mascote do dia
};
