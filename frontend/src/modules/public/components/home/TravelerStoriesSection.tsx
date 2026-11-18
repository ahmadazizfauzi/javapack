"use client";

import React, { useState } from "react";
import Image from "next/image";
import { HomeStoryItem } from "@/types/public.type";
import { baseTypography } from "@/tokens/base_typography";

export interface TravelerStoriesSectionProps {
  stories: HomeStoryItem[];
}

export function TravelerStoriesSection({
  stories,
}: TravelerStoriesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (stories.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
      {/* Centered Header */}
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2
          className={`${baseTypography["2xl"]} font-bold tracking-tight text-surface-foreground sm:text-4xl`}
        >
          Traveler Stories
        </h2>
        <p className={`mt-3 ${baseTypography.sm} text-surface-subtle sm:text-base`}>
          Real trips powered by JavaPack winter jackets, Pocket WiFi, and cabin luggage. Hover a card to expand.
        </p>
      </div>

      {/* Expandable Gallery of Stories */}
      <div className="mt-12 flex flex-col gap-4 md:h-[420px] md:flex-row md:gap-5">
        {stories.map((story, idx) => {
          const isExpanded = idx === activeIndex;
          return (
            <div
              key={story.id}
              role="button"
              tabIndex={0}
              onMouseEnter={() => setActiveIndex(idx)}
              onFocus={() => setActiveIndex(idx)}
              onClick={() => setActiveIndex(idx)}
              className={`group relative h-[360px] cursor-pointer overflow-hidden rounded-2xl border bg-surface-card transition-all duration-500 ease-out md:h-full ${
                isExpanded
                  ? "border-indigo-500/60 shadow-2xl shadow-indigo-600/15 md:flex-[2.2]"
                  : "border-surface-elevated hover:border-surface-border md:flex-1"
              }`}
            >
              <Image
                src={story.imageUrl}
                alt={`${story.customerName} — ${story.gearTag}`}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              {/* Dark Gradient Scrim */}
              <div
                aria-hidden="true"
                className={`absolute inset-0 transition-opacity duration-500 ${
                  isExpanded
                    ? "bg-gradient-to-t from-[#080C14]/95 via-[#080C14]/45 to-[#080C14]/15"
                    : "bg-gradient-to-t from-[#080C14]/90 via-[#080C14]/25 to-[#080C14]/15"
                }`}
              />

              {/* Top Tag Pill (Expanded) */}
              <div
                className={`absolute left-5 top-5 transition-all duration-300 ${
                  isExpanded
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-2 opacity-0"
                }`}
              >
                <span
                  className={`inline-flex items-center rounded-full bg-white/90 px-3.5 py-1.5 ${baseTypography.xs} font-semibold text-slate-900 shadow-sm backdrop-blur-sm`}
                >
                  {story.gearTag}
                </span>
              </div>

              {/* Bottom Copy */}
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3
                  className={`font-bold text-white transition-all duration-300 ${
                    isExpanded ? "text-xl sm:text-2xl" : "text-lg"
                  }`}
                >
                  {story.customerName}
                </h3>

                {!isExpanded && (
                  <p className={`mt-1 ${baseTypography.xs} font-medium text-indigo-300`}>
                    {story.gearTag}
                  </p>
                )}

                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    isExpanded
                      ? "mt-2 max-h-40 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p
                    className={`max-w-xl ${baseTypography.xs} leading-relaxed text-slate-200 sm:text-sm`}
                  >
                    {story.testimonial}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
