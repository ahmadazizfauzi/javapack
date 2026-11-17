import React from "react";
import { BaseAccordion } from "@/components/ui/base_accordion";
import { PublicFaqItem } from "@/types/public.type";
import { baseTypography } from "@/tokens/base_typography";

export interface FaqSectionProps {
  items: PublicFaqItem[];
}

export function FaqSection({ items }: FaqSectionProps) {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <span className={`${baseTypography.xs} font-bold uppercase tracking-widest text-indigo-400`}>
          GENERAL QUESTIONS
        </span>
        <h1 className={`mt-2 ${baseTypography["3xl"]} font-bold tracking-tight text-surface-foreground sm:text-4xl`}>
          Frequently Asked Questions
        </h1>
        <p className={`mt-2.5 ${baseTypography.sm} text-surface-subtle`}>
          Everything you need to know before renting travel gear at JavaPack.
        </p>
      </div>

      <div className="mt-10">
        <BaseAccordion items={items} defaultOpenId={items[0]?.id} />
      </div>
    </section>
  );
}
