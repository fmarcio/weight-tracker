'use client';

import { EXERCISE_DETAILS_MAX_LENGTH } from '@/lib/weightService';

interface ExerciseFieldsProps {
  didExercise: boolean;
  exerciseDetails: string;
  onDidExerciseChange: (value: boolean) => void;
  onExerciseDetailsChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  compact?: boolean;
}

export default function ExerciseFields({
  didExercise,
  exerciseDetails,
  onDidExerciseChange,
  onExerciseDetailsChange,
  label = 'Did exercises today?',
  placeholder = 'e.g. 5km run, weightlifting, yoga, 40m cycling...',
  compact = false,
}: ExerciseFieldsProps) {
  return (
    <div
      className={`bg-neutral-100 border border-neutral-200 rounded-xl space-y-3 dark:bg-[#191919] dark:border-neutral-800 transition-colors ${
        compact ? 'p-3.5' : 'p-4'
      }`}
    >
      <div
        className={
          compact
            ? 'flex items-center justify-between'
            : 'flex flex-col sm:flex-row sm:items-center justify-between gap-3'
        }
      >
        <span
          className={`${
            compact ? 'text-xs' : 'text-sm'
          } font-medium text-neutral-700 dark:text-neutral-300`}
        >
          {label}
        </span>

        <div className={`flex items-center ${compact ? 'gap-2 text-xs' : 'gap-3 text-sm'}`}>
          <label
            className={`flex items-center cursor-pointer select-none rounded-lg border border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-700 dark:bg-[#202020] dark:hover:border-neutral-600 transition ${
              compact ? 'gap-1.5 px-2.5 py-1' : 'gap-2 px-3 py-1.5'
            }`}
          >
            <input
              type="checkbox"
              checked={didExercise}
              onChange={(e) => onDidExerciseChange(e.target.checked)}
              className={`${
                compact ? 'w-3.5 h-3.5' : 'w-4 h-4'
              } rounded bg-white border-neutral-300 dark:bg-[#191919] dark:border-neutral-700 accent-neutral-900 dark:accent-neutral-100 cursor-pointer`}
            />
            <span
              className={
                didExercise
                  ? 'text-neutral-900 dark:text-white font-semibold'
                  : 'text-neutral-500 dark:text-neutral-400'
              }
            >
              Yes
            </span>
          </label>

          <label
            className={`flex items-center cursor-pointer select-none rounded-lg border border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-700 dark:bg-[#202020] dark:hover:border-neutral-600 transition ${
              compact ? 'gap-1.5 px-2.5 py-1' : 'gap-2 px-3 py-1.5'
            }`}
          >
            <input
              type="checkbox"
              checked={!didExercise}
              onChange={(e) => {
                if (e.target.checked) {
                  onDidExerciseChange(false);
                  onExerciseDetailsChange('');
                }
              }}
              className={`${
                compact ? 'w-3.5 h-3.5' : 'w-4 h-4'
              } rounded bg-white border-neutral-300 dark:bg-[#191919] dark:border-neutral-700 accent-neutral-900 dark:accent-neutral-100 cursor-pointer`}
            />
            <span
              className={
                !didExercise
                  ? 'text-neutral-900 dark:text-white font-semibold'
                  : 'text-neutral-500 dark:text-neutral-400'
              }
            >
              No
            </span>
          </label>
        </div>
      </div>

      {didExercise && (
        <div className={compact ? '' : 'pt-2 animate-in fade-in duration-200'}>
          <label
            className={`block text-neutral-600 dark:text-neutral-400 ${
              compact ? 'text-[11px] mb-1' : 'text-xs mb-1.5 font-medium'
            }`}
          >
            Exercise details{' '}
            <span className="text-neutral-400 dark:text-neutral-500 font-normal">
              (optional)
            </span>
            :
          </label>
          <input
            type="text"
            maxLength={EXERCISE_DETAILS_MAX_LENGTH}
            value={exerciseDetails}
            onChange={(e) => onExerciseDetailsChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full bg-white border border-neutral-300 focus:border-neutral-900 rounded-xl text-neutral-900 placeholder-neutral-400 outline-none transition dark:bg-[#202020] dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:border-neutral-300 ${
              compact ? 'px-3 py-2 text-xs' : 'px-4 py-2.5 text-xs sm:text-sm'
            }`}
          />
        </div>
      )}
    </div>
  );
}
