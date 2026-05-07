// TODO: Landing page full content — BLOK 1
import LayoutWrapper from "@/components/layout/LayoutWrapper";

export default function HomePage() {
  return (
    <LayoutWrapper>
      <section className="flex min-h-[calc(100vh-128px)] flex-col items-center justify-center bg-[#F5F5F5] px-4 text-center">
        <h1 className="text-4xl font-bold text-[#2D5F3F] md:text-5xl">
          Platform Aksi Kolektif<br />
          <span className="text-[#7AC74F]">untuk Lingkungan</span>
        </h1>
        <p className="mt-4 max-w-xl text-base text-gray-600 leading-relaxed">
          Lacak jejak karbon, ikuti tantangan hijau, dan berkolaborasi bersama komunitas
          untuk mewujudkan dampak nyata bagi lingkungan.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/dashboard"
            className="rounded-md bg-[#2D5F3F] px-6 py-3 text-sm font-semibold text-white hover:bg-[#245233] transition-colors"
          >
            Mulai Sekarang
          </a>
          <a
            href="#"
            className="rounded-md border border-[#2D5F3F] px-6 py-3 text-sm font-semibold text-[#2D5F3F] hover:bg-[#2D5F3F] hover:text-white transition-colors"
          >
            Pelajari Lebih Lanjut
          </a>
        </div>
      </section>
    </LayoutWrapper>
  );
}
