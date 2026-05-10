"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import { useStepTrackerStore } from "@/store/stepTracker.store";
import { DASHBOARD_NAV } from "@/config/navigation";

/* ── Shared nav content ── */
function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const isLiveTracking = useStepTrackerStore((s) => s.isTracking);
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-[#E5E7EB] px-4">
        <Image src="/logo.png" alt="PACUL Logo" width={32} height={32} className="h-8 w-8 object-contain" />
        <span className="text-xl font-bold tracking-wide text-[#2D5F3F]">PACUL</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="flex flex-col gap-1">
          {DASHBOARD_NAV.map(({ label, icon: Icon, href, exact, ...rest }) => {
            const live = 'live' in rest ? rest.live : undefined;
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onLinkClick}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5F3F] focus-visible:ring-offset-1",
                    isActive ? "bg-[#A8D5BA] text-[#2D5F3F]" : "text-gray-600 hover:bg-[#F5F5F5] hover:text-[#2D5F3F]"
                  )}
                >
                  <Icon size={18} className={cn("shrink-0", isActive ? "text-[#2D5F3F]" : "text-gray-400")} />
                  <span className="flex-1">{label}</span>
                  {live && isLiveTracking && (
                    <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white leading-none">
                      LIVE
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-[#E5E7EB] p-4">
        <p className="text-xs text-gray-400">© 2026 PACUL · Titik Nadir</p>
      </div>
    </div>
  );
}

/* ── Desktop sidebar (always visible on lg+) ── */
function DesktopSidebar() {
  return (
    <aside className="hidden lg:flex h-screen w-60 shrink-0 flex-col border-r border-[#E5E7EB] bg-white" style={{ position: "sticky", top: 0 }}>
      <SidebarContent />
    </aside>
  );
}

/* ── Mobile drawer sidebar ── */
function MobileSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="sb-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="sb-panel"
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu navigasi dashboard"
            className="fixed inset-y-0 left-0 z-[70] w-60 bg-white shadow-2xl lg:hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Tutup sidebar"
              className="absolute right-3 top-3 rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <X size={18} />
            </button>
            <SidebarContent onLinkClick={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Default export: combined ── */
export default function Sidebar({ mobileOpen, onMobileClose }: { mobileOpen?: boolean; onMobileClose?: () => void }) {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar isOpen={mobileOpen ?? false} onClose={onMobileClose ?? (() => {})} />
    </>
  );
}
