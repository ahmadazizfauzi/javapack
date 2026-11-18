"use client";

import React from "react";
import Image from "next/image";
import { baseTypography } from "@/tokens/base_typography";

export function FullHeroSection() {
  const headline = "Travel Lighter\nwith JavaPack.";
  const subheadline =
    "Rent winter jackets, Pocket WiFi modems, and cabin luggage with convenient pickup right at the airport.";

  const handleExploreClick = () => {
    const target = document.getElementById("highlighted-gear");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative -mt-20 flex h-[100svh] min-h-[500px] max-h-[860px] w-full items-center justify-center overflow-hidden pt-20">
      {/* Masked Background + Scrim Wrapper: fades seamlessly to transparent so BaseAmbientBg blends without a seam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 52%, rgba(0,0,0,0.65) 76%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 52%, rgba(0,0,0,0.65) 76%, rgba(0,0,0,0) 100%)",
        }}
      >
        <Image
          src="/images/hero-overseas-travel.jpg"
          alt="International travel destination with airport terminal and snowy mountains"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Balanced Dark Scrim for Centered Typography */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080C14]/75 via-[#080C14]/55 to-[#080C14]/30" />
      </div>

      {/* Centered Hero Copy */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1
          className={`whitespace-pre-line ${baseTypography["3xl"]} font-bold tracking-tight text-white sm:text-5xl lg:text-[54px] lg:leading-[1.15]`}
        >
          {headline}
        </h1>
        <p
          className={`mt-5 max-w-xl ${baseTypography.sm} leading-relaxed text-slate-200 sm:text-base`}
        >
          {subheadline}
        </p>
        <div className="mt-8 flex items-center justify-center">
          <button
            type="button"
            onClick={handleExploreClick}
            className={`inline-flex items-center justify-center rounded-full bg-indigo-600 px-7 py-3.5 ${baseTypography.sm} font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500`}
          >
            Explore Gear
          </button>
        </div>
      </div>
    </section>
  );
}
