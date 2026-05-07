"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Zap,
  Map,
  Users,
  User,
} from "lucide-react";
import { cn } from "@/utils/cn";

const MENU_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Carbon Tracker", icon: Activity, href: "/dashboard/tracker" },
  { label: "EcoAction", icon: Zap, href: "/dashboard/eco-action" },
  { label: "Impact Map", icon: Map, href: "/dashboard/map" },
  { label: "Collaboration", icon: Users, href: "/dashboard/collaboration" },
  { label: "Profile", icon: User, href: "/dashboard/profile" },
];

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2C6 2 3 8 3 12c0 3.5 2.5 6.5 6 7.5V22h2v-2.5c3.5-1 6-4 6-7.5 0-4-3-10-5-10z"
        fill="#7AC74F"
      />
      <path d="M12 2c2 2 5 8 5 10a7 7 0 01-5 6.7V2z" fill="#5aad36" opacity="0.7" />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex h-screen w-60 shrink-0 flex-col border-r border-[#E5E7EB] bg-white"
      style={{ position: "sticky", top: 0 }}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-[#E5E7EB] px-4">
        <LeafIcon className="h-8 w-8" />
        <span className="text-xl font-bold text-[#2D5F3F] tracking-wide">PACUL</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="flex flex-col gap-1">
          {MENU_ITEMS.map(({ label, icon: Icon, href }) => {
            const isActive =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#A8D5BA] text-[#2D5F3F]"
                      : "text-gray-600 hover:bg-[#F5F5F5] hover:text-[#2D5F3F]"
                  )}
                >
                  <Icon
                    size={18}
                    className={cn(
                      "shrink-0",
                      isActive ? "text-[#2D5F3F]" : "text-gray-400"
                    )}
                  />
                  {label}
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
    </aside>
  );
}
