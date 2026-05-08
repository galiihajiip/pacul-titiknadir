"use client";

import { useState } from "react";
import PageWrapper from "@/components/common/PageWrapper";
import TrendEmisiChart from "@/components/features/carbon-tracker/TrendEmisiChart";
import CatatAktivitasBaru from "@/components/features/carbon-tracker/CatatAktivitasBaru";
import ScanStrukListrik from "@/components/features/carbon-tracker/ScanStrukListrik";
import RiwayatAktivitas from "@/components/features/carbon-tracker/RiwayatAktivitas";
import BreakdownKategori from "@/components/features/carbon-tracker/BreakdownKategori";
import RekomendasiAI from "@/components/features/carbon-tracker/RekomendasiAI";
import type { EmisiData } from "@/types/carbon";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { cn } from "@/utils/cn";

type InputTab = "manual" | "scan" | "listrik";

const TABS: { id: InputTab; label: string }[] = [
  { id: "manual", label: "Input Manual" },
  { id: "scan",   label: "📷 Scan Struk" },
  { id: "listrik", label: "⚡ Input Listrik" },
];

/* Placeholder for EXT-05 */
function InputListrikPlaceholder() {
  return (
    <div className="rounded-[12px] border-2 border-dashed border-[#E5E7EB] bg-white p-10 text-center">
      <p className="text-3xl">⚡</p>
      <p className="mt-2 font-semibold text-gray-500">Input Listrik Manual</p>
      <p className="mt-1 text-sm text-gray-400">Segera hadir di pembaruan berikutnya (EXT-05)</p>
    </div>
  );
}

export default function TrackerPageClient() {
  const [chartView, setChartView] = useState<"weekly" | "monthly">("weekly");
  const [activeTab, setActiveTab] = useState<InputTab>("manual");
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
            <ErrorBoundary>
              <TrendEmisiChart
                data={emptyData}
                view={chartView}
                onViewChange={setChartView}
              />
            </ErrorBoundary>
          </div>

          <div className="flex flex-col gap-6">
            {/* Tab bar */}
            <div className="flex overflow-x-auto rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-1 gap-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={cn(
                    "flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5F3F] focus-visible:ring-offset-1",
                    activeTab === t.id
                      ? "bg-white text-[#2D5F3F] shadow-sm"
                      : "text-gray-500 hover:text-[#2D5F3F]"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab panels */}
            {activeTab === "manual" && <CatatAktivitasBaru />}
            {activeTab === "scan"   && <ScanStrukListrik />}
            {activeTab === "listrik" && <InputListrikPlaceholder />}

            <BreakdownKategori />
            <RekomendasiAI />
          </div>
        </div>

        <RiwayatAktivitas />
      </div>
    </PageWrapper>
  );
}
