"use client";

import React from "react";

export interface ChartCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function ChartCard({ children, className = "" }: ChartCardProps) {
  return (
    <div
      className={`bg-neutral-50 border border-neutral-200 rounded-2xl p-5 sm:p-6 space-y-4 hover:border-neutral-300 dark:bg-[#202020] dark:border-neutral-800 dark:hover:border-neutral-700 transition-colors ${className}`}
    >
      {children}
    </div>
  );
}

export interface ChartCardHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

function ChartCardHeader({
  title,
  subtitle,
  badge,
  action,
  className = "",
}: ChartCardHeaderProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4 ${className}`}
    >
      <div className="space-y-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
            {title}
          </h3>
          {badge}
        </div>
        {subtitle && <p className="text-xs text-neutral-500 dark:text-neutral-400">{subtitle}</p>}
      </div>

      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
}

export interface ChartCardBodyProps {
  children: React.ReactNode;
  className?: string;
}

function ChartCardBody({ children, className = "" }: ChartCardBodyProps) {
  return <div className={`pt-2 ${className}`}>{children}</div>;
}

export interface ChartCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

function ChartCardFooter({ children, className = "" }: ChartCardFooterProps) {
  return (
    <div
      className={`pt-3 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400 flex flex-wrap items-center justify-between gap-3 ${className}`}
    >
      {children}
    </div>
  );
}

ChartCard.Header = ChartCardHeader;
ChartCard.Body = ChartCardBody;
ChartCard.Footer = ChartCardFooter;
