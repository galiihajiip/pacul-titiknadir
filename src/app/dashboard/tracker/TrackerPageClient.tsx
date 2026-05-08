"use client";

import { useState } from "react";
import PageWrapper from "@/components/common/PageWrapper";
import TrendEmisiChart from "@/components/features/carbon-tracker/TrendEmisiChart";
import CatatAktivitasBaru from "@/components/features/carbon-tracker/CatatAktivitasBaru";
import RiwayatAktivitas from "@/components/features/carbon-tracker/RiwayatAktivitas";
import BreakdownKategori from "@/components/features/carbon-tracker/BreakdownKategori";
import RekomendasiAI from "@/components/features/carbon-tracker/RekomendasiAI";
import type { EmisiData } from "@/types/carbon";

export default function TrackerPageClient() {
  const [chartView, setChartView] = useState<"weekly" | "monthly">("weekly");
  const emptyData: EmisiData[] = [];

  return (
    <PageWrapper>
      <div className="flex flex-col gap-4 lg:gap-6">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A1A] sm:text-2xl">Carbon Tracker</h1>
          <p className="mt-1 text-sm text-gray-500">Monitor jejak karbon komunitasmu</p>
        </div>

        <div className="grid gap-4 lg:gap-6 lg:grid-cols-[60fr_40fr]">
          <div className="flex flex-col gap-6">
            <TrendEmisiChart
              data={emptyData}
              view={chartView}
              onViewChange={setChartView}
            />
          </div>
          <div className="flex flex-col gap-6">
            <CatatAktivitasBaru />
            <BreakdownKategori />
            <RekomendasiAI />
          </div>
        </div>

        <RiwayatAktivitas />
      </div>
    </PageWrapper>
  );
}
