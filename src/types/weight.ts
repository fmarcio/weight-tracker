export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  didExercise?: boolean;
  exerciseDetails?: string;
  userId?: string;
  userEmail?: string;
}

export interface RankedExercise {
  name: string;
  count: number;
  percentage: number;
}

export interface MonthlyStats {
  monthKey: string;
  monthName: string;
  totalLogs: number;
  startWeight: number;
  endWeight: number;
  weightChange: number;
  minWeight: number;
  maxWeight: number;
  averageWeight: number;
  exerciseDays: number;
  exerciseRate: number;
  workoutNotes: string[];
}

export interface MonthComparisonSummary {
  currentMonthKey: string;
  currentMonthName: string;
  currentMonthLogsCount: number;
  currentMonthProgression: number;
  currentMonthExerciseDays: number;

  previousMonthKey: string;
  previousMonthName: string;
  previousMonthLogsCount: number;
  previousMonthProgression: number | null;
  previousMonthExerciseDays: number;

  allTimeWeightChange: number;
  totalLogsCount: number;
  totalExerciseDays: number;
  topExercises: RankedExercise[];
}
