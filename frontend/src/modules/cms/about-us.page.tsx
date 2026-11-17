"use client";

import React, { useCallback, useEffect, useState } from "react";
import { BaseHeader } from "@/components/navigation/base_header";
import { BaseCard } from "@/components/ui/base_card";
import { BaseButton } from "@/components/ui/base_button";
import { BaseImageUpload } from "@/components/ui/base_image_upload";
import { BaseInput } from "@/components/ui/base_input";
import { BaseTextarea } from "@/components/ui/base_textarea";
import { BaseSkeleton } from "@/components/ui/base_skeleton";
import { BaseToast } from "@/components/ui/base_toast";
import { getApiErrorMessage } from "@/lib/axiosInstance";
import {
  fetchCmsAboutUs,
  updateCmsAboutUs,
  uploadCmsImage,
} from "./actions/cms.action";
import { baseTypography } from "@/tokens/base_typography";

export function CmsAboutUsPage() {
  const [eyebrow, setEyebrow] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [sideImageUrl, setSideImageUrl] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [sidePreview, setSidePreview] = useState("");
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingSide, setUploadingSide] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [toast, setToast] = useState<{
    visible: boolean;
    variant: "success" | "error";
    title: string;
    message: string;
  }>({ visible: false, variant: "success", title: "", message: "" });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCmsAboutUs();
      setEyebrow(data.eyebrow);
      setTitle(data.title);
      setDescription(data.description);
      setBannerImageUrl(data.bannerImageUrl);
      setSideImageUrl(data.sideImageUrl);
      setBannerPreview(data.bannerImageUrl);
      setSidePreview(data.sideImageUrl);
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Load Failed",
        message: getApiErrorMessage(error, "Failed to load About Us content."),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleImagePick = async (
    target: "banner" | "side",
    file: File | undefined
  ) => {
    if (!file) return;
    const localPreview = URL.createObjectURL(file);
    if (target === "banner") {
      setBannerPreview(localPreview);
      setUploadingBanner(true);
    } else {
      setSidePreview(localPreview);
      setUploadingSide(true);
    }

    try {
      const uploadedUrl = await uploadCmsImage(file);
      if (target === "banner") {
        setBannerImageUrl(uploadedUrl);
        setBannerPreview(uploadedUrl);
      } else {
        setSideImageUrl(uploadedUrl);
        setSidePreview(uploadedUrl);
      }
      setToast({
        visible: true,
        variant: "success",
        title: "Image Uploaded",
        message: "Image selected from gallery and ready to save.",
      });
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Upload Failed",
        message: getApiErrorMessage(error, "Failed to upload selected image."),
      });
    } finally {
      if (target === "banner") {
        setUploadingBanner(false);
      } else {
        setUploadingSide(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setToast({
        visible: true,
        variant: "error",
        title: "Validation Error",
        message: "Title and Description are required.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const updated = await updateCmsAboutUs({
        eyebrow: eyebrow.trim() || "WHY CHOOSE JAVAPACK?",
        title: title.trim(),
        description: description.trim(),
        banner_image_url: bannerImageUrl.trim() || "/images/travel-lounge.jpg",
        side_image_url: sideImageUrl.trim() || "/images/travel-winter.jpg",
      });
      setEyebrow(updated.eyebrow);
      setTitle(updated.title);
      setDescription(updated.description);
      setBannerImageUrl(updated.bannerImageUrl);
      setSideImageUrl(updated.sideImageUrl);
      setBannerPreview(updated.bannerImageUrl);
      setSidePreview(updated.sideImageUrl);

      setToast({
        visible: true,
        variant: "success",
        title: "Saved",
        message: "About Us content updated successfully.",
      });
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Save Failed",
        message: getApiErrorMessage(error, "Failed to save About Us content."),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <BaseHeader breadcrumb="JAVAPACK CMS  /  ABOUT US" title="About Us" />

      {isLoading ? (
        <BaseSkeleton variant="table" />
      ) : (
        <BaseCard className="p-6">
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1 border-b border-surface-elevated pb-4">
              <h2 className={`${baseTypography.md} font-semibold text-surface-foreground`}>
                About Us Content Editor
              </h2>
              <p className={`${baseTypography.xs} text-surface-muted`}>
                Edit the single About Us section displayed on the public About Us page. Separate paragraphs with a blank line.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <BaseInput
                label="Eyebrow Label"
                value={eyebrow}
                onChange={(e) => setEyebrow(e.target.value)}
                placeholder="WHY CHOOSE JAVAPACK?"
              />
              <BaseInput
                label="Headline Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Rent Premium Travel Gear, Save Up to 70% on Trip Costs"
                required
              />
            </div>

            <BaseTextarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Write About Us paragraphs here. Leave an empty line between paragraphs..."
              required
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <BaseImageUpload
                label="Top Banner Image"
                value={bannerPreview}
                isUploading={uploadingBanner}
                onFileSelect={(file) => handleImagePick("banner", file)}
                changeText="Change Banner Image"
                heightClass="h-44"
              />
              <BaseImageUpload
                label="Side Image"
                value={sidePreview}
                isUploading={uploadingSide}
                onFileSelect={(file) => handleImagePick("side", file)}
                changeText="Change Side Image"
                heightClass="h-44"
              />
            </div>

            <div className="flex justify-end border-t border-surface-elevated pt-4">
              <BaseButton
                type="submit"
                variant="primary"
                isLoading={isSaving}
                disabled={uploadingBanner || uploadingSide}
              >
                Save Changes
              </BaseButton>
            </div>
          </form>
        </BaseCard>
      )}

      <BaseToast
        isVisible={toast.visible}
        variant={toast.variant}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}
