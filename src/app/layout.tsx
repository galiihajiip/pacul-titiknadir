import type { Metadata } from "next";
import { Providers } from "@/components/common/providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "PACUL — Platform Aksi Komunitas Untuk Lingkungan",
  description:
    "Platform web inovatif yang memberdayakan komunitas lokal dalam mengambil tindakan nyata terhadap perubahan iklim.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
