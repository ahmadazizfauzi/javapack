import React from "react";

export type BaseCardVariant = "default" | "highlighted";

export interface BaseCardProps {
  children: React.ReactNode;
  variant?: BaseCardVariant;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "p-0",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function BaseCard({
  children,
  variant = "default",
  className = "",
  padding = "md",
}: BaseCardProps) {
  const surfaceClass =
    variant === "highlighted"
      ? "bg-gradient-to-br from-indigo-600 to-indigo-500 border-indigo-400/40 text-white shadow-lg shadow-indigo-600/20"
      : "bg-surface-card border-surface-elevated text-surface-foreground";

  return (
    <div
      className={`rounded-xl border ${surfaceClass} ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
