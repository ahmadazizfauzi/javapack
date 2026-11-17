"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { HeroBannerItem, HomeContent } from "@/types/public.type";
import { baseTypography } from "@/tokens/base_typography";

export interface HeroSliderSectionProps {
  banners: HeroBannerItem[];
  homeContent?: HomeContent;
}

export function HeroSliderSection({
  banners,
  homeContent,
}: HeroSliderSectionProps) {
  const [activeIndex, setActiveIndex] = useState(
    banners.length > 1 ? 1 : 0
  );
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isPaused, setIsPaused] = useState(false);

  const total = banners.length;

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setDirection("prev");
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setDirection("next");
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [total, isPaused, handleNext]);

  const prevIndex = total > 0 ? (activeIndex - 1 + total) % total : 0;
  const nextIndex = total > 0 ? (activeIndex + 1) % total : 0;

  const currentBanner = banners[activeIndex];
  const leftBanner = banners[prevIndex];
  const rightBanner = banners[nextIndex];
  const animClass =
    direction === "next" ? "animate-slide-right" : "animate-slide-left";

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      {/* Hero Header Block */}
      {(homeContent?.badgeText ||
        homeContent?.headline ||
        homeContent?.subheadline) && (
        <div className="flex max-w-3xl flex-col items-center text-center">
          {homeContent?.badgeText && (
            <span className={`inline-flex items-center rounded-full border border-surface-border bg-surface-card/80 px-4 py-1 ${baseTypography.xs} font-medium text-surface-subtle`}>
              {homeContent.badgeText}
            </span>
          )}
          {homeContent?.headline && (
            <h1 className={`mt-5 ${baseTypography["3xl"]} font-bold tracking-tight text-surface-foreground sm:text-4xl lg:text-5xl`}>
              {homeContent.headline}
            </h1>
          )}
          {homeContent?.subheadline && (
            <p className={`mt-4 max-w-2xl ${baseTypography.sm} text-surface-subtle sm:text-base`}>
              {homeContent.subheadline}
            </p>
          )}
        </div>
      )}

      {/* Hero Slider Row */}
      {total > 0 && currentBanner && (
        <>
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="mt-10 grid w-full grid-cols-1 items-center gap-5 lg:grid-cols-12"
          >
        {total > 1 && (
          <button
            key={`left-${leftBanner.id}-${activeIndex}`}
            type="button"
            onClick={handlePrev}
            className={`group relative hidden h-80 overflow-hidden rounded-2xl border border-surface-elevated text-left transition-all duration-300 hover:border-surface-border lg:col-span-3 lg:block ${animClass}`}
          >
            <Image
              src={leftBanner.imageUrl}
              alt={leftBanner.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-canvas/95 via-surface-canvas/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h2 className={`${baseTypography.sm} font-bold text-white`}>
                {leftBanner.title}
              </h2>
              <p className={`mt-1 line-clamp-2 ${baseTypography.xs} text-surface-subtle`}>
                {leftBanner.description}
              </p>
            </div>
          </button>
        )}

        <div
          key={`center-${currentBanner.id}-${activeIndex}`}
          className={`group relative h-80 overflow-hidden rounded-2xl border border-indigo-500/80 shadow-2xl shadow-indigo-600/20 transition-all duration-500 sm:h-96 ${
            total > 1 ? "lg:col-span-6" : "lg:col-span-12"
          } ${animClass}`}
        >
          <Image
            src={currentBanner.imageUrl}
            alt={currentBanner.title}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-canvas/95 via-surface-canvas/35 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-6">
            <div>
              <h2 className={`${baseTypography.lg} font-bold text-white sm:text-xl`}>
                {currentBanner.title}
              </h2>
              <p className={`mt-1 ${baseTypography.xs} text-surface-subtle sm:text-sm`}>
                {currentBanner.description}
              </p>
            </div>
            <Link
              href={currentBanner.ctaHref}
              aria-label={`View ${currentBanner.title}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-indigo-600 shadow-lg transition-transform hover:scale-105"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {total > 2 && (
          <button
            key={`right-${rightBanner.id}-${activeIndex}`}
            type="button"
            onClick={handleNext}
            className={`group relative hidden h-80 overflow-hidden rounded-2xl border border-surface-elevated text-left transition-all duration-300 hover:border-surface-border lg:col-span-3 lg:block ${animClass}`}
          >
            <Image
              src={rightBanner.imageUrl}
              alt={rightBanner.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-canvas/95 via-surface-canvas/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h2 className={`${baseTypography.sm} font-bold text-white`}>
                {rightBanner.title}
              </h2>
              <p className={`mt-1 line-clamp-2 ${baseTypography.xs} text-surface-subtle`}>
                {rightBanner.description}
              </p>
            </div>
          </button>
        )}
      </div>

      {/* Slider Controls Row */}
      <div className="mt-7 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous slide"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-elevated bg-surface-card text-surface-subtle transition-colors hover:border-surface-border hover:text-surface-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 px-1">
          {banners.map((banner, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={banner.id}
                type="button"
                onClick={() => {
                  setDirection(idx > activeIndex ? "next" : "prev");
                  setActiveIndex(idx);
                }}
                aria-label={`Select slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-6 bg-indigo-500"
                    : "w-2 bg-surface-border hover:bg-surface-muted"
                }`}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next slide"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-elevated bg-surface-card text-surface-subtle transition-colors hover:border-surface-border hover:text-surface-foreground"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
        </>
      )}
    </section>
  );
}
