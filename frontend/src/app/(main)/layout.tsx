"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { BaseSidebar } from "@/components/navigation/base_sidebar";
import { BaseMobileDrawer } from "@/components/navigation/base_mobile_drawer";
import { BaseModal } from "@/components/ui/base_modal";
import { BaseButton } from "@/components/ui/base_button";
import { BaseSkeleton } from "@/components/ui/base_skeleton";
import {
  fetchMeAction,
  logoutAction,
} from "@/modules/auth/actions/auth.action";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    async function verifyAdmin() {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        router.replace("/login");
        return;
      }
      try {
        const user = await fetchMeAction();
        if (user.role !== "admin") {
          router.replace("/home");
          return;
        }
        if (active) setIsAuthorized(true);
      } catch {
        logoutAction();
        router.replace("/login");
      }
    }

    verifyAdmin();
    return () => {
      active = false;
    };
  }, [router]);

  const handleConfirmLogout = () => {
    logoutAction();
    setLogoutModalOpen(false);
    router.push("/login");
  };

  if (!isAuthorized) {
    return <BaseSkeleton variant="adminShell" />;
  }

  return (
    <div className="flex min-h-screen bg-surface-canvas text-surface-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:sticky lg:top-0 lg:h-screen">
        <BaseSidebar onLogoutClick={() => setLogoutModalOpen(true)} />
      </div>

      {/* Mobile Drawer */}
      <BaseMobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onLogoutClick={() => setLogoutModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile Top Bar */}
        <div className="flex items-center justify-between border-b border-surface-elevated bg-surface-sidebar px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2">
            <Image
              src="/images/javapack-logo.png"
              alt="JavaPack"
              width={124}
              height={28}
              className="h-6 w-auto shrink-0 object-contain"
            />
            <span className="text-xs font-bold uppercase tracking-wider text-surface-muted">
              CMS
            </span>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-elevated bg-surface-card text-surface-subtle hover:text-surface-foreground"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* Sign Out Confirmation Modal */}
      <BaseModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Sign out of JavaPack CMS?"
        description="Your admin session will end and you will be redirected to the login page."
        footer={
          <>
            <BaseButton
              variant="secondary"
              size="sm"
              onClick={() => setLogoutModalOpen(false)}
            >
              Cancel
            </BaseButton>
            <BaseButton
              variant="danger"
              size="sm"
              onClick={handleConfirmLogout}
            >
              Yes, Sign Out
            </BaseButton>
          </>
        }
      />
    </div>
  );
}
