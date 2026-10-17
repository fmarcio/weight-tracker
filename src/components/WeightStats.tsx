import Link from 'next/link';
import { WeightEntry } from '@/types/weight';

interface WeightStatsProps {
  logs: WeightEntry[];
}

export default function WeightStats({ logs }: WeightStatsProps) {
  const latestWeight = logs.length > 0 ? `${logs[0].weight} kg` : '--';

  return (
    <div className='space-y-3'>
      <div className='grid grid-cols-2 gap-4'>
        <div className='bg-neutral-50 border border-neutral-200 dark:bg-[#202020] dark:border-neutral-800 rounded-xl p-4 text-center transition-colors'>
          <p className='text-xs font-medium text-neutral-500 dark:text-neutral-400'>Latest Weight</p>
          <p className='text-2xl font-bold text-neutral-900 dark:text-white mt-1'>
            {latestWeight}
          </p>
        </div>
        <div className='bg-neutral-50 border border-neutral-200 dark:bg-[#202020] dark:border-neutral-800 rounded-xl p-4 text-center transition-colors'>
          <p className='text-xs font-medium text-neutral-500 dark:text-neutral-400'>Total Logs</p>
          <p className='text-2xl font-bold text-neutral-900 dark:text-white mt-1'>{logs.length}</p>
        </div>
      </div>

      <Link
        href='/stats'
        className='group flex items-center justify-between px-4 py-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-300 dark:bg-[#202020] dark:hover:bg-neutral-800 dark:border-neutral-800 rounded-xl transition'
      >
        <div className='text-xs text-neutral-700 dark:text-neutral-300'>
          <strong className='text-neutral-900 dark:text-white font-semibold group-hover:underline'>
            View Monthly Stats & Progression
          </strong>
        </div>
        <span className='text-xs text-neutral-400 group-hover:text-neutral-900 dark:text-neutral-500 dark:group-hover:text-white transition'>
          →
        </span>
      </Link>
    </div>
  );
}
