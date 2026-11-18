"use client";

import React, { useEffect, useState } from "react";
import { BaseSkeleton } from "@/components/ui/base_skeleton";
import {
  HeroBannerItem,
  HomeStepItem,
  HomeStoryItem,
} from "@/types/public.type";
import {
  DEFAULT_HOME_STEPS,
  DEFAULT_HOME_STORIES,
  fetchPublicHomeData,
  recordSiteVisit,
} from "./actions/public.action";
import { FullHeroSection } from "./components/home/FullHeroSection";
import { HeroSliderSection } from "./components/home/HeroSliderSection";
import { HowItWorksTimelineSection } from "./components/home/HowItWorksTimelineSection";
import { TravelerStoriesSection } from "./components/home/TravelerStoriesSection";

export function PublicHomePage() {
  const [banners, setBanners] = useState<HeroBannerItem[]>([]);
  const [homeSteps, setHomeSteps] =
    useState<HomeStepItem[]>(DEFAULT_HOME_STEPS);
  const [homeStories, setHomeStories] =
    useState<HomeStoryItem[]>(DEFAULT_HOME_STORIES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    recordSiteVisit("home");

    fetchPublicHomeData()
      .then((data) => {
        if (!active) return;
        setBanners(data.banners);
        setHomeSteps(data.homeSteps);
        setHomeStories(data.homeStories);
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

  return (
    <>
      <FullHeroSection />
      <HeroSliderSection banners={banners} />
      <HowItWorksTimelineSection steps={homeSteps} />
      <TravelerStoriesSection stories={homeStories} />
    </>
  );
}
