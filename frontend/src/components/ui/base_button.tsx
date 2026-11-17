import React from "react";

export type BaseButtonVariant =
  | "primary"
  | "cyan"
  | "secondary"
  | "danger"
  | "success"
  | "softPrimary"
  | "softDanger"
  | "ghost";

export type BaseButtonSize = "sm" | "md" | "lg" | "icon";

export interface BaseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BaseButtonVariant;
  size?: BaseButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<BaseButtonVariant, string> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-500 border border-indigo-500/30 shadow-sm shadow-indigo-600/20",
  cyan: "bg-cyan-500 text-surface-canvas font-semibold hover:bg-cyan-400 border border-cyan-400/30",
  secondary:
    "bg-surface-card text-surface-foreground border border-surface-border hover:bg-surface-elevated",
  danger:
    "bg-rose-600 text-white hover:bg-rose-500 border border-rose-500/30",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-500 border border-emerald-500/30",
  softPrimary:
    "bg-indigo-500/15 text-indigo-400 border border-indigo-500/40 hover:bg-indigo-500/25 hover:text-indigo-300",
  softDanger:
    "bg-rose-500/15 text-rose-400 border border-rose-500/40 hover:bg-rose-500/25 hover:text-rose-300",
  ghost:
    "bg-transparent text-surface-subtle hover:bg-surface-elevated hover:text-surface-foreground border border-transparent",
};

const sizeClasses: Record<BaseButtonSize, string> = {
  sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-11 px-5 text-sm rounded-lg gap-2",
  icon: "h-8 w-8 p-0 rounded-lg justify-center",
};

export function BaseButton({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: BaseButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      disabled={isDisabled}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
        isDisabled
          ? "bg-surface-elevated text-surface-muted border border-surface-border cursor-not-allowed opacity-75"
          : variantClasses[variant]
      } ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {isLoading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
