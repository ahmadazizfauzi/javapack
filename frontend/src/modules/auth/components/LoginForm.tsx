"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BaseButton } from "@/components/ui/base_button";
import { BaseInput } from "@/components/ui/base_input";
import { BaseCard } from "@/components/ui/base_card";
import { BaseToast } from "@/components/ui/base_toast";
import { getApiErrorMessage } from "@/lib/axiosInstance";
import { loginAction } from "@/modules/auth/actions/auth.action";
import { baseTypography } from "@/tokens/base_typography";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    variant: "success" | "error";
    title: string;
    message: string;
  }>({
    visible: false,
    variant: "success",
    title: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { user } = await loginAction({ email, password });
      setToast({
        visible: true,
        variant: "success",
        title: "Login Successful",
        message: `Welcome back, ${user.name}!`,
      });
      if (user.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/");
      }
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Login Failed",
        message: getApiErrorMessage(error, "Invalid email or password."),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BaseCard
        className="w-full max-w-md rounded-2xl border-surface-elevated px-7 pb-8 pt-6 sm:px-8 sm:pb-8 sm:pt-7 shadow-2xl shadow-black/40"
        padding="none"
      >
        <Link href="/home" className="inline-flex items-center">
          <Image
            src="/images/javapack-logo.png"
            alt="JavaPack"
            width={145}
            height={34}
            className="h-8 w-auto shrink-0 object-contain"
          />
        </Link>

        <div className="mt-4">
          <h1 className={`${baseTypography.xl} font-bold tracking-tight text-surface-foreground`}>
            Sign in to JavaPack
          </h1>
          <p className={`mt-1 ${baseTypography.xs} text-surface-subtle`}>
            Sign in to rent travel gear
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <BaseInput
            label="Email"
            type="email"
            placeholder="raka@javapack.id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <BaseInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            fullWidth
            className="mt-1"
          >
            Sign In Now
          </BaseButton>
        </form>

        <p className={`mt-6 text-center ${baseTypography.xs} text-surface-subtle`}>
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Register here
          </Link>
        </p>
      </BaseCard>

      <BaseToast
        isVisible={toast.visible}
        variant={toast.variant}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </>
  );
}
