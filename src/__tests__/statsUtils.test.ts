import {
  formatMonthName,
  calculateTopExercises,
  calculateMonthlyStats,
  calculateSummaryComparison,
} from '@/lib/statsUtils';
import { WeightEntry } from '@/types/weight';

describe('statsUtils', () => {
  const sampleLogs: WeightEntry[] = [
    {
      id: '1',
      weight: 82.0,
      date: '2026-09-05',
      didExercise: true,
      exerciseDetails: 'Running, Swimming',
    },
    {
      id: '2',
      weight: 80.5,
      date: '2026-09-20',
      didExercise: false,
      exerciseDetails: '',
    },
    {
      id: '3',
      weight: 79.0,
      date: '2026-10-02',
      didExercise: true,
      exerciseDetails: 'Running and Cycling',
    },
    {
      id: '4',
      weight: 78.2,
      date: '2026-10-15',
      didExercise: true,
      exerciseDetails: 'running',
    },
  ];

  test('formatMonthName formats YYYY-MM into readable Month Year', () => {
    expect(formatMonthName('2026-10')).toBe('October 2026');
    expect(formatMonthName('invalid')).toBe('invalid');
  });

  test('calculateTopExercises ranks activities case-insensitively and splits delimiters', () => {
    const top = calculateTopExercises(sampleLogs, 3);
    expect(top[0]).toEqual({
      name: 'Running',
      count: 3,
      percentage: 60,
    });
    expect(top).toHaveLength(3);
  });

  test('calculateMonthlyStats groups logs by month and calculates weight deltas and averages', () => {
    const stats = calculateMonthlyStats(sampleLogs);
    expect(stats).toHaveLength(2);

    const oct = stats.find((s) => s.monthKey === '2026-10')!;
    expect(oct.totalLogs).toBe(2);
    expect(oct.startWeight).toBe(79.0);
    expect(oct.endWeight).toBe(78.2);
    expect(oct.weightChange).toBe(-0.8);
    expect(oct.minWeight).toBe(78.2);
    expect(oct.maxWeight).toBe(79.0);
    expect(oct.averageWeight).toBe(78.6);
    expect(oct.exerciseDays).toBe(2);
    expect(oct.exerciseRate).toBe(100);

    const sep = stats.find((s) => s.monthKey === '2026-09')!;
    expect(sep.weightChange).toBe(-1.5);
    expect(sep.exerciseRate).toBe(50);
  });

  test('calculateSummaryComparison computes all-time weight change and total counts', () => {
    const summary = calculateSummaryComparison(sampleLogs);
    expect(summary.totalLogsCount).toBe(4);
    expect(summary.totalExerciseDays).toBe(3);
    expect(summary.allTimeWeightChange).toBe(-3.8);
    expect(summary.topExercises[0].name).toBe('Running');
  });
});
