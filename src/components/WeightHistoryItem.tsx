'use client';

import { WeightEntry } from '@/types/weight';

interface WeightHistoryItemProps {
  log: WeightEntry;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: (log: WeightEntry) => void;
  onDelete: (log: WeightEntry) => void;
}

export default function WeightHistoryItem({
  log,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
}: WeightHistoryItemProps) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3.5 transition gap-3 ${
        isSelected
          ? 'bg-neutral-200/70 hover:bg-neutral-200 border-l-2 border-l-neutral-900 dark:bg-neutral-800/80 dark:hover:bg-neutral-800 dark:border-l-white'
          : 'bg-white hover:bg-neutral-100 dark:bg-[#191919] dark:hover:bg-[#252525]'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(log.id)}
          className="w-4 h-4 rounded bg-white border-neutral-300 dark:bg-[#202020] dark:border-neutral-700 accent-neutral-900 dark:accent-neutral-100 cursor-pointer shrink-0"
          aria-label={`Select entry from ${log.date}`}
        />

        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-neutral-900 dark:text-white font-bold text-base">
              {log.weight}{' '}
              <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">
                kg
              </span>
            </p>

            {log.didExercise && (
              <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800 border border-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700">
                Workout
              </span>
            )}
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {log.date}
          </p>

          {log.didExercise && log.exerciseDetails && (
            <p className="text-xs text-neutral-700 italic bg-neutral-100 px-2 py-1 rounded border border-neutral-200 dark:bg-[#202020] dark:border-neutral-800 dark:text-neutral-300 inline-block mt-1 truncate max-w-xs sm:max-w-md">
              {log.exerciseDetails}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onEdit(log)}
          title="Edit entry"
          className="text-neutral-600 hover:text-neutral-900 text-sm font-medium px-2.5 py-1 rounded-md hover:bg-neutral-200/70 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 transition cursor-pointer"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(log)}
          title="Delete entry"
          className="text-neutral-500 hover:text-neutral-900 text-sm font-medium px-2.5 py-1 rounded-md hover:bg-neutral-200/70 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 transition cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
