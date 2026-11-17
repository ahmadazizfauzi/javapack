"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";
import { baseTypography } from "@/tokens/base_typography";

export interface BaseDropdownOption {
  label: string;
  value: string;
}

export interface BaseDropdownProps {
  label?: string;
  options: BaseDropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function BaseDropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Select option",
  searchable = false,
  searchPlaceholder = "Search...",
  icon,
  className = "",
}: BaseDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuPos, setMenuPos] = useState<{
    top: number;
    left: number;
    minWidth: number;
  }>({ top: 0, left: 0, minWidth: 164 });

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(query.toLowerCase())
      )
    : options;

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 6,
      left: rect.left + rect.width / 2,
      minWidth: rect.width,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleScrollOrResize = () => updatePosition();
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const inContainer = containerRef.current?.contains(target);
      const inMenu = menuRef.current?.contains(target);
      if (!inContainer && !inMenu) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative flex flex-col gap-1.5 ${className}`}>
      {label && (
        <span className={`${baseTypography.xs} font-medium text-surface-subtle`}>
          {label}
        </span>
      )}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-10 min-w-[164px] items-center justify-between gap-2.5 rounded-lg border px-3.5 ${baseTypography.xs} font-medium transition-colors ${
          isOpen
            ? "border-indigo-600 bg-surface-sidebar text-surface-foreground"
            : "border-surface-border bg-surface-sidebar text-surface-foreground hover:border-surface-muted"
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          {icon && <span className="text-surface-subtle">{icon}</span>}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-surface-muted transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: menuPos.top,
              left: menuPos.left,
              minWidth: menuPos.minWidth,
              transform: "translateX(-50%)",
            }}
            className="z-[70] w-max max-w-[280px] rounded-xl border border-surface-border bg-surface-card p-1.5 shadow-xl shadow-black/40"
          >
            {searchable && (
              <div className="relative mb-1.5">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-surface-muted" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={`h-8 w-full rounded-lg border border-surface-elevated bg-surface-sidebar pl-8 pr-2.5 ${baseTypography.xs} text-surface-foreground placeholder-surface-muted focus:border-indigo-600 focus:outline-none`}
                />
              </div>
            )}
            <div className="flex max-h-56 flex-col gap-0.5 overflow-y-auto overscroll-y-contain">
              {filteredOptions.length === 0 ? (
                <div className={`px-3 py-2 ${baseTypography.xs} text-surface-muted`}>
                  No results found
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                        setQuery("");
                      }}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left ${baseTypography.xs} transition-colors ${
                        isSelected
                          ? "bg-indigo-600/20 font-semibold text-indigo-300"
                          : "text-surface-subtle hover:bg-surface-elevated hover:text-surface-foreground"
                      }`}
                    >
                      <span className="whitespace-nowrap">{opt.label}</span>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
