"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import MapFilters from "@/components/features/local-impact-map/MapFilters";
import DistrictPanel from "@/components/features/local-impact-map/DistrictPanel";
import type { Hotspot } from "@/components/features/local-impact-map/MapContainer";

const MapContainer = dynamic(
  () => import("@/components/features/local-impact-map/MapContainer"),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex items-center justify-center rounded-[12px] border border-[#E5E7EB] bg-[#F5F5F5]"
        style={{ height: "calc(100vh - 200px)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#A8D5BA] border-t-[#2D5F3F]" />
          <p className="text-sm text-gray-400">Memuat peta...</p>
        </div>
      </div>
    ),
  }
);

export default function MapPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeMonth, setActiveMonth] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<Hotspot | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Local Impact Map</h1>
        <p className="mt-1 text-sm text-gray-500">Visualisasi dampak aksi komunitas per wilayah</p>
      </div>

      {/* Filters */}
      <MapFilters
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        activeMonth={activeMonth}
        onMonthChange={setActiveMonth}
      />

      {/* Map + District panel grid */}
      <div className="grid gap-4 lg:grid-cols-[70fr_30fr]">
        {/* Map area */}
        <div className="sticky top-4">
          <MapContainer
            activeCategory={activeCategory}
            onSelectDistrict={setSelectedDistrict}
          />
        </div>

        {/* District info panel */}
        <div style={{ height: "calc(100vh - 200px)" }}>
          <DistrictPanel district={selectedDistrict} />
        </div>
      </div>
    </div>
  );
}
