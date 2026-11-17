export interface DashboardKpiItem {
  id: string;
  label: string;
  value: string;
  highlighted?: boolean;
}

export interface SiteVisitPoint {
  day: string;
  visits: number;
}

export interface DashboardOverviewData {
  kpis: DashboardKpiItem[];
  siteVisits: SiteVisitPoint[];
}
