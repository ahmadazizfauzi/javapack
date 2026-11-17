"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Mail, Phone, ShieldCheck } from "lucide-react";
import { BaseCard } from "@/components/ui/base_card";
import { BaseBadge, BaseBadgeVariant } from "@/components/ui/base_badge";
import { BaseButton } from "@/components/ui/base_button";
import { BaseTable, BaseTableColumn } from "@/components/ui/base_table";
import { BaseModal } from "@/components/ui/base_modal";
import { BaseSkeleton } from "@/components/ui/base_skeleton";
import {
  fetchMeAction,
  logoutAction,
} from "@/modules/auth/actions/auth.action";
import { fetchMyRentalHistory } from "@/modules/public/actions/public.action";
import { User } from "@/types/auth.type";
import { RentalHistoryLogItem } from "@/types/public.type";
import { baseTypography } from "@/tokens/base_typography";

function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function getEventBadgeVariant(status: string): BaseBadgeVariant {
  if (status === "paid") return "success";
  if (status === "active_rent") return "info";
  if (status === "pending_payment") return "warning";
  return "neutral";
}

export function PublicProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<RentalHistoryLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }

    async function loadProfile() {
      try {
        const me = await fetchMeAction();
        if (!active) return;
        setUser(me);

        try {
          const logs = await fetchMyRentalHistory();
          if (active) setHistory(logs);
        } catch {
          if (active) setHistory([]);
        }
      } catch {
        logoutAction();
        router.replace("/login");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [router]);

  const handleConfirmLogout = () => {
    logoutAction();
    setLogoutModalOpen(false);
    router.replace("/login");
  };

  if (isLoading || !user) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <BaseSkeleton variant="card" />
        <BaseSkeleton variant="table" rows={4} />
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");

  const columns: BaseTableColumn<RentalHistoryLogItem>[] = [
    {
      key: "no",
      header: "NO",
      widthClass: "w-14",
      render: (_row, idx) => (
        <span className={`${baseTypography.xs} text-surface-muted`}>{idx + 1}</span>
      ),
    },
    {
      key: "createdAt",
      header: "LOGGED AT",
      render: (row) => (
        <span className={`${baseTypography.xs} text-surface-subtle`}>{row.createdAt}</span>
      ),
    },
    {
      key: "orderCode",
      header: "BOOKING CODE",
      render: (row) => (
        <span className="font-semibold text-cyan-400">{row.orderCode}</span>
      ),
    },
    {
      key: "productName",
      header: "PRODUCT",
      render: (row) => (
        <span className="font-semibold text-surface-foreground">
          {row.productName}
        </span>
      ),
    },
    {
      key: "quantity",
      header: "QTY",
      render: (row) => (
        <span className={`${baseTypography.xs} text-surface-subtle`}>
          {row.quantity}x
        </span>
      ),
    },
    {
      key: "durationDays",
      header: "DURATION",
      render: (row) => (
        <span className={`${baseTypography.xs} text-surface-subtle`}>
          {row.durationDays} {row.durationDays === 1 ? "Day" : "Days"}
        </span>
      ),
    },
    {
      key: "rentalRange",
      header: "RENTAL DATES",
      render: (row) => (
        <span className={`${baseTypography.xs} text-surface-subtle`}>{row.rentalRange}</span>
      ),
    },
    {
      key: "totalAmount",
      header: "TOTAL",
      render: (row) => (
        <span className="font-semibold text-surface-foreground">
          {formatRupiah(row.totalAmount)}
        </span>
      ),
    },
    {
      key: "eventStatus",
      header: "STATUS",
      render: (row) => (
        <BaseBadge variant={getEventBadgeVariant(row.eventStatus)}>
          {row.eventStatus.replace("_", " ").toUpperCase()}
        </BaseBadge>
      ),
    },
    {
      key: "note",
      header: "NOTE",
      render: (row) => (
        <span className={`block max-w-xs truncate ${baseTypography.xs} text-surface-muted`}>
          {row.note}
        </span>
      ),
    },
    {
      key: "paymentUrl",
      header: "ACTION",
      align: "right",
      render: (row) =>
        row.eventStatus === "pending_payment" && row.paymentUrl ? (
          <BaseButton
            type="button"
            variant="primary"
            size="sm"
            onClick={() =>
              window.open(row.paymentUrl!, "_blank", "noopener,noreferrer")
            }
          >
            Pay Now
          </BaseButton>
        ) : (
          <span className={`${baseTypography.xs} text-surface-muted`}>-</span>
        ),
    },
  ];

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      {/* User Profile Card */}
      <BaseCard padding="lg" className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {user.avatar_url ? (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-indigo-500/50">
              <Image
                src={user.avatar_url}
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-indigo-500/40 bg-indigo-600/20 ${baseTypography.xl} font-bold text-indigo-300`}>
              {initials || "JP"}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className={`${baseTypography.xl} font-bold text-surface-foreground sm:text-2xl`}>
                {user.name}
              </h1>
              <BaseBadge variant={user.role === "admin" ? "info" : "success"}>
                {user.role.toUpperCase()}
              </BaseBadge>
            </div>
            <div className={`flex flex-wrap items-center gap-4 ${baseTypography.xs} text-surface-subtle`}>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-indigo-400" />
                <span>{user.email}</span>
              </span>
              {user.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{user.phone}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Verified Account</span>
              </span>
            </div>
          </div>
        </div>

        <BaseButton
          variant="softDanger"
          size="md"
          onClick={() => setLogoutModalOpen(true)}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </BaseButton>
      </BaseCard>

      {/* Immutable Rental History Log */}
      <BaseCard padding="lg" className="flex flex-col gap-4">
        <div>
          <h2 className={`${baseTypography.md} font-bold text-surface-foreground`}>
            Rental History Logs
          </h2>
          <p className={`mt-1 ${baseTypography.xs} text-surface-muted`}>
            Immutable historical record of your gear rental transactions.
          </p>
        </div>

        <BaseTable
          columns={columns}
          data={history}
          rowKey={(row) => row.id}
          emptyMessage="You have no rental history logs yet."
        />
      </BaseCard>

      <BaseModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Sign out of JavaPack?"
        description="Your session will be cleared and you will be redirected to the login page."
        footer={
          <>
            <BaseButton
              variant="secondary"
              size="sm"
              onClick={() => setLogoutModalOpen(false)}
            >
              Cancel
            </BaseButton>
            <BaseButton
              variant="danger"
              size="sm"
              onClick={handleConfirmLogout}
            >
              Yes, Sign Out
            </BaseButton>
          </>
        }
      />
    </section>
  );
}
