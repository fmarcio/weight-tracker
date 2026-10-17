"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { WeightEntry } from "@/types/weight";
import Modal from "./Modal";
import Pagination from "./Pagination";
import WeightHistoryItem from "./WeightHistoryItem";

interface WeightHistoryProps {
  logs: WeightEntry[];
  onDeleteLog: (id: string) => void;
  onEditLog: (
    id: string,
    updatedData: {
      weight: number;
      date: string;
      didExercise: boolean;
      exerciseDetails: string;
    }
  ) => void;
  onDeleteMultipleLogs: (ids: string[]) => void;
}

export default function WeightHistory({
  logs,
  onDeleteLog,
  onEditLog,
  onDeleteMultipleLogs,
}: WeightHistoryProps) {
  const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<WeightEntry | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [sortByOldest, setSortByOldest] = useState<boolean>(false);

  const totalPages = Math.max(1, Math.ceil(logs.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const sortedLogs = [...logs].sort((a, b) =>
    sortByOldest
      ? a.date.localeCompare(b.date)
      : b.date.localeCompare(a.date)
  );

  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedLogs = sortedLogs.slice(startIndex, startIndex + pageSize);

  const allVisibleSelected =
    paginatedLogs.length > 0 &&
    paginatedLogs.every((log) => selectedIds.has(log.id));

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        paginatedLogs.forEach((log) => next.delete(log.id));
      } else {
        paginatedLogs.forEach((log) => next.add(log.id));
      }
      return next;
    });
  };

  const handleSelectAllEntries = () => {
    setSelectedIds(new Set(logs.map((log) => log.id)));
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleConfirmSingleDelete = () => {
    if (deletingEntry) {
      onDeleteLog(deletingEntry.id);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(deletingEntry.id);
        return next;
      });
      setDeletingEntry(null);
    }
  };

  const handleConfirmBulkDelete = () => {
    const idsToDelete =
      selectedIds.size > 0
        ? Array.from(selectedIds)
        : logs.map((log) => log.id);

    onDeleteMultipleLogs(idsToDelete);
    setSelectedIds(new Set());
    setIsBulkDeleteModalOpen(false);
  };

  const handleSaveEdit = (updatedData: {
    weight: number;
    date: string;
    didExercise: boolean;
    exerciseDetails: string;
  }) => {
    if (editingEntry) {
      onEditLog(editingEntry.id, updatedData);
      setEditingEntry(null);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const isSelectedDeletion = selectedIds.size > 0;
  const bulkDeleteCount = isSelectedDeletion ? selectedIds.size : logs.length;
  const bulkDeleteTitle = isSelectedDeletion
    ? `Delete ${bulkDeleteCount} selected entries?`
    : `Delete all entries?`;
  const bulkDeleteDescription = isSelectedDeletion
    ? `You are about to delete ${bulkDeleteCount} selected entries. If you delete, this data cannot be recovered.`
    : `You are about to delete all ${logs.length} entries. If you delete, this data cannot be recovered.`;
  const bulkDeleteConfirmText = isSelectedDeletion
    ? `Delete ${bulkDeleteCount} Entries`
    : `Delete All ${logs.length} Entries`;

  return (
    <>
      <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 dark:bg-[#202020] dark:border-neutral-800 space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-neutral-900 dark:text-white" strokeWidth={2} /> History Logs
            </h3>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {logs.length} entries recorded
            </span>
          </div>

          {logs.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              {selectedIds.size > 0 ? (
                <>
                  <span className="text-neutral-900 dark:text-white font-medium">
                    {selectedIds.size} of {logs.length} selected
                  </span>
                  <span className="text-neutral-400 dark:text-neutral-600">&bull;</span>
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white underline cursor-pointer"
                  >
                    Deselect all
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleSelectAllEntries}
                  className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition font-medium underline cursor-pointer"
                >
                  Select all ({logs.length})
                </button>
              )}
            </div>
          )}
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 text-sm">
            No weight measurements logged yet. Use the form above to add one!
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-3 py-2 bg-neutral-100 border border-neutral-200 dark:bg-[#191919] dark:border-neutral-800 rounded-xl text-xs text-neutral-600 dark:text-neutral-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={handleToggleSelectAllVisible}
                  className="w-4 h-4 rounded bg-white border-neutral-300 dark:bg-[#202020] dark:border-neutral-700 accent-neutral-900 dark:accent-neutral-100 cursor-pointer"
                />
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                  Select page ({paginatedLogs.length})
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={sortByOldest}
                  onChange={(e) => {
                    setSortByOldest(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 rounded bg-white border-neutral-300 dark:bg-[#202020] dark:border-neutral-700 accent-neutral-900 dark:accent-neutral-100 cursor-pointer"
                />
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                  Sort by oldest
                </span>
              </label>
            </div>

            <div className="divide-y divide-neutral-200 border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800 rounded-xl overflow-hidden">
              {paginatedLogs.map((log) => (
                <WeightHistoryItem
                  key={log.id}
                  log={log}
                  isSelected={selectedIds.has(log.id)}
                  onToggleSelect={handleToggleSelect}
                  onEdit={setEditingEntry}
                  onDelete={setDeletingEntry}
                />
              ))}
            </div>

            <Pagination
              currentPage={safeCurrentPage}
              totalItems={logs.length}
              pageSize={pageSize}
              pageSizeOptions={[5, 10, 15]}
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <div className="text-xs text-neutral-600 dark:text-neutral-400 text-center sm:text-left">
                {selectedIds.size > 0 && (
                  <span>
                    Ready to delete{" "}
                    <strong className="text-neutral-900 dark:text-white">{selectedIds.size}</strong>{" "}
                    selected {selectedIds.size === 1 ? "entry" : "entries"}.
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(true)}
                disabled={logs.length === 0}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-[0.98] flex items-center justify-center shrink-0 cursor-pointer"
              >
                <span>
                  {selectedIds.size > 0
                    ? `Delete Selected (${selectedIds.size})`
                    : "Delete All Entries"}
                </span>
              </button>
            </div>
          </>
        )}
      </div>

      <Modal.Edit
        isOpen={Boolean(editingEntry)}
        onClose={() => setEditingEntry(null)}
        entry={editingEntry}
        onSave={handleSaveEdit}
      />

      <Modal.Delete
        isOpen={Boolean(deletingEntry)}
        onClose={() => setDeletingEntry(null)}
        onConfirm={handleConfirmSingleDelete}
        title="Delete entry?"
        description="If you delete, this data cannot be recovered"
      />

      <Modal.Delete
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title={bulkDeleteTitle}
        description={bulkDeleteDescription}
        confirmText={bulkDeleteConfirmText}
      />
    </>
  );
}
