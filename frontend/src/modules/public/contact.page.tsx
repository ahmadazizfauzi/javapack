"use client";

import React, { useEffect, useState } from "react";
import { ContactInfo } from "@/types/public.type";
import { fetchPublicContactInfo } from "./actions/public.action";
import { ContactSection } from "./components/contact/ContactSection";

export function PublicContactPage() {
  const [info, setInfo] = useState<ContactInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchPublicContactInfo()
      .then((res) => {
        if (active) setInfo(res);
      })
      .catch(() => {
        if (active) setInfo(null);
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
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="h-96 animate-pulse rounded-2xl bg-surface-card" />
        <div className="h-96 animate-pulse rounded-2xl bg-surface-card" />
      </div>
    );
  }

  return <ContactSection info={info} />;
}
