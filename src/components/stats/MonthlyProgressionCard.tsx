import { Calendar } from 'lucide-react';
import { MonthlyStats } from '@/types/weight';

interface MonthlyProgressionCardProps {
  month: MonthlyStats;
}

function renderProgressionBadge(change: number, monthName: string) {
  if (change < 0) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
        Lost {Math.abs(change).toFixed(2)} kg in {monthName}
      </span>
    );
  }
  if (change > 0) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-200 text-neutral-800 border border-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700">
        Gained {change.toFixed(2)} kg in {monthName}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700">
      Maintained weight in {monthName}
    </span>
  );
}

export default function MonthlyProgressionCard({
  month,
}: MonthlyProgressionCardProps) {
  const metrics = [
    { label: 'Start Weight', value: `${month.startWeight} kg`, highlight: false },
    { label: 'End Weight', value: `${month.endWeight} kg`, highlight: false },
    { label: 'Lowest', value: `${month.minWeight} kg`, highlight: true },
    { label: 'Average', value: `${month.averageWeight} kg`, highlight: true },
    {
      label: 'Workouts',
      value: `${month.exerciseDays} / ${month.totalLogs} days`,
      highlight: true,
      spanCols: true,
    },
  ];

  return (
    <div className="bg-neutral-50 border border-neutral-200 dark:bg-[#202020] dark:border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Calendar
              className="w-5 h-5 text-neutral-900 dark:text-white"
              strokeWidth={2}
            />{' '}
            {month.monthName}
          </h3>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            <span>
              {month.totalLogs} {month.totalLogs === 1 ? 'entry' : 'entries'}
            </span>
            <span>&bull;</span>
            <span className="text-neutral-800 dark:text-neutral-200 font-medium">
              {month.exerciseDays} workout{' '}
              {month.exerciseDays === 1 ? 'day' : 'days'} ({month.exerciseRate}%
              active)
            </span>
          </div>
        </div>

        <div>{renderProgressionBadge(month.weightChange, month.monthName)}</div>
      </div>

      <p className="text-sm text-neutral-600 dark:text-neutral-300">
        In{' '}
        <span className="font-semibold text-neutral-900 dark:text-white">
          {month.monthName}
        </span>
        , you{' '}
        {month.weightChange < 0 ? (
          <>
            lost{' '}
            <span className="font-bold text-neutral-900 dark:text-white">
              {Math.abs(month.weightChange).toFixed(2)} kg
            </span>
          </>
        ) : month.weightChange > 0 ? (
          <>
            gained{' '}
            <span className="font-bold text-neutral-900 dark:text-white">
              {month.weightChange.toFixed(2)} kg
            </span>
          </>
        ) : (
          <span className="font-medium text-neutral-500 dark:text-neutral-400">
            maintained your weight
          </span>
        )}{' '}
        (started at{' '}
        <strong className="text-neutral-900 dark:text-white">
          {month.startWeight} kg
        </strong>{' '}
        and ended at{' '}
        <strong className="text-neutral-900 dark:text-white">
          {month.endWeight} kg
        </strong>
        ).
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={`bg-white border border-neutral-200 dark:bg-[#191919] dark:border-neutral-800 rounded-xl p-3 ${
              m.spanCols ? 'col-span-2 sm:col-span-1' : ''
            }`}
          >
            <span className="text-[11px] font-medium text-neutral-500 uppercase block">
              {m.label}
            </span>
            <span
              className={`text-sm font-bold mt-1 block ${
                m.highlight
                  ? 'text-neutral-900 dark:text-white'
                  : 'text-neutral-800 dark:text-neutral-200'
              }`}
            >
              {m.value}
            </span>
          </div>
        ))}
      </div>

      {month.workoutNotes.length > 0 && (
        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            Logged workouts in {month.monthName}:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {month.workoutNotes.map((note, index) => (
              <span
                key={index}
                className="text-xs px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-neutral-700 dark:bg-[#191919] dark:border-neutral-800 dark:text-neutral-300"
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
