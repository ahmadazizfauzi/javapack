"use client";

import React from "react";
import { baseTypography } from "@/tokens/base_typography";

export interface BaseSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  variant?: "emerald" | "indigo";
  disabled?: boolean;
}

export function BaseSwitch({
  checked,
  onChange,
  label,
  variant = "emerald",
  disabled = false,
}: BaseSwitchProps) {
  const activeBg =
    variant === "indigo" ? "bg-indigo-600" : "bg-emerald-500";

  return (
    <div
      className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
        checked && variant === "indigo"
          ? "border-indigo-500/60 bg-surface-card"
          : "border-surface-elevated bg-surface-card"
      }`}
    >
      {label && (
        <span
          className={`${baseTypography.sm} font-medium ${
            checked ? "text-surface-foreground" : "text-surface-muted"
          }`}
        >
          {label}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
          checked ? activeBg : "bg-surface-border"
        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
