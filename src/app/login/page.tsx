import type { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Login - Weight Tracker',
  description: 'Log in to your Weight Tracker account to manage your records and progression.',
};

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto py-8 sm:py-14 px-2">
      <LoginForm />
    </div>
  );
}
