'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function NavbarNav() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading || !user) {
    return null;
  }

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    return `px-3 py-1.5 rounded-lg transition ${
      isActive
        ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-white font-semibold'
        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800'
    }`;
  };

  return (
    <nav className="flex items-center gap-1 text-sm font-medium">
      <Link href="/" className={getLinkClasses('/')}>
        Dashboard
      </Link>
      <Link href="/stats" className={getLinkClasses('/stats')}>
        Stats
      </Link>
      <Link href="/charts" className={getLinkClasses('/charts')}>
        Charts
      </Link>
    </nav>
  );
}
