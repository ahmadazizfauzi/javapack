import React, { Suspense } from "react";
import { BaseSkeleton } from "@/components/ui/base_skeleton";
import { PublicProductsPage } from "@/modules/public/products.page";

export default function ProductsRoutePage() {
  return (
    <Suspense fallback={<BaseSkeleton variant="productCatalog" />}>
      <PublicProductsPage />
    </Suspense>
  );
}
