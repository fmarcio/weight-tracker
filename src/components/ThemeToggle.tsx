"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-[#202020] text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition flex items-center justify-center cursor-pointer active:scale-95"
      title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-neutral-200" strokeWidth={2} />
      ) : (
        <Moon className="w-4 h-4 text-neutral-800" strokeWidth={2} />
      )}
    </button>
  );
}
