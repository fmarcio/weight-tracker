'use client';

import Link from 'next/link';

interface AlreadySignedInCardProps {
  email: string | null | undefined;
  onLogout: () => void;
}

export default function AlreadySignedInCard({
  email,
  onLogout,
}: AlreadySignedInCardProps) {
  return (
    <div className="bg-neutral-50 border border-neutral-200 dark:bg-[#202020] dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4 text-center">
      <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
        Already Signed In
      </h1>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        You are currently signed in as{' '}
        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
          {email}
        </span>
        .
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-900 text-xs font-semibold transition"
        >
          Go to Dashboard
        </Link>
        <button
          onClick={onLogout}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold transition cursor-pointer"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
