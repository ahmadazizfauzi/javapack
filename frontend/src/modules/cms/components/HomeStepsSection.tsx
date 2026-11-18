"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { BaseCard } from "@/components/ui/base_card";
import { BaseButton } from "@/components/ui/base_button";
import { BaseBadge } from "@/components/ui/base_badge";
import { BaseTable, BaseTableColumn } from "@/components/ui/base_table";
import { BasePagination } from "@/components/ui/base_pagination";
import { BaseModal } from "@/components/ui/base_modal";
import { BaseInput } from "@/components/ui/base_input";
import { BaseTextarea } from "@/components/ui/base_textarea";
import { BaseSwitch } from "@/components/ui/base_switch";
import { BaseSkeleton } from "@/components/ui/base_skeleton";
import { BaseToast } from "@/components/ui/base_toast";
import { getApiErrorMessage } from "@/lib/axiosInstance";
import { CmsHomeStepItem } from "@/types/cms.type";
import {
  createCmsHomeStep,
  deleteCmsHomeStep,
  fetchCmsHomeSteps,
  updateCmsHomeStep,
} from "../actions/cms.action";
import { CmsTableToolbar } from "./CmsTableToolbar";
import { CmsActionButtons } from "./CmsActionButtons";
import { baseTypography } from "@/tokens/base_typography";

const statusFilterOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Published", value: "Published" },
  { label: "Draft", value: "Draft" },
];

export function HomeStepsSection() {
  const [items, setItems] = useState<CmsHomeStepItem[]>([]);
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
  const [editingItem, setEditingItem] = useState<CmsHomeStepItem | null>(null);
  const [stepLabelInput, setStepLabelInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [sortOrderInput, setSortOrderInput] = useState("1");
  const [isActiveInput, setIsActiveInput] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<CmsHomeStepItem | null>(null);
  const [toast, setToast] = useState<{
    visible: boolean;
    variant: "success" | "error";
    title: string;
    message: string;
  }>({ visible: false, variant: "success", title: "", message: "" });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchCmsHomeSteps({
        search,
        sort_by: "sort_order",
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
        message: getApiErrorMessage(error, "Failed to load How It Works steps."),
      });
    } finally {
      setIsLoading(false);
    }
  }, [search, sortDir, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredItems = items.filter((item) => {
    if (statusFilter === "all") return true;
    return item.status === statusFilter;
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setStepLabelInput("");
    setTitleInput("");
    setDescInput("");
    setSortOrderInput(String(totalItems + 1));
    setIsActiveInput(true);
    setFormOpen(true);
  };

  const openEditModal = (item: CmsHomeStepItem) => {
    setEditingItem(item);
    setStepLabelInput(item.stepLabel);
    setTitleInput(item.title);
    setDescInput(item.description);
    setSortOrderInput(String(item.sortOrder));
    setIsActiveInput(item.isActive);
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepLabelInput.trim() || !titleInput.trim() || !descInput.trim()) {
      setToast({
        visible: true,
        variant: "error",
        title: "Validation Error",
        message: "Step label, title, and description are required.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        step_label: stepLabelInput.trim(),
        title: titleInput.trim(),
        description: descInput.trim(),
        sort_order: Number(sortOrderInput) || 1,
        is_active: isActiveInput,
      };
      if (editingItem) {
        await updateCmsHomeStep(editingItem.id, payload);
      } else {
        await createCmsHomeStep(payload);
      }
      setFormOpen(false);
      await loadData();
      setToast({
        visible: true,
        variant: "success",
        title: editingItem ? "Step Updated" : "Step Created",
        message: "How It Works step saved successfully.",
      });
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Save Failed",
        message: getApiErrorMessage(error, "Failed to save step."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (item: CmsHomeStepItem) => {
    try {
      await updateCmsHomeStep(item.id, { is_active: !item.isActive });
      await loadData();
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Update Failed",
        message: getApiErrorMessage(error, "Failed to update step status."),
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      await deleteCmsHomeStep(deleteTarget.id);
      setDeleteTarget(null);
      await loadData();
      setToast({
        visible: true,
        variant: "success",
        title: "Step Deleted",
        message: "How It Works step removed.",
      });
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Delete Failed",
        message: getApiErrorMessage(error, "Failed to delete step."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: BaseTableColumn<CmsHomeStepItem>[] = [
    {
      key: "sortOrder",
      header: "Order",
      render: (item) => (
        <span className="font-mono text-xs font-semibold text-indigo-400">
          {item.sortOrder}
        </span>
      ),
    },
    {
      key: "stepLabel",
      header: "Step Label",
      render: (item) => (
        <BaseBadge variant="info">{item.stepLabel}</BaseBadge>
      ),
    },
    {
      key: "title",
      header: "Step Title & Description",
      render: (item) => (
        <div className="max-w-md">
          <p className="font-semibold text-surface-foreground">{item.title}</p>
          <p className="mt-0.5 line-clamp-2 text-xs text-surface-muted">
            {item.description}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <button
          type="button"
          onClick={() => handleToggleStatus(item)}
          className="cursor-pointer"
        >
          <BaseBadge variant={item.isActive ? "success" : "warning"}>
            {item.status}
          </BaseBadge>
        </button>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (item) => (
        <CmsActionButtons
          onEdit={() => openEditModal(item)}
          onDelete={() => setDeleteTarget(item)}
        />
      ),
    },
  ];

  return (
    <>
      <BaseCard padding="lg" className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className={`${baseTypography.sm} font-bold text-surface-foreground`}>
              How JavaPack Works Steps
            </h2>
            <p className={`mt-0.5 ${baseTypography.xs} text-surface-muted`}>
              Manage the timeline steps displayed on the Home page.
            </p>
          </div>
          <BaseButton variant="primary" size="sm" onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            <span>Add Step</span>
          </BaseButton>
        </div>

        <CmsTableToolbar
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          searchPlaceholder="Search step label, title, or description..."
          filterOptions={statusFilterOptions}
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
          <BaseSkeleton variant="table" rows={4} />
        ) : (
          <BaseTable
            columns={columns}
            data={filteredItems}
            rowKey={(item) => item.id}
            emptyMessage="No timeline steps found."
          />
        )}

        <BasePagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={10}
          onPageChange={setPage}
        />
      </BaseCard>

      <BaseModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingItem ? "Edit Timeline Step" : "Add Timeline Step"}
        description="Configure the step badge, heading, description, and display order."
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <BaseInput
                label="Step Label"
                value={stepLabelInput}
                onChange={(e) => setStepLabelInput(e.target.value)}
                placeholder="Step 01 - Book Online"
                required
              />
            </div>
            <BaseInput
              label="Sort Order"
              type="number"
              min={1}
              value={sortOrderInput}
              onChange={(e) => setSortOrderInput(e.target.value)}
              required
            />
          </div>

          <BaseInput
            label="Step Title"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="Choose Your Gear"
            required
          />

          <BaseTextarea
            label="Step Description"
            rows={3}
            value={descInput}
            onChange={(e) => setDescInput(e.target.value)}
            placeholder="Select winter jackets, Pocket WiFi modems, or cabin luggage..."
            required
          />

          <BaseSwitch
            checked={isActiveInput}
            onChange={setIsActiveInput}
            label="Publish step on Home page"
          />

          <div className="flex justify-end gap-2 pt-2">
            <BaseButton
              type="button"
              variant="secondary"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </BaseButton>
            <BaseButton type="submit" variant="primary" isLoading={isSubmitting}>
              {editingItem ? "Update Step" : "Create Step"}
            </BaseButton>
          </div>
        </form>
      </BaseModal>

      <BaseModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Timeline Step?"
        description={`Are you sure you want to remove "${deleteTarget?.title || ""}"?`}
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
              onClick={handleConfirmDelete}
            >
              Delete
            </BaseButton>
          </>
        }
      />

      <BaseToast
        isVisible={toast.visible}
        variant={toast.variant}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </>
  );
}
