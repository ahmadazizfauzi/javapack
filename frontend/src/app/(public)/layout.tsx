import React from "react";
import { BaseNavbar } from "@/components/navigation/base_navbar";
import { BaseFooter } from "@/components/navigation/base_footer";
import { BaseAmbientBg } from "@/components/ui/base_ambient_bg";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-surface-canvas text-surface-foreground">
      <BaseAmbientBg />
      <div className="relative z-10 flex min-h-screen flex-col">
        <BaseNavbar />
        <main className="flex-1">{children}</main>
        <BaseFooter />
      </div>
    </div>
  );
}
