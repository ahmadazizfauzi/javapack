"use client";

import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Search, X } from "lucide-react";
import { baseTypography } from "@/tokens/base_typography";

export interface BaseInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isSearch?: boolean;
  isCurrency?: boolean;
  onClear?: () => void;
}

function formatThousandDots(raw: string | number | readonly string[] | undefined): string {
  if (raw === undefined || raw === null) return "";
  const digits = String(raw).replace(/\D/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function BaseInput({
  label,
  error,
  helperText,
  type = "text",
  isSearch = false,
  isCurrency = false,
  onClear,
  className = "",
  value,
  defaultValue,
  onChange,
  ...props
}: BaseInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [currencyDisplay, setCurrencyDisplay] = useState(() =>
    isCurrency ? formatThousandDots(value ?? defaultValue) : ""
  );

  useEffect(() => {
    if (isCurrency && value !== undefined) {
      setCurrencyDisplay(formatThousandDots(value));
    }
  }, [isCurrency, value]);

  const isPassword = type === "password";
  const resolvedType = isCurrency
    ? "text"
    : isPassword && showPassword
    ? "text"
    : type;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCurrency) {
      const formatted = formatThousandDots(e.target.value);
      setCurrencyDisplay(formatted);
      if (onChange) {
        const numericString = e.target.value.replace(/\D/g, "");
        e.target.value = numericString;
        onChange(e);
      }
      return;
    }
    onChange?.(e);
  };

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
      <div className="relative flex items-center">
        {isSearch && (
          <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-surface-muted" />
        )}
        <input
          type={resolvedType}
          inputMode={isCurrency ? "numeric" : props.inputMode}
          value={isCurrency ? currencyDisplay : value}
          defaultValue={isCurrency ? undefined : defaultValue}
          onChange={handleInputChange}
          className={`h-10 w-full rounded-lg border bg-surface-sidebar ${baseTypography.sm} text-surface-foreground placeholder-surface-muted transition-colors focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-ms-clear]:hidden [&::-ms-reveal]:hidden ${
            isSearch ? "pl-10" : "px-3.5"
          } ${isPassword || (isSearch && onClear) ? "pr-11" : "pr-3.5"} ${
            error
              ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40"
              : "border-surface-border focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/40"
          } ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-surface-subtle transition-colors hover:bg-surface-elevated hover:text-surface-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
        {isSearch && onClear && value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-surface-muted hover:text-surface-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {error && <span className={`${baseTypography.xs} text-rose-400`}>{error}</span>}
      {!error && helperText && (
        <span className={`${baseTypography.xs} text-surface-muted`}>{helperText}</span>
      )}
    </div>
  );
}
