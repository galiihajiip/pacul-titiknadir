"use client";

import { useState } from "react";
import TrendEmisiChart from "@/components/features/carbon-tracker/TrendEmisiChart";
import CatatAktivitasBaru from "@/components/features/carbon-tracker/CatatAktivitasBaru";
import type { EmisiData } from "@/types/carbon";

export default function TrackerPage() {
  const [chartView, setChartView] = useState<"weekly" | "monthly">("weekly");
  const emptyData: EmisiData[] = [];

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Carbon Tracker</h1>
        <p className="mt-1 text-sm text-gray-500">Monitor jejak karbon komunitasmu</p>
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-[60fr_40fr]">
        {/* Left col — Charts */}
        <div className="flex flex-col gap-6">
          <TrendEmisiChart
            data={emptyData}
            view={chartView}
            onViewChange={setChartView}
          />
        </div>

        {/* Right col — Form & breakdown */}
        <div className="flex flex-col gap-6">
          <CatatAktivitasBaru />
          <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#1A1A1A]">Breakdown Kategori</h3>
            <p className="mt-2 text-sm text-gray-400">
              Donut chart akan tersedia di BLOK 2.3
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
