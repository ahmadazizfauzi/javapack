import React from "react";
import Image from "next/image";
import { AboutContent } from "@/types/public.type";
import { baseTypography } from "@/tokens/base_typography";

export interface AboutSectionProps {
  content: AboutContent;
}

export function AboutSection({ content }: AboutSectionProps) {
  return (
    <section className="flex w-full flex-col pb-16">
      {/* Full Width Banner extending behind BaseNavbar */}
      <div className="relative -mt-20 h-72 w-full overflow-hidden border-b border-surface-elevated pt-20 sm:h-80">
        <Image
          src={content.bannerImageUrl}
          alt="About JavaPack"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-canvas/70 via-surface-canvas/55 to-surface-canvas/85" />
        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <span className={`${baseTypography.xs} font-bold uppercase tracking-widest text-indigo-300 sm:text-sm`}>
            ABOUT JAVAPACK
          </span>
        </div>
      </div>

      {/* Body Row */}
      <div className="mx-auto mt-10 grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        {/* Left Image */}
        <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-surface-elevated sm:h-96">
          <Image
            src={content.sideImageUrl}
            alt="Perlengkapan Travel JavaPack"
            fill
            className="object-cover"
          />
        </div>

        {/* Right Copy & Highlight Cards */}
        <div className="flex flex-col gap-5">
          <span className={`${baseTypography.xs} font-bold uppercase tracking-wider text-indigo-400`}>
            {content.eyebrow}
          </span>
          <h1 className={`${baseTypography["2xl"]} font-bold tracking-tight text-surface-foreground sm:text-3xl`}>
            {content.headline}
          </h1>
          <div className={`space-y-3 ${baseTypography.sm} leading-relaxed text-surface-subtle`}>
            {content.paragraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
