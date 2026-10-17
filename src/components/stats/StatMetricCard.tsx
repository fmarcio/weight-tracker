import React from 'react';

interface StatMetricCardProps {
  label: string;
  value: React.ReactNode;
  unit: string;
  footer: React.ReactNode;
  className?: string;
}

export default function StatMetricCard({
  label,
  value,
  unit,
  footer,
  className = 'space-y-2',
}: StatMetricCardProps) {
  return (
    <div
      className={`bg-neutral-50 border border-neutral-200 dark:bg-[#202020] dark:border-neutral-800 rounded-2xl p-5 ${className}`}
    >
      <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">
          {value}
        </span>
        <span className="text-xs text-neutral-500 font-medium">{unit}</span>
      </div>
      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
        {footer}
      </p>
    </div>
  );
}
