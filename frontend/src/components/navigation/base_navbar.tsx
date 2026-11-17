"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, User, X } from "lucide-react";
import { baseTypography } from "@/tokens/base_typography";

const navLinks = [
  { label: "Home", href: "/home" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function BaseNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const profileHref = "/profile";

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link href="/home" className="flex items-center">
            <Image
              src="/images/javapack-logo.png"
              alt="JavaPack"
              width={155}
              height={36}
              className="h-8 w-auto shrink-0 object-contain"
              priority
            />
          </Link>

          {/* Desktop Floating Pill Bar */}
          <nav
            aria-label="Public navigation"
            className="hidden items-center gap-1 rounded-full border border-surface-elevated bg-surface-sidebar/90 p-1.5 shadow-lg shadow-black/20 lg:flex"
          >
            {navLinks.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/home" && pathname === "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-1.5 ${baseTypography.xs} font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600 font-semibold text-white shadow-sm shadow-indigo-600/30"
                      : "text-surface-subtle hover:text-surface-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA + Profile Icon + Mobile Hamburger */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/products"
              className={`inline-flex items-center gap-2 rounded-full bg-indigo-600 py-1.5 pl-4 pr-1.5 ${baseTypography.xs} font-semibold text-white shadow-md shadow-indigo-600/30 transition-all hover:bg-indigo-500`}
            >
              <span>Rent Now</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-indigo-600">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>

            <Link
              href={profileHref}
              aria-label="User profile"
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                pathname === "/profile"
                  ? "border-indigo-500 bg-indigo-600 text-white"
                  : "border-surface-elevated bg-surface-card text-surface-foreground hover:border-surface-border hover:bg-surface-elevated"
              }`}
            >
              <User className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-elevated bg-surface-card text-surface-foreground lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Top Dropdown Sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 flex max-h-[85vh] w-full flex-col overflow-y-auto rounded-b-2xl border-b border-surface-elevated bg-surface-sidebar p-5 shadow-2xl">
            <div className="flex shrink-0 items-center justify-between pb-4">
              <Link
                href="/home"
                onClick={() => setMobileOpen(false)}
                className="flex items-center"
              >
                <Image
                  src="/images/javapack-logo.png"
                  alt="JavaPack"
                  width={136}
                  height={32}
                  className="h-7 w-auto shrink-0 object-contain"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-subtle transition-colors hover:bg-surface-elevated hover:text-surface-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4 h-px w-full shrink-0 bg-surface-elevated" />

            <nav className="flex flex-col gap-1.5">
              {navLinks.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/home" && pathname === "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-3.5 py-2.5 ${baseTypography.sm} font-medium transition-colors ${
                      isActive
                        ? "bg-indigo-600 font-semibold text-white"
                        : "text-surface-subtle hover:bg-surface-elevated hover:text-surface-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className={`mt-5 flex shrink-0 items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 ${baseTypography.xs} font-semibold text-white`}
            >
              <span>Rent Now</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
