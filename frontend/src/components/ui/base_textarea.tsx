import { baseTypography } from "@/tokens/base_typography";
import React from "react";

export interface BaseTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function BaseTextarea({
  label,
  error,
  className = "",
  rows = 4,
  ...props
}: BaseTextareaProps) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label
          className={`${baseTypography.xs} font-medium ${
            error ? "text-rose-400" : "text-surface-subtle"
          }`}
        >
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={`w-full rounded-lg border bg-surface-sidebar px-3.5 py-2.5 ${baseTypography.sm} text-surface-foreground placeholder-surface-muted transition-colors focus:outline-none ${
          error
            ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40"
            : "border-surface-border focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/40"
        } ${className}`}
        {...props}
      />
      {error && <span className={`${baseTypography.xs} text-rose-400`}>{error}</span>}
    </div>
  );
}
