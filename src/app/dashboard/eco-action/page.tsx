import PageWrapper from "@/components/common/PageWrapper";
import BuktikanAksimu from "@/components/features/eco-action/BuktikanAksimu";
import TantanganAktif from "@/components/features/eco-action/TantanganAktif";
import Leaderboard from "@/components/features/eco-action/Leaderboard";
import GreenMarketplace from "@/components/features/eco-action/GreenMarketplace";
import Pencapaian from "@/components/features/eco-action/Pencapaian";

export default function EcoActionPage() {
  return (
    <PageWrapper>
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">EcoAction</h1>
        <p className="mt-1 text-sm text-gray-500">Gamifikasi aksi hijau komunitasmu</p>
      </div>

      {/* Upload bukti — full width */}
      <BuktikanAksimu />

      {/* Tantangan Aktif — full width */}
      <TantanganAktif />

      {/* Leaderboard */}
      <Leaderboard />

      {/* Marketplace */}
      <GreenMarketplace />

      {/* Pencapaian badges */}
      <Pencapaian />
    </div>
    </PageWrapper>
  );
}
