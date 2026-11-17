import React from "react";
import { ChevronDown } from "lucide-react";
import { baseTypography } from "@/tokens/base_typography";

export interface BaseSelectOption {
  label: string;
  value: string;
}

export interface BaseSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: BaseSelectOption[];
  error?: string;
}

export function BaseSelect({
  label,
  options,
  error,
  className = "",
  ...props
}: BaseSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className={`${baseTypography.xs} font-medium text-surface-subtle`}>
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`h-9 w-full appearance-none rounded-lg border bg-surface-sidebar pl-3.5 pr-9 ${baseTypography.xs} font-medium text-surface-foreground transition-colors focus:outline-none ${
            error
              ? "border-rose-500 focus:border-rose-500"
              : "border-surface-border hover:border-surface-muted focus:border-indigo-600"
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-surface-card text-surface-foreground"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-surface-muted" />
      </div>
      {error && <span className={`${baseTypography.xs} text-rose-400`}>{error}</span>}
    </div>
  );
}
