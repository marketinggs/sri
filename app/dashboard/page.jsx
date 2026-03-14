'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PostForm from '@/components/posts/PostForm';
import PostCard from '@/components/posts/PostCard';
import { useAuth } from '@/components/providers/AuthProvider';

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [error, setError] = useState('');

  async function loadPosts() {
    try {
      const data = await fetchJson('/api/posts');
      setPosts(data.posts);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
      <div className="space-y-3">
        <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-5 text-white">
          <p className="text-sm opacity-90">Welcome back</p>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-xs opacity-80">{user.email}</p>
        </div>
        <PostForm
          initialPost={editingPost}
          onCancel={() => setEditingPost(null)}
          onSave={async (payload) => {
            if (editingPost) {
              await fetchJson(`/api/posts/${editingPost.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              });
              setEditingPost(null);
            } else {
              await fetchJson('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              });
            }
            await loadPosts();
          }}
        />
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Recent Posts</h2>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              canManage={post.authorId === user.userId}
              onEdit={(candidate) => setEditingPost(candidate)}
              onDelete={async (id) => {
                await fetchJson(`/api/posts/${id}`, { method: 'DELETE' });
                await loadPosts();
              }}
            />
          ))}
          {!posts.length ? <p className="text-gray-500">No posts yet. Publish your first post.</p> : null}
        </div>
      </div>
    </section>
  );
}
