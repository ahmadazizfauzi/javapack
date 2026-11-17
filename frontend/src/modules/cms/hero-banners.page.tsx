"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { BaseHeader } from "@/components/navigation/base_header";
import { BaseCard } from "@/components/ui/base_card";
import { BaseButton } from "@/components/ui/base_button";
import { BaseBadge } from "@/components/ui/base_badge";
import { BaseTable, BaseTableColumn } from "@/components/ui/base_table";
import { BasePagination } from "@/components/ui/base_pagination";
import { BaseModal } from "@/components/ui/base_modal";
import { BaseInput } from "@/components/ui/base_input";
import { BaseDropdown } from "@/components/ui/base_dropdown";
import { BaseImageUpload } from "@/components/ui/base_image_upload";
import { BaseSwitch } from "@/components/ui/base_switch";
import { BaseTextarea } from "@/components/ui/base_textarea";
import { BaseSkeleton } from "@/components/ui/base_skeleton";
import { BaseToast } from "@/components/ui/base_toast";
import { getApiErrorMessage } from "@/lib/axiosInstance";
import {
  CmsHeroBannerItem,
  CmsProductItem,
} from "@/types/cms.type";
import {
  createCmsHeroBanner,
  deleteCmsHeroBanner,
  fetchCmsHeroBanners,
  fetchCmsHomeContent,
  fetchCmsProducts,
  updateCmsHeroBanner,
  updateCmsHomeContent,
  uploadCmsImage,
} from "./actions/cms.action";
import { CmsTableToolbar } from "./components/CmsTableToolbar";
import { CmsActionButtons } from "./components/CmsActionButtons";
import { baseTypography } from "@/tokens/base_typography";

const statusFilterOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Published", value: "Published" },
  { label: "Draft", value: "Draft" },
];

export function CmsHeroBannersPage() {
  const [items, setItems] = useState<CmsHeroBannerItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date>(
    () => new Date(2026, 10, 17)
  );
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CmsHeroBannerItem | null>(
    null
  );
  const [titleInput, setTitleInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [ctaLinkInput, setCtaLinkInput] = useState("/products");
  const [isActiveInput, setIsActiveInput] = useState(true);
  const [products, setProducts] = useState<CmsProductItem[]>([]);
  const [uploadingSlideImage, setUploadingSlideImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [badgeText, setBadgeText] = useState("International Travel Gear Rental");
  const [headline, setHeadline] = useState(
    "Travel Lighter, Your Gear Ready at the Airport"
  );
  const [subheadline, setSubheadline] = useState(
    "Rent winter jackets, hardcase luggage, action cams & WiFi adapters without buying expensive gear — easy pickup at Terminal 3."
  );
  const [isSavingHome, setIsSavingHome] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<CmsHeroBannerItem | null>(
    null
  );
  const [toast, setToast] = useState<{
    visible: boolean;
    variant: "success" | "error";
    title: string;
    message: string;
  }>({ visible: false, variant: "success", title: "", message: "" });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchCmsHeroBanners({ search, page, limit: 10 });
      setItems(res.items);
      setTotalItems(res.pagination.total);
      setTotalPages(Math.max(1, res.pagination.totalPages));
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Load Failed",
        message: getApiErrorMessage(error, "Failed to load hero banners."),
      });
    } finally {
      setIsLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    fetchCmsHomeContent()
      .then((home) => {
        setBadgeText(home.badgeText);
        setHeadline(home.headline);
        setSubheadline(home.subheadline);
      })
      .catch(() => {
        // Keep defaults if initial fetch fails
      });

    fetchCmsProducts({ limit: 50 })
      .then((prodRes) => {
        setProducts(prodRes.items);
      })
      .catch(() => {
        // Non-blocking target dropdown options
      });
  }, []);

  const ctaLinkOptions = useMemo(() => {
    return [
      { label: "All Products (/products)", value: "/products" },
      ...products.map((p) => ({
        label: `Product: ${p.name}`,
        value: `/products?search=${encodeURIComponent(p.name)}`,
      })),
    ];
  }, [products]);

  const handleSaveHomeText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeText.trim() || !headline.trim() || !subheadline.trim()) {
      setToast({
        visible: true,
        variant: "error",
        title: "Validation Error",
        message: "Badge text, Headline, and Subheadline are required.",
      });
      return;
    }

    setIsSavingHome(true);
    try {
      const updated = await updateCmsHomeContent({
        badge_text: badgeText.trim(),
        headline: headline.trim(),
        subheadline: subheadline.trim(),
      });
      setBadgeText(updated.badgeText);
      setHeadline(updated.headline);
      setSubheadline(updated.subheadline);
      setToast({
        visible: true,
        variant: "success",
        title: "Saved",
        message: "Home header texts updated successfully.",
      });
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Save Failed",
        message: getApiErrorMessage(error, "Failed to update Home texts."),
      });
    } finally {
      setIsSavingHome(false);
    }
  };

  const handleSlideImagePick = async (file: File | undefined) => {
    if (!file) return;
    setUploadingSlideImage(true);
    try {
      const url = await uploadCmsImage(file);
      setImageUrlInput(url);
      setToast({
        visible: true,
        variant: "success",
        title: "Image Uploaded",
        message: "Slide image uploaded from gallery.",
      });
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Upload Failed",
        message: getApiErrorMessage(error, "Failed to upload slide image."),
      });
    } finally {
      setUploadingSlideImage(false);
    }
  };

  const filtered = useMemo(() => {
    if (statusFilter === "all") return items;
    return items.filter((item) => item.status === statusFilter);
  }, [items, statusFilter]);

  const handleSave = async () => {
    if (!titleInput.trim() || !imageUrlInput.trim()) {
      setToast({
        visible: true,
        variant: "error",
        title: "Validation Error",
        message: "Slide title and image are required.",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        title: titleInput.trim(),
        subtitle: descInput.trim(),
        image_url: imageUrlInput.trim(),
        cta_link: ctaLinkInput || "/products",
        is_active: isActiveInput,
      };
      if (editingItem) {
        await updateCmsHeroBanner(editingItem.id, payload);
        setToast({
          visible: true,
          variant: "success",
          title: "Slide Updated",
          message: "Hero banner slide updated.",
        });
      } else {
        await createCmsHeroBanner(payload);
        setToast({
          visible: true,
          variant: "success",
          title: "Slide Created",
          message: "New hero banner slide added.",
        });
      }
      setFormOpen(false);
      await loadData();
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Save Failed",
        message: getApiErrorMessage(error, "Failed to save hero slide."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      await deleteCmsHeroBanner(deleteTarget.id);
      setDeleteTarget(null);
      setToast({
        visible: true,
        variant: "success",
        title: "Slide Deleted",
        message: "Hero banner slide removed.",
      });
      await loadData();
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Delete Failed",
        message: getApiErrorMessage(error, "Failed to delete hero slide."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: BaseTableColumn<CmsHeroBannerItem>[] = [
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
      key: "imageUrl",
      header: "IMAGE",
      render: (row) => (
        <div className="relative h-10 w-16 overflow-hidden rounded-md border border-surface-elevated">
          <Image
            src={row.imageUrl}
            alt={row.title}
            fill
            className="object-cover"
          />
        </div>
      ),
    },
    {
      key: "title",
      header: "TITLE",
      render: (row) => (
        <span className="font-semibold text-surface-foreground">
          {row.title}
        </span>
      ),
    },
    {
      key: "shortDescription",
      header: "SHORT DESCRIPTION",
      render: (row) => (
        <span className={`block max-w-xs truncate ${baseTypography.xs} text-surface-subtle`}>
          {row.shortDescription}
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
            setTitleInput(row.title);
            setDescInput(row.shortDescription);
            setImageUrlInput(row.imageUrl);
            setCtaLinkInput(row.ctaLink || "/products");
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
        breadcrumb="JAVAPACK CMS  /  WEBSITE CONTENT  /  HOME"
        title="Home"
        action={
          <BaseButton
            variant="primary"
            size="md"
            onClick={() => {
              setEditingItem(null);
              setTitleInput("");
              setDescInput("");
              setImageUrlInput("");
              setCtaLinkInput("/products");
              setIsActiveInput(true);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            <span>Add Slide</span>
          </BaseButton>
        }
      />

      <BaseCard padding="lg">
        <form onSubmit={handleSaveHomeText} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 border-b border-surface-elevated pb-3">
            <h2 className={`${baseTypography.sm} font-bold text-surface-foreground`}>
              Home Header Texts
            </h2>
            <p className={`${baseTypography.xs} text-surface-muted`}>
              Edit the badge, main headline, and description displayed above the hero slider on the Home page.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <BaseInput
              label="Badge Text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="International Travel Gear Rental"
              required
            />
            <BaseInput
              label="Main Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Travel Lighter, Your Gear Ready at the Airport"
              required
            />
          </div>
          <BaseTextarea
            label="Subheadline Description"
            rows={3}
            value={subheadline}
            onChange={(e) => setSubheadline(e.target.value)}
            placeholder="Rent winter jackets, hardcase luggage, action cams & WiFi adapters..."
            required
          />
          <div className="flex justify-end">
            <BaseButton type="submit" variant="primary" isLoading={isSavingHome}>
              Save Changes
            </BaseButton>
          </div>
        </form>
      </BaseCard>

      <BaseCard padding="lg" className="flex flex-col gap-5">
        <h2 className={`${baseTypography.sm} font-bold text-surface-foreground`}>
          Hero Banner Slides List
        </h2>

        <CmsTableToolbar
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          searchPlaceholder="Search title / short description..."
          filterOptions={statusFilterOptions}
          filterValue={statusFilter}
          onFilterChange={setStatusFilter}
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
            emptyMessage="No hero banner slides found."
          />
        )}

        <BasePagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={10}
          itemLabel="banner slides"
          onPageChange={setPage}
        />
      </BaseCard>

      <BaseModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingItem ? "Edit Hero Slide" : "Add Hero Slide"}
        description="Manage public landing page hero slider banners."
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
              Save Slide
            </BaseButton>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <BaseInput
            label="Slide Title"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="e.g. International Travel Gear Rental"
          />
          <BaseTextarea
            label="Short Description"
            rows={3}
            value={descInput}
            onChange={(e) => setDescInput(e.target.value)}
            placeholder="Short banner summary..."
          />
          <BaseDropdown
            label="Target Destination"
            options={ctaLinkOptions}
            value={ctaLinkInput}
            onChange={setCtaLinkInput}
          />
          <BaseImageUpload
            label="Slide Image"
            value={imageUrlInput}
            isUploading={uploadingSlideImage}
            onFileSelect={handleSlideImagePick}
            changeText="Change Slide Image"
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
        title="Delete Hero Slide?"
        description={`Slide "${deleteTarget?.title ?? ""}" will be removed.`}
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
