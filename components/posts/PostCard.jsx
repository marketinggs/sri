'use client';

export default function PostCard({ post, canManage, onEdit, onDelete }) {
  return (
    <article className="slide-up rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-2 flex items-start justify-between gap-4">
        <div>
          <h4 className="text-xl font-semibold text-gray-900">{post.title}</h4>
          <p className="text-xs text-gray-500">
            By {post.author} • Updated {new Date(post.updatedAt).toLocaleString()}
          </p>
        </div>
        {canManage ? (
          <div className="flex gap-2">
            <button type="button" className="rounded bg-gray-100 px-2 py-1 text-xs" onClick={() => onEdit(post)}>
              Edit
            </button>
            <button type="button" className="rounded bg-red-100 px-2 py-1 text-xs text-red-700" onClick={() => onDelete(post.id)}>
              Delete
            </button>
          </div>
        ) : null}
      </div>
      <p className="whitespace-pre-wrap text-gray-700">{post.content}</p>
    </article>
  );
}
