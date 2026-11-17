"use client";

import React, { useEffect, useState } from "react";
import { BaseHeader } from "@/components/navigation/base_header";
import { BaseSkeleton } from "@/components/ui/base_skeleton";
import { BaseToast } from "@/components/ui/base_toast";
import { getApiErrorMessage } from "@/lib/axiosInstance";
import { DashboardOverviewData } from "@/types/dashboard.type";
import { fetchDashboardOverview } from "./actions/dashboard.action";
import { KpiCardsSection } from "./components/KpiCardsSection";
import { SiteVisitsSection } from "./components/SiteVisitsSection";

export interface DashboardPageProps {
  onOpenMobileMenu?: () => void;
}

export function DashboardPage({ onOpenMobileMenu }: DashboardPageProps) {
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("11");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    fetchDashboardOverview({
      year: Number(selectedYear),
      month: Number(selectedMonth),
    })
      .then((res) => {
        if (active) setData(res);
      })
      .catch((error) => {
        if (active) {
          setErrorMsg(
            getApiErrorMessage(error, "Failed to load dashboard overview.")
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedMonth, selectedYear]);

  return (
    <div className="flex flex-col gap-5">
      <BaseHeader
        breadcrumb="JAVAPACK CMS  /  DASHBOARD"
        title="Dashboard"
        onMenuClick={onOpenMobileMenu}
      />

      {isLoading && !data ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <BaseSkeleton variant="card" />
          <BaseSkeleton variant="card" />
          <BaseSkeleton variant="card" />
          <BaseSkeleton variant="card" />
        </div>
      ) : (
        <KpiCardsSection items={data?.kpis ?? []} />
      )}

      <SiteVisitsSection
        data={data?.siteVisits ?? []}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />

      <BaseToast
        isVisible={Boolean(errorMsg)}
        variant="error"
        title="Dashboard Error"
        message={errorMsg ?? ""}
        onClose={() => setErrorMsg(null)}
      />
    </div>
  );
}
