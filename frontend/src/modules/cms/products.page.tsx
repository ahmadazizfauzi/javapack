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
import { BaseDropdown } from "@/components/ui/base_dropdown";
import { BaseImageUpload } from "@/components/ui/base_image_upload";
import { BaseSwitch } from "@/components/ui/base_switch";
import { BaseSkeleton } from "@/components/ui/base_skeleton";
import { BaseToast } from "@/components/ui/base_toast";
import { getApiErrorMessage } from "@/lib/axiosInstance";
import {
  CmsCategoryItem,
  CmsPickupLocationItem,
  CmsProductItem,
} from "@/types/cms.type";
import {
  createCmsProduct,
  deleteCmsProduct,
  fetchCmsCategories,
  fetchCmsPickupLocations,
  fetchCmsProducts,
  updateCmsProduct,
  uploadCmsImage,
} from "./actions/cms.action";
import { CmsTableToolbar } from "./components/CmsTableToolbar";
import { CmsActionButtons } from "./components/CmsActionButtons";
import { baseTypography } from "@/tokens/base_typography";

function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function CmsProductsPage() {
  const [items, setItems] = useState<CmsProductItem[]>([]);
  const [categories, setCategories] = useState<CmsCategoryItem[]>([]);
  const [locations, setLocations] = useState<CmsPickupLocationItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date>(
    () => new Date(2026, 10, 17)
  );
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CmsProductItem | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [catIdInput, setCatIdInput] = useState("");
  const [locIdInput, setLocIdInput] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [stockInput, setStockInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isActiveInput, setIsActiveInput] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<CmsProductItem | null>(null);
  const [toast, setToast] = useState<{
    visible: boolean;
    variant: "success" | "error";
    title: string;
    message: string;
  }>({ visible: false, variant: "success", title: "", message: "" });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes, locRes] = await Promise.all([
        fetchCmsProducts({
          search,
          category_id: categoryFilter !== "all" ? categoryFilter : undefined,
          page,
          limit: 10,
        }),
        fetchCmsCategories({ limit: 50 }),
        fetchCmsPickupLocations({ limit: 50 }),
      ]);
      setItems(prodRes.items);
      setTotalItems(prodRes.pagination.total);
      setTotalPages(Math.max(1, prodRes.pagination.totalPages));
      setCategories(catRes.items);
      setLocations(locRes.items);
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Load Failed",
        message: getApiErrorMessage(error, "Failed to load products."),
      });
    } finally {
      setIsLoading(false);
    }
  }, [search, categoryFilter, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const categoryFilterOptions = useMemo(() => {
    return [
      { label: "All Categories", value: "all" },
      ...categories.map((c) => ({ label: c.name, value: c.id })),
    ];
  }, [categories]);

  const categorySelectOptions = useMemo(
    () => categories.map((c) => ({ label: c.name, value: c.id })),
    [categories]
  );

  const locationSelectOptions = useMemo(
    () => locations.map((l) => ({ label: `${l.name} (${l.city})`, value: l.id })),
    [locations]
  );

  const filtered = useMemo(() => {
    if (categoryFilter === "all") return items;
    return items.filter((item) => item.categoryId === categoryFilter);
  }, [items, categoryFilter]);

  const openCreateModal = () => {
    setEditingItem(null);
    setNameInput("");
    setCatIdInput(categories[0]?.id ?? "1");
    setLocIdInput(locations[0]?.id ?? "1");
    setPriceInput("");
    setStockInput("");
    setImageUrlInput("");
    setIsActiveInput(true);
    setFormOpen(true);
  };

  const handleProductImagePick = async (file: File | undefined) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadCmsImage(file);
      setImageUrlInput(url);
      setToast({
        visible: true,
        variant: "success",
        title: "Image Uploaded",
        message: "Product image uploaded from gallery.",
      });
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Upload Failed",
        message: getApiErrorMessage(error, "Failed to upload product image."),
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const openEditModal = (row: CmsProductItem) => {
    setEditingItem(row);
    setNameInput(row.name);
    setCatIdInput(row.categoryId);
    setLocIdInput(row.pickupLocationId);
    setPriceInput(String(row.pricePerDay));
    setStockInput(String(row.stock));
    setImageUrlInput(row.imageUrl);
    setIsActiveInput(row.isActive);
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!nameInput.trim()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        name: nameInput.trim(),
        category_id: Number(catIdInput || categories[0]?.id || 1),
        pickup_location_id: Number(locIdInput || locations[0]?.id || 1),
        price_per_day: Number(priceInput.replace(/\D/g, "")) || 0,
        stock: Number(stockInput) || 0,
        image_url: imageUrlInput.trim() || "/images/travel-luggage.jpg",
        is_active: isActiveInput,
      };
      if (editingItem) {
        await updateCmsProduct(editingItem.id, payload);
        setToast({
          visible: true,
          variant: "success",
          title: "Product Updated",
          message: "Product has been updated.",
        });
      } else {
        await createCmsProduct(payload);
        setToast({
          visible: true,
          variant: "success",
          title: "Product Created",
          message: "New product has been added.",
        });
      }
      setFormOpen(false);
      await loadData();
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Save Failed",
        message: getApiErrorMessage(error, "Failed to save product."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      await deleteCmsProduct(deleteTarget.id);
      setDeleteTarget(null);
      setToast({
        visible: true,
        variant: "success",
        title: "Product Deleted",
        message: "Product has been removed.",
      });
      await loadData();
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Delete Failed",
        message: getApiErrorMessage(error, "Failed to delete product."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: BaseTableColumn<CmsProductItem>[] = [
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
      key: "name",
      header: "PRODUCT NAME",
      render: (row) => (
        <span className="font-semibold text-surface-foreground">{row.name}</span>
      ),
    },
    {
      key: "category",
      header: "CATEGORY",
      render: (row) => (
        <span className={`${baseTypography.xs} text-surface-subtle`}>{row.category}</span>
      ),
    },
    {
      key: "pickupLocation",
      header: "PICKUP LOCATION",
      render: (row) => (
        <span className={`${baseTypography.xs} text-surface-subtle`}>{row.pickupLocation}</span>
      ),
    },
    {
      key: "pricePerDay",
      header: "PRICE",
      render: (row) => (
        <span className="font-semibold text-surface-foreground">
          {formatRupiah(row.pricePerDay)}
        </span>
      ),
    },
    {
      key: "durationLabel",
      header: "DURATION",
      render: (row) => (
        <span className={`${baseTypography.xs} text-surface-subtle`}>{row.durationLabel}</span>
      ),
    },
    {
      key: "stock",
      header: "STOCK",
      render: (row) => (
        <span
          className={`font-semibold ${
            row.stock <= 3 ? "text-amber-400" : "text-cyan-400"
          }`}
        >
          {row.stock}
        </span>
      ),
    },
    {
      key: "status",
      header: "STATUS",
      render: (row) => (
        <BaseBadge variant={row.isActive ? "success" : "neutral"}>
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
          onEdit={() => openEditModal(row)}
          onDelete={() => setDeleteTarget(row)}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <BaseHeader
        breadcrumb="JAVAPACK CMS  /  TRAVEL GEAR PRODUCTS"
        title="Travel Gear Products"
        action={
          <BaseButton variant="primary" size="md" onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </BaseButton>
        }
      />

      <BaseCard padding="lg" className="flex flex-col gap-5">
        <h2 className={`${baseTypography.sm} font-bold text-surface-foreground`}>
          Travel Gear Products List
        </h2>

        <CmsTableToolbar
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          searchPlaceholder="Search product name..."
          filterOptions={categoryFilterOptions}
          filterValue={categoryFilter}
          onFilterChange={(val) => {
            setCategoryFilter(val);
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
            emptyMessage="No products found."
          />
        )}

        <BasePagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={10}
          itemLabel="products"
          onPageChange={setPage}
        />
      </BaseCard>

      <BaseModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingItem ? "Edit Product" : "Add Product"}
        description="Manage rental travel gear item details."
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
              Save Product
            </BaseButton>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <BaseInput
            label="Product Name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="e.g. Thermal Parka Jacket -20°C"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <BaseDropdown
              label="Category"
              options={categorySelectOptions}
              value={catIdInput}
              onChange={setCatIdInput}
            />
            <BaseDropdown
              label="Pickup Location"
              options={locationSelectOptions}
              value={locIdInput}
              onChange={setLocIdInput}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <BaseInput
              label="Price / Day (IDR)"
              isCurrency
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              placeholder="e.g. 75.000"
            />
            <BaseInput
              label="Stock"
              type="number"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              placeholder="e.g. 10"
            />
          </div>
          <BaseImageUpload
            label="Product Image"
            value={imageUrlInput}
            isUploading={uploadingImage}
            onFileSelect={handleProductImagePick}
            changeText="Change Product Image"
          />
          <BaseSwitch
            checked={isActiveInput}
            onChange={setIsActiveInput}
            label={isActiveInput ? "Status: Active" : "Status: Inactive"}
          />
        </div>
      </BaseModal>

      <BaseModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product?"
        description={`Product "${deleteTarget?.name ?? ""}" will be removed.`}
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
