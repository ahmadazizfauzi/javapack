"use client";

import React, { useEffect, useState } from "react";
import { BaseSkeleton } from "@/components/ui/base_skeleton";
import { PublicFaqItem } from "@/types/public.type";
import { fetchPublicFaqs, recordSiteVisit } from "./actions/public.action";
import { FaqSection } from "./components/FaqSection";

export function PublicFaqPage() {
  const [items, setItems] = useState<PublicFaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    recordSiteVisit("faq");

    fetchPublicFaqs()
      .then((data) => {
        if (active) setItems(data);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return <BaseSkeleton variant="faqList" />;
  }

  return <FaqSection items={items} />;
}
