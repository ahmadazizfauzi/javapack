import axiosInstance from "@/lib/axiosInstance";
import {
  AuthResponse,
  LoginCredentials,
  RegisterPayload,
  User,
} from "@/types/auth.type";

interface ApiEnvelope<T> {
  status: string;
  message: string;
  data: T;
}

export async function loginAction(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const response = await axiosInstance.post<ApiEnvelope<AuthResponse>>(
    "/auth/login",
    credentials
  );
  const authData = response.data.data;

  if (typeof window !== "undefined") {
    localStorage.setItem("token", authData.token);
    if (authData.refreshToken) {
      localStorage.setItem("refreshToken", authData.refreshToken);
    }
    localStorage.setItem("user", JSON.stringify(authData.user));
  }

  return authData;
}

export async function registerAction(
  payload: RegisterPayload
): Promise<AuthResponse> {
  const response = await axiosInstance.post<ApiEnvelope<AuthResponse>>(
    "/auth/register",
    payload
  );
  const authData = response.data.data;

  if (typeof window !== "undefined") {
    localStorage.setItem("token", authData.token);
    if (authData.refreshToken) {
      localStorage.setItem("refreshToken", authData.refreshToken);
    }
    localStorage.setItem("user", JSON.stringify(authData.user));
  }

  return authData;
}

export async function fetchMeAction(): Promise<User> {
  const response = await axiosInstance.get<ApiEnvelope<User>>("/auth/me");
  const user = response.data.data;

  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }

  return user;
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function logoutAction(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
}
