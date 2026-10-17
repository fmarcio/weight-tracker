'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import WeightTracker from '@/components/WeightTracker';
import LoginForm from '@/components/LoginForm';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-neutral-900 dark:border-neutral-100 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-neutral-500 dark:text-neutral-400">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-8 sm:py-14 px-2">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      <section className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Track Your Evolution
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm max-w-md mx-auto">
          Log daily measurements, monitor your progress, and take control of your health goals.
        </p>
      </section>

      <WeightTracker />
    </div>
  );
}
