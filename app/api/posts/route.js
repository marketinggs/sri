import { NextResponse } from 'next/server';
import { createId, readDb, writeDb } from '@/lib/db';
import { getCurrentUserFromCookie } from '@/lib/http';

export async function GET() {
  const db = await readDb();
  const posts = [...db.posts]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .map((post) => ({
      ...post,
      author: db.users.find((u) => u.id === post.authorId)?.name || 'Unknown',
    }));

  return NextResponse.json({ posts });
}

export async function POST(request) {
  const user = await getCurrentUserFromCookie();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, content } = await request.json();
  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
  }

  const db = await readDb();
  const now = new Date().toISOString();

  const post = {
    id: createId('post'),
    title: title.trim(),
    content: content.trim(),
    authorId: user.userId,
    createdAt: now,
    updatedAt: now,
  };

  db.posts.push(post);
  await writeDb(db);

  return NextResponse.json({ post: { ...post, author: user.name } }, { status: 201 });
}
