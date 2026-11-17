"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { baseTypography } from "@/tokens/base_typography";
import { ContactInfo } from "@/types/public.type";
import { fetchPublicContactInfo } from "@/modules/public/actions/public.action";

const quickLinks = [
  { label: "Home", href: "/home" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function BaseFooter() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    let active = true;
    fetchPublicContactInfo()
      .then((info) => {
        if (active) setContactInfo(info);
      })
      .catch(() => {
        if (active) setContactInfo(null);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <footer className="border-t border-surface-elevated bg-surface-sidebar/95">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-3 md:col-span-5">
            <Link href="/home" className="inline-flex w-fit items-center">
              <Image
                src="/images/javapack-logo.png"
                alt="JavaPack"
                width={155}
                height={36}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className={`max-w-sm ${baseTypography.xs} leading-relaxed text-surface-subtle`}>
              International travel gear rental service. Rent sanitized winter
              apparel, hardcase cabin luggage, action cameras, and universal
              adapters with convenient pickup.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-3 md:col-span-3">
            <h3 className={`${baseTypography.xs} font-bold uppercase tracking-wider text-surface-foreground`}>
              Navigation
            </h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${baseTypography.xs} text-surface-subtle transition-colors hover:text-indigo-400`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Counter & Contact */}
          <div className="flex flex-col gap-3 md:col-span-4">
            <h3 className={`${baseTypography.xs} font-bold uppercase tracking-wider text-surface-foreground`}>
              Counter &amp; Support
            </h3>
            {contactInfo ? (
              <ul className={`flex flex-col gap-2.5 ${baseTypography.xs} text-surface-subtle`}>
                {contactInfo.address && (
                  <li className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" />
                    <span>{contactInfo.address}</span>
                  </li>
                )}
                {contactInfo.whatsapp && (
                  <li className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
                    <span>{contactInfo.whatsapp}</span>
                  </li>
                )}
                {contactInfo.email && (
                  <li className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
                    <span>{contactInfo.email}</span>
                  </li>
                )}
              </ul>
            ) : (
              <p className={`${baseTypography.xs} text-surface-muted`}>
                Counter contact info is not configured yet.
              </p>
            )}
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className={`mt-10 flex items-center justify-center border-t border-surface-elevated pt-6 ${baseTypography.xs} text-surface-muted`}>
          <p>&copy; 2026 JavaPack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
