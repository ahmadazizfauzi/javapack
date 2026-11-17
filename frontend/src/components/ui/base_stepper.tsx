"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { baseTypography } from "@/tokens/base_typography";

export interface BaseStepperProps {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export function BaseStepper({
  label,
  value,
  min = 1,
  max = 99,
  onChange,
}: BaseStepperProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className={`${baseTypography.xs} font-medium text-surface-subtle`}>{label}</span>
      )}
      <div className="inline-flex h-9 items-center overflow-hidden rounded-lg border border-surface-border bg-surface-sidebar">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          aria-label="Decrease quantity"
          className="flex h-full w-9 items-center justify-center text-surface-subtle transition-colors hover:bg-surface-elevated hover:text-surface-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className={`min-w-[40px] px-2 text-center ${baseTypography.xs} font-bold text-surface-foreground`}>
          {value}
        </span>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          aria-label="Increase quantity"
          className="flex h-full w-9 items-center justify-center text-surface-subtle transition-colors hover:bg-surface-elevated hover:text-surface-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
