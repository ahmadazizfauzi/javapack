"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { BaseButton } from "./base_button";
import { baseTypography } from "@/tokens/base_typography";

export interface BaseSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  buttonLabel?: string;
  showButton?: boolean;
  className?: string;
}

export function BaseSearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search travel gear...",
  buttonLabel = "Search",
  showButton = true,
  className = "",
}: BaseSearchBarProps) {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className={`flex w-full max-w-xl items-center gap-2 rounded-full border border-surface-border bg-surface-card p-1.5 pl-4 ${showButton ? "" : "pr-3 py-2.5"} shadow-lg shadow-black/20 focus-within:border-indigo-500 ${className}`}
    >
      <Search className="h-4 w-4 shrink-0 text-surface-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full min-w-0 bg-transparent ${baseTypography.sm} text-surface-foreground placeholder-surface-muted focus:outline-none`}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="rounded-full p-1 text-surface-muted hover:text-surface-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      {showButton && (
        <BaseButton
          type="submit"
          variant="primary"
          size="sm"
          className="shrink-0 rounded-full px-4"
        >
          {buttonLabel}
        </BaseButton>
      )}
    </form>
  );
}
