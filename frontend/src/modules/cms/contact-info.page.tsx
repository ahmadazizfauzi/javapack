"use client";

import React, { useCallback, useEffect, useState } from "react";
import { BaseHeader } from "@/components/navigation/base_header";
import { BaseCard } from "@/components/ui/base_card";
import { BaseButton } from "@/components/ui/base_button";
import { BaseInput } from "@/components/ui/base_input";
import { BaseTextarea } from "@/components/ui/base_textarea";
import { BaseSkeleton } from "@/components/ui/base_skeleton";
import { BaseToast } from "@/components/ui/base_toast";
import { getApiErrorMessage } from "@/lib/axiosInstance";
import {
  fetchCmsContactInfo,
  updateCmsContactInfo,
} from "./actions/cms.action";
import { baseTypography } from "@/tokens/base_typography";

export function CmsContactInfoPage() {
  const [locationTitle, setLocationTitle] = useState("");
  const [locationSubtitle, setLocationSubtitle] = useState("");
  const [address, setAddress] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [operatingHours, setOperatingHours] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

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
      const data = await fetchCmsContactInfo();
      setLocationTitle(data.locationTitle);
      setLocationSubtitle(data.locationSubtitle);
      setAddress(data.address);
      setWhatsapp(data.whatsapp);
      setEmail(data.email);
      setOperatingHours(data.operatingHours);
      setLatitude(data.latitude);
      setLongitude(data.longitude);
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Load Failed",
        message: getApiErrorMessage(error, "Failed to load Contact info."),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !locationTitle.trim() ||
      !address.trim() ||
      !whatsapp.trim() ||
      !email.trim() ||
      !latitude.trim() ||
      !longitude.trim()
    ) {
      setToast({
        visible: true,
        variant: "error",
        title: "Validation Error",
        message:
          "Location Title, Address, WhatsApp, Email, Latitude, and Longitude are required.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const updated = await updateCmsContactInfo({
        location_title: locationTitle.trim(),
        location_subtitle: locationSubtitle.trim(),
        address: address.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        operating_hours: operatingHours.trim(),
        latitude: latitude.trim(),
        longitude: longitude.trim(),
      });
      setLocationTitle(updated.locationTitle);
      setLocationSubtitle(updated.locationSubtitle);
      setAddress(updated.address);
      setWhatsapp(updated.whatsapp);
      setEmail(updated.email);
      setOperatingHours(updated.operatingHours);
      setLatitude(updated.latitude);
      setLongitude(updated.longitude);

      setToast({
        visible: true,
        variant: "success",
        title: "Saved",
        message: "Contact info updated successfully.",
      });
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Save Failed",
        message: getApiErrorMessage(error, "Failed to save Contact info."),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <BaseHeader breadcrumb="JAVAPACK CMS  /  CONTACT" title="Contact" />

      {isLoading ? (
        <BaseSkeleton variant="table" />
      ) : (
        <BaseCard className="p-6">
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1 border-b border-surface-elevated pb-4">
              <h2 className={`${baseTypography.md} font-semibold text-surface-foreground`}>
                Contact Information Editor
              </h2>
              <p className={`${baseTypography.xs} text-surface-muted`}>
                Edit the official contact details and counter information displayed on the public Contact page.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <BaseInput
                label="Location Title"
                value={locationTitle}
                onChange={(e) => setLocationTitle(e.target.value)}
                placeholder="JavaPack Counter — Malang, East Java"
                required
              />
              <BaseInput
                label="Location Subtitle"
                value={locationSubtitle}
                onChange={(e) => setLocationSubtitle(e.target.value)}
                placeholder="Malang City, East Java, Indonesia"
                required
              />
            </div>

            <BaseTextarea
              label="Full Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              placeholder="Jl. Soekarno Hatta No. 18, Lowokwaru, Malang, East Java 65141"
              required
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <BaseInput
                label="WhatsApp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+62 812-3456-7890"
                required
              />
              <BaseInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@javapack.id"
                required
              />
              <BaseInput
                label="Operating Hours"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                placeholder="Open Daily 08:00 - 22:00 WIB"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <BaseInput
                label="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g. -7.9467"
                required
              />
              <BaseInput
                label="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g. 112.6157"
                required
              />
            </div>

            <div className="flex justify-end border-t border-surface-elevated pt-4">
              <BaseButton type="submit" variant="primary" isLoading={isSaving}>
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
