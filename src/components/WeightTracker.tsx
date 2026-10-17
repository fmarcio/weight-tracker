'use client';

import { AlertTriangle } from 'lucide-react';
import WeightForm from './WeightForm';
import WeightStats from './WeightStats';
import WeightHistory from './WeightHistory';
import { useWeightLogs } from '@/hooks/useWeightLogs';
import { isFirebaseConfigured } from '@/lib/firebase';
import {
  addWeightLog,
  deleteWeightLog,
  deleteMultipleWeightLogs,
  updateWeightLog,
} from '@/lib/weightService';

export default function WeightTracker() {
  const { logs, isLoading, errorMessage, setErrorMessage, currentUid } =
    useWeightLogs();

  const runAction = async (
    action: () => Promise<unknown>,
    fallbackError: string,
  ) => {
    try {
      setErrorMessage(null);
      await action();
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message || fallbackError;
      setErrorMessage(message);
    }
  };

  const handleAddWeight = (
    weight: number,
    date: string,
    didExercise?: boolean,
    exerciseDetails?: string,
  ) =>
    runAction(
      () =>
        addWeightLog(
          weight,
          date,
          didExercise,
          exerciseDetails,
          currentUid,
        ),
      'Failed to save weight log.',
    );

  const handleDeleteLog = (id: string) =>
    runAction(() => deleteWeightLog(id), 'Failed to delete weight log.');

  const handleEditLog = (
    id: string,
    updatedData: {
      weight: number;
      date: string;
      didExercise: boolean;
      exerciseDetails: string;
    },
  ) =>
    runAction(
      () => updateWeightLog(id, updatedData),
      'Failed to update weight log.',
    );

  const handleDeleteMultipleLogs = (ids: string[]) =>
    runAction(
      () => deleteMultipleWeightLogs(ids),
      'Failed to delete selected logs.',
    );

  return (
    <div className='max-w-2xl mx-auto space-y-8'>
      {!isFirebaseConfigured && (
        <div className='bg-neutral-100 border border-neutral-300 rounded-xl p-4 text-neutral-800 text-xs flex items-center gap-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200'>
          <AlertTriangle
            className='w-4 h-4 text-neutral-700 dark:text-neutral-300 shrink-0'
            strokeWidth={2}
          />
          <span>
            Database connection is currently unavailable. Please verify service
            configuration.
          </span>
        </div>
      )}

      {errorMessage && (
        <div className='bg-neutral-100 border border-neutral-300 rounded-xl p-4 text-neutral-800 text-xs flex items-center justify-between dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200'>
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className='text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white font-bold ml-2 cursor-pointer'
          >
            ✕
          </button>
        </div>
      )}

      <WeightForm onAddWeight={handleAddWeight} />

      <WeightStats logs={logs} />

      {isLoading ? (
        <div className='bg-neutral-50 border border-neutral-200 rounded-2xl p-12 text-center text-neutral-600 text-sm animate-pulse flex flex-col items-center justify-center gap-3 dark:bg-[#202020] dark:border-neutral-800 dark:text-neutral-400'>
          <div className='w-6 h-6 border-2 border-neutral-900 dark:border-neutral-100 border-t-transparent rounded-full animate-spin'></div>
          <span>Loading records...</span>
        </div>
      ) : (
        <WeightHistory
          logs={logs}
          onDeleteLog={handleDeleteLog}
          onEditLog={handleEditLog}
          onDeleteMultipleLogs={handleDeleteMultipleLogs}
        />
      )}
    </div>
  );
}
