"use client";

import React, { useEffect, useState } from "react";
import { BaseSkeleton } from "@/components/ui/base_skeleton";
import { HeroBannerItem, HomeContent } from "@/types/public.type";
import {
  DEFAULT_HOME_CONTENT,
  fetchPublicHomeData,
  recordSiteVisit,
} from "./actions/public.action";
import { HeroSliderSection } from "./components/HeroSliderSection";

export function PublicHomePage() {
  const [banners, setBanners] = useState<HeroBannerItem[]>([]);
  const [homeContent, setHomeContent] =
    useState<HomeContent>(DEFAULT_HOME_CONTENT);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    recordSiteVisit("home");

    fetchPublicHomeData()
      .then((data) => {
        if (!active) return;
        setBanners(data.banners);
        setHomeContent(data.homeContent);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return <BaseSkeleton variant="heroSlider" />;
  }

  return <HeroSliderSection banners={banners} homeContent={homeContent} />;
}
