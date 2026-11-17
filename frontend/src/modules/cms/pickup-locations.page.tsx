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
import { BaseTextarea } from "@/components/ui/base_textarea";
import { BaseSkeleton } from "@/components/ui/base_skeleton";
import { BaseToast } from "@/components/ui/base_toast";
import { getApiErrorMessage } from "@/lib/axiosInstance";
import { CmsPickupLocationItem } from "@/types/cms.type";
import {
  createCmsPickupLocation,
  deleteCmsPickupLocation,
  fetchCmsPickupLocations,
  updateCmsPickupLocation,
} from "./actions/cms.action";
import { CmsTableToolbar } from "./components/CmsTableToolbar";
import { CmsActionButtons } from "./components/CmsActionButtons";
import { baseTypography } from "@/tokens/base_typography";

const statusFilterOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

export function CmsPickupLocationsPage() {
  const [items, setItems] = useState<CmsPickupLocationItem[]>([]);
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
  const [editingItem, setEditingItem] =
    useState<CmsPickupLocationItem | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] =
    useState<CmsPickupLocationItem | null>(null);
  const [toast, setToast] = useState<{
    visible: boolean;
    variant: "success" | "error";
    title: string;
    message: string;
  }>({ visible: false, variant: "success", title: "", message: "" });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchCmsPickupLocations({ search, page, limit: 10 });
      setItems(res.items);
      setTotalItems(res.pagination.total);
      setTotalPages(Math.max(1, res.pagination.totalPages));
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Load Failed",
        message: getApiErrorMessage(error, "Failed to load pickup locations."),
      });
    } finally {
      setIsLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return items;
    return items.filter((item) => item.status === statusFilter);
  }, [items, statusFilter]);

  const handleSave = async () => {
    if (!nameInput.trim() || !cityInput.trim() || !addressInput.trim()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        name: nameInput.trim(),
        city: cityInput.trim(),
        address: addressInput.trim(),
        is_active: true,
      };
      if (editingItem) {
        await updateCmsPickupLocation(editingItem.id, payload);
        setToast({
          visible: true,
          variant: "success",
          title: "Location Updated",
          message: "Pickup location updated.",
        });
      } else {
        await createCmsPickupLocation(payload);
        setToast({
          visible: true,
          variant: "success",
          title: "Location Created",
          message: "New pickup location added.",
        });
      }
      setFormOpen(false);
      await loadData();
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Save Failed",
        message: getApiErrorMessage(error, "Failed to save location."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      await deleteCmsPickupLocation(deleteTarget.id);
      setDeleteTarget(null);
      setToast({
        visible: true,
        variant: "success",
        title: "Location Deleted",
        message: "Pickup location removed.",
      });
      await loadData();
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Delete Failed",
        message: getApiErrorMessage(error, "Failed to delete location."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: BaseTableColumn<CmsPickupLocationItem>[] = [
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
      header: "LOCATION NAME",
      render: (row) => (
        <span className="font-semibold text-surface-foreground">
          {row.name}
        </span>
      ),
    },
    {
      key: "city",
      header: "CITY",
      render: (row) => (
        <span className={`${baseTypography.xs} text-surface-subtle`}>{row.city}</span>
      ),
    },
    {
      key: "address",
      header: "ADDRESS",
      render: (row) => (
        <span className={`block max-w-xs truncate ${baseTypography.xs} text-surface-subtle`}>
          {row.address}
        </span>
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
            setNameInput(row.name);
            setCityInput(row.city);
            setAddressInput(row.address);
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
        breadcrumb="JAVAPACK CMS  /  PICKUP LOCATIONS"
        title="Pickup Locations"
        action={
          <BaseButton
            variant="primary"
            size="md"
            onClick={() => {
              setEditingItem(null);
              setNameInput("");
              setCityInput("");
              setAddressInput("");
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            <span>Add Location</span>
          </BaseButton>
        }
      />

      <BaseCard padding="lg" className="flex flex-col gap-5">
        <h2 className={`${baseTypography.sm} font-bold text-surface-foreground`}>
          Pickup Counters List
        </h2>

        <CmsTableToolbar
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          searchPlaceholder="Search location or city..."
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
            emptyMessage="No pickup locations found."
          />
        )}

        <BasePagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={10}
          itemLabel="locations"
          onPageChange={setPage}
        />
      </BaseCard>

      <BaseModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingItem ? "Edit Pickup Location" : "Add Pickup Location"}
        description="Manage counter pickup & return points."
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
              Save Location
            </BaseButton>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <BaseInput
            label="Location Name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="e.g. Malang Main Counter"
          />
          <BaseInput
            label="City"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="e.g. Malang"
          />
          <BaseTextarea
            label="Address"
            rows={3}
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder="Full address..."
          />
        </div>
      </BaseModal>

      <BaseModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Pickup Location?"
        description={`Location "${deleteTarget?.name ?? ""}" will be removed.`}
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
