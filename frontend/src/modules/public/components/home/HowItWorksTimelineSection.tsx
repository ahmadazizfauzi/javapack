"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { HomeStepItem } from "@/types/public.type";
import { baseTypography } from "@/tokens/base_typography";

export interface HowItWorksTimelineSectionProps {
  steps: HomeStepItem[];
}

export function HowItWorksTimelineSection({
  steps,
}: HowItWorksTimelineSectionProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let rafId = 0;

    const updateProgress = () => {
      const el = timelineRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportAnchor = window.innerHeight * 0.52;
      const raw = (viewportAnchor - rect.top) / Math.max(rect.height, 1);
      const clamped = Math.min(1, Math.max(0, raw));
      setScrollProgress(clamped);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [steps.length]);

  if (steps.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-24 pt-14 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2
          className={`${baseTypography["2xl"]} font-bold tracking-tight text-surface-foreground sm:text-4xl`}
        >
          How JavaPack Works
        </h2>
        <p className={`mt-3 ${baseTypography.sm} text-surface-subtle sm:text-base`}>
          From online booking to airport pickup in four effortless steps.
        </p>
      </div>

      {/* Alternating Vertical Timeline */}
      <div ref={timelineRef} className="relative mt-16">
        {/* Center Vertical Track + Scroll-Following Progress & Large Circle (Desktop) */}
        <div
          aria-hidden="true"
          className="absolute bottom-4 left-1/2 top-0 hidden w-0.5 -translate-x-1/2 bg-surface-elevated md:block"
        >
          {/* Active Indigo Progress Line */}
          <div
            className="w-full rounded-full bg-gradient-to-b from-indigo-500 via-indigo-400 to-indigo-500 transition-[height] duration-75 ease-out"
            style={{ height: `${scrollProgress * 100}%` }}
          />

          {/* Large Scroll-Following Circle */}
          <div
            className="absolute left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transition-[top] duration-75 ease-out"
            style={{ top: `${scrollProgress * 100}%` }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-500/20 backdrop-blur-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-indigo-300/60 bg-indigo-600 text-white shadow-lg shadow-indigo-500/40">
                <ArrowDown className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-10 pt-8 md:gap-14 md:pt-10">
          {steps.map((step, index) => {
            const isCardRight = index % 2 === 0;
            return (
              <div
                key={step.id}
                className="relative grid grid-cols-1 items-start gap-4 md:grid-cols-[1fr_44px_1fr] md:gap-0"
              >
                {/* Left Column (Desktop) */}
                <div
                  className={`hidden md:flex md:flex-col ${
                    isCardRight
                      ? "items-end pr-8 pt-0.5"
                      : "items-end pr-8 text-right"
                  }`}
                >
                  {isCardRight ? (
                    <span
                      className={`inline-flex items-center rounded-full bg-indigo-600 px-4 py-1.5 ${baseTypography.xs} font-semibold text-white shadow-md shadow-indigo-600/20`}
                    >
                      {step.stepLabel}
                    </span>
                  ) : (
                    <>
                      <h3
                        className={`${baseTypography.lg} font-semibold text-surface-foreground`}
                      >
                        {step.title}
                      </h3>
                      <div className="mt-2.5 w-full max-w-md rounded-2xl border border-surface-elevated bg-surface-card/70 px-5 py-4 text-right backdrop-blur-sm">
                        <p
                          className={`${baseTypography.xs} leading-relaxed text-surface-subtle sm:text-sm`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Center Dot (Desktop) */}
                <div className="relative z-10 hidden items-center justify-center pt-1.5 md:flex">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600/25">
                    <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                  </div>
                </div>

                {/* Right Column (Desktop) + Mobile Stacked Card */}
                <div className="flex flex-col md:items-start md:pl-8">
                  {/* Mobile Pill */}
                  <span
                    className={`mb-2 inline-flex w-fit items-center rounded-full bg-indigo-600 px-3.5 py-1 ${baseTypography.xs} font-semibold text-white md:hidden`}
                  >
                    {step.stepLabel}
                  </span>

                  {isCardRight ? (
                    <>
                      <h3
                        className={`${baseTypography.lg} font-semibold text-surface-foreground`}
                      >
                        {step.title}
                      </h3>
                      <div className="mt-2.5 w-full max-w-md rounded-2xl border border-surface-elevated bg-surface-card/70 px-5 py-4 backdrop-blur-sm">
                        <p
                          className={`${baseTypography.xs} leading-relaxed text-surface-subtle sm:text-sm`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Desktop: Pill on Right */}
                      <span
                        className={`hidden items-center rounded-full bg-indigo-600 px-4 py-1.5 ${baseTypography.xs} font-semibold text-white shadow-md shadow-indigo-600/20 md:mt-0.5 md:inline-flex`}
                      >
                        {step.stepLabel}
                      </span>
                      {/* Mobile: Title + Card */}
                      <div className="md:hidden">
                        <h3
                          className={`${baseTypography.lg} font-semibold text-surface-foreground`}
                        >
                          {step.title}
                        </h3>
                        <div className="mt-2.5 w-full rounded-2xl border border-surface-elevated bg-surface-card/70 px-5 py-4 backdrop-blur-sm">
                          <p
                            className={`${baseTypography.xs} leading-relaxed text-surface-subtle`}
                          >
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
