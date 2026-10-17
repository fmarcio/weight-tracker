'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function NavbarAuth() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-neutral-500 dark:text-neutral-400 hidden sm:inline-block max-w-[140px] truncate font-medium">
          {user.email}
        </span>
        <button
          onClick={() => logout()}
          className="px-2.5 py-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800 font-medium transition cursor-pointer"
        >
          Log Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Link
        href="/login"
        className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800 transition"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800 transition"
      >
        New Account
      </Link>
    </div>
  );
}
