import Link from 'next/link';

export default function Home() {
  return (
    <section className="fade-in grid gap-6 md:grid-cols-2 md:items-center">
      <div className="space-y-4">
        <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">Hackathon Ready</span>
        <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl">Build, publish, and manage dynamic content in minutes.</h1>
        <p className="text-gray-600">
          HackFlow is a fully responsive starter platform featuring secure authentication, API-powered CRUD, reusable components, and clean modern UI.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/signup" className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-500">
            Create account
          </Link>
          <Link href="/dashboard" className="rounded-xl bg-gray-200 px-5 py-3 font-medium text-gray-900 transition hover:bg-gray-300">
            Open dashboard
          </Link>
        </div>
      </div>
      <div className="scale-in rounded-3xl border border-indigo-100 bg-white p-6 shadow-lg">
        <ul className="space-y-3 text-gray-700">
          <li>✅ JWT-style cookie auth flow (signup/login/logout)</li>
          <li>✅ Database-backed posts with create/edit/delete APIs</li>
          <li>✅ Responsive mobile-first design</li>
          <li>✅ Smooth transitions and animated cards</li>
          <li>✅ Seed script with sample users and posts</li>
        </ul>
      </div>
    </section>
  );
}
