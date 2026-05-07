"use client";

import { ChevronDown } from "lucide-react";

const CATEGORIES = ["Semua", "Energi", "Limbah", "Transportasi"];

const CATEGORY_COLOR: Record<string, string> = {
  Semua: "#2D5F3F",
  Energi: "#F59E0B",
  Limbah: "#10B981",
  Transportasi: "#2D5F3F",
};

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

interface MapFiltersProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export default function MapFilters({
  activeCategory,
  onCategoryChange,
  selectedMonth,
  onMonthChange,
}: MapFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Category filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat;
          const color = CATEGORY_COLOR[cat];
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-150"
              style={
                active
                  ? { backgroundColor: color, color: "#fff", border: `1.5px solid ${color}` }
                  : { backgroundColor: "transparent", color: "#6B7280", border: "1.5px solid #E5E7EB" }
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Month dropdown */}
      <div className="relative ml-auto">
        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="appearance-none rounded-md border border-[#E5E7EB] bg-white px-3 py-1.5 pr-8 text-xs font-medium text-gray-600 outline-none focus:border-[#2D5F3F]"
        >
          {MONTHS.map((m) => (
            <option key={m} value={m}>{m} 2026</option>
          ))}
        </select>
        <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
}
