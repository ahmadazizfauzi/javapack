"use client";

import React from "react";
import { BaseSidebar } from "./base_sidebar";

export interface BaseMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoutClick?: () => void;
}

export function BaseMobileDrawer({
  isOpen,
  onClose,
  onLogoutClick,
}: BaseMobileDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-b-2xl border-b border-surface-elevated bg-surface-sidebar shadow-2xl">
        <BaseSidebar
          className="w-full border-r-0"
          onNavigate={onClose}
          onClose={onClose}
          onLogoutClick={() => {
            onClose();
            onLogoutClick?.();
          }}
        />
      </div>
    </div>
  );
}
