import type { Metadata } from 'next';
import RegisterForm from '@/components/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account - Weight Tracker',
  description: 'Create a new Weight Tracker account to start logging and monitoring your weight evolution.',
};

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto py-8 sm:py-14 px-2">
      <RegisterForm />
    </div>
  );
}
