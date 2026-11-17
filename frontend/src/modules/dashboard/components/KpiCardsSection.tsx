import React from "react";
import { BaseCard } from "@/components/ui/base_card";
import { DashboardKpiItem } from "@/types/dashboard.type";
import { baseTypography } from "@/tokens/base_typography";

export interface KpiCardsSectionProps {
  items: DashboardKpiItem[];
}

export function KpiCardsSection({ items }: KpiCardsSectionProps) {
  return (
    <section
      aria-label="Ringkasan KPI"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {items.map((item) => (
        <BaseCard
          key={item.id}
          variant={item.highlighted ? "highlighted" : "default"}
          padding="md"
          className="flex flex-col justify-between gap-2.5"
        >
          <span
            className={`${baseTypography.xs} font-bold uppercase tracking-wider ${
              item.highlighted ? "text-indigo-100" : "text-surface-muted"
            }`}
          >
            {item.label}
          </span>
          <p className={`${baseTypography["2xl"]} font-bold tracking-tight text-white`}>
            {item.value}
          </p>
        </BaseCard>
      ))}
    </section>
  );
}
