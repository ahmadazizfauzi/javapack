"use client";

import React from "react";
import { BaseCard } from "@/components/ui/base_card";
import { BaseDropdown } from "@/components/ui/base_dropdown";
import { SiteVisitPoint } from "@/types/dashboard.type";
import { baseTypography } from "@/tokens/base_typography";

export interface SiteVisitsSectionProps {
  data: SiteVisitPoint[];
  selectedMonth: string;
  onMonthChange: (monthValue: string) => void;
  selectedYear: string;
  onYearChange: (yearValue: string) => void;
}

const monthOptions = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

const yearOptions = [
  { label: "2025", value: "2025" },
  { label: "2026", value: "2026" },
  { label: "2027", value: "2027" },
];

export function SiteVisitsSection({
  data,
  selectedMonth,
  onMonthChange,
  selectedYear,
  onYearChange,
}: SiteVisitsSectionProps) {
  const maxValue = Math.max(10, ...data.map((point) => point.visits));
  const step = Math.ceil(maxValue / 4);
  const topTick = step * 4;
  const yAxisTicks = [topTick, step * 3, step * 2, step, 0];

  return (
    <BaseCard padding="lg" className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className={`${baseTypography.md} font-bold text-surface-foreground`}>
            Site visits
          </h2>
          <p className={`mt-1 ${baseTypography.xs} text-surface-muted`}>
            JavaPack public website visit statistics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <BaseDropdown
            options={monthOptions}
            value={selectedMonth}
            onChange={onMonthChange}
          />
          <BaseDropdown
            options={yearOptions}
            value={selectedYear}
            onChange={onYearChange}
          />
        </div>
      </div>

      <div className="flex gap-4 pt-2">
        <div className={`flex h-80 flex-col justify-between pb-6 pt-9 text-right ${baseTypography.xs} text-surface-muted`}>
          {yAxisTicks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>

        <div className="flex-1 overflow-x-auto">
          <div className="flex min-w-[640px] flex-col pt-9">
            <div className="flex h-72 items-end justify-between gap-2 border-b border-surface-elevated/60 px-1">
              {data.map((point) => {
                const heightPercent =
                  topTick > 0
                    ? Math.min(100, Math.round((point.visits / topTick) * 100))
                    : 0;
                const isPeak = point.visits >= step * 3 && point.visits > 0;

                return (
                  <div
                    key={point.day}
                    className="group relative flex h-full flex-1 cursor-pointer flex-col items-center justify-end"
                  >
                    <div className={`pointer-events-none absolute -top-8 left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-surface-border bg-surface-elevated px-2 py-0.5 ${baseTypography.xs} font-semibold text-surface-foreground shadow-lg group-hover:block`}>
                      {point.visits}
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[14px] rounded-t-md transition-all duration-200 group-hover:brightness-110 ${
                        isPeak
                          ? "bg-gradient-to-t from-indigo-600 to-indigo-400"
                          : "bg-gradient-to-t from-indigo-700 to-indigo-500"
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-2 px-1 pt-2.5">
              {data.map((point) => (
                <span
                  key={point.day}
                  className={`flex-1 text-center ${baseTypography.xs} text-surface-muted`}
                >
                  {point.day}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
