"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Columns2,
  Diamond,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  LayoutGrid,
  List,
  LogOut,
  MapPin,
  Phone,
  Smile,
  X,
} from "lucide-react";
import { baseTypography } from "@/tokens/base_typography";

export interface BaseSidebarProps {
  onNavigate?: () => void;
  onLogoutClick?: () => void;
  onClose?: () => void;
  className?: string;
}

const contentSubItems = [
  { label: "Home", href: "/admin/contents/hero", Icon: ImageIcon },
  { label: "About Us", href: "/admin/contents/about-us", Icon: FileText },
  { label: "FAQ", href: "/admin/contents/faq", Icon: HelpCircle },
  { label: "Contact", href: "/admin/contents/contact", Icon: Phone },
];

export function BaseSidebar({
  onNavigate,
  onLogoutClick,
  onClose,
  className = "h-full w-64 border-r",
}: BaseSidebarProps) {
  const pathname = usePathname();
  const isContentActive = pathname.startsWith("/admin/contents");
  const [contentOpen, setContentOpen] = useState(isContentActive);

  const isDashboard = pathname === "/admin/dashboard";

  const itemBaseClass =
    "flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-xs font-medium transition-colors";
  const inactiveClass =
    "text-surface-subtle hover:bg-surface-elevated/60 hover:text-surface-foreground";
  const activeClass = "bg-indigo-600 font-semibold text-white";

  return (
    <aside
      className={`flex shrink-0 flex-col border-surface-elevated bg-surface-sidebar p-5 ${className}`}
    >
      {/* Brand Header (Pinned Top) */}
      <div className="flex shrink-0 items-center justify-between gap-2.5 pb-3">
        <div className="flex items-center gap-2">
          <Image
            src="/images/javapack-logo.png"
            alt="JavaPack"
            width={136}
            height={32}
            className="h-7 w-auto shrink-0 object-contain"
          />
          <span className={`${baseTypography.xs} font-bold uppercase tracking-wider text-surface-muted`}>
            CMS
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-subtle transition-colors hover:bg-surface-elevated hover:text-surface-foreground lg:hidden"
            aria-label="Close navigation menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mb-3 h-px w-full shrink-0 bg-surface-elevated" />

      {/* Scrollable Navigation Area */}
      <nav
        aria-label="Admin CMS navigation"
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-y-contain pr-1"
      >
        {/* Group: OVERVIEW */}
        <div className="flex flex-col gap-1.5">
          <span className={`px-1 ${baseTypography.xs} font-bold uppercase tracking-wider text-surface-muted`}>
            OVERVIEW
          </span>
          <Link
            href="/admin/dashboard"
            onClick={onNavigate}
            className={`${itemBaseClass} ${
              isDashboard ? activeClass : inactiveClass
            }`}
          >
            <LayoutGrid className="h-4 w-4 shrink-0" />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Group: PUBLIC CONTENT CMS */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className={`px-1 ${baseTypography.xs} font-bold uppercase tracking-wider text-surface-muted`}>
            PUBLIC CONTENT CMS
          </span>
          <Link
            href="/admin/categories"
            onClick={onNavigate}
            className={`${itemBaseClass} ${
              pathname === "/admin/categories" ? activeClass : inactiveClass
            }`}
          >
            <Columns2 className="h-4 w-4 shrink-0" />
            <span>Categories</span>
          </Link>
          <Link
            href="/admin/products"
            onClick={onNavigate}
            className={`${itemBaseClass} ${
              pathname === "/admin/products" ? activeClass : inactiveClass
            }`}
          >
            <Diamond className="h-4 w-4 shrink-0" />
            <span>Products</span>
          </Link>
          <Link
            href="/admin/pickup-locations"
            onClick={onNavigate}
            className={`${itemBaseClass} ${
              pathname === "/admin/pickup-locations"
                ? activeClass
                : inactiveClass
            }`}
          >
            <MapPin className="h-4 w-4 shrink-0" />
            <span>Pickup Locations</span>
          </Link>

          {/* Dropdown: Website Content */}
          <div>
            <button
              type="button"
              onClick={() => setContentOpen((prev) => !prev)}
              className={`${itemBaseClass} justify-between ${
                contentOpen || isContentActive
                  ? "bg-surface-elevated font-semibold text-surface-foreground"
                  : inactiveClass
              }`}
            >
              <span className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 shrink-0" />
                <span>Website Content</span>
              </span>
              {contentOpen ? (
                <ChevronDown className="h-3.5 w-3.5 text-surface-muted" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-surface-muted" />
              )}
            </button>

            {contentOpen && (
              <div className="mt-1 flex flex-col gap-1 pl-7">
                {contentSubItems.map((sub) => {
                  const subActive = pathname === sub.href;
                  const SubIcon = sub.Icon;
                  return (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={onNavigate}
                      className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 ${baseTypography.xs} transition-colors ${
                        subActive
                          ? "bg-indigo-600 font-semibold text-white"
                          : "text-surface-subtle hover:bg-surface-elevated/50 hover:text-surface-foreground"
                      }`}
                    >
                      <SubIcon className="h-3.5 w-3.5 shrink-0" />
                      <span>{sub.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Group: TRANSACTIONS & RENTALS */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className={`px-1 ${baseTypography.xs} font-bold uppercase tracking-wider text-surface-muted`}>
            {/* OPERATIONAL &amp;   */}
            OPERATIONAL
          </span>
          <Link
            href="/admin/orders"
            onClick={onNavigate}
            className={`${itemBaseClass} ${
              pathname === "/admin/orders" ? activeClass : inactiveClass
            }`}
          >
            <List className="h-4 w-4 shrink-0" />
            <span>Order</span>
          </Link>
          <Link
            href="/admin/users"
            onClick={onNavigate}
            className={`${itemBaseClass} ${
              pathname === "/admin/users" ? activeClass : inactiveClass
            }`}
          >
            <Smile className="h-4 w-4 shrink-0" />
            <span>User Management</span>
          </Link>
          <Link
            href="/admin/contacts"
            onClick={onNavigate}
            className={`${itemBaseClass} ${
              pathname === "/admin/contacts" ? activeClass : inactiveClass
            }`}
          >
            <FileText className="h-4 w-4 shrink-0" />
            <span>Contact Messages</span>
          </Link>
        </div>
      </nav>

      {/* Bottom Group: Sign Out */}
      <div className="flex shrink-0 flex-col gap-2.5 pt-3">
        <div className="h-px w-full bg-surface-elevated" />
        <button
          type="button"
          onClick={onLogoutClick}
          className={`flex h-9 w-full items-center gap-2.5 rounded-lg px-3 ${baseTypography.xs} font-semibold text-red-400 transition-colors hover:bg-red-500/10`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
