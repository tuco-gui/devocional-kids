const STORAGE_KEY = "devocional_kids_done_dates_v1";

export function loadDoneDates(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x) => typeof x === "string");
  } catch {
    return [];
  }
}

export function saveDoneDates(dates: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dates));
}

export function isDone(dateISO: string, dates: string[]) {
  return dates.includes(dateISO);
}

export function toggleDone(dateISO: string, dates: string[]) {
  const set = new Set(dates);
  if (set.has(dateISO)) set.delete(dateISO);
  else set.add(dateISO);
  return Array.from(set).sort();
}

export function daysInYear(year: number) {
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  const ms = end.getTime() - start.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function dateToISO(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}


export function formatDateBR(date: Date) {
  return date.toLocaleDateString('pt-BR');
}
