"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, QrCode, ShieldCheck } from "lucide-react";
import axiosInstance, { getApiErrorMessage } from "@/lib/axiosInstance";
import { BaseCard } from "@/components/ui/base_card";
import { BaseInput } from "@/components/ui/base_input";
import { BaseButton } from "@/components/ui/base_button";
import { BaseBadge } from "@/components/ui/base_badge";
import { BaseSwitch } from "@/components/ui/base_switch";
import { BaseSkeleton } from "@/components/ui/base_skeleton";
import { BaseToast } from "@/components/ui/base_toast";
import { baseTypography } from "@/tokens/base_typography";

interface VerifiedOrder {
  id: number;
  order_code: string;
  quantity: number;
  start_date: string;
  end_date: string;
  duration_days: number;
  status: "pending_payment" | "paid" | "active_rent" | "completed";
  user?: { name: string; email: string; phone?: string };
  product?: { name: string; is_physical: boolean };
  pickupLocation?: { name: string; city: string };
}

function PickupVerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState("petugas@gmail.com");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [order, setOrder] = useState<VerifiedOrder | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    visible: boolean;
    variant: "success" | "error";
    title: string;
    message: string;
  }>({ visible: false, variant: "success", title: "", message: "" });

  const loadOrder = useCallback(async () => {
    if (!token) {
      setErrorMsg("QR pickup token is missing.");
      return;
    }
    setLoadingOrder(true);
    setErrorMsg(null);
    try {
      const res = await axiosInstance.get<{ data: VerifiedOrder }>(
        "/cms/orders/verify-pickup",
        { params: { token } }
      );
      setOrder(res.data.data);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, "Failed to verify pickup QR."));
    } finally {
      setLoadingOrder(false);
    }
  }, [token]);

  useEffect(() => {
    const authToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!authToken) {
      setCheckingAuth(false);
      return;
    }
    axiosInstance
      .get<{ data: { role: string } }>("/auth/me")
      .then((res) => {
        if (res.data.data.role === "admin") {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => setCheckingAuth(false));
  }, []);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadOrder();
    }
  }, [isAuthenticated, token, loadOrder]);

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setErrorMsg(null);
    try {
      const res = await axiosInstance.post<{
        data: { token: string; user: { role: string } };
      }>("/auth/login", { email: email.trim(), password });

      if (res.data.data.user.role !== "admin") {
        setErrorMsg("Only staff/admin accounts can verify gear pickup.");
        return;
      }
      localStorage.setItem("token", res.data.data.token);
      setIsAuthenticated(true);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, "Invalid staff credentials."));
    } finally {
      setLoggingIn(false);
    }
  };

  const handleToggleActiveRent = async (checked: boolean) => {
    if (!order) return;
    const nextStatus = checked ? "active_rent" : "paid";
    setToggling(true);
    try {
      await axiosInstance.patch(`/cms/orders/${order.id}/status`, {
        status: nextStatus,
      });
      setOrder({ ...order, status: nextStatus });
      setToast({
        visible: true,
        variant: "success",
        title: "Status Updated",
        message: checked
          ? "Gear handed over — status is now Active Rent."
          : "Order status reverted to Paid.",
      });
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Update Failed",
        message: getApiErrorMessage(error, "Failed to update order status."),
      });
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-canvas px-4 py-12 text-surface-foreground">
      <div className="w-full max-w-md">
        <BaseCard padding="lg" className="flex flex-col gap-5">
          <div className="flex items-center gap-3 border-b border-surface-elevated pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h1 className={`${baseTypography.lg} font-bold text-surface-foreground`}>
                Airport Counter Pickup Verify
              </h1>
              <p className={`${baseTypography.xs} text-surface-muted`}>
                Staff QR scan verification for JavaPack gear handover
              </p>
            </div>
          </div>

          {checkingAuth ? (
            <BaseSkeleton variant="table" rows={3} />
          ) : !isAuthenticated ? (
            <form onSubmit={handleStaffLogin} className="flex flex-col gap-4">
              <div className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2.5 text-xs text-indigo-300">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Sign in with counter staff credentials to activate rental.</span>
              </div>

              {errorMsg && (
                <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                  {errorMsg}
                </p>
              )}

              <BaseInput
                label="Staff Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="petugas@gmail.com"
                required
              />
              <BaseInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <BaseButton type="submit" variant="primary" isLoading={loggingIn}>
                Sign In & Verify QR
              </BaseButton>
            </form>
          ) : loadingOrder ? (
            <BaseSkeleton variant="table" rows={4} />
          ) : errorMsg ? (
            <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
              {errorMsg}
            </p>
          ) : order ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-cyan-400">
                  {order.order_code}
                </span>
                <BaseBadge
                  variant={
                    order.status === "active_rent"
                      ? "info"
                      : order.status === "paid"
                        ? "success"
                        : "warning"
                  }
                >
                  {order.status.toUpperCase()}
                </BaseBadge>
              </div>

              <div className="flex flex-col gap-2 rounded-xl border border-surface-elevated bg-surface-sidebar p-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-surface-muted">Customer</span>
                  <span className="font-semibold text-surface-foreground">
                    {order.user?.name || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-muted">Product</span>
                  <span className="font-semibold text-surface-foreground">
                    {order.product?.name || "-"} ({order.quantity} unit)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-muted">Pickup Counter</span>
                  <span className="text-surface-subtle">
                    {order.pickupLocation?.name || "Digital / Online"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-muted">Rental Dates</span>
                  <span className="text-surface-subtle">
                    {order.start_date} to {order.end_date} ({order.duration_days}d)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                  <div>
                    <p className="text-xs font-bold text-surface-foreground">
                      Activate Rental (Active Rent)
                    </p>
                    <p className="text-[11px] text-surface-muted">
                      Toggle ON once gear is handed to the customer
                    </p>
                  </div>
                </div>
                <BaseSwitch
                  checked={order.status === "active_rent"}
                  disabled={toggling || order.status === "completed"}
                  onChange={handleToggleActiveRent}
                />
              </div>
            </div>
          ) : null}
        </BaseCard>
      </div>

      <BaseToast
        isVisible={toast.visible}
        variant={toast.variant}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </div>
  );
}

export default function PickupVerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-canvas" />}>
      <PickupVerifyContent />
    </Suspense>
  );
}
