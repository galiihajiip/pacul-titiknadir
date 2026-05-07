import BuktikanAksimu from "@/components/features/eco-action/BuktikanAksimu";
import TantanganAktif from "@/components/features/eco-action/TantanganAktif";

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

      {/* Leaderboard — placeholder BLOK 3.2 */}
      <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#1A1A1A]">Leaderboard</h3>
        <p className="mt-2 text-sm text-gray-400">Tersedia di BLOK 3.2</p>
      </div>

      {/* Marketplace + Badges row — placeholder BLOK 3.3 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#1A1A1A]">Green Marketplace</h3>
          <p className="mt-2 text-sm text-gray-400">Tersedia di BLOK 3.3</p>
        </div>
        <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#1A1A1A]">Badge Koleksi</h3>
          <p className="mt-2 text-sm text-gray-400">Tersedia di BLOK 3.3</p>
        </div>
      </div>
    </div>
  );
}
