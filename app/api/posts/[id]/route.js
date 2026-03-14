import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getCurrentUserFromCookie } from '@/lib/http';

export async function PUT(request, { params }) {
  const user = await getCurrentUserFromCookie();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const { title, content } = await request.json();

  const db = await readDb();
  const index = db.posts.findIndex((post) => post.id === id);

  if (index === -1) return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
  if (db.posts[index].authorId !== user.userId) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  db.posts[index] = {
    ...db.posts[index],
    title: title?.trim() || db.posts[index].title,
    content: content?.trim() || db.posts[index].content,
    updatedAt: new Date().toISOString(),
  };

  await writeDb(db);
  return NextResponse.json({ post: { ...db.posts[index], author: user.name } });
}

export async function DELETE(_request, { params }) {
  const user = await getCurrentUserFromCookie();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const db = await readDb();
  const post = db.posts.find((candidate) => candidate.id === id);

  if (!post) return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
  if (post.authorId !== user.userId) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  db.posts = db.posts.filter((candidate) => candidate.id !== id);
  await writeDb(db);

  return NextResponse.json({ ok: true });
}
