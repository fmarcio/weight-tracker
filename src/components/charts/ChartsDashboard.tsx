"use client";

import Link from "next/link";
import { LineChart } from "lucide-react";
import { useWeightLogs } from "@/hooks/useWeightLogs";
import WeightTrendChart from "./WeightTrendChart";
import ExerciseActivityChart from "./ExerciseActivityChart";

export default function ChartsDashboard() {
  const { logs, isLoading } = useWeightLogs();

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/"
              className="text-xs text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition flex items-center gap-1 font-medium"
            >
              <span>←</span> Back to Dashboard
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
            <LineChart className="w-7 h-7 text-neutral-900 dark:text-white" strokeWidth={2} /> Visual Analytics & Charts
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm mt-1">
            Interactive data visualization of your weight trend and workout consistency.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/stats"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 dark:bg-[#202020] dark:border-neutral-800 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800 transition"
          >
            Detailed Stats
          </Link>
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white dark:text-neutral-900 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white transition"
          >
            Log Weight
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-16 text-center text-neutral-500 text-sm animate-pulse flex flex-col items-center justify-center gap-3 dark:bg-[#202020] dark:border-neutral-800 dark:text-neutral-400">
          <div className="w-8 h-8 border-2 border-neutral-900 dark:border-neutral-100 border-t-transparent rounded-full animate-spin"></div>
          <span>Rendering analytics charts...</span>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-10 text-center space-y-4 dark:bg-[#202020] dark:border-neutral-800">
          <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-500 flex items-center justify-center mx-auto text-xl">
            <LineChart className="w-6 h-6 text-neutral-600 dark:text-neutral-400" strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">No data points available</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            Log your daily weight and workouts on the dashboard to generate your interactive
            charts and progress graphs!
          </p>
          <Link
            href="/"
            className="inline-block bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-900 font-bold px-5 py-2.5 rounded-xl text-xs transition"
          >
            Go to Dashboard & Log Weight
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <WeightTrendChart logs={logs} />
          <ExerciseActivityChart logs={logs} />
        </div>
      )}
    </div>
  );
}
