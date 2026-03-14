import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (error, key) => {
      if (error) reject(error);
      else resolve(`${salt}:${key.toString('hex')}`);
    });
  });
}

const now = new Date().toISOString();
const userOneId = createId('user');
const userTwoId = createId('user');

const db = {
  users: [
    {
      id: userOneId,
      name: 'Aarav Demo',
      email: 'aarav@example.com',
      passwordHash: await hashPassword('password123'),
      createdAt: now,
    },
    {
      id: userTwoId,
      name: 'Siya Demo',
      email: 'siya@example.com',
      passwordHash: await hashPassword('password123'),
      createdAt: now,
    },
  ],
  posts: [
    {
      id: createId('post'),
      title: 'Welcome to HackFlow',
      content: 'This sample post was seeded automatically. Start building from here!',
      authorId: userOneId,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: createId('post'),
      title: 'Hackathon Tip',
      content: 'Keep your modules small and reusable to move faster under pressure.',
      authorId: userTwoId,
      createdAt: now,
      updatedAt: now,
    },
  ],
};

await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');

console.log('Seed complete. Demo users:\n- aarav@example.com / password123\n- siya@example.com / password123');
