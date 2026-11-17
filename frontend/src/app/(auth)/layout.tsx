"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BaseAmbientBg } from "@/components/ui/base_ambient_bg";
import { BaseSkeleton } from "@/components/ui/base_skeleton";
import {
  fetchMeAction,
  getStoredUser,
  logoutAction,
} from "@/modules/auth/actions/auth.action";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function redirectIfAuthenticated() {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        if (active) setChecking(false);
        return;
      }

      const cachedUser = getStoredUser();
      if (cachedUser) {
        router.replace(
          cachedUser.role === "admin" ? "/admin/dashboard" : "/"
        );
        return;
      }

      try {
        const user = await fetchMeAction();
        router.replace(user.role === "admin" ? "/admin/dashboard" : "/");
      } catch {
        logoutAction();
        if (active) setChecking(false);
      }
    }

    redirectIfAuthenticated();
    return () => {
      active = false;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-surface-canvas px-4 py-6">
        <BaseAmbientBg />
        <div className="relative z-10 flex w-full max-w-md justify-center">
          <BaseSkeleton variant="authCard" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-surface-canvas px-4 py-6 text-surface-foreground">
      <BaseAmbientBg />
      <main className="relative z-10 flex w-full max-w-md justify-center">
        {children}
      </main>
    </div>
  );
}
