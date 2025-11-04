# Papais CCTV - Purwakarta 📹

Website monitoring CCTV modern untuk Kabupaten Purwakarta menggunakan React.js

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)

## 🎯 Fitur Utama

- ✅ **Welcome Page** - Halaman sambutan dengan video CCTV unggulan
- ✅ **Video Page** - Halaman pemutaran video dengan sidebar thumbnail
- ✅ **Live Indicator** - Badge "LIVE" untuk menandai feed yang aktif
- ✅ **Search Functionality** - Fitur pencarian titik CCTV
- ✅ **Responsive Design** - Tampilan optimal di berbagai perangkat
- ✅ **Modern UI/UX** - Desain modern dengan gradient background
- ✅ **Interactive Elements** - Hover effects dan smooth transitions

## 🚀 Quick Start

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Jalankan development server:**

   ```bash
   npm start
   ```

   Aplikasi akan otomatis terbuka di browser: `http://localhost:3000`

3. **Build untuk production:**
   ```bash
   npm run build
   ```

## 📁 Struktur Project

```
cctv.purwakartakab.go.id/
├── public/assets/          # Gambar & media files
├── src/
│   ├── components/
│   │   ├── WelcomePage.jsx
│   │   ├── WelcomePage.module.css
│   │   ├── VideoPage.jsx
│   │   └── VideoPage.module.css
│   ├── App.js
│   └── index.js
└── package.json
```

## 🎨 Halaman

### 1. Welcome Page

- Header dengan logo & search bar
- Video CCTV utama dengan badge LIVE
- Grid thumbnail video lainnya
- "Lihat Lebih Banyak" section

### 2. Video Page

- Video player utama
- Sidebar dengan thumbnail
- Bottom carousel thumbnails
- Informasi lokasi detail

## 🎭 Navigasi

Gunakan tombol di pojok kanan bawah untuk berpindah halaman:

- **Welcome Page** - Halaman utama
- **Video Page** - Halaman pemutaran

## 🔧 Kustomisasi

### Menambah Video CCTV

Edit `WelcomePage.jsx` atau `VideoPage.jsx`:

```javascript
const cctvLocations = [
  {
    id: 1,
    title: "Nama Lokasi",
    location: "Alamat Lengkap",
    thumbnail: "/assets/cctv-new.jpg",
    isLive: true,
  },
];
```

## 🛠️ Built With

- **React 18.3.1** - JavaScript library
- **CSS Modules** - Scoped styling
- **Google Fonts (Inter)** - Typography

## 📱 Responsive

- Desktop: > 1200px
- Tablet: 768px - 1200px
- Mobile: < 768px

## 🚀 Deployment ke XAMPP

```bash
npm run build
```

Copy folder `build/` ke `C:\xampp\htdocs\cctv-purwakarta\`

Akses: `http://localhost/cctv-purwakarta`

## 👥 Team

**Dinas Komunikasi dan Informatika Kabupaten Purwakarta**

---

**Made with ❤️ in Purwakarta**

© 2025 Diskominfo Kabupaten Purwakarta
