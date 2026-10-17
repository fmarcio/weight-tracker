import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import NavbarAuth from '@/components/NavbarAuth';
import NavbarNav from '@/components/NavbarNav';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Weight Tracker - Evolution & Progress',
  description:
    'Track daily weight measurements, visualize your health trends, and achieve your goals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className='min-h-full flex flex-col bg-white text-neutral-900 dark:bg-[#191919] dark:text-neutral-100 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-neutral-100 dark:selection:text-neutral-900 transition-colors duration-200'>
        <ThemeProvider>
          <AuthProvider>
            <header className='border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#191919] sticky top-0 z-50 transition-colors'>
              <div className='max-w-6xl mx-auto px-4 h-16 flex items-center justify-between'>
                <div className='flex items-center gap-6'>
                  <Link href='/' className='flex items-center gap-3 group'>
                    <div className='w-9 h-9 rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 flex items-center justify-center font-bold transition'>
                      <Zap className='w-5 h-5' strokeWidth={2} />
                    </div>
                    <span className='font-semibold text-lg tracking-tight text-neutral-900 dark:text-white'>
                      Weight Tracker
                    </span>
                  </Link>

                  <NavbarNav />
                </div>

                <div className='flex items-center gap-2 sm:gap-3'>
                  <NavbarAuth />
                  <ThemeToggle />
                </div>
              </div>
            </header>

            <main className='flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6'>
              {children}
            </main>

            <footer className='border-t border-neutral-200 dark:border-neutral-800 py-6 text-center text-xs text-neutral-500 dark:text-neutral-400'>
              &copy; {new Date().getFullYear()} Weight Tracker &bull; Precision
              Health & Progress Monitoring &bull; Developed by{' '}
              <a
                href='https://github.com/fmarcio'
                target='_blank'
                rel='noopener noreferrer'
                className='font-medium text-neutral-800 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white underline transition'
              >
                fmarcio
              </a>
            </footer>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
