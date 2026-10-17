'use client';

import React from 'react';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  pageSizeOptions = [5, 10, 15],
  onPageChange,
  onPageSizeChange,
  className = '',
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 ${className}`}
    >
      <div className='flex items-center gap-4 flex-wrap justify-center sm:justify-start'>
        <span>
          Showing{' '}
          <strong className='text-neutral-900 dark:text-neutral-200'>
            {startItem}
          </strong>{' '}
          -{' '}
          <strong className='text-neutral-900 dark:text-neutral-200'>
            {endItem}
          </strong>{' '}
          of{' '}
          <strong className='text-neutral-900 dark:text-neutral-200'>
            {totalItems}
          </strong>{' '}
          entries
        </span>

        <div className='flex items-center gap-1.5'>
          <label
            htmlFor='pageSizeSelect'
            className='text-neutral-500 dark:text-neutral-400'
          >
            Show items:
          </label>
          <select
            id='pageSizeSelect'
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className='bg-white border border-neutral-300 focus:border-neutral-900 rounded-lg px-2 py-1 text-xs text-neutral-800 outline-none cursor-pointer hover:border-neutral-400 transition dark:bg-[#191919] dark:border-neutral-700 dark:text-white dark:hover:border-neutral-600'
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='flex items-center gap-1'>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className='px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900 text-neutral-700 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-neutral-400 disabled:cursor-not-allowed transition flex items-center gap-1 dark:border-neutral-800 dark:bg-[#191919] dark:hover:bg-neutral-800 dark:hover:text-white dark:text-neutral-300 dark:disabled:hover:bg-[#191919]'
          aria-label='Previous Page'
        >
          <span>‹</span> Prev
        </button>

        <div className='flex items-center gap-1'>
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className='px-2 py-1 text-neutral-400 dark:text-neutral-600 select-none'
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-7 h-7 px-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white font-bold dark:bg-neutral-100 dark:text-neutral-900'
                    : 'border border-neutral-200 bg-white text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-[#191919] dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className='px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900 text-neutral-700 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-neutral-400 disabled:cursor-not-allowed transition flex items-center gap-1 dark:border-neutral-800 dark:bg-[#191919] dark:hover:bg-neutral-800 dark:hover:text-white dark:text-neutral-300 dark:disabled:hover:bg-[#191919]'
          aria-label='Next Page'
        >
          Next <span>›</span>
        </button>
      </div>
    </div>
  );
}
