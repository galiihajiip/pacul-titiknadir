"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ChevronDown, Loader2, CheckCircle } from "lucide-react";
import type { EmissionCategory } from "@/types/carbon";

/* ── Zod schema ── */
const aktivitasSchema = z.object({
  category: z.enum(["Transportasi", "Energi", "Limbah", "Pangan"], {
    required_error: "Pilih kategori aktivitas",
  }),
  amount: z
    .number({ invalid_type_error: "Masukkan angka yang valid" })
    .positive("Jumlah harus lebih dari 0"),
  unit: z.string().min(1, "Unit diperlukan"),
  notes: z.string().optional(),
});

type AktivitasForm = z.infer<typeof aktivitasSchema>;

const CATEGORIES: EmissionCategory[] = [
  "Transportasi",
  "Energi",
  "Limbah",
  "Pangan",
];

const UNIT_MAP: Record<EmissionCategory, string> = {
  Transportasi: "km",
  Energi: "kWh",
  Limbah: "kg",
  Pangan: "kg",
};

const CATEGORY_COLORS: Record<EmissionCategory, string> = {
  Transportasi: "#2D5F3F",
  Energi: "#F59E0B",
  Limbah: "#10B981",
  Pangan: "#7AC74F",
};

/* ── Toast mini ── */
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex items-center gap-2 rounded-lg border border-[#A8D5BA] bg-white px-4 py-3 shadow-md text-sm text-[#2D5F3F] font-medium"
    >
      <CheckCircle size={16} className="shrink-0 text-[#7AC74F]" />
      {message}
    </motion.div>
  );
}

interface CatatAktivitasBaruProps {
  onActivityAdded?: (data: AktivitasForm) => void;
}

export default function CatatAktivitasBaru({
  onActivityAdded,
}: CatatAktivitasBaruProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AktivitasForm>({
    resolver: zodResolver(aktivitasSchema),
    defaultValues: { unit: "km" },
  });

  const selectedCategory = watch("category");

  /* Auto-fill unit when category changes */
  useEffect(() => {
    if (selectedCategory && UNIT_MAP[selectedCategory]) {
      setValue("unit", UNIT_MAP[selectedCategory]);
    }
  }, [selectedCategory, setValue]);

  const onSubmit = async (data: AktivitasForm) => {
    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 1500));
    setIsSubmitting(false);
    onActivityAdded?.(data);
    reset({ unit: "km" });
    setToast("Aktivitas berhasil dicatat! +25 XP");
  };

  const inputBase =
    "w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-[#1A1A1A] outline-none transition-all placeholder:text-gray-300 focus:border-[#2D5F3F] focus:ring-1 focus:ring-[#2D5F3F]";

  const labelBase = "mb-1.5 block text-xs font-semibold text-gray-600";

  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <h3 className="mb-5 text-base font-semibold text-[#1A1A1A]">
        Catat Aktivitas Baru
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

        {/* Field 1 — Kategori */}
        <div>
          <label className={labelBase}>Pilih Kategori</label>
          <div className="relative">
            <select
              {...register("category")}
              className={`${inputBase} appearance-none pr-9 bg-white`}
              defaultValue=""
            >
              <option value="" disabled>
                -- Pilih kategori --
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
          {errors.category && (
            <p className="mt-1 text-xs text-[#EF4444]">{errors.category.message}</p>
          )}
          {/* Category color indicator */}
          {selectedCategory && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[selectedCategory] }}
              />
              <span className="text-xs text-gray-400">{selectedCategory}</span>
            </div>
          )}
        </div>

        {/* Field 2 — Jumlah + Unit */}
        <div className="grid grid-cols-[1fr_80px] gap-2">
          <div>
            <label className={labelBase}>Jumlah</label>
            <input
              type="number"
              step="0.01"
              placeholder="Contoh: 15"
              {...register("amount", { valueAsNumber: true })}
              className={inputBase}
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-[#EF4444]">{errors.amount.message}</p>
            )}
          </div>
          <div>
            <label className={labelBase}>Unit</label>
            <input
              type="text"
              {...register("unit")}
              className={`${inputBase} text-center font-medium text-[#2D5F3F]`}
              readOnly
            />
          </div>
        </div>

        {/* Field 3 — Catatan */}
        <div>
          <label className={labelBase}>
            Catatan{" "}
            <span className="font-normal text-gray-400">(opsional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="Deskripsi aktivitas..."
            {...register("notes")}
            className={`${inputBase} resize-none`}
          />
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileTap={{ scale: 0.97 }}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold text-white transition-colors disabled:opacity-70"
          style={{ backgroundColor: isSubmitting ? "#245033" : "#2D5F3F" }}
          onMouseEnter={(e) => {
            if (!isSubmitting) e.currentTarget.style.backgroundColor = "#245033";
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) e.currentTarget.style.backgroundColor = "#2D5F3F";
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Menyimpan...
            </>
          ) : (
            "SIMPAN AKSI"
          )}
        </motion.button>
      </form>
    </div>
  );
}
