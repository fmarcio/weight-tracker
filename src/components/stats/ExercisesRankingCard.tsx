import { Trophy } from 'lucide-react';
import { RankedExercise } from '@/types/weight';

interface ExercisesRankingCardProps {
  topExercises: RankedExercise[];
}

export default function ExercisesRankingCard({
  topExercises,
}: ExercisesRankingCardProps) {
  return (
    <div className="bg-neutral-50 border border-neutral-200 dark:bg-[#202020] dark:border-neutral-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy
              className="w-4 h-4 text-neutral-900 dark:text-white"
              strokeWidth={2}
            />{' '}
            Exercises Ranking
          </p>
          <span className="text-[10px] text-neutral-600 dark:text-neutral-400 font-medium bg-neutral-100 dark:bg-[#191919] px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800">
            Top 3 All-Time
          </span>
        </div>

        {topExercises && topExercises.length > 0 ? (
          <div className="space-y-2 mt-3">
            {topExercises.map((exercise, index) => (
              <div
                key={exercise.name}
                className="bg-white border border-neutral-200 hover:border-neutral-300 dark:bg-[#191919] dark:border-neutral-800 dark:hover:border-neutral-700 rounded-xl px-3 py-2 flex items-center justify-between gap-2 transition"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 w-5 shrink-0">
                    #{index + 1}
                  </span>
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-200 truncate">
                    {exercise.name}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">
                    {exercise.count}x
                  </span>
                  <span className="text-[10px] text-neutral-500 ml-1">
                    ({exercise.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-neutral-500 text-xs">
            <p>No workout notes logged yet.</p>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-600 mt-1">
              Type exercise names (e.g. &apos;Running&apos;, &apos;Gym&apos;) in
              your logs to generate your top 3!
            </p>
          </div>
        )}
      </div>

      <p className="text-[10px] text-neutral-500">
        Aggregated from your exercise descriptions
      </p>
    </div>
  );
}
