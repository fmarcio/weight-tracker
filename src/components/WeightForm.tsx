"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { WEIGHT_MIN, WEIGHT_MAX } from "@/lib/weightService";
import ExerciseFields from "./ExerciseFields";

interface WeightFormProps {
  onAddWeight: (
    weight: number,
    date: string,
    didExercise?: boolean,
    exerciseDetails?: string
  ) => void;
}

export default function WeightForm({ onAddWeight }: WeightFormProps) {
  const [inputWeight, setInputWeight] = useState<string>("");
  const [inputDate, setInputDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [didExercise, setDidExercise] = useState<boolean>(false);
  const [exerciseDetails, setExerciseDetails] = useState<string>("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const numericWeight = parseFloat(inputWeight);

    if (
      isNaN(numericWeight) ||
      numericWeight < WEIGHT_MIN ||
      numericWeight > WEIGHT_MAX
    ) {
      alert(
        `Please enter a valid weight between ${WEIGHT_MIN} and ${WEIGHT_MAX} kg (e.g. 75.5)`
      );
      return;
    }

    onAddWeight(
      numericWeight,
      inputDate || new Date().toISOString().split("T")[0],
      didExercise,
      didExercise ? exerciseDetails.trim() : ""
    );

    setInputWeight("");
    setDidExercise(false);
    setExerciseDetails("");
  };

  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 dark:bg-[#202020] dark:border-neutral-800 space-y-5 transition-colors">
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-neutral-900 dark:text-white" strokeWidth={2} /> Log New Weight
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="number"
              step="0.1"
              min={WEIGHT_MIN}
              max={WEIGHT_MAX}
              value={inputWeight}
              onChange={(e) => setInputWeight(e.target.value)}
              placeholder="e.g. 74.5"
              className="w-full bg-white border border-neutral-300 focus:border-neutral-900 rounded-xl px-4 py-3 text-neutral-900 placeholder-neutral-400 outline-none transition dark:bg-[#191919] dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:border-neutral-300"
              required
            />
            <span className="absolute right-4 top-3.5 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase pointer-events-none">
              kg
            </span>
          </div>

          <div className="w-full sm:w-44">
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full bg-white border border-neutral-300 focus:border-neutral-900 rounded-xl px-4 py-3 text-neutral-900 outline-none transition text-sm dark:bg-[#191919] dark:border-neutral-700 dark:text-white dark:focus:border-neutral-300"
              required
            />
          </div>
        </div>

        <ExerciseFields
          didExercise={didExercise}
          exerciseDetails={exerciseDetails}
          onDidExerciseChange={setDidExercise}
          onExerciseDetailsChange={setExerciseDetails}
        />

        <button
          type="submit"
          className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-900 font-bold px-6 py-3 rounded-xl transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
        >
          Add Log
        </button>
      </form>
    </div>
  );
}
