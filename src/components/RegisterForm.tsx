'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AlreadySignedInCard from './AlreadySignedInCard';
import {
  formatAuthError,
  validateCredentials,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from '@/lib/authService';

export default function RegisterForm() {
  const router = useRouter();
  const { user, register, logout } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const validationError = validateCredentials(email, password, true);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify and retype.');
      return;
    }

    try {
      setIsSubmitting(true);
      await register(email, password);
      router.push('/');
    } catch (err: unknown) {
      const errCode =
        (err as { code?: string; message?: string })?.code ||
        (err as { message?: string })?.message ||
        '';
      const message = formatAuthError(errCode);
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user) {
    return <AlreadySignedInCard email={user.email} onLogout={() => logout()} />;
  }

  return (
    <div className="bg-neutral-50 border border-neutral-200 dark:bg-[#202020] dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
          Create Account
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Set up your credentials to track your progress and logs
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 dark:bg-[#191919] dark:border-neutral-700 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-neutral-300 text-sm transition"
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
            minLength={PASSWORD_MIN_LENGTH}
            maxLength={PASSWORD_MAX_LENGTH}
            autoComplete="new-password"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 dark:bg-[#191919] dark:border-neutral-700 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-neutral-300 text-sm transition"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            minLength={PASSWORD_MIN_LENGTH}
            maxLength={PASSWORD_MAX_LENGTH}
            autoComplete="new-password"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your password"
            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 dark:bg-[#191919] dark:border-neutral-700 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-neutral-300 text-sm transition"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-900 font-semibold text-sm transition active:scale-[0.99] disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center text-xs text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-200 dark:border-neutral-800">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-neutral-900 hover:text-neutral-700 dark:text-white dark:hover:text-neutral-300 font-semibold underline"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
