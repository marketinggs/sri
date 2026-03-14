import { NextResponse } from 'next/server';
import { createId, readDb, writeDb } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';
import { authCookieOptions } from '@/lib/http';

export async function POST(request) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
  }

  const db = await readDb();
  const normalizedEmail = email.trim().toLowerCase();

  if (db.users.some((user) => user.email === normalizedEmail)) {
    return NextResponse.json({ error: 'Email already exists.' }, { status: 409 });
  }

  const user = {
    id: createId('user'),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  await writeDb(db);

  const token = signToken({ userId: user.id, email: user.email, name: user.name });
  const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
  response.cookies.set('auth_token', token, authCookieOptions());

  return response;
}
