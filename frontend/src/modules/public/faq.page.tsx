"use client";

import React, { useEffect, useState } from "react";
import { BaseSkeleton } from "@/components/ui/base_skeleton";
import { PublicFaqItem } from "@/types/public.type";
import { fetchPublicFaqs } from "./actions/public.action";
import { FaqSection } from "./components/faq/FaqSection";

export function PublicFaqPage() {
  const [items, setItems] = useState<PublicFaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

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
