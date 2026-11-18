"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { BaseSearchBar } from "@/components/ui/base_search_bar";
import { BaseFilterPills } from "@/components/ui/base_filter_pills";
import { BasePagination } from "@/components/ui/base_pagination";
import { BaseToast } from "@/components/ui/base_toast";
import {
  PublicCategory,
  PublicPickupLocation,
  PublicProduct,
} from "@/types/public.type";
import {
  fetchPublicProducts,
  PublicProductsPagination,
} from "../actions/public.action";
import { ProductCard } from "./ProductCard";
import { OrderModal } from "./OrderModal";
import { baseTypography } from "@/tokens/base_typography";

export interface ProductCatalogSectionProps {
  categories: PublicCategory[];
  products: PublicProduct[];
  initialPagination: PublicProductsPagination;
  initialCategory?: string;
  initialSearch?: string;
  pickupLocations: PublicPickupLocation[];
}

export function ProductCatalogSection({
  categories,
  products,
  initialPagination,
  initialCategory = "all",
  initialSearch = "",
  pickupLocations,
}: ProductCatalogSectionProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedQuery, setDebouncedQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [page, setPage] = useState(initialPagination.page || 1);
  const [pagination, setPagination] =
    useState<PublicProductsPagination>(initialPagination);
  const [displayedProducts, setDisplayedProducts] =
    useState<PublicProduct[]>(products);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PublicProduct | null>(
    null
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setDisplayedProducts(products);
  }, [products]);

  useEffect(() => {
    setPagination(initialPagination);
  }, [initialPagination]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery((prev) => {
        if (prev !== searchQuery) {
          setPage(1);
        }
        return searchQuery;
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let active = true;
    setIsSearching(true);
    fetchPublicProducts({
      search: debouncedQuery,
      categoryId: selectedCategory,
      page,
      limit: 20,
    })
      .then((res) => {
        if (!active) return;
        setDisplayedProducts(res.items);
        setPagination(res.pagination);
      })
      .finally(() => {
        if (active) setIsSearching(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedQuery, selectedCategory, page]);

  const categoryOptions = useMemo(
    () => categories.map((cat) => ({ label: cat.name, value: cat.id })),
    [categories]
  );

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-2xl flex-col items-center text-center">
        <h1 className={`${baseTypography["3xl"]} font-bold tracking-tight text-surface-foreground sm:text-4xl`}>
          Travel Gear Catalog
        </h1>
        <p className={`mt-2.5 ${baseTypography.sm} text-surface-subtle`}>
          Browse our travel essentials, click Rent Now to select dates &amp;
          complete payment.
        </p>

        <BaseSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          showButton={false}
          placeholder="Search winter jackets, cabin luggage, cameras, or adapters..."
          className="mt-6"
        />

        <BaseFilterPills
          options={categoryOptions}
          value={selectedCategory}
          onChange={(val) => {
            setSelectedCategory(val);
            setPage(1);
          }}
          className="mt-5"
        />
      </div>

      {isSearching ? (
        <div className="mt-10 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-80 animate-pulse rounded-2xl border border-surface-elevated bg-surface-card"
            />
          ))}
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className={`mt-12 rounded-xl border border-surface-elevated bg-surface-card px-6 py-12 text-center ${baseTypography.sm} text-surface-muted`}>
          No travel gear matched your search.
        </div>
      ) : (
        <>
          <div className="mt-10 flex w-full flex-wrap justify-center gap-5">
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-0.9375rem)]"
              >
                <ProductCard
                  product={product}
                  onRentClick={(item) => setSelectedProduct(item)}
                />
              </div>
            ))}
          </div>
          {pagination.totalPages > 1 && (
            <div className="mt-10 flex w-full justify-center">
              <BasePagination
                currentPage={page}
                totalPages={pagination.totalPages}
                totalItems={pagination.total}
                itemsPerPage={pagination.limit}
                itemLabel="products"
                centered
                onPageChange={(nextPage) => {
                  setPage(nextPage);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          )}
        </>
      )}

      <OrderModal
        product={selectedProduct}
        pickupLocations={pickupLocations}
        onClose={() => setSelectedProduct(null)}
        onCheckoutSuccess={(orderCode) => {
          setSelectedProduct(null);
          setToastMessage(`Order ${orderCode} created successfully.`);
        }}
      />

      <BaseToast
        isVisible={Boolean(toastMessage)}
        variant="success"
        title="Rental Order Created"
        message={toastMessage ?? ""}
        onClose={() => setToastMessage(null)}
      />
    </section>
  );
}
