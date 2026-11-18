"use client";

import React, { useMemo, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { baseTypography } from "@/tokens/base_typography";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SHORT_MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const SHORT_DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const GRID_DAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"];

export interface BaseDatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  displayMode?: "month-year" | "full-date";
  placeholder?: string;
  className?: string;
}

function formatHeadlineDate(date: Date): string {
  const dayName = SHORT_DAY_NAMES[date.getDay()];
  const day = date.getDate();
  const month = SHORT_MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}, ${day} ${month} ${year}`;
}

export function BaseDatePicker({
  value,
  onChange,
  displayMode = "month-year",
  placeholder = "Select date",
  className = "",
}: BaseDatePickerProps) {
  const fallbackDate = value ?? new Date();
  const [isOpen, setIsOpen] = useState(false);
  const [draftDate, setDraftDate] = useState<Date>(fallbackDate);
  const [viewYear, setViewYear] = useState<number>(fallbackDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(fallbackDate.getMonth());

  const openDialog = () => {
    const initial = value ?? new Date();
    setDraftDate(initial);
    setViewYear(initial.getFullYear());
    setViewMonth(initial.getMonth());
    setIsOpen(true);
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const calendarCells = useMemo(() => {
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(day);
    }
    return cells;
  }, [viewYear, viewMonth]);

  const triggerLabel = !value
    ? placeholder
    : displayMode === "month-year"
      ? `${MONTH_NAMES[value.getMonth()]} ${value.getFullYear()}`
      : formatHeadlineDate(value);

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className={`flex h-10 items-center gap-2 rounded-lg border border-surface-border bg-surface-sidebar px-3.5 ${baseTypography.xs} font-medium transition-colors hover:border-surface-muted focus:border-indigo-600 focus:outline-none ${
          value ? "text-surface-foreground" : "text-surface-muted"
        } ${className}`}
      >
        <Calendar className="h-3.5 w-3.5 text-surface-subtle" />
        <span>{triggerLabel}</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-xs rounded-2xl border border-surface-border bg-surface-card p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <p className={`${baseTypography.xs} font-medium text-surface-subtle`}>
                Select date
              </p>
              <p className={`mt-1.5 ${baseTypography["2xl"]} font-bold tracking-tight text-surface-foreground`}>
                {formatHeadlineDate(draftDate)}
              </p>
            </div>

            <div className="my-4 h-px w-full bg-surface-elevated" />

            <div className="flex items-center justify-between">
              <span className={`${baseTypography.sm} font-bold text-surface-foreground`}>
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-surface-subtle transition-colors hover:bg-surface-elevated hover:text-surface-foreground"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-surface-subtle transition-colors hover:bg-surface-elevated hover:text-surface-foreground"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1 text-center">
              {GRID_DAY_HEADERS.map((d, idx) => (
                <span
                  key={idx}
                  className={`py-1 ${baseTypography.xs} font-medium text-surface-muted`}
                >
                  {d}
                </span>
              ))}
            </div>

            <div className="mt-1 grid grid-cols-7 gap-y-1 text-center">
              {calendarCells.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="h-9" />;
                }

                const isSelected =
                  draftDate.getFullYear() === viewYear &&
                  draftDate.getMonth() === viewMonth &&
                  draftDate.getDate() === day;

                return (
                  <div
                    key={day}
                    className="flex h-9 items-center justify-center"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setDraftDate(new Date(viewYear, viewMonth, day))
                      }
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${baseTypography.xs} transition-colors ${
                        isSelected
                          ? "bg-blue-600 font-bold text-white"
                          : "font-medium text-surface-foreground hover:bg-surface-elevated"
                      }`}
                    >
                      {day}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="my-4 h-px w-full bg-surface-elevated" />

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`h-10 rounded-lg bg-surface-border/70 ${baseTypography.xs} font-semibold text-surface-foreground transition-colors hover:bg-surface-border`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange(draftDate);
                  setIsOpen(false);
                }}
                className={`h-10 rounded-lg bg-blue-600 ${baseTypography.xs} font-semibold text-white transition-colors hover:bg-blue-500`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
