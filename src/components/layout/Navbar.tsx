"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2C6 2 3 8 3 12c0 3.5 2.5 6.5 6 7.5V22h2v-2.5c3.5-1 6-4 6-7.5 0-4-3-10-5-10z"
        fill="#7AC74F"
      />
      <path
        d="M12 2c2 2 5 8 5 10a7 7 0 01-5 6.7V2z"
        fill="#5aad36"
        opacity="0.7"
      />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full" style={{ backgroundColor: "#2D5F3F" }}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <LeafIcon className="h-8 w-8" />
          <span className="text-xl font-bold text-white tracking-wide">PACUL</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
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

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            aria-label="Notifikasi"
            className="rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Bell size={20} />
          </button>
          <button
            aria-label="Profil"
            className="rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <User size={20} />
          </button>
          <Link
            href="/dashboard"
            className="ml-2 rounded-md border border-white px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#2D5F3F]"
          >
            DASHBOARD
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden rounded-md p-2 text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 px-4 pb-4 pt-2">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-white/15 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 flex items-center gap-3 border-t border-white/10 pt-3">
            <button className="flex items-center gap-2 text-sm text-white/70 hover:text-white">
              <Bell size={18} /> Notifikasi
            </button>
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="ml-auto rounded-md border border-white px-4 py-1.5 text-sm font-semibold text-white hover:bg-white hover:text-[#2D5F3F] transition-colors"
            >
              DASHBOARD
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
