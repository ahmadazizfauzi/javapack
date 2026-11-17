"use client";

import React from "react";
import { X } from "lucide-react";
import { baseTypography } from "@/tokens/base_typography";

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export function BaseModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
}: BaseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl border border-surface-border bg-surface-card p-6 shadow-2xl">
        <div className="flex shrink-0 items-start justify-between gap-4">
          <div>
            <h3 className={`${baseTypography.md} font-bold text-surface-foreground`}>
              {title}
            </h3>
            {description && (
              <p className={`mt-1 ${baseTypography.xs} text-surface-subtle`}>{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-surface-muted transition-colors hover:bg-surface-elevated hover:text-surface-foreground"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {children && (
          <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
            {children}
          </div>
        )}

        {footer && (
          <div className="mt-5 flex shrink-0 items-center justify-end gap-2.5 border-t border-surface-elevated pt-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
