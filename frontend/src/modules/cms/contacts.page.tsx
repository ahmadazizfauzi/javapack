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
import { BackendContactStatus, CmsContactItem } from "@/types/cms.type";
import {
  deleteCmsContact,
  fetchCmsContacts,
  updateCmsContactStatus,
} from "./actions/cms.action";
import { CmsTableToolbar } from "./components/CmsTableToolbar";
import { CmsActionButtons } from "./components/CmsActionButtons";
import { baseTypography } from "@/tokens/base_typography";

const contactStatusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Read", value: "read" },
  { label: "Replied", value: "replied" },
];

const updateStatusOptions = contactStatusOptions.slice(1);

function getContactBadgeVariant(
  status: BackendContactStatus
): BaseBadgeVariant {
  if (status === "replied") return "success";
  if (status === "read") return "info";
  return "warning";
}

export function CmsContactsPage() {
  const [items, setItems] = useState<CmsContactItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date>(
    () => new Date(2026, 10, 17)
  );
  const [page, setPage] = useState(1);

  const [editingItem, setEditingItem] = useState<CmsContactItem | null>(null);
  const [draftStatus, setDraftStatus] =
    useState<BackendContactStatus>("read");
  const [deleteTarget, setDeleteTarget] = useState<CmsContactItem | null>(
    null
  );
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
      const res = await fetchCmsContacts({
        search,
        status: statusFilter === "all" ? undefined : statusFilter,
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
        message: getApiErrorMessage(error, "Failed to load contact messages."),
      });
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateStatus = async () => {
    if (!editingItem) return;
    setIsSubmitting(true);
    try {
      await updateCmsContactStatus(editingItem.id, draftStatus);
      setEditingItem(null);
      setToast({
        visible: true,
        variant: "success",
        title: "Status Updated",
        message: "Contact message status updated.",
      });
      await loadData();
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Update Failed",
        message: getApiErrorMessage(error, "Failed to update message status."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      await deleteCmsContact(deleteTarget.id);
      setDeleteTarget(null);
      setToast({
        visible: true,
        variant: "success",
        title: "Message Deleted",
        message: "Contact message removed.",
      });
      await loadData();
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Delete Failed",
        message: getApiErrorMessage(error, "Failed to delete message."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: BaseTableColumn<CmsContactItem>[] = [
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
      header: "RECEIVED AT",
      render: (row) => (
        <span className={`${baseTypography.xs} text-surface-subtle`}>{row.createdAt}</span>
      ),
    },
    {
      key: "name",
      header: "SENDER",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-surface-foreground">
            {row.name}
          </span>
          <span className={`${baseTypography.xs} text-surface-muted`}>{row.email}</span>
        </div>
      ),
    },
    {
      key: "subject",
      header: "SUBJECT",
      render: (row) => (
        <span className={`${baseTypography.xs} font-semibold text-surface-foreground`}>
          {row.subject}
        </span>
      ),
    },
    {
      key: "message",
      header: "MESSAGE",
      render: (row) => (
        <span className={`block max-w-xs truncate ${baseTypography.xs} text-surface-subtle`}>
          {row.message}
        </span>
      ),
    },
    {
      key: "status",
      header: "STATUS",
      render: (row) => (
        <BaseBadge variant={getContactBadgeVariant(row.status)}>
          {row.status.toUpperCase()}
        </BaseBadge>
      ),
    },
    {
      key: "actions",
      header: "ACTIONS",
      align: "right",
      render: (row) => (
        <CmsActionButtons
          onEdit={() => {
            setEditingItem(row);
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
        breadcrumb="JAVAPACK CMS  /  CONTACT MESSAGES"
        title="Contact Messages"
        action={
          <BaseButton variant="primary" size="md" onClick={loadData}>
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Inbox</span>
          </BaseButton>
        }
      />

      <BaseCard padding="lg" className="flex flex-col gap-5">
        <h2 className={`${baseTypography.sm} font-bold text-surface-foreground`}>
          Incoming Inquiries List
        </h2>

        <CmsTableToolbar
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          searchPlaceholder="Search sender or subject..."
          filterOptions={contactStatusOptions}
          filterValue={statusFilter}
          onFilterChange={(val) => {
            setStatusFilter(val);
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
            emptyMessage="No contact messages found."
          />
        )}

        <BasePagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={10}
          itemLabel="messages"
          onPageChange={setPage}
        />
      </BaseCard>

      <BaseModal
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        title="Update Message Status"
        description={editingItem?.subject ?? ""}
        footer={
          <>
            <BaseButton
              variant="secondary"
              size="sm"
              onClick={() => setEditingItem(null)}
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
        <div className="flex flex-col gap-3">
          <p className={`rounded-lg border border-surface-elevated bg-surface-sidebar p-3 ${baseTypography.xs} text-surface-subtle`}>
            {editingItem?.message}
          </p>
          <BaseDropdown
            label="Inquiry Status"
            options={updateStatusOptions}
            value={draftStatus}
            onChange={(val) => setDraftStatus(val as BackendContactStatus)}
          />
        </div>
      </BaseModal>

      <BaseModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Message?"
        description={`Message from "${deleteTarget?.name ?? ""}" will be removed.`}
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
