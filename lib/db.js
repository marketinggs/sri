import { promises as fs } from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

const defaultDb = {
  users: [],
  posts: [],
};

/**
 * Ensures a persistent JSON datastore exists before reads/writes.
 */
async function ensureDbFile() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(defaultDb, null, 2), 'utf-8');
  }
}

export async function readDb() {
  await ensureDbFile();
  const content = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(content);
}

export async function writeDb(nextDb) {
  await ensureDbFile();
  await fs.writeFile(DB_PATH, JSON.stringify(nextDb, null, 2), 'utf-8');
}

export function createId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}
