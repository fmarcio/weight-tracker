"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { WeightEntry } from "@/types/weight";
import { formatMonthName } from "@/lib/statsUtils";
import { Activity } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useIsMounted } from "@/hooks/useIsMounted";
import ChartCard from "./ChartCard";

interface ExerciseActivityChartProps {
  logs: WeightEntry[];
}

export default function ExerciseActivityChart({
  logs,
}: ExerciseActivityChartProps) {
  const { theme } = useTheme();
  const isMounted = useIsMounted();

  const monthlyData = useMemo(() => {
    if (!logs || logs.length === 0) return [];

    const groups: Record<string, WeightEntry[]> = {};
    logs.forEach((log) => {
      const monthKey = log.date.slice(0, 7);
      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push(log);
    });

    const result = Object.entries(groups)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([monthKey, entries]) => {
        const [yearStr, monthStr] = monthKey.split("-");
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);

        const daysInMonth = new Date(year, month, 0).getDate();
        const uniqueLoggedDays = new Set(entries.map((e) => e.date)).size;
        const uniqueExerciseDays = new Set(
          entries.filter((e) => Boolean(e.didExercise)).map((e) => e.date)
        ).size;

        const calendarConsistency = Math.round(
          (uniqueExerciseDays / daysInMonth) * 100
        );

        const loggedConsistency =
          uniqueLoggedDays > 0
            ? Math.round((uniqueExerciseDays / uniqueLoggedDays) * 100)
            : 0;

        return {
          monthKey,
          monthName: formatMonthName(monthKey),
          daysInMonth,
          loggedDays: uniqueLoggedDays,
          exerciseDays: uniqueExerciseDays,
          calendarConsistency,
          loggedConsistency,
        };
      });

    return result;
  }, [logs]);

  const totalStats = useMemo(() => {
    if (monthlyData.length === 0) return null;
    const totalExercises = monthlyData.reduce((acc, m) => acc + m.exerciseDays, 0);
    const totalLogged = monthlyData.reduce((acc, m) => acc + m.loggedDays, 0);
    return { totalExercises, totalLogged };
  }, [monthlyData]);

  const isDark = theme === "dark";
  const gridColor = isDark ? "#2f2f2f" : "#e5e5e5";
  const axisColor = isDark ? "#a3a3a3" : "#737373";
  const barDaysInMonthColor = isDark ? "#404040" : "#d4d4d4";
  const barLoggedDaysColor = isDark ? "#a3a3a3" : "#737373";
  const barExerciseDaysColor = isDark ? "#f5f5f5" : "#171717";

  return (
    <ChartCard>
      <ChartCard.Header
        title={
          <span className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-neutral-900 dark:text-white" strokeWidth={2} /> Days in Month vs. Exercises Done
          </span>
        }
        subtitle="Compare your workout frequency against total days in each month"
        badge={
          totalStats && (
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-neutral-100 text-neutral-800 border border-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700">
              {totalStats.totalExercises} total workout days
            </span>
          )
        }
      />

      <ChartCard.Body>
        {!isMounted || monthlyData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-neutral-500 text-xs">
            {monthlyData.length === 0
              ? "No monthly activity recorded yet. Start logging weights and workouts!"
              : "Loading chart..."}
          </div>
        ) : (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={gridColor}
                  vertical={false}
                />

                <XAxis
                  dataKey="monthName"
                  stroke={axisColor}
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: gridColor }}
                  tickFormatter={(val) => {
                    const parts = val.split(" ");
                    return parts.length === 2 ? `${parts[0].slice(0, 3)} '${parts[1].slice(-2)}` : val;
                  }}
                />

                <YAxis
                  stroke={axisColor}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  unit="d"
                />

                <Tooltip
                  cursor={{ fill: isDark ? "#262626" : "#f5f5f5" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as (typeof monthlyData)[0];
                      return (
                        <div className="bg-white border border-neutral-200 text-neutral-800 dark:bg-[#191919] dark:border-neutral-800 dark:text-white rounded-xl p-3 text-xs space-y-2 min-w-44">
                          <p className="text-neutral-900 dark:text-white font-bold text-sm border-b border-neutral-200 dark:border-neutral-800 pb-1">
                            {data.monthName}
                          </p>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-neutral-900 dark:text-white font-semibold">
                              <span>Exercises Done:</span>
                              <span>{data.exerciseDays} days</span>
                            </div>

                            <div className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
                              <span>Weight Logged:</span>
                              <span>{data.loggedDays} days</span>
                            </div>

                            <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                              <span>Calendar Month:</span>
                              <span>{data.daysInMonth} days</span>
                            </div>
                          </div>

                          <div className="pt-1.5 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-300">
                            Workout Consistency:{" "}
                            <strong className="text-neutral-900 dark:text-white">
                              {data.loggedConsistency}%
                            </strong>{" "}
                            of logged days
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ paddingBottom: 12, fontSize: 11 }}
                  formatter={(value) => (
                    <span className="text-neutral-600 dark:text-neutral-400 text-xs font-medium ml-1">
                      {value}
                    </span>
                  )}
                />

                <Bar
                  name="Days in Month"
                  dataKey="daysInMonth"
                  fill={barDaysInMonthColor}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                />

                <Bar
                  name="Weigh-in Days"
                  dataKey="loggedDays"
                  fill={barLoggedDaysColor}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                />

                <Bar
                  name="Exercises Done"
                  dataKey="exerciseDays"
                  fill={barExerciseDaysColor}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard.Body>

      {monthlyData.length > 0 && (
        <ChartCard.Footer>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 dark:bg-neutral-100 inline-block"></span>
            <span className="text-neutral-600 dark:text-neutral-300">
              Darkest/lightest bars represent days with workouts completed.
            </span>
          </div>

          <span className="text-neutral-500 text-[11px]">
            {monthlyData.length} {monthlyData.length === 1 ? "month" : "months"} tracked
          </span>
        </ChartCard.Footer>
      )}
    </ChartCard>
  );
}
