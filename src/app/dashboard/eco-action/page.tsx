import BuktikanAksimu from "@/components/features/eco-action/BuktikanAksimu";
import TantanganAktif from "@/components/features/eco-action/TantanganAktif";
import Leaderboard from "@/components/features/eco-action/Leaderboard";
import GreenMarketplace from "@/components/features/eco-action/GreenMarketplace";

export default function EcoActionPage() {
  return (
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

      {/* Badge Koleksi — placeholder BLOK 3.4 */}
      <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#1A1A1A]">Badge Koleksi</h3>
        <p className="mt-2 text-sm text-gray-400">Tersedia di BLOK 3.4</p>
      </div>
    </div>
  );
}
