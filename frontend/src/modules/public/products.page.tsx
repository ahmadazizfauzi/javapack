"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BaseSkeleton } from "@/components/ui/base_skeleton";
import {
  PublicCategory,
  PublicPickupLocation,
  PublicProduct,
} from "@/types/public.type";
import {
  fetchPublicCategories,
  fetchPublicPickupLocations,
  fetchPublicProducts,
  PublicProductsPagination,
} from "./actions/public.action";
import { ProductCatalogSection } from "./components/ProductCatalogSection";

export function PublicProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [categories, setCategories] = useState<PublicCategory[]>([
    { id: "all", name: "All", slug: "all" },
  ]);
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [pagination, setPagination] = useState<PublicProductsPagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });
  const [pickupLocations, setPickupLocations] = useState<
    PublicPickupLocation[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      fetchPublicCategories(),
      fetchPublicProducts({
        page: 1,
        limit: 20,
        categoryId: initialCategory,
        search: initialSearch,
      }),
      fetchPublicPickupLocations(),
    ])
      .then(([cats, prodsRes, locs]) => {
        if (!active) return;
        setCategories(cats);
        setProducts(prodsRes.items);
        setPagination(prodsRes.pagination);
        setPickupLocations(locs);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [initialCategory, initialSearch]);

  if (isLoading) {
    return <BaseSkeleton variant="productCatalog" />;
  }

  return (
    <ProductCatalogSection
      categories={categories}
      products={products}
      initialPagination={pagination}
      initialCategory={initialCategory}
      initialSearch={initialSearch}
      pickupLocations={pickupLocations}
    />
  );
}
