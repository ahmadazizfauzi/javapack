"use client";

import React, { useEffect, useState } from "react";
import { BaseInput } from "@/components/ui/base_input";
import {
  BaseDropdown,
  BaseDropdownOption,
} from "@/components/ui/base_dropdown";
import { BaseDatePicker } from "@/components/ui/base_date_picker";

const sortOptions: BaseDropdownOption[] = [
  { label: "Newest", value: "DESC" },
  { label: "Oldest", value: "ASC" },
];

export interface CmsTableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  filterOptions: BaseDropdownOption[];
  filterValue: string;
  onFilterChange: (value: string) => void;
  sortValue?: "DESC" | "ASC";
  onSortChange?: (value: "DESC" | "ASC") => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function CmsTableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filterOptions,
  filterValue,
  onFilterChange,
  sortValue = "DESC",
  onSortChange,
  selectedDate,
  onDateChange,
}: CmsTableToolbarProps) {
  const [draftSearch, setDraftSearch] = useState(searchValue);

  useEffect(() => {
    setDraftSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (draftSearch === searchValue) return;
    const timer = setTimeout(() => {
      onSearchChange(draftSearch);
    }, 1000);
    return () => clearTimeout(timer);
  }, [draftSearch, searchValue, onSearchChange]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="w-full sm:max-w-xs">
        <BaseInput
          isSearch
          value={draftSearch}
          onChange={(e) => setDraftSearch(e.target.value)}
          onClear={() => {
            setDraftSearch("");
            onSearchChange("");
          }}
          placeholder={searchPlaceholder}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <BaseDropdown
          options={filterOptions}
          value={filterValue}
          onChange={onFilterChange}
        />
        {onSortChange && (
          <BaseDropdown
            options={sortOptions}
            value={sortValue}
            onChange={(val) => onSortChange(val as "DESC" | "ASC")}
          />
        )}
        <BaseDatePicker
          value={selectedDate}
          onChange={onDateChange}
          displayMode="full-date"
        />
      </div>
    </div>
  );
}
