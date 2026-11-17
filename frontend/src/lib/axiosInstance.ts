import axios, { AxiosRequestConfig } from "axios";

interface RetryableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string | null> | null = null;

async function performTokenRefresh(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const storedRefresh = localStorage.getItem("refreshToken");
  if (!storedRefresh) return null;

  try {
    const res = await axios.post<{
      data: { token: string; refreshToken?: string };
    }>(`${baseURL}/auth/refresh`, { refreshToken: storedRefresh });

    const { token, refreshToken } = res.data.data;
    localStorage.setItem("token", token);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    return token;
  } catch {
    return null;
  }
}

function clearAuthAndRedirect(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  if (window.location.pathname.startsWith("/admin")) {
    window.location.href = "/login";
  }
}

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url || "";

    const isAuthEndpoint =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/refresh");

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = performTokenRefresh().finally(() => {
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;
      if (newToken) {
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return axiosInstance(originalRequest);
      }

      clearAuthAndRedirect();
    } else if (status === 401 && !isAuthEndpoint) {
      clearAuthAndRedirect();
    }

    return Promise.reject(error);
  }
);

export function getApiErrorMessage(
  error: unknown,
  fallback = "Request failed"
): string {
  if (axios.isAxiosError(error)) {
    const message = (
      error.response?.data as { message?: string } | undefined
    )?.message;
    if (message) return message;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

export default axiosInstance;
