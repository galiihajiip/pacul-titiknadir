"use client";

interface RewardItem {
  id: string;
  title: string;
  xpCost: number;
  image: string;
  category: string;
  stock: number;
}

const rewards: RewardItem[] = [
  { id: "1", title: "Voucher Toko Organik", xpCost: 500, image: "🥦", category: "Pangan", stock: 50 },
  { id: "2", title: "Indoor Plant Kit", xpCost: 1200, image: "🌱", category: "Taman", stock: 20 },
  { id: "3", title: "Tumbler Bambu", xpCost: 800, image: "🎋", category: "Lifestyle", stock: 35 },
  { id: "4", title: "Tas Belanja Kanvas", xpCost: 300, image: "👜", category: "Lifestyle", stock: 100 },
];

export default function GreenMarketplace() {
  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-[#1A1A1A]">
          Green Marketplace 🌱
        </h3>
        <button className="text-sm font-medium text-[#2D5F3F] hover:underline transition-colors">
          Lihat Semua →
        </button>
      </div>

      {/* Horizontal scroll */}
      <div
        className="flex gap-4 overflow-x-auto pb-3"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#A8D5BA transparent",
        }}
      >
        {rewards.map((item) => (
          <RewardCard key={item.id} item={item} />
        ))}

        {/* Custom scrollbar for webkit */}
        <style>{`
          .marketplace-scroll::-webkit-scrollbar { height: 4px; }
          .marketplace-scroll::-webkit-scrollbar-track { background: transparent; }
          .marketplace-scroll::-webkit-scrollbar-thumb { background: #A8D5BA; border-radius: 4px; }
        `}</style>
      </div>
    </div>
  );
}

function RewardCard({ item }: { item: RewardItem }) {
  const { title, xpCost, image, category, stock } = item;

  return (
    <div
      className="flex min-w-[180px] shrink-0 flex-col gap-3 rounded-[12px] border border-gray-100 bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      {/* Emoji circle */}
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
        style={{ backgroundColor: "rgba(168,213,186,0.2)" }}
      >
        {image}
      </div>

      {/* Title */}
      <div>
        <p className="text-sm font-medium leading-tight text-[#1A1A1A]">{title}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{ backgroundColor: "rgba(45,95,63,0.08)", color: "#2D5F3F" }}
          >
            {category}
          </span>
          <span className="text-[10px] text-gray-400">Stok: {stock}</span>
        </div>
      </div>

      {/* XP cost */}
      <p className="text-sm font-bold" style={{ color: "#7AC74F" }}>
        ⭐ {xpCost.toLocaleString("id-ID")} XP
      </p>

      {/* Redeem button */}
      <button
        className="w-full rounded-md py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#7AC74F" }}
      >
        Redeem
      </button>
    </div>
  );
}
