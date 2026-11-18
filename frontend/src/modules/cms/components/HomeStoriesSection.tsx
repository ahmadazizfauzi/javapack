"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { BaseCard } from "@/components/ui/base_card";
import { BaseButton } from "@/components/ui/base_button";
import { BaseBadge } from "@/components/ui/base_badge";
import { BaseTable, BaseTableColumn } from "@/components/ui/base_table";
import { BasePagination } from "@/components/ui/base_pagination";
import { BaseModal } from "@/components/ui/base_modal";
import { BaseInput } from "@/components/ui/base_input";
import { BaseTextarea } from "@/components/ui/base_textarea";
import { BaseDropdown } from "@/components/ui/base_dropdown";
import { BaseImageUpload } from "@/components/ui/base_image_upload";
import { BaseSwitch } from "@/components/ui/base_switch";
import { BaseSkeleton } from "@/components/ui/base_skeleton";
import { BaseToast } from "@/components/ui/base_toast";
import { getApiErrorMessage } from "@/lib/axiosInstance";
import { CmsHomeStoryItem, CmsProductItem } from "@/types/cms.type";
import {
  createCmsHomeStory,
  deleteCmsHomeStory,
  fetchCmsHomeStories,
  fetchCmsProducts,
  updateCmsHomeStory,
  uploadCmsImage,
} from "../actions/cms.action";
import { CmsTableToolbar } from "./CmsTableToolbar";
import { CmsActionButtons } from "./CmsActionButtons";
import { baseTypography } from "@/tokens/base_typography";

const statusFilterOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Published", value: "Published" },
  { label: "Draft", value: "Draft" },
];

export function HomeStoriesSection() {
  const [items, setItems] = useState<CmsHomeStoryItem[]>([]);
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
  const [editingItem, setEditingItem] = useState<CmsHomeStoryItem | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [gearTagInput, setGearTagInput] = useState("");
  const [testimonialInput, setTestimonialInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isActiveInput, setIsActiveInput] = useState(true);
  const [products, setProducts] = useState<CmsProductItem[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<CmsHomeStoryItem | null>(null);
  const [toast, setToast] = useState<{
    visible: boolean;
    variant: "success" | "error";
    title: string;
    message: string;
  }>({ visible: false, variant: "success", title: "", message: "" });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchCmsHomeStories({
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
        message: getApiErrorMessage(error, "Failed to load Traveler Stories."),
      });
    } finally {
      setIsLoading(false);
    }
  }, [search, sortDir, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    fetchCmsProducts({ limit: 50 })
      .then((res) => setProducts(res.items))
      .catch(() => {});
  }, []);

  const productOptions = useMemo(() => {
    return products.map((p) => ({
      label: p.name,
      value: p.name,
    }));
  }, [products]);

  const filteredItems = items.filter((item) => {
    if (statusFilter === "all") return true;
    return item.status === statusFilter;
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setNameInput("");
    setGearTagInput(products[0]?.name || "");
    setTestimonialInput("");
    setImageUrlInput("");
    setIsActiveInput(true);
    setFormOpen(true);
  };

  const openEditModal = (item: CmsHomeStoryItem) => {
    setEditingItem(item);
    setNameInput(item.customerName);
    setGearTagInput(item.gearTag);
    setTestimonialInput(item.testimonial);
    setImageUrlInput(item.imageUrl);
    setIsActiveInput(item.isActive);
    setFormOpen(true);
  };

  const handleImagePick = async (file: File | undefined) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadCmsImage(file);
      setImageUrlInput(url);
      setToast({
        visible: true,
        variant: "success",
        title: "Uploaded",
        message: "Story image uploaded.",
      });
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Upload Failed",
        message: getApiErrorMessage(error, "Failed to upload story image."),
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !nameInput.trim() ||
      !gearTagInput.trim() ||
      !testimonialInput.trim() ||
      !imageUrlInput.trim()
    ) {
      setToast({
        visible: true,
        variant: "error",
        title: "Validation Error",
        message: "Name, gear tag, testimonial, and image are required.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customer_name: nameInput.trim(),
        gear_tag: gearTagInput.trim(),
        testimonial: testimonialInput.trim(),
        image_url: imageUrlInput.trim(),
        is_active: isActiveInput,
      };
      if (editingItem) {
        await updateCmsHomeStory(editingItem.id, payload);
      } else {
        await createCmsHomeStory(payload);
      }
      setFormOpen(false);
      await loadData();
      setToast({
        visible: true,
        variant: "success",
        title: editingItem ? "Story Updated" : "Story Created",
        message: "Traveler story saved successfully.",
      });
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Save Failed",
        message: getApiErrorMessage(error, "Failed to save story."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (item: CmsHomeStoryItem) => {
    try {
      await updateCmsHomeStory(item.id, { is_active: !item.isActive });
      await loadData();
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Update Failed",
        message: getApiErrorMessage(error, "Failed to update story status."),
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      await deleteCmsHomeStory(deleteTarget.id);
      setDeleteTarget(null);
      await loadData();
      setToast({
        visible: true,
        variant: "success",
        title: "Story Deleted",
        message: "Traveler story removed.",
      });
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Delete Failed",
        message: getApiErrorMessage(error, "Failed to delete story."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: BaseTableColumn<CmsHomeStoryItem>[] = [
    {
      key: "imageUrl",
      header: "Photo",
      render: (item) => (
        <div className="relative h-12 w-10 overflow-hidden rounded-lg border border-surface-elevated bg-surface-card">
          <Image
            src={item.imageUrl}
            alt={item.customerName}
            fill
            className="object-cover"
          />
        </div>
      ),
    },
    {
      key: "customerName",
      header: "Traveler & Gear",
      render: (item) => (
        <div>
          <p className="font-semibold text-surface-foreground">
            {item.customerName}
          </p>
          <div className="mt-1">
            <BaseBadge variant="info">{item.gearTag}</BaseBadge>
          </div>
        </div>
      ),
    },
    {
      key: "testimonial",
      header: "Testimonial",
      render: (item) => (
        <p className="line-clamp-2 max-w-md text-xs text-surface-muted">
          {item.testimonial}
        </p>
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
              Traveler Stories Gallery
            </h2>
            <p className={`mt-0.5 ${baseTypography.xs} text-surface-muted`}>
              Manage traveler story cards and testimonials displayed on the Home page.
            </p>
          </div>
          <BaseButton variant="primary" size="sm" onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            <span>Add Story</span>
          </BaseButton>
        </div>

        <CmsTableToolbar
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          searchPlaceholder="Search traveler name, gear tag, or testimonial..."
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
          <BaseSkeleton variant="table" rows={3} />
        ) : (
          <BaseTable
            columns={columns}
            data={filteredItems}
            rowKey={(item) => item.id}
            emptyMessage="No traveler stories found."
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
        title={editingItem ? "Edit Traveler Story" : "Add Traveler Story"}
        description="Configure the photo, traveler name, gear tag, and testimonial."
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <BaseImageUpload
            label="Story Photo"
            value={imageUrlInput}
            isUploading={uploadingImage}
            onFileSelect={handleImagePick}
          />

          <BaseInput
            label="Traveler Name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Raka Pratama"
            required
          />

          <BaseDropdown
            label="Product (Gear Tag)"
            options={productOptions}
            value={gearTagInput}
            onChange={setGearTagInput}
            placeholder="Select a product..."
            searchable
          />

          <BaseTextarea
            label="Testimonial"
            rows={3}
            value={testimonialInput}
            onChange={(e) => setTestimonialInput(e.target.value)}
            placeholder="Traveling abroad with my family was effortless..."
            required
          />

          <BaseSwitch
            checked={isActiveInput}
            onChange={setIsActiveInput}
            label="Publish story on Home page"
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
              {editingItem ? "Update Story" : "Create Story"}
            </BaseButton>
          </div>
        </form>
      </BaseModal>

      <BaseModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Traveler Story?"
        description={`Are you sure you want to remove "${deleteTarget?.customerName || ""}"?`}
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
