"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, User, Menu, X } from "lucide-react";
import { cn } from "@/utils/cn";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Tracker", href: "/dashboard/tracker" },
  { label: "EcoAction", href: "/dashboard/eco-action" },
  { label: "Map", href: "/dashboard/map" },
  { label: "Collaboration", href: "/dashboard/collaboration" },
];

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2C6 2 3 8 3 12c0 3.5 2.5 6.5 6 7.5V22h2v-2.5c3.5-1 6-4 6-7.5 0-4-3-10-5-10z" fill="#7AC74F" />
      <path d="M12 2c2 2 5 8 5 10a7 7 0 01-5 6.7V2z" fill="#5aad36" opacity="0.7" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full" style={{ backgroundColor: "#2D5F3F" }}>
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <LeafIcon className="h-8 w-8" />
            <span className="text-xl font-bold tracking-wide text-white">PACUL</span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative px-3 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "text-white after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-[#7AC74F]"
                        : "text-white/70 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop right actions */}
          <div className="hidden items-center gap-3 md:flex">
            <button aria-label="Notifikasi" className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
              <Bell size={20} />
            </button>
            <button aria-label="Profil" className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
              <User size={20} />
            </button>
            <Link href="/dashboard" className="ml-2 rounded-md border border-white px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#2D5F3F]">
              DASHBOARD
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="rounded-md p-2 text-white transition-colors hover:bg-white/10 md:hidden"
            aria-label="Buka menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>
        </nav>
      </header>

      {/* Mobile drawer + overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/50"
              onClick={close}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-[70] flex w-[260px] flex-col bg-[#2D5F3F] shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
                <Link href="/" onClick={close} className="flex items-center gap-2">
                  <LeafIcon className="h-8 w-8" />
                  <span className="text-xl font-bold tracking-wide text-white">PACUL</span>
                </Link>
                <button onClick={close} aria-label="Tutup menu" className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="flex flex-col gap-1">
                  {NAV_LINKS.map((link, i) => {
                    const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                    return (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          onClick={close}
                          className={cn(
                            "block rounded-md px-4 py-3 text-sm font-medium transition-colors",
                            isActive ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          {link.label}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* Drawer footer */}
              <div className="border-t border-white/10 p-4">
                <Link
                  href="/dashboard"
                  onClick={close}
                  className="block w-full rounded-md border border-white py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#2D5F3F]"
                >
                  DASHBOARD
                </Link>
                <p className="mt-3 text-center text-xs text-white/40">© 2026 PACUL · Titik Nadir</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
