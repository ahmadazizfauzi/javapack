"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { BaseHeader } from "@/components/navigation/base_header";
import { BaseCard } from "@/components/ui/base_card";
import { BaseButton } from "@/components/ui/base_button";
import { BaseBadge } from "@/components/ui/base_badge";
import { BaseTable, BaseTableColumn } from "@/components/ui/base_table";
import { BasePagination } from "@/components/ui/base_pagination";
import { BaseModal } from "@/components/ui/base_modal";
import { BaseInput } from "@/components/ui/base_input";
import { BaseSwitch } from "@/components/ui/base_switch";
import { BaseTextarea } from "@/components/ui/base_textarea";
import { BaseSkeleton } from "@/components/ui/base_skeleton";
import { BaseToast } from "@/components/ui/base_toast";
import { getApiErrorMessage } from "@/lib/axiosInstance";
import { CmsFaqItem } from "@/types/cms.type";
import {
  createCmsFaq,
  deleteCmsFaq,
  fetchCmsFaqs,
  updateCmsFaq,
} from "./actions/cms.action";
import { CmsTableToolbar } from "./components/CmsTableToolbar";
import { CmsActionButtons } from "./components/CmsActionButtons";
import { baseTypography } from "@/tokens/base_typography";

const statusFilterOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Published", value: "Published" },
  { label: "Draft", value: "Draft" },
];

export function CmsFaqsPage() {
  const [items, setItems] = useState<CmsFaqItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortDir, setSortDir] = useState<"DESC" | "ASC">("ASC");
  const [selectedDate, setSelectedDate] = useState<Date>(
    () => new Date(2026, 10, 17)
  );
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CmsFaqItem | null>(null);
  const [questionInput, setQuestionInput] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [isActiveInput, setIsActiveInput] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<CmsFaqItem | null>(null);
  const [toast, setToast] = useState<{
    visible: boolean;
    variant: "success" | "error";
    title: string;
    message: string;
  }>({ visible: false, variant: "success", title: "", message: "" });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchCmsFaqs({
        search,
        sort_by: "id",
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
        message: getApiErrorMessage(error, "Failed to load FAQs."),
      });
    } finally {
      setIsLoading(false);
    }
  }, [search, sortDir, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return items;
    return items.filter((item) => item.status === statusFilter);
  }, [items, statusFilter]);

  const handleSave = async () => {
    if (!questionInput.trim() || !answerInput.trim()) return;
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateCmsFaq(editingItem.id, {
          question: questionInput.trim(),
          answer: answerInput.trim(),
          is_active: isActiveInput,
        });
        setToast({
          visible: true,
          variant: "success",
          title: "FAQ Updated",
          message: "FAQ item updated.",
        });
      } else {
        await createCmsFaq({
          question: questionInput.trim(),
          answer: answerInput.trim(),
          is_active: isActiveInput,
        });
        setToast({
          visible: true,
          variant: "success",
          title: "FAQ Created",
          message: "New FAQ item added.",
        });
      }
      setFormOpen(false);
      await loadData();
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Save Failed",
        message: getApiErrorMessage(error, "Failed to save FAQ."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      await deleteCmsFaq(deleteTarget.id);
      setDeleteTarget(null);
      setToast({
        visible: true,
        variant: "success",
        title: "FAQ Deleted",
        message: "FAQ item removed.",
      });
      await loadData();
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Delete Failed",
        message: getApiErrorMessage(error, "Failed to delete FAQ."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: BaseTableColumn<CmsFaqItem>[] = [
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
      header: "CREATED AT",
      render: (row) => (
        <span className={`${baseTypography.xs} text-surface-subtle`}>{row.createdAt}</span>
      ),
    },
    {
      key: "question",
      header: "QUESTION",
      render: (row) => (
        <span className="font-semibold text-surface-foreground">
          {row.question}
        </span>
      ),
    },
    {
      key: "answer",
      header: "ANSWER",
      render: (row) => (
        <span className={`block max-w-xs truncate ${baseTypography.xs} text-surface-subtle`}>
          {row.answer}
        </span>
      ),
    },
    {
      key: "status",
      header: "STATUS",
      render: (row) => (
        <BaseBadge variant={row.status === "Published" ? "success" : "neutral"}>
          {row.status}
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
            setQuestionInput(row.question);
            setAnswerInput(row.answer);
            setIsActiveInput(row.isActive);
            setFormOpen(true);
          }}
          onDelete={() => setDeleteTarget(row)}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <BaseHeader
        breadcrumb="JAVAPACK CMS  /  WEBSITE CONTENT  /  FAQ"
        title="Frequently Asked Questions"
        action={
          <BaseButton
            variant="primary"
            size="md"
            onClick={() => {
              setEditingItem(null);
              setQuestionInput("");
              setAnswerInput("");
              setIsActiveInput(true);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            <span>Add FAQ</span>
          </BaseButton>
        }
      />

      <BaseCard padding="lg" className="flex flex-col gap-5">
        <h2 className={`${baseTypography.sm} font-bold text-surface-foreground`}>
          FAQ Items List
        </h2>

        <CmsTableToolbar
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          searchPlaceholder="Search question or answer..."
          filterOptions={statusFilterOptions}
          filterValue={statusFilter}
          onFilterChange={setStatusFilter}
          sortValue={sortDir}
          onSortChange={(val) => {
            setSortDir(val);
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
            data={filtered}
            rowKey={(row) => row.id}
            emptyMessage="No FAQ items found."
          />
        )}

        <BasePagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={10}
          itemLabel="FAQs"
          onPageChange={setPage}
        />
      </BaseCard>

      <BaseModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingItem ? "Edit FAQ" : "Add FAQ"}
        description="Manage public FAQ questions and answers."
        footer={
          <>
            <BaseButton
              variant="secondary"
              size="sm"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </BaseButton>
            <BaseButton
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              onClick={handleSave}
            >
              Save FAQ
            </BaseButton>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <BaseInput
            label="Question"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder="Enter question..."
          />
          <BaseTextarea
            label="Answer"
            rows={4}
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
            placeholder="Enter answer..."
          />
          <BaseSwitch
            checked={isActiveInput}
            onChange={setIsActiveInput}
            label={isActiveInput ? "Status: Published" : "Status: Draft"}
          />
        </div>
      </BaseModal>

      <BaseModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete FAQ?"
        description="This FAQ item will be removed."
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
