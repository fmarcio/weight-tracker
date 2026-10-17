"use client";

import Link from "next/link";
import { BarChart3, Activity } from "lucide-react";
import { MonthlyStats } from "@/types/weight";
import { useWeightLogs } from "@/hooks/useWeightLogs";
import {
  calculateMonthlyStats,
  calculateSummaryComparison,
} from "@/lib/statsUtils";
import StatMetricCard from "./stats/StatMetricCard";
import ExercisesRankingCard from "./stats/ExercisesRankingCard";
import MonthlyProgressionCard from "./stats/MonthlyProgressionCard";

export default function StatsDashboard() {
  const { logs, isLoading } = useWeightLogs();

  const summary = calculateSummaryComparison(logs);
  const monthlyBreakdowns = calculateMonthlyStats(logs);

  const logDiff =
    summary.currentMonthLogsCount - summary.previousMonthLogsCount;
  const exerciseDiff =
    summary.currentMonthExerciseDays - summary.previousMonthExerciseDays;

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
            <BarChart3
              className="w-7 h-7 text-neutral-900 dark:text-white"
              strokeWidth={2}
            />{" "}
            Weight Stats & Progression
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm mt-1">
            Track weigh-in habits, physical activity, and monthly evolution over
            time.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-900 transition active:scale-[0.98]"
        >
          Log New Weight
        </Link>
      </div>

      {isLoading ? (
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-12 text-center text-neutral-500 text-sm animate-pulse flex flex-col items-center justify-center gap-3 dark:bg-[#202020] dark:border-neutral-800 dark:text-neutral-400">
          <div className="w-6 h-6 border-2 border-neutral-900 dark:border-neutral-100 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading statistics...</span>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-10 text-center space-y-4 dark:bg-[#202020] dark:border-neutral-800">
          <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-500 flex items-center justify-center mx-auto text-xl">
            <BarChart3
              className="w-6 h-6 text-neutral-600 dark:text-neutral-400"
              strokeWidth={1.5}
            />
          </div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
            No weight logs found
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            You haven&apos;t logged any weight measurements yet. Start
            registering your weight and exercise habits on the dashboard to
            unlock detailed monthly progression stats!
          </p>
          <Link
            href="/"
            className="inline-block bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-900 font-bold px-5 py-2.5 rounded-xl text-xs transition"
          >
            Go to Dashboard & Log Weight
          </Link>
        </div>
      ) : (
        <>
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Overview & Frequency
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatMetricCard
                label={`${summary.currentMonthName} Logs`}
                value={summary.currentMonthLogsCount}
                unit="weigh-ins"
                footer={
                  <span
                    className={
                      logDiff >= 0
                        ? "text-neutral-800 dark:text-neutral-200 font-medium"
                        : "text-neutral-500 dark:text-neutral-400 font-medium"
                    }
                  >
                    {logDiff >= 0 ? `+${logDiff}` : logDiff} vs previous month
                  </span>
                }
              />

              <StatMetricCard
                label={`${summary.previousMonthName} Logs`}
                value={summary.previousMonthLogsCount}
                unit="weigh-ins"
                footer="Previous month activity"
              />

              <StatMetricCard
                label="This Month's Progress"
                value={`${
                  summary.currentMonthProgression > 0 ? "+" : ""
                }${summary.currentMonthProgression.toFixed(2)}`}
                unit="kg"
                footer={
                  summary.currentMonthProgression < 0
                    ? "Weight reduction so far"
                    : summary.currentMonthProgression > 0
                    ? "Weight gained so far"
                    : "No net change"
                }
              />

              <StatMetricCard
                label="All-Time Progression"
                value={`${
                  summary.allTimeWeightChange > 0 ? "+" : ""
                }${summary.allTimeWeightChange.toFixed(2)}`}
                unit="kg"
                footer={`Across ${summary.totalLogsCount} total entries`}
              />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
              <Activity
                className="w-4 h-4 text-neutral-900 dark:text-white"
                strokeWidth={2}
              />{" "}
              Physical Activity Habits
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatMetricCard
                  label={`${summary.currentMonthName} Workouts`}
                  value={summary.currentMonthExerciseDays}
                  unit="active days"
                  className="space-y-1.5 flex flex-col justify-between"
                  footer={
                    <span
                      className={
                        exerciseDiff >= 0
                          ? "text-neutral-800 dark:text-neutral-200 font-medium"
                          : "text-neutral-500 dark:text-neutral-400 font-medium"
                      }
                    >
                      {exerciseDiff >= 0 ? `+${exerciseDiff}` : exerciseDiff} vs{" "}
                      {summary.previousMonthName}
                    </span>
                  }
                />

                <StatMetricCard
                  label={`${summary.previousMonthName} Workouts`}
                  value={summary.previousMonthExerciseDays}
                  unit="active days"
                  className="space-y-1.5 flex flex-col justify-between"
                  footer="Recorded in previous month"
                />

                <StatMetricCard
                  label="Total Active Days"
                  value={summary.totalExerciseDays}
                  unit="sessions"
                  className="space-y-1.5 flex flex-col justify-between"
                  footer={
                    summary.totalLogsCount > 0
                      ? `${Math.round(
                          (summary.totalExerciseDays / summary.totalLogsCount) *
                            100
                        )}% consistency rate`
                      : "0% consistency"
                  }
                />
              </div>

              <ExercisesRankingCard topExercises={summary.topExercises} />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Monthly Progression History
            </h2>

            <div className="space-y-4">
              {monthlyBreakdowns.map((month: MonthlyStats) => (
                <MonthlyProgressionCard key={month.monthKey} month={month} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
