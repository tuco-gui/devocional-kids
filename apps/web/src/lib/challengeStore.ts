const KEY = "devokids_challenges_v1";

type ChallengeData = {
  done?: boolean;
  photoDataUrl?: string; // MVP: base64
  textAnswer?: string;
};

type DB = Record<string, ChallengeData>;

function loadDB(): DB {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveDB(db: DB) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function getChallengeData(dateISO: string): ChallengeData {
  const db = loadDB();
  return db[dateISO] ?? {};
}

export function setChallengeDone(dateISO: string, done: boolean) {
  const db = loadDB();
  db[dateISO] = { ...(db[dateISO] ?? {}), done };
  saveDB(db);
}

export function setChallengePhoto(dateISO: string, photoDataUrl: string) {
  const db = loadDB();
  db[dateISO] = { ...(db[dateISO] ?? {}), photoDataUrl };
  saveDB(db);
}

export function setChallengeText(dateISO: string, textAnswer: string) {
  const db = loadDB();
  db[dateISO] = { ...(db[dateISO] ?? {}), textAnswer };
  saveDB(db);
}
