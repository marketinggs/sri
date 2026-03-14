'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  return (
    <section className="mx-auto max-w-md">
      <form
        className="slide-up space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        onSubmit={async (event) => {
          event.preventDefault();
          setError('');
          setSubmitting(true);
          try {
            await signup(form);
            router.push('/dashboard');
          } catch (err) {
            setError(err.message);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <h1 className="text-2xl font-bold">Create Account</h1>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(event) => setForm((old) => ({ ...old, name: event.target.value }))}
          className="w-full rounded-xl border border-gray-300 px-3 py-2"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm((old) => ({ ...old, email: event.target.value }))}
          className="w-full rounded-xl border border-gray-300 px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) => setForm((old) => ({ ...old, password: event.target.value }))}
          className="w-full rounded-xl border border-gray-300 px-3 py-2"
          required
          minLength={6}
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button disabled={submitting} className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-white" type="submit">
          {submitting ? 'Creating account...' : 'Signup'}
        </button>
      </form>
    </section>
  );
}
