import React from "react";

export interface BaseSkeletonProps {
  variant?:
    | "card"
    | "table"
    | "line"
    | "adminShell"
    | "authCard"
    | "heroSlider"
    | "productCatalog"
    | "faqList";
  rows?: number;
  className?: string;
}

export function BaseSkeleton({
  variant = "line",
  rows = 3,
  className = "",
}: BaseSkeletonProps) {
  if (variant === "adminShell") {
    return (
      <div className="flex min-h-screen bg-surface-canvas">
        <div className="hidden w-64 shrink-0 flex-col justify-between border-r border-surface-elevated bg-surface-sidebar p-5 lg:flex">
          <div className="animate-pulse space-y-5">
            <div className="h-7 w-32 rounded-lg bg-surface-elevated" />
            <div className="h-px w-full bg-surface-elevated" />
            <div className="space-y-2.5">
              <div className="h-9 w-full rounded-lg bg-surface-elevated" />
              <div className="h-9 w-full rounded-lg bg-surface-elevated/60" />
              <div className="h-9 w-full rounded-lg bg-surface-elevated/60" />
              <div className="h-9 w-full rounded-lg bg-surface-elevated/60" />
              <div className="h-9 w-full rounded-lg bg-surface-elevated/60" />
            </div>
          </div>
          <div className="h-9 w-full animate-pulse rounded-lg bg-surface-elevated/50" />
        </div>
        <div className="flex-1 animate-pulse space-y-6 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 w-44 rounded bg-surface-elevated" />
              <div className="h-7 w-60 rounded bg-surface-elevated" />
            </div>
            <div className="h-10 w-32 rounded-lg bg-surface-elevated" />
          </div>
          <div className="rounded-xl border border-surface-elevated bg-surface-card p-6 space-y-4">
            <div className="h-4 w-48 rounded bg-surface-elevated" />
            <div className="flex justify-between gap-4">
              <div className="h-10 w-72 rounded-lg bg-surface-elevated" />
              <div className="h-10 w-56 rounded-lg bg-surface-elevated" />
            </div>
            <div className="space-y-3 pt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-11 w-full rounded-lg bg-surface-elevated/70"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "authCard") {
    return (
      <div className="w-full max-w-md animate-pulse rounded-2xl border border-surface-elevated bg-surface-card px-7 pb-8 pt-6 sm:px-8">
        <div className="h-7 w-32 rounded-lg bg-surface-elevated" />
        <div className="mt-5 h-6 w-48 rounded bg-surface-elevated" />
        <div className="mt-2 h-3.5 w-64 rounded bg-surface-elevated/70" />
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <div className="h-3 w-12 rounded bg-surface-elevated" />
            <div className="h-10 w-full rounded-lg bg-surface-elevated" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-16 rounded bg-surface-elevated" />
            <div className="h-10 w-full rounded-lg bg-surface-elevated" />
          </div>
          <div className="h-11 w-full rounded-lg bg-indigo-600/30" />
        </div>
      </div>
    );
  }

  if (variant === "heroSlider") {
    return (
      <div className="mx-auto flex w-full max-w-7xl animate-pulse flex-col items-center px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="h-6 w-56 rounded-full bg-surface-elevated" />
        <div className="mt-5 h-10 w-full max-w-2xl rounded-lg bg-surface-elevated" />
        <div className="mt-3 h-4 w-full max-w-xl rounded bg-surface-elevated/70" />
        <div className="mt-10 grid w-full grid-cols-1 items-center gap-5 lg:grid-cols-12">
          <div className="hidden h-80 rounded-2xl bg-surface-card lg:col-span-3 lg:block" />
          <div className="h-80 rounded-2xl border border-surface-elevated bg-surface-card sm:h-96 lg:col-span-6" />
          <div className="hidden h-80 rounded-2xl bg-surface-card lg:col-span-3 lg:block" />
        </div>
      </div>
    );
  }

  if (variant === "productCatalog") {
    return (
      <div className="mx-auto flex w-full max-w-7xl animate-pulse flex-col items-center px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="h-9 w-72 rounded-lg bg-surface-elevated" />
        <div className="mt-3 h-4 w-96 max-w-full rounded bg-surface-elevated/70" />
        <div className="mt-6 h-11 w-full max-w-xl rounded-full bg-surface-card" />
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-24 rounded-full bg-surface-card" />
          ))}
        </div>
        <div className="mt-10 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-surface-elevated bg-surface-card p-4"
            >
              <div className="h-44 w-full rounded-lg bg-surface-elevated" />
              <div className="mt-4 h-3 w-24 rounded bg-surface-elevated" />
              <div className="mt-2 h-4 w-3/4 rounded bg-surface-elevated" />
              <div className="mt-2 h-4 w-1/2 rounded bg-surface-elevated" />
              <div className="mt-4 h-10 w-full rounded-lg bg-surface-elevated" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "faqList") {
    return (
      <div className="mx-auto flex w-full max-w-4xl animate-pulse flex-col px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <div className="h-3 w-32 rounded bg-surface-elevated" />
          <div className="mt-3 h-9 w-80 max-w-full rounded-lg bg-surface-elevated" />
          <div className="mt-3 h-4 w-96 max-w-full rounded bg-surface-elevated/70" />
        </div>
        <div className="mt-10 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-14 w-full rounded-xl border border-surface-elevated bg-surface-card"
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`animate-pulse rounded-xl border border-surface-elevated bg-surface-card p-5 ${className}`}
      >
        <div className="h-24 w-full rounded-lg bg-surface-elevated" />
        <div className="mt-4 h-3.5 w-2/3 rounded bg-surface-elevated" />
        <div className="mt-2 h-3 w-1/2 rounded bg-surface-elevated" />
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div
        className={`animate-pulse space-y-3 rounded-xl border border-surface-elevated bg-surface-card p-4 ${className}`}
      >
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-5 w-full rounded-md bg-surface-elevated" />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`h-4 w-full animate-pulse rounded bg-surface-elevated ${className}`}
    />
  );
}
