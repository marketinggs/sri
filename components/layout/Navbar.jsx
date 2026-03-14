'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../providers/AuthProvider';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  const navClass = (href) =>
    `rounded-full px-4 py-2 text-sm transition ${pathname === href ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="text-lg font-bold text-gray-900">HackFlow</Link>
        <nav className="flex items-center gap-2">
          <Link href="/" className={navClass('/')}>Home</Link>
          <Link href="/dashboard" className={navClass('/dashboard')}>Dashboard</Link>
          {!loading && !user ? (
            <>
              <Link href="/login" className={navClass('/login')}>Login</Link>
              <Link href="/signup" className={navClass('/signup')}>Signup</Link>
            </>
          ) : null}
          {!loading && user ? (
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push('/');
              }}
              className="rounded-full bg-gray-900 px-4 py-2 text-sm text-white transition hover:bg-gray-700"
            >
              Logout
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
