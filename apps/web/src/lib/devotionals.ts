import { promises as fs } from "node:fs";
import path from "node:path";
import type { Devotional } from "./types";

const DATA_DIR = path.join(process.cwd(), "src", "lib", "data", "devotionals");

export async function getDevotionalByDate(dateISO: string): Promise<Devotional | null> {
  try {
    const filePath = path.join(DATA_DIR, `${dateISO}.json`);
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as Devotional;
  } catch {
    return null;
  }
}
