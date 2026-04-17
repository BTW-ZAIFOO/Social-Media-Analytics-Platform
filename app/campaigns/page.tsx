'use client';

import Link from 'next/link';

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
        <h1 className="text-4xl font-bold text-slate-900">Campaigns</h1>
        <p className="mt-4 text-slate-600">
          This route is not yet implemented in the frontend. For now, use the main dashboard at
          <span className="font-semibold text-slate-900"> / </span>.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/api/campaigns"
            className="inline-flex justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            View Campaign API
          </Link>
        </div>
      </div>
    </div>
  );
}
