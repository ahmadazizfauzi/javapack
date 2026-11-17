import React from "react";
import Image from "next/image";
import { BaseCard } from "@/components/ui/base_card";
import { BaseBadge } from "@/components/ui/base_badge";
import { BaseButton } from "@/components/ui/base_button";
import { PublicProduct } from "@/types/public.type";
import { baseTypography } from "@/tokens/base_typography";

export interface ProductCardProps {
  product: PublicProduct;
  onRentClick: (product: PublicProduct) => void;
}

function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function ProductCard({ product, onRentClick }: ProductCardProps) {
  const isLowStock = product.stock <= 3;

  return (
    <BaseCard padding="sm" className="flex h-full flex-col justify-between gap-4">
      <div>
        <div className="relative h-44 w-full overflow-hidden rounded-lg border border-surface-elevated">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="mt-3.5 flex items-center justify-between gap-2">
          <span className={`truncate ${baseTypography.xs} font-medium text-indigo-400`}>
            {product.categoryName}
          </span>
          <BaseBadge variant={isLowStock ? "warning" : "success"}>
            Stock: {product.stock}
          </BaseBadge>
        </div>

        <h3 className={`mt-2 ${baseTypography.sm} font-bold text-surface-foreground`}>
          {product.name}
        </h3>
        <p className={`mt-1 ${baseTypography.sm} font-semibold text-cyan-400`}>
          {formatRupiah(product.pricePerDay)} / day
        </p>
      </div>

      <BaseButton
        variant="primary"
        size="md"
        fullWidth
        onClick={() => onRentClick(product)}
      >
        Rent Now
      </BaseButton>
    </BaseCard>
  );
}
