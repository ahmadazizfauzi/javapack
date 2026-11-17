"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { BaseButton } from "@/components/ui/base_button";

export interface CmsActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function CmsActionButtons({ onEdit, onDelete }: CmsActionButtonsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <BaseButton
        type="button"
        variant="softPrimary"
        size="icon"
        onClick={onEdit}
        aria-label="Edit item"
      >
        <Pencil className="h-3.5 w-3.5" />
      </BaseButton>
      <BaseButton
        type="button"
        variant="softDanger"
        size="icon"
        onClick={onDelete}
        aria-label="Delete item"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </BaseButton>
    </div>
  );
}
