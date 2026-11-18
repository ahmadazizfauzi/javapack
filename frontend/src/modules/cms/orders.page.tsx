"use client";

import React, { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { BaseHeader } from "@/components/navigation/base_header";
import { BaseCard } from "@/components/ui/base_card";
import { BaseButton } from "@/components/ui/base_button";
import { BaseBadge, BaseBadgeVariant } from "@/components/ui/base_badge";
import { BaseTable, BaseTableColumn } from "@/components/ui/base_table";
import { BasePagination } from "@/components/ui/base_pagination";
import { BaseModal } from "@/components/ui/base_modal";
import { BaseDropdown } from "@/components/ui/base_dropdown";
import { BaseSkeleton } from "@/components/ui/base_skeleton";
import { BaseToast } from "@/components/ui/base_toast";
import { getApiErrorMessage } from "@/lib/axiosInstance";
import { BackendOrderStatus, CmsOrderItem } from "@/types/cms.type";
import {
  deleteCmsOrder,
  fetchCmsOrders,
  updateCmsOrderStatus,
} from "./actions/cms.action";
import { CmsTableToolbar } from "./components/CmsTableToolbar";
import { CmsActionButtons } from "./components/CmsActionButtons";
import { baseTypography } from "@/tokens/base_typography";

const orderFilterOptions = [
  { label: "All Rental Statuses", value: "all" },
  { label: "Pending Payment", value: "pending_payment" },
  { label: "Paid", value: "paid" },
  { label: "Active Rent", value: "active_rent" },
  { label: "Completed (Returned)", value: "completed" },
];

const statusUpdateOptions = orderFilterOptions.slice(1);

function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function getOrderBadge(status: BackendOrderStatus): {
  label: string;
  variant: BaseBadgeVariant;
} {
  if (status === "paid") return { label: "Paid (Booked)", variant: "success" };
  if (status === "pending_payment") {
    return { label: "Pending Payment", variant: "warning" };
  }
  if (status === "completed") {
    return { label: "Completed", variant: "neutral" };
  }
  return { label: "Paid (Rented)", variant: "info" };
}

export function CmsOrdersPage() {
  const [items, setItems] = useState<CmsOrderItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortDir, setSortDir] = useState<"DESC" | "ASC">("DESC");
  const [selectedDate, setSelectedDate] = useState<Date>(
    () => new Date(2026, 10, 17)
  );
  const [page, setPage] = useState(1);

  const [editingOrder, setEditingOrder] = useState<CmsOrderItem | null>(null);
  const [draftStatus, setDraftStatus] =
    useState<BackendOrderStatus>("paid");
  const [deleteTarget, setDeleteTarget] = useState<CmsOrderItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toast, setToast] = useState<{
    visible: boolean;
    variant: "success" | "error";
    title: string;
    message: string;
  }>({ visible: false, variant: "success", title: "", message: "" });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchCmsOrders({
        search,
        status: statusFilter === "all" ? undefined : statusFilter,
        sort_by: "created_at",
        sort_dir: sortDir,
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
        message: getApiErrorMessage(error, "Failed to load orders."),
      });
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, sortDir, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateStatus = async () => {
    if (!editingOrder) return;
    setIsSubmitting(true);
    try {
      await updateCmsOrderStatus(editingOrder.id, draftStatus);
      setEditingOrder(null);
      setToast({
        visible: true,
        variant: "success",
        title: "Status Updated",
        message: "Order status has been updated.",
      });
      await loadData();
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Update Failed",
        message: getApiErrorMessage(error, "Failed to update order status."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      await deleteCmsOrder(deleteTarget.id);
      setDeleteTarget(null);
      setToast({
        visible: true,
        variant: "success",
        title: "Order Deleted",
        message: "Order has been removed.",
      });
      await loadData();
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Delete Failed",
        message: getApiErrorMessage(error, "Failed to delete order."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: BaseTableColumn<CmsOrderItem>[] = [
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
      key: "bookingCode",
      header: "BOOKING CODE",
      render: (row) => (
        <span className="font-semibold text-cyan-400">{row.bookingCode}</span>
      ),
    },
    {
      key: "createdAt",
      header: "CREATED AT",
      render: (row) => (
        <span className={`${baseTypography.xs} text-surface-subtle`}>
          {row.createdAt}
        </span>
      ),
    },
    {
      key: "customerName",
      header: "CUSTOMER",
      render: (row) => (
        <span className="font-semibold text-surface-foreground">
          {row.customerName}
        </span>
      ),
    },
    {
      key: "productName",
      header: "PRODUCT",
      render: (row) => (
        <span className={`${baseTypography.xs} text-surface-subtle`}>{row.productName}</span>
      ),
    },
    {
      key: "durationDays",
      header: "DURATION",
      render: (row) => (
        <span className={`${baseTypography.xs} text-surface-subtle`}>
          {row.durationDays} Days
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
      header: "TOTAL PAID",
      render: (row) => (
        <span className="font-semibold text-surface-foreground">
          {formatRupiah(row.totalAmount)}
        </span>
      ),
    },
    {
      key: "status",
      header: "STATUS",
      render: (row) => {
        const badge = getOrderBadge(row.status);
        return <BaseBadge variant={badge.variant}>{badge.label}</BaseBadge>;
      },
    },
    {
      key: "actions",
      header: "ACTIONS",
      align: "right",
      render: (row) => (
        <CmsActionButtons
          onEdit={() => {
            setEditingOrder(row);
            setDraftStatus(row.status);
          }}
          onDelete={() => setDeleteTarget(row)}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <BaseHeader
        breadcrumb="JAVAPACK CMS  /  ORDER"
        title="Order"
        action={
          <BaseButton variant="primary" size="md" onClick={loadData}>
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Orders</span>
          </BaseButton>
        }
      />

      <BaseCard padding="lg" className="flex flex-col gap-5">
        <h2 className={`${baseTypography.sm} font-bold text-surface-foreground`}>
          Incoming Orders List
        </h2>

        <CmsTableToolbar
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          searchPlaceholder="Search booking code / customer..."
          filterOptions={orderFilterOptions}
          filterValue={statusFilter}
          onFilterChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
          sortValue={sortDir}
          onSortChange={(val) => {
            setSortDir(val);
            setPage(1);
          }}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {isLoading ? (
          <BaseSkeleton variant="table" rows={5} />
        ) : (
          <BaseTable
            columns={columns}
            data={items}
            rowKey={(row) => row.id}
            emptyMessage="No orders found."
          />
        )}

        <BasePagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={10}
          itemLabel="orders"
          onPageChange={setPage}
        />
      </BaseCard>

      <BaseModal
        isOpen={Boolean(editingOrder)}
        onClose={() => setEditingOrder(null)}
        title="Update Order Status"
        description={`Booking ${editingOrder?.bookingCode ?? ""} — ${
          editingOrder?.customerName ?? ""
        }`}
        footer={
          <>
            <BaseButton
              variant="secondary"
              size="sm"
              onClick={() => setEditingOrder(null)}
            >
              Cancel
            </BaseButton>
            <BaseButton
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              onClick={handleUpdateStatus}
            >
              Save Status
            </BaseButton>
          </>
        }
      >
        <BaseDropdown
          label="Payment & Rental Status"
          options={statusUpdateOptions}
          value={draftStatus}
          onChange={(val) => setDraftStatus(val as BackendOrderStatus)}
        />
      </BaseModal>

      <BaseModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Order?"
        description={`Order ${deleteTarget?.bookingCode ?? ""} will be removed.`}
        footer={
          <>
            <BaseButton
              variant="secondary"
              size="sm"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </BaseButton>
            <BaseButton
              variant="danger"
              size="sm"
              isLoading={isSubmitting}
              onClick={handleDelete}
            >
              Yes, Delete
            </BaseButton>
          </>
        }
      />

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
