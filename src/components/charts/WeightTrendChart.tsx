"use client";

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { WeightEntry } from "@/types/weight";
import { TrendingDown } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useIsMounted } from "@/hooks/useIsMounted";
import ChartCard from "./ChartCard";

interface WeightTrendChartProps {
  logs: WeightEntry[];
}

type TimeRange = "7D" | "30D" | "90D" | "ALL";

export default function WeightTrendChart({ logs }: WeightTrendChartProps) {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState<TimeRange>("30D");
  const isMounted = useIsMounted();

  const chartData = useMemo(() => {
    if (!logs || logs.length === 0) return [];

    const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));

    if (timeRange === "ALL") {
      return sorted;
    }

    const daysLimit = timeRange === "7D" ? 7 : timeRange === "30D" ? 30 : 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysLimit);
    const cutoffString = cutoffDate.toISOString().split("T")[0];

    const filtered = sorted.filter((entry) => entry.date >= cutoffString);
    return filtered.length > 0 ? filtered : sorted.slice(-daysLimit);
  }, [logs, timeRange]);

  const stats = useMemo(() => {
    if (chartData.length === 0) return null;
    const weights = chartData.map((d) => d.weight);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const avg = Number((weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1));
    const first = chartData[0].weight;
    const last = chartData[chartData.length - 1].weight;
    const change = Number((last - first).toFixed(2));

    return { min, max, avg, change };
  }, [chartData]);

  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 100];
    const weights = chartData.map((d) => d.weight);
    const min = Math.floor(Math.min(...weights) - 1);
    const max = Math.ceil(Math.max(...weights) + 1);
    return [Math.max(0, min), max];
  }, [chartData]);

  const isDark = theme === "dark";
  const lineColor = isDark ? "#f5f5f5" : "#171717";
  const areaFillColor = isDark ? "#2f2f2f" : "#e5e5e5";
  const gridColor = isDark ? "#2f2f2f" : "#e5e5e5";
  const axisColor = isDark ? "#a3a3a3" : "#737373";

  return (
    <ChartCard>
      <ChartCard.Header
        title={
          <span className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-neutral-900 dark:text-white" strokeWidth={2} /> Weight Tracking
          </span>
        }
        subtitle="Visual progression curve over time"
        badge={
          stats && (
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold border bg-neutral-100 text-neutral-800 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700">
              {stats.change > 0 ? "+" : ""}
              {stats.change} kg in view
            </span>
          )
        }
        action={
          <div className="flex items-center bg-neutral-100 dark:bg-[#191919] p-1 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs">
            {(["7D", "30D", "90D", "ALL"] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  timeRange === range
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        }
      />

      <ChartCard.Body>
        {!isMounted || chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-neutral-500 text-xs">
            {chartData.length === 0
              ? "No weight measurements recorded for this time range."
              : "Loading chart..."}
          </div>
        ) : (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={gridColor}
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  tickFormatter={(val) => {
                    const parts = val.split("-");
                    return parts.length === 3 ? `${parts[1]}/${parts[2]}` : val;
                  }}
                  stroke={axisColor}
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: gridColor }}
                />

                <YAxis
                  domain={yDomain}
                  stroke={axisColor}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  unit="kg"
                />

                <Tooltip
                  cursor={{ stroke: isDark ? "#404040" : "#d4d4d4", strokeWidth: 1 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as WeightEntry;
                      return (
                        <div className="bg-white border border-neutral-200 text-neutral-800 dark:bg-[#191919] dark:border-neutral-800 dark:text-white rounded-xl p-3 text-xs space-y-1.5 min-w-36">
                          <p className="text-neutral-500 dark:text-neutral-400 font-mono text-[11px]">
                            {data.date}
                          </p>
                          <p className="text-base font-bold text-neutral-900 dark:text-white">
                            {data.weight}{" "}
                            <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">
                              kg
                            </span>
                          </p>
                          {data.didExercise && (
                            <div className="pt-1 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-700 dark:text-neutral-300">
                              <span className="truncate max-w-44 block">
                                {data.exerciseDetails || "Workout completed"}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke={lineColor}
                  strokeWidth={2.5}
                  fillOpacity={0.35}
                  fill={areaFillColor}
                  activeDot={{
                    r: 5,
                    fill: lineColor,
                    stroke: isDark ? "#191919" : "#ffffff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard.Body>

      {stats && (
        <ChartCard.Footer>
          <div className="flex items-center gap-4 flex-wrap">
            <span>
              Lowest: <strong className="text-neutral-900 dark:text-white">{stats.min} kg</strong>
            </span>
            <span>&bull;</span>
            <span>
              Highest: <strong className="text-neutral-900 dark:text-white">{stats.max} kg</strong>
            </span>
            <span>&bull;</span>
            <span>
              Average: <strong className="text-neutral-900 dark:text-white">{stats.avg} kg</strong>
            </span>
          </div>

          <span className="text-neutral-500 text-[11px]">
            {chartData.length} weigh-in data points
          </span>
        </ChartCard.Footer>
      )}
    </ChartCard>
  );
}
