import { baseTypography } from "@/tokens/base_typography";
import React from "react";

export type BaseBadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

export interface BaseBadgeProps {
  children: React.ReactNode;
  variant?: BaseBadgeVariant;
  className?: string;
}

const badgeVariantClasses: Record<BaseBadgeVariant, string> = {
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/40",
  danger: "bg-rose-500/15 text-rose-400 border-rose-500/40",
  info: "bg-blue-500/15 text-blue-400 border-blue-500/40",
  neutral: "bg-surface-elevated text-surface-subtle border-surface-border",
};

export function BaseBadge({
  children,
  variant = "neutral",
  className = "",
}: BaseBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full border px-3 py-0.5 ${baseTypography.xs} font-semibold tracking-wide ${badgeVariantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
