import axiosInstance from "@/lib/axiosInstance";
import { DashboardOverviewData } from "@/types/dashboard.type";

interface ApiEnvelope<T> {
  status: string;
  message: string;
  data: T;
}

export interface DashboardQueryParams {
  year?: number;
  month?: number;
  page?: string;
  visitor_type?: string;
}

export async function fetchDashboardOverview(
  params?: DashboardQueryParams
): Promise<DashboardOverviewData> {
  const response = await axiosInstance.get<ApiEnvelope<DashboardOverviewData>>(
    "/cms/dashboard",
    { params }
  );
  return response.data.data;
}
