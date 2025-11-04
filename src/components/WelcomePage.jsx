import React, { useState } from 'react';
import styles from './WelcomePage.module.css';

// Komponen utama halaman sambutan (Welcome Page)
const WelcomePage = ({ onNavigate }) => {
  // State untuk menyimpan input pencarian
  const [searchQuery, setSearchQuery] = useState('');

  // Daftar lokasi CCTV dengan URL embed dari cctv.purwakartakab.go.id
  const cctvLocations = [
    {
      id: 1,
      title: 'Halte Usman 2',
      location: 'Jl. Nasional 4, Nagri Kaler, Kec. Purwakarta',
      embedUrl: 'https://cctv.purwakartakab.go.id/node/halte-usman-2',
      thumbnail: 'https://cctv.purwakartakab.go.id/node/halte-usman-2',
      isLive: true,
    },
    {
      id: 2,
      title: 'Perempatan Pemda',
      location: 'Jl. Ganda Negara, Nagri Kidul, Kec. Purwakarta',
      embedUrl: 'https://cctv.purwakartakab.go.id/node/perempatan-pemda',
      thumbnail: 'https://cctv.purwakartakab.go.id/node/perempatan-pemda',
      isLive: true,
    },
    {
      id: 3,
      title: 'Perempatan Sudirman',
      location: 'Jl. Jendral Sudirman, Kec. Nagri Tengah',
      embedUrl: 'https://cctv.purwakartakab.go.id/node/perempatan-sudirman',
      thumbnail: 'https://cctv.purwakartakab.go.id/node/perempatan-sudirman',
      isLive: true,
    },
    {
      id: 4,
      title: 'Gapura Pemda',
      location: 'Jl. Ganda Negara, Nagri Tengah, Kec. Purwakarta',
      embedUrl: 'https://cctv.purwakartakab.go.id/node/gapura-pemda',
      thumbnail: 'https://cctv.purwakartakab.go.id/node/gapura-pemda',
      isLive: true,
    },
  ];

  // Fungsi untuk handle klik video
  const handleVideoClick = (location) => {
    if (onNavigate) {
      onNavigate('video');
    }
  };

  return (
    <div className={styles.container}>
      {/* ===== Efek Latar Belakang (Gradient Ellipses) ===== */}
      <div className={styles.backgroundEffects}>
        <img
          src="./assets/20174.svg"
          alt="gradasi latar 1"
          width={656}
          height={983}
          className={styles.ellipse1}
        />
        <img
          src="./assets/20175.svg"
          alt="gradasi latar 2"
          width={682}
          height={806}
          className={styles.ellipse2}
        />
        <img
          src="./assets/20176.svg"
          alt="gradasi latar 3"
          width={656}
          height={705}
          className={styles.ellipse3}
        />
      </div>

      {/* ===== Header ===== */}
      <header className={styles.header}>
        {/* Logo */}
        <div className={styles.logo}>
          <img
            src="/assets/logo.png"
            alt="Logo aplikasi Papais CCTV"
            width={239}
            height={30}
            className={styles.logoImage}
          />
        </div>

        {/* Kolom Pencarian */}
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Cari Titik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-label="Ikon pencarian"
            >
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* ===== Konten Utama ===== */}
      <main className={styles.main}>
        <div className={styles.topSection}>
          {/* Teks Sambutan */}
          <div className={styles.welcomeSection}>
            <h1 className={styles.welcomeTitle}>
              Selamat Datang di <br />
              <span className={styles.brandName}>Papais CCTV</span>
            </h1>
          </div>

          {/* Video Utama */}
          <div className={styles.mainVideoContainer}>
            <div 
              className={styles.mainVideo}
              onClick={() => handleVideoClick(cctvLocations[0])}
              style={{ cursor: 'pointer' }}
            >
              <span className={styles.liveBadge}>LIVE</span>
              <iframe
                src="https://cctv.purwakartakab.go.id/node/halte-usman-2"
                title="Halte Usman 2 - Live CCTV"
                className={styles.videoPlaceholder}
                frameBorder="0"
                allowFullScreen
                allow="autoplay; fullscreen"
              />
              <div className={styles.videoOverlay}>
                <div className={styles.videoInfo}>
                  <h2 className={styles.videoTitle}>Halte Usman 2</h2>
                  <p className={styles.videoLocation}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="10"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    Jl. Nasional 4, Nagri Kaler, Kec. Purwakarta
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Bagian Thumbnail CCTV ===== */}
        <div className={styles.thumbnailsSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Lihat Lebih Banyak</h3>
          </div>

          <div className={styles.thumbnailsGrid}>
            {cctvLocations.map((location) => (
              <div 
                key={location.id} 
                className={styles.thumbnailCard}
                onClick={() => handleVideoClick(location)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.thumbnailImageWrapper}>
                  {/* Badge LIVE */}
                  {location.isLive && (
                    <span className={styles.thumbnailLiveBadge}>LIVE</span>
                  )}

                  {/* Iframe Video Thumbnail */}
                  <iframe
                    src={location.embedUrl}
                    title={location.title}
                    className={styles.thumbnailImage}
                    frameBorder="0"
                    scrolling="no"
                    allow="autoplay"
                  />

                  {/* Tombol Play */}
                  <div className={styles.thumbnailPlayButton}>
                    <svg
                      width="60"
                      height="60"
                      viewBox="0 0 60 60"
                      fill="none"
                    >
                      <circle cx="30" cy="30" r="30" fill="#2772F8" />
                      <path d="M22 18L42 30L22 42V18Z" fill="white" />
                    </svg>
                  </div>

                  {/* Overlay Judul */}
                  <div className={styles.thumbnailOverlay}>
                    <p className={styles.thumbnailTitle}>{location.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WelcomePage;
