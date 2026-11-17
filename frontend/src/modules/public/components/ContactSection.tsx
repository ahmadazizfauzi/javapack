"use client";

import React, { useState } from "react";
import { MapPin } from "lucide-react";
import { BaseCard } from "@/components/ui/base_card";
import { BaseInput } from "@/components/ui/base_input";
import { BaseTextarea } from "@/components/ui/base_textarea";
import { BaseButton } from "@/components/ui/base_button";
import { BaseToast } from "@/components/ui/base_toast";
import { getApiErrorMessage } from "@/lib/axiosInstance";
import { submitContactForm } from "@/modules/public/actions/public.action";
import { ContactInfo } from "@/types/public.type";
import { baseTypography } from "@/tokens/base_typography";

export interface ContactSectionProps {
  info: ContactInfo | null;
}

export function ContactSection({ info }: ContactSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    variant: "success" | "error";
    title: string;
    message: string;
  }>({
    visible: false,
    variant: "success",
    title: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitContactForm({ name, email, subject, message });
      setToast({
        visible: true,
        variant: "success",
        title: "Message Sent",
        message: "Thank you! Our team has received your inquiry.",
      });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      setToast({
        visible: true,
        variant: "error",
        title: "Submission Failed",
        message: getApiErrorMessage(error, "Unable to send your message."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <span className={`${baseTypography.xs} font-bold uppercase tracking-widest text-indigo-400`}>
          CONTACT US
        </span>
        <h1 className={`mt-2 ${baseTypography["3xl"]} font-bold tracking-tight text-surface-foreground sm:text-4xl`}>
          Counter Location &amp; Send Message
        </h1>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BaseCard padding="md" className="flex flex-col justify-between gap-4">
          {info ? (
            <>
              <div className="relative min-h-[300px] w-full flex-1 overflow-hidden rounded-xl border border-surface-elevated bg-surface-sidebar">
                <iframe
                  title={info.locationTitle || "Counter Location Map"}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    info.latitude && info.longitude
                      ? `${info.latitude},${info.longitude}`
                      : info.address || info.locationSubtitle || "Indonesia"
                  )}&output=embed`}
                  className="h-full min-h-[300px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                {info.locationTitle && (
                  <div className="pointer-events-none absolute left-3 top-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full bg-indigo-600/95 px-3 py-1.5 ${baseTypography.xs} font-semibold text-white shadow-lg shadow-indigo-600/30 backdrop-blur-sm`}>
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{info.locationTitle}</span>
                    </span>
                  </div>
                )}
              </div>

              <div>
                <p className={`${baseTypography.sm} font-bold text-surface-foreground`}>
                  {info.address}
                </p>
                <p className={`mt-1 ${baseTypography.xs} text-surface-subtle`}>
                  WhatsApp: {info.whatsapp} &bull; Email: {info.email} &bull;{" "}
                  {info.operatingHours}
                </p>
              </div>
            </>
          ) : (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-surface-elevated p-6 text-center">
              <p className={`${baseTypography.sm} text-surface-muted`}>
                Contact information is not configured yet.
              </p>
            </div>
          )}
        </BaseCard>

        <BaseCard padding="lg">
          <h2 className={`${baseTypography.md} font-bold text-surface-foreground`}>
            Send a Message to JavaPack Team
          </h2>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            <BaseInput
              label="Full Name"
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <BaseInput
              label="Email Address"
              type="email"
              placeholder="name@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <BaseInput
              label="Subject"
              placeholder="e.g. Group Winter Jacket Rental Inquiry"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <BaseTextarea
              label="Message"
              rows={4}
              placeholder="Write your question or rental inquiry here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              fullWidth
            >
              Send Message
            </BaseButton>
          </form>
        </BaseCard>
      </div>

      <BaseToast
        isVisible={toast.visible}
        variant={toast.variant}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </section>
  );
}
