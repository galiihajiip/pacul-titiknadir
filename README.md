# 🌿 PACUL — Platform Aksi Komunitas Untuk Lingkungan

**Titik Nadir Team | Web Design Competition 2026**
**Sub-theme: Social Innovation & Community-Based Applications**

---

## 📖 Tentang PACUL

PACUL (Platform Aksi Komunitas Untuk Lingkungan) adalah platform web inovatif yang dirancang untuk memberdayakan komunitas lokal dalam mengambil tindakan nyata terhadap perubahan iklim. Dengan menggabungkan teknologi modern dan pendekatan berbasis komunitas, PACUL memudahkan masyarakat untuk:

- 📊 **Melacak jejak karbon** aktivitas sehari-hari secara personal
- 🎯 **Berpartisipasi dalam tantangan aksi hijau** dengan sistem gamifikasi XP & badge
- 🗺️ **Memvisualisasikan dampak lingkungan lokal** melalui peta interaktif
- 🤝 **Berkolaborasi dengan komunitas** melalui dinding kolaborasi berbasis aksi
- 🤖 **Mendapatkan rekomendasi AI** untuk mengurangi emisi karbon pribadi

---

## 🚀 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Icons | Lucide React |
| Charts | Recharts |
| Maps | Leaflet.js |
| State Management | Zustand |
| Data Fetching | TanStack Query (React Query v5) |
| HTTP Client | Axios |
| Animations | Framer Motion |
| Form Handling | React Hook Form + Zod |
| Linting | ESLint + Prettier |

---

## 🗂️ Struktur Proyek

```
pacul/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (landing)/          # Landing page
│   │   ├── dashboard/          # Dashboard utama
│   │   ├── carbon-tracker/     # Pelacak karbon
│   │   ├── eco-action/         # EcoAction & tantangan
│   │   ├── impact-map/         # Peta dampak lokal
│   │   ├── collaboration/      # Dinding kolaborasi
│   │   └── profile/            # Profil pengguna
│   ├── components/
│   │   ├── ui/                 # shadcn/ui base components
│   │   ├── layout/             # Navbar, Sidebar, Footer
│   │   ├── landing/            # Landing page sections
│   │   ├── dashboard/          # Dashboard components
│   │   ├── carbon/             # Carbon tracker components
│   │   ├── eco-action/         # EcoAction components
│   │   ├── map/                # Map components
│   │   ├── collaboration/      # Collaboration wall components
│   │   └── profile/            # Profile components
│   ├── stores/                 # Zustand state stores
│   ├── services/               # API service layer (Axios)
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities & helpers
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
└── ...config files
```

---

## 📋 Fitur Utama

### 1. 🌱 Carbon Tracker
- Input aktivitas harian (transportasi, energi, makanan, belanja)
- Visualisasi tren emisi mingguan/bulanan dengan chart interaktif
- Breakdown kategori emisi dengan donut chart
- Rekomendasi AI personal untuk mengurangi emisi

### 2. ⚡ EcoAction
- Upload foto bukti aksi hijau dengan verifikasi AI
- Tantangan aktif dengan progress tracker dan reward XP
- Leaderboard komunitas real-time
- Green Marketplace untuk penukaran poin
- Sistem achievement badge (locked/unlocked)

### 3. 🗺️ Local Impact Map
- Peta interaktif berbasis Leaflet.js
- Filter berdasarkan kategori aksi (penghijauan, daur ulang, energi)
- Visualisasi intensitas dampak per kecamatan
- Statistik dan leaderboard distrik

### 4. 🤝 Collaboration Wall
- Post composer dengan dukungan teks, foto, dan link aksi terverifikasi
- Feed postingan komunitas dengan engagement (like, komentar, share)
- Tag badge berdasarkan jenis aksi
- Sidebar trending topics dan inisiatif unggulan

### 5. 📊 Dashboard Utama
- Welcome section dengan counter XP dan level
- KPI cards (total emisi, aksi selesai, poin terkumpul, rank komunitas)
- Grafik emisi mingguan
- Tantangan aktif dengan progress bar
- Tips hari ini & aktivitas komunitas terbaru

### 6. 👤 Profil Pengguna
- Header profil dengan avatar dan progress bar level XP
- Statistik personal (total aksi, emisi dikurangi, poin, ranking)
- Grid achievement badge
- Riwayat aktivitas terbaru

---

## 🛠️ Cara Menjalankan

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x atau pnpm >= 8.x

### Instalasi

```bash
# Clone repository
git clone https://github.com/galiihajiip/pacul-titiknadir.git
cd pacul-titiknadir

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build Production

```bash
npm run build
npm run start
```

---

## 🎨 Design System

PACUL menggunakan palet warna berbasis alam dengan aksen modern:

| Token | Warna | Keterangan |
|-------|-------|------------|
| `--color-primary` | `#2D6A4F` | Hijau hutan — warna utama |
| `--color-secondary` | `#52B788` | Hijau muda — aksen |
| `--color-accent` | `#F4A261` | Oranye hangat — CTA & highlight |
| `--color-earth` | `#6B4226` | Coklat bumi — elemen natural |
| `--color-sky` | `#90E0EF` | Biru langit — info & map |
| `--color-bg` | `#F8FAF7` | Krem hijau — background utama |

---

## 👥 Tim Titik Nadir

| Nama | Role |
|------|------|
| M. Ananda H |  System Analyst business      |
| Cleo Firman  |  UI Designer                 |
| Galih Aji IP | Fullstack Developer          |

---

## 📄 Lisensi

© 2026 Titik Nadir Team. All rights reserved.
Built with 💚 for Web Design Competition 2026.
