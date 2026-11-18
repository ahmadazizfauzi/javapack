"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { BaseModal } from "@/components/ui/base_modal";
import { BaseCard } from "@/components/ui/base_card";
import { BaseDatePicker } from "@/components/ui/base_date_picker";
import { BaseInput } from "@/components/ui/base_input";
import { BaseDropdown } from "@/components/ui/base_dropdown";
import { BaseButton } from "@/components/ui/base_button";
import { BaseToast } from "@/components/ui/base_toast";
import { getApiErrorMessage } from "@/lib/axiosInstance";
import { createOrderCheckout } from "@/modules/public/actions/public.action";
import { PublicPickupLocation, PublicProduct } from "@/types/public.type";
import { baseTypography } from "@/tokens/base_typography";

export interface OrderModalProps {
  product: PublicProduct | null;
  pickupLocations: PublicPickupLocation[];
  onClose: () => void;
  onCheckoutSuccess: (orderCode: string) => void;
}

function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function formatApiDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function OrderModal({
  product,
  pickupLocations,
  onClose,
  onCheckoutSuccess,
}: OrderModalProps) {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [quantityInput, setQuantityInput] = useState("");
  const [pickupLocationId, setPickupLocationId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setStartDate(null);
      setEndDate(null);
      setQuantityInput("");
      setPickupLocationId("");
      setErrorMsg(null);
    }
  }, [product]);

  const pickupOptions = useMemo(() => {
    if (pickupLocations.length === 0) {
      return [{ label: "Malang Airport (Malang)", value: "1" }];
    }
    return pickupLocations.map((loc) => ({
      label: `${loc.name} (${loc.city})`,
      value: loc.id,
    }));
  }, [pickupLocations]);

  const durationDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const diffMs = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  }, [startDate, endDate]);

  if (!product) return null;

  const parsedQuantity = Number.parseInt(quantityInput, 10);
  const validQuantity =
    !Number.isNaN(parsedQuantity) && parsedQuantity >= 1 ? parsedQuantity : 0;
  const totalAmount = product.pricePerDay * durationDays * validQuantity;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      setQuantityInput("");
      return;
    }
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.max(1, Math.min(product.stock, parsed));
    setQuantityInput(String(clamped));
  };

  const handleCheckout = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setErrorMsg("Please sign in first to complete your rental order.");
      setTimeout(() => {
        router.push("/login");
      }, 1200);
      return;
    }

    if (!startDate || !endDate) {
      setErrorMsg("Please select both rental start date and return date.");
      return;
    }
    if (durationDays <= 0) {
      setErrorMsg("Return date must be after rental start date.");
      return;
    }
    if (validQuantity < 1) {
      setErrorMsg("Please enter a valid rental quantity.");
      return;
    }
    if (!pickupLocationId) {
      setErrorMsg("Please select a pickup location.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const result = await createOrderCheckout({
        product_id: Number(product.id),
        pickup_location_id: Number(pickupLocationId),
        quantity: validQuantity,
        start_date: formatApiDate(startDate),
        end_date: formatApiDate(endDate),
      });

      if (result.payment?.payment_url) {
        window.open(result.payment.payment_url, "_blank", "noopener,noreferrer");
      }

      onCheckoutSuccess(result.order.order_code);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, "Failed to create rental order."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <BaseModal
        isOpen={Boolean(product)}
        onClose={onClose}
        title="Gear Rental Form"
      >
        <div className="flex flex-col gap-4">
          <BaseCard
            padding="sm"
            className="flex items-center gap-3.5 bg-surface-sidebar"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-surface-elevated">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className={`truncate ${baseTypography.sm} font-bold text-surface-foreground`}>
                {product.name}
              </p>
              <div className={`mt-1 flex items-center justify-between gap-2 ${baseTypography.xs} font-medium`}>
                <span className="text-cyan-400">
                  {formatRupiah(product.pricePerDay)} / day
                </span>
                <span className="shrink-0 text-surface-subtle">
                  Stock: {product.stock}
                </span>
              </div>
            </div>
          </BaseCard>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <span className={`${baseTypography.xs} font-medium text-surface-subtle`}>
                Rental Start Date
              </span>
              <BaseDatePicker
                value={startDate}
                onChange={setStartDate}
                displayMode="full-date"
                placeholder="Select start date"
                className="w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className={`${baseTypography.xs} font-medium text-surface-subtle`}>
                Return Date
              </span>
              <BaseDatePicker
                value={endDate}
                onChange={setEndDate}
                displayMode="full-date"
                placeholder="Select return date"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <BaseInput
              label="Quantity"
              type="number"
              min={1}
              max={product.stock}
              placeholder="Enter quantity"
              value={quantityInput}
              onChange={handleQuantityChange}
            />
            <BaseDropdown
              label="Pickup Location"
              options={pickupOptions}
              value={pickupLocationId}
              placeholder="Select pickup location"
              onChange={setPickupLocationId}
            />
          </div>

          <BaseCard
            padding="sm"
            className="flex flex-col gap-2 bg-surface-sidebar"
          >
            <p className={`${baseTypography.xs} font-bold text-surface-foreground`}>
              Billing Summary
            </p>
            <div className={`flex items-center justify-between ${baseTypography.xs} text-surface-subtle`}>
              <span>Daily Rate</span>
              <span>{formatRupiah(product.pricePerDay)}</span>
            </div>
            <div className={`flex items-center justify-between ${baseTypography.xs} text-surface-subtle`}>
              <span>Duration</span>
              <span>
                {durationDays} {durationDays === 1 ? "Day" : "Days"}
              </span>
            </div>
            <div className={`flex items-center justify-between ${baseTypography.xs} text-surface-subtle`}>
              <span>Quantity</span>
              <span>
                {validQuantity} {validQuantity === 1 ? "Unit" : "Units"}
              </span>
            </div>
            <div className="my-1 h-px w-full bg-surface-elevated" />
            <div className={`flex items-center justify-between ${baseTypography.sm} font-bold`}>
              <span className="text-surface-foreground">Total Amount</span>
              <span className="text-indigo-400">
                {formatRupiah(totalAmount)}
              </span>
            </div>
          </BaseCard>

          <BaseButton
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            fullWidth
            onClick={handleCheckout}
          >
            <span>Process</span>
          </BaseButton>
        </div>
      </BaseModal>

      <BaseToast
        isVisible={Boolean(errorMsg)}
        variant="error"
        title="Checkout Notice"
        message={errorMsg ?? ""}
        onClose={() => setErrorMsg(null)}
      />
    </>
  );
}
