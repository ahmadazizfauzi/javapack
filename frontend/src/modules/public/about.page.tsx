"use client";

import React, { useEffect, useState } from "react";
import { AboutContent } from "@/types/public.type";
import { baseTypography } from "@/tokens/base_typography";
import { fetchPublicAboutUs, recordSiteVisit } from "./actions/public.action";
import { AboutSection } from "./components/AboutSection";

export function PublicAboutPage() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    recordSiteVisit("about");

    fetchPublicAboutUs()
      .then((res) => {
        if (active) setContent(res);
      })
      .catch(() => {
        if (active) setContent(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-64 w-full animate-pulse rounded-2xl bg-surface-card" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-2xl bg-surface-card" />
          <div className="flex flex-col gap-4">
            <div className="h-4 w-40 animate-pulse rounded bg-surface-card" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-surface-card" />
            <div className="h-24 w-full animate-pulse rounded bg-surface-card" />
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
        <p className={`${baseTypography.sm} text-surface-muted`}>
          About Us content is not configured yet.
        </p>
      </div>
    );
  }

  return <AboutSection content={content} />;
}
