import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';
import { verifyPassword, signToken } from '@/lib/auth';
import { authCookieOptions } from '@/lib/http';

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const db = await readDb();
  const normalizedEmail = email.trim().toLowerCase();
  const user = db.users.find((candidate) => candidate.email === normalizedEmail);

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const token = signToken({ userId: user.id, email: user.email, name: user.name });
  const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
  response.cookies.set('auth_token', token, authCookieOptions());

  return response;
}
