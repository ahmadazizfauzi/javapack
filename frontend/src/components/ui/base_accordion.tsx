"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { baseTypography } from "@/tokens/base_typography";

export interface BaseAccordionItem {
  id: string;
  question: string;
  answer: string;
}

export interface BaseAccordionProps {
  items: BaseAccordionItem[];
  defaultOpenId?: string;
}

export function BaseAccordion({ items, defaultOpenId }: BaseAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={`rounded-xl border transition-colors duration-200 ${
              isOpen
                ? "border-indigo-500/60 bg-surface-card"
                : "border-surface-elevated bg-surface-card hover:border-surface-border"
            }`}
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className={`${baseTypography.sm} font-semibold text-surface-foreground`}>
                {item.question}
              </span>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-surface-subtle">
                <ChevronRight
                  className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
                    isOpen ? "rotate-90 text-indigo-400" : "rotate-0"
                  }`}
                />
              </span>
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className={`px-5 pb-4 pt-0 ${baseTypography.xs} leading-relaxed text-surface-subtle sm:text-sm`}>
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
