"use client";

import React from "react";
import { Menu } from "lucide-react";

export interface BaseHeaderProps {
  breadcrumb: string;
  title: string;
  action?: React.ReactNode;
  onMenuClick?: () => void;
}

export function BaseHeader({
  breadcrumb,
  title,
  action,
  onMenuClick,
}: BaseHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 pb-6">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-elevated bg-surface-card text-surface-subtle hover:text-surface-foreground lg:hidden"
            aria-label="Buka menu navigasi"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-surface-foreground">
            {title}
          </h1>
        </div>
      </div>
      {action && <div className="flex items-center gap-2.5">{action}</div>}
    </header>
  );
}
