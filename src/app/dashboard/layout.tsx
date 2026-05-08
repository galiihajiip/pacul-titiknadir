"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar — hamburger only, hidden on lg */}
        <div className="flex h-14 items-center border-b border-[#E5E7EB] bg-white px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka sidebar"
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-[#2D5F3F]"
          >
            <Menu size={22} />
          </button>
          <span className="ml-3 text-sm font-semibold text-[#2D5F3F]">PACUL Dashboard</span>
        </div>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <AnimatePresence mode="wait">{children}</AnimatePresence>
        </main>
      </div>
    </div>
  );
}
