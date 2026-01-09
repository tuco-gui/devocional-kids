import { promises as fs } from "node:fs";
import fssync from "node:fs";
import path from "node:path";
import type { Devotional } from "./types";

function pickDataDir() {
  // Caso 1: rodando com cwd = apps/web
  const dir1 = path.join(process.cwd(), "src", "lib", "data", "devotionals");

  // Caso 2: rodando com cwd = raiz do repo
  const dir2 = path.join(process.cwd(), "apps", "web", "src", "lib", "data", "devotionals");

  if (fssync.existsSync(dir1)) return dir1;
  if (fssync.existsSync(dir2)) return dir2;

  // fallback (cria depois, mas evita crash)
  return dir1;
}

const DATA_DIR = pickDataDir();

export async function getDevotionalByDate(dateISO: string): Promise<Devotional | null> {
  try {
    const filePath = path.join(DATA_DIR, `${dateISO}.json`);
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as Devotional;
  } catch {
    return null;
  }
}
