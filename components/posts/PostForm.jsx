'use client';

import { useState } from 'react';

export default function PostForm({ onSave, initialPost, onCancel }) {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  return (
    <form
      className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        setError('');
        setSubmitting(true);
        try {
          await onSave({ title, content });
          if (!initialPost) {
            setTitle('');
            setContent('');
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <h3 className="text-lg font-semibold text-gray-900">{initialPost ? 'Edit Post' : 'Create a Post'}</h3>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none ring-indigo-500 transition focus:ring"
        placeholder="Post title"
        required
      />
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={5}
        className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none ring-indigo-500 transition focus:ring"
        placeholder="Write your content..."
        required
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex gap-2">
        <button
          disabled={submitting}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60"
          type="submit"
        >
          {submitting ? 'Saving...' : initialPost ? 'Update Post' : 'Publish Post'}
        </button>
        {initialPost ? (
          <button type="button" onClick={onCancel} className="rounded-xl bg-gray-100 px-4 py-2 text-sm text-gray-800">
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
