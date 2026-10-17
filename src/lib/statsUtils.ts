import {
  WeightEntry,
  MonthlyStats,
  MonthComparisonSummary,
  RankedExercise,
} from '@/types/weight';

export function formatMonthName(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  if (!year || !month) return monthKey;

  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getPreviousMonthKey(): string {
  const now = new Date();
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const year = prevDate.getFullYear();
  const month = String(prevDate.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function calculateTopExercises(
  logs: WeightEntry[],
  limit = 3,
): RankedExercise[] {
  const frequencyMap: Record<string, number> = {};
  let totalEntriesCounted = 0;

  logs.forEach((log) => {
    if (!log.didExercise || !log.exerciseDetails?.trim()) return;

    const activities = log.exerciseDetails
      .split(/[,;/+]|\band\b/i)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    activities.forEach((activity) => {
      const normalized = activity
        .toLowerCase()
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      frequencyMap[normalized] = (frequencyMap[normalized] || 0) + 1;
      totalEntriesCounted += 1;
    });
  });

  return Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({
      name,
      count,
      percentage:
        totalEntriesCounted > 0
          ? Math.round((count / totalEntriesCounted) * 100)
          : 0,
    }));
}

export function calculateMonthlyStats(logs: WeightEntry[]): MonthlyStats[] {
  if (!logs || logs.length === 0) return [];

  const groups: Record<string, WeightEntry[]> = {};

  logs.forEach((log) => {
    const monthKey = log.date.slice(0, 7);
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(log);
  });

  const monthlyStatsList: MonthlyStats[] = Object.entries(groups).map(
    ([monthKey, entries]) => {
      const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

      const weights = sorted.map((e) => e.weight);
      const startWeight = sorted[0].weight;
      const endWeight = sorted[sorted.length - 1].weight;
      const weightChange = Number((endWeight - startWeight).toFixed(2));

      const minWeight = Math.min(...weights);
      const maxWeight = Math.max(...weights);
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      const averageWeight = Number((totalWeight / weights.length).toFixed(2));

      const exerciseDays = sorted.filter((e) => Boolean(e.didExercise)).length;
      const exerciseRate =
        entries.length > 0
          ? Math.round((exerciseDays / entries.length) * 100)
          : 0;

      const workoutNotes = sorted
        .map((e) => e.exerciseDetails?.trim())
        .filter((details): details is string =>
          Boolean(details && details.length > 0),
        );

      return {
        monthKey,
        monthName: formatMonthName(monthKey),
        totalLogs: entries.length,
        startWeight,
        endWeight,
        weightChange,
        minWeight,
        maxWeight,
        averageWeight,
        exerciseDays,
        exerciseRate,
        workoutNotes,
      };
    },
  );

  return monthlyStatsList.sort((a, b) => b.monthKey.localeCompare(a.monthKey));
}

export function calculateSummaryComparison(
  logs: WeightEntry[],
): MonthComparisonSummary {
  const currentMonthKey = getCurrentMonthKey();
  const previousMonthKey = getPreviousMonthKey();

  const monthlyStats = calculateMonthlyStats(logs);

  const currentMonthStats = monthlyStats.find(
    (s) => s.monthKey === currentMonthKey,
  );
  const previousMonthStats = monthlyStats.find(
    (s) => s.monthKey === previousMonthKey,
  );

  let allTimeWeightChange = 0;
  if (logs.length >= 2) {
    const chronological = [...logs].sort((a, b) =>
      a.date.localeCompare(b.date),
    );
    const firstWeight = chronological[0].weight;
    const lastWeight = chronological[chronological.length - 1].weight;
    allTimeWeightChange = Number((lastWeight - firstWeight).toFixed(2));
  }

  const totalExerciseDays = logs.filter((l) => Boolean(l.didExercise)).length;
  const topExercises = calculateTopExercises(logs, 3);

  return {
    currentMonthKey,
    currentMonthName: formatMonthName(currentMonthKey),
    currentMonthLogsCount: currentMonthStats?.totalLogs ?? 0,
    currentMonthProgression: currentMonthStats?.weightChange ?? 0,
    currentMonthExerciseDays: currentMonthStats?.exerciseDays ?? 0,

    previousMonthKey,
    previousMonthName: formatMonthName(previousMonthKey),
    previousMonthLogsCount: previousMonthStats?.totalLogs ?? 0,
    previousMonthProgression: previousMonthStats
      ? previousMonthStats.weightChange
      : null,
    previousMonthExerciseDays: previousMonthStats?.exerciseDays ?? 0,

    allTimeWeightChange,
    totalLogsCount: logs.length,
    totalExerciseDays,
    topExercises,
  };
}
