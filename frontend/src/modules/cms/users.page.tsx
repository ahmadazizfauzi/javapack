"use client";

import React, { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { BaseHeader } from "@/components/navigation/base_header";
import { BaseCard } from "@/components/ui/base_card";
import { BaseButton } from "@/components/ui/base_button";
import { BaseBadge } from "@/components/ui/base_badge";
import { BaseTable, BaseTableColumn } from "@/components/ui/base_table";
import { BasePagination } from "@/components/ui/base_pagination";
import { BaseSwitch } from "@/components/ui/base_switch";
import { BaseSkeleton } from "@/components/ui/base_skeleton";
import { BaseToast } from "@/components/ui/base_toast";
import { getApiErrorMessage } from "@/lib/axiosInstance";
import { CmsUserItem } from "@/types/cms.type";
import { fetchCmsUsers, updateCmsUserStatus } from "./actions/cms.action";
import { CmsTableToolbar } from "./components/CmsTableToolbar";
import { baseTypography } from "@/tokens/base_typography";

const roleFilterOptions = [
  { label: "All Roles", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "Customer", value: "customer" },
];

export function CmsUsersPage() {
  const [items, setItems] = useState<CmsUserItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date>(
    () => new Date(2026, 10, 17)
  );
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{
    visible: boolean;
    variant: "success" | "error";
    title: string;
    message: string;
  }>({ visible: false, variant: "success", title: "", message: "" });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchCmsUsers({
        search,
        role: roleFilter === "all" ? undefined : roleFilter,
        page,
        limit: 10,
      });
      setItems(res.items);
      setTotalItems(res.pagination.total);
      setTotalPages(Math.max(1, res.pagination.totalPages));
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Load Failed",
        message: getApiErrorMessage(error, "Failed to load users."),
      });
    } finally {
      setIsLoading(false);
    }
  }, [search, roleFilter, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleStatus = async (user: CmsUserItem, nextActive: boolean) => {
    try {
      await updateCmsUserStatus(user.id, nextActive);
      setToast({
        visible: true,
        variant: "success",
        title: "User Status Updated",
        message: `${user.name} is now ${nextActive ? "Active" : "Inactive"}.`,
      });
      await loadData();
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Update Failed",
        message: getApiErrorMessage(error, "Failed to update user status."),
      });
    }
  };

  const columns: BaseTableColumn<CmsUserItem>[] = [
    {
      key: "no",
      header: "NO",
      widthClass: "w-14",
      render: (_row, idx) => (
        <span className={`${baseTypography.xs} text-surface-muted`}>
          {(page - 1) * 10 + idx + 1}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "REGISTERED AT",
      render: (row) => (
        <span className={`${baseTypography.xs} text-surface-subtle`}>{row.createdAt}</span>
      ),
    },
    {
      key: "name",
      header: "FULL NAME",
      render: (row) => (
        <span className="font-semibold text-surface-foreground">
          {row.name}
        </span>
      ),
    },
    {
      key: "email",
      header: "EMAIL",
      render: (row) => (
        <span className={`${baseTypography.xs} text-surface-subtle`}>{row.email}</span>
      ),
    },
    {
      key: "phone",
      header: "PHONE",
      render: (row) => (
        <span className={`${baseTypography.xs} text-surface-subtle`}>{row.phone}</span>
      ),
    },
    {
      key: "role",
      header: "ROLE",
      render: (row) => (
        <BaseBadge variant={row.role === "admin" ? "info" : "neutral"}>
          {row.role.toUpperCase()}
        </BaseBadge>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <BaseHeader
        breadcrumb="JAVAPACK CMS  /  USER MANAGEMENT"
        title="User Management"
        action={
          <BaseButton variant="primary" size="md" onClick={loadData}>
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Users</span>
          </BaseButton>
        }
      />

      <BaseCard padding="lg" className="flex flex-col gap-5">
        <h2 className={`${baseTypography.sm} font-bold text-surface-foreground`}>
          Registered Users List
        </h2>

        <CmsTableToolbar
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          searchPlaceholder="Search name or email..."
          filterOptions={roleFilterOptions}
          filterValue={roleFilter}
          onFilterChange={(val) => {
            setRoleFilter(val);
            setPage(1);
          }}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {isLoading ? (
          <BaseSkeleton variant="table" rows={4} />
        ) : (
          <BaseTable
            columns={columns}
            data={items}
            rowKey={(row) => row.id}
            emptyMessage="No users found."
          />
        )}

        <BasePagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={10}
          itemLabel="users"
          onPageChange={setPage}
        />
      </BaseCard>

      <BaseToast
        isVisible={toast.visible}
        variant={toast.variant}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}
