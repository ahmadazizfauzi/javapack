import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { baseTypography } from "@/tokens/base_typography";

export interface BasePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  itemLabel?: string;
  centered?: boolean;
  onPageChange: (page: number) => void;
}

export function BasePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  itemLabel = "data",
  centered = false,
  onPageChange,
}: BasePaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      className={`flex flex-wrap items-center gap-3 pt-3 ${
        centered ? "flex-col justify-center" : "justify-between"
      }`}
    >
      <p className={`${baseTypography.xs} text-surface-muted`}>
        Showing {startItem}–{endItem} of {totalItems} {itemLabel}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-elevated bg-surface-card text-surface-subtle transition-colors hover:bg-surface-elevated disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border ${baseTypography.xs} font-semibold transition-colors ${
                isActive
                  ? "border-indigo-500 bg-indigo-600 text-white"
                  : "border-surface-elevated bg-surface-card text-surface-subtle hover:bg-surface-elevated hover:text-surface-foreground"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-elevated bg-surface-card text-surface-subtle transition-colors hover:bg-surface-elevated disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Halaman berikutnya"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
