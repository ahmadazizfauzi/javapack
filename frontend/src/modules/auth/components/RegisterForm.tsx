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
import { registerAction } from "@/modules/auth/actions/auth.action";
import { baseTypography } from "@/tokens/base_typography";

export function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
      const { user } = await registerAction({
        name: fullName,
        email,
        phone,
        password,
      });
      setToast({
        visible: true,
        variant: "success",
        title: "Account Created",
        message: `Welcome to JavaPack, ${user.name}!`,
      });
      router.push("/");
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Registration Failed",
        message: getApiErrorMessage(error, "Unable to create account."),
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
            Create JavaPack Account
          </h1>
          <p className={`mt-1 ${baseTypography.xs} text-surface-subtle`}>
            Sign up for free to start renting travel gear.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <BaseInput
            label="Full Name"
            type="text"
            placeholder="Raka Pratama"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <BaseInput
            label="Email"
            type="email"
            placeholder="name@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <BaseInput
            label="WhatsApp / Phone Number"
            type="tel"
            placeholder="081234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <BaseInput
            label="Password"
            type="password"
            placeholder="Minimum 8 characters"
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
            Register Now
          </BaseButton>
        </form>

        <p className={`mt-6 text-center ${baseTypography.xs} text-surface-subtle`}>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Sign in here
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
