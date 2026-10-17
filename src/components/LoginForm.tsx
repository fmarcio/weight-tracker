'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AlreadySignedInCard from './AlreadySignedInCard';
import {
  formatAuthError,
  validateCredentials,
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
} from '@/lib/authService';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;

export default function LoginForm() {
  const router = useRouter();
  const { user, login, logout } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  useEffect(() => {
    if (lockoutTimer <= 0) return;

    const interval = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutTimer]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (lockoutTimer > 0) {
      setErrorMessage(
        `Too many failed attempts. Please wait ${lockoutTimer} seconds before trying again.`
      );
      return;
    }

    const validationError = validateCredentials(email, password, false);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      setFailedAttempts(0);
      router.push('/');
    } catch (err: unknown) {
      const newFailCount = failedAttempts + 1;
      setFailedAttempts(newFailCount);

      if (newFailCount >= MAX_FAILED_ATTEMPTS) {
        setLockoutTimer(LOCKOUT_SECONDS);
        setErrorMessage(
          `Too many failed login attempts. Form locked for ${LOCKOUT_SECONDS} seconds.`
        );
      } else {
        const errCode =
          (err as { code?: string; message?: string })?.code ||
          (err as { message?: string })?.message ||
          '';
        const message = formatAuthError(errCode);
        setErrorMessage(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user) {
    return <AlreadySignedInCard email={user.email} onLogout={() => logout()} />;
  }

  const isFormDisabled = isSubmitting || lockoutTimer > 0;

  return (
    <div className="bg-neutral-50 border border-neutral-200 dark:bg-[#202020] dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
          Login
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Enter your credentials to access your weight tracking dashboard
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-300 text-neutral-800 text-xs dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            maxLength={EMAIL_MAX_LENGTH}
            disabled={isFormDisabled}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 dark:bg-[#191919] dark:border-neutral-700 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-neutral-300 text-sm transition disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            maxLength={PASSWORD_MAX_LENGTH}
            disabled={isFormDisabled}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 dark:bg-[#191919] dark:border-neutral-700 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-neutral-300 text-sm transition disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={isFormDisabled}
          className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-900 font-semibold text-sm transition active:scale-[0.99] disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting
            ? 'Logging in...'
            : lockoutTimer > 0
            ? `Locked (${lockoutTimer}s)`
            : 'Login'}
        </button>
      </form>

      <div className="text-center text-xs text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-200 dark:border-neutral-800">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="text-neutral-900 hover:text-neutral-700 dark:text-white dark:hover:text-neutral-300 font-semibold underline"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}
