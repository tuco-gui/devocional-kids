const KEY = "devokids_journal_v2";

type JournalDay = {
  answers?: Record<number, string>;
  answerImages?: Record<number, string>; // base64 por pergunta
  notes?: string;
  activityImage?: string; // base64 (MVP)
};

type JournalDB = Record<string, JournalDay>;

function loadDB(): JournalDB {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveDB(db: JournalDB) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(db));
}

function ensureDay(db: JournalDB, dateISO: string): JournalDay {
  db[dateISO] = db[dateISO] ?? {};
  return db[dateISO]!;
}

export function getAnswers(dateISO: string): Record<number, string> {
  const db = loadDB();
  return db[dateISO]?.answers ?? {};
}

export function setAnswer(dateISO: string, index: number, text: string) {
  const db = loadDB();
  const day = ensureDay(db, dateISO);
  day.answers = day.answers ?? {};
  day.answers[index] = text;
  saveDB(db);
}

export function getAnswerImage(dateISO: string, index: number): string | null {
  const db = loadDB();
  return db[dateISO]?.answerImages?.[index] ?? null;
}

export function setAnswerImage(dateISO: string, index: number, dataUrl: string) {
  const db = loadDB();
  const day = ensureDay(db, dateISO);
  day.answerImages = day.answerImages ?? {};
  day.answerImages[index] = dataUrl;
  saveDB(db);
}

export function getActivityImage(dateISO: string): string | null {
  const db = loadDB();
  return db[dateISO]?.activityImage ?? null;
}

export function setActivityImage(dateISO: string, dataUrl: string) {
  const db = loadDB();
  const day = ensureDay(db, dateISO);
  day.activityImage = dataUrl;
  saveDB(db);
}
