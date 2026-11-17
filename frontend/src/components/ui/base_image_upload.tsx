"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { baseTypography } from "@/tokens/base_typography";

export interface BaseImageUploadProps {
  label: string;
  value?: string;
  onFileSelect: (file: File) => void | Promise<void>;
  isUploading?: boolean;
  emptyText?: string;
  changeText?: string;
  heightClass?: string;
}

export function BaseImageUpload({
  label,
  value,
  onFileSelect,
  isUploading = false,
  emptyText = "Click to import image from gallery",
  changeText = "Change Image",
  heightClass = "h-36",
}: BaseImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className={`${baseTypography.xs} font-medium text-surface-subtle`}>
        {label}
      </span>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        onClick={() => {
          if (!isUploading) inputRef.current?.click();
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (!isUploading && (e.key === "Enter" || e.key === " ")) {
            inputRef.current?.click();
          }
        }}
        className={`group relative flex ${heightClass} w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-surface-border bg-surface-canvas transition-colors hover:border-indigo-500`}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt={`${label} preview`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full bg-surface-card/90 px-3 py-1.5 ${baseTypography.xs} font-medium text-white`}
              >
                <ImagePlus className="h-3.5 w-3.5" />
                {changeText}
              </span>
            </div>
          </>
        ) : (
          <div
            className={`flex flex-col items-center gap-1.5 ${baseTypography.xs} text-surface-muted`}
          >
            <ImagePlus className="h-5 w-5" />
            <span>{emptyText}</span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className={`${baseTypography.xs} font-medium text-white`}>
              Uploading...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
