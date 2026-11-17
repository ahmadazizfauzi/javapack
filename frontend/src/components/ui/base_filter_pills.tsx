"use client";

import React from "react";
import { baseTypography } from "@/tokens/base_typography";

export interface BaseFilterPillOption {
  label: string;
  value: string;
}

export interface BaseFilterPillsProps {
  options: BaseFilterPillOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function BaseFilterPills({
  options,
  value,
  onChange,
  className = "",
}: BaseFilterPillsProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-2 ${className}`}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-full border px-4 py-1.5 ${baseTypography.xs} font-semibold transition-all ${
              isActive
                ? "border-indigo-500 bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                : "border-surface-elevated bg-surface-card text-surface-subtle hover:border-surface-border hover:text-surface-foreground"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
