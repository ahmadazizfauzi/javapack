"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, X, XCircle } from "lucide-react";
import { baseTypography } from "@/tokens/base_typography";

export type BaseToastVariant = "success" | "warning" | "error";

export interface BaseToastProps {
  isVisible: boolean;
  variant?: BaseToastVariant;
  title: string;
  message?: string;
  durationMs?: number;
  onClose: () => void;
}

const toastStyles: Record<
  BaseToastVariant,
  { border: string; bar: string; iconBg: string; Icon: React.ElementType }
> = {
  success: {
    border: "border-emerald-500/50",
    bar: "bg-emerald-500",
    iconBg: "bg-emerald-500 text-surface-canvas",
    Icon: CheckCircle2,
  },
  warning: {
    border: "border-amber-500/50",
    bar: "bg-amber-500",
    iconBg: "bg-amber-500 text-surface-canvas",
    Icon: AlertCircle,
  },
  error: {
    border: "border-rose-500/50",
    bar: "bg-rose-500",
    iconBg: "bg-rose-500 text-white",
    Icon: XCircle,
  },
};

export function BaseToast({
  isVisible,
  variant = "success",
  title,
  message,
  durationMs = 5000,
  onClose,
}: BaseToastProps) {
  const [shrinking, setShrinking] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setShrinking(false);
      return;
    }
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setShrinking(true);
      });
    });
    const timer = setTimeout(onClose, durationMs);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(timer);
    };
  }, [isVisible, durationMs, onClose]);

  if (!isVisible) return null;

  const { border, bar, iconBg, Icon } = toastStyles[variant];

  return (
    <div className="fixed right-5 top-5 z-50 w-full max-w-sm overflow-hidden rounded-xl border bg-surface-card shadow-2xl shadow-black/50">
      <div className={`border ${border} rounded-xl p-4`}>
        <div className="flex items-start gap-3">
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${iconBg}`}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className={`${baseTypography.xs} font-bold text-surface-foreground`}>{title}</p>
            {message && (
              <p className={`mt-0.5 ${baseTypography.xs} text-surface-subtle`}>{message}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-surface-muted hover:text-surface-foreground"
            aria-label="Tutup notifikasi"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-surface-elevated">
          <div
            className={`h-full rounded-full ${bar}`}
            style={{
              width: shrinking ? "0%" : "100%",
              transition: `width ${durationMs}ms linear`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
