import React, { useState, useEffect } from 'react';
// Pastikan path ke HlsPlayer.jsx ini benar
import HlsPlayer from './HlsPlayer'; // <-- MENGGUNAKAN HLS.JS
import styles from './WelcomePage.module.css'; // Tetap pakai styling Anda

// URL API backend Go Anda
const API_URL = 'http://localhost:8000/api';

const WelcomePage = () => {
  // --- STATE DARI HomePage.jsx ---
  const [cameras, setCameras] = useState([]);
  const [locations, setLocations] = useState([]);
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [error, setError] = useState(null);
  
  // State pencarian dari WelcomePage.jsx
  const [searchQuery, setSearchQuery] = useState('');

  // --- FUNGSI useEffect DARI HomePage.jsx ---
  // (Untuk mengambil data dari API saat halaman dimuat)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [camerasRes, locationsRes] = await Promise.all([
          fetch(`${API_URL}/cameras`),
          fetch(`${API_URL}/locations`)
        ]);

        if (!camerasRes.ok || !locationsRes.ok) {
          throw new Error('Gagal mengambil data dari server');
        }

        const camerasData = await camerasRes.json();
        const locationsData = await locationsRes.json();
        const activeCameras = camerasData.filter(cam => cam.enabled);

        setCameras(activeCameras);
        setLocations(locationsData);

        if (activeCameras.length > 0) {
          setFeaturedVideo(activeCameras[0]);
        }

      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      }
    };

    fetchInitialData();
  }, []);

  // --- FUNGSI HANDLER DARI HomePage.jsx ---
  const handleSearch = async (query) => {
    if (query === "") {
      try {
        const res = await fetch(`${API_URL}/cameras`);
        const data = await res.json();
        setCameras(data.filter(cam => cam.enabled));
      } catch (err) {
        console.error("Reset search error:", err);
      }
      return;
    }
    try {
      const res = await fetch(`${API_URL}/cameras/search/${query}`);
      const data = await res.json();
      setCameras(data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleThumbnailClick = (camera) => {
    setFeaturedVideo(camera);
  };

  // Fungsi URL HLS (tanpa cache bust, karena sudah di-handle di server)
  const getHlsUrl = (id) => {
    return `http://localhost:8000/live/${id}/index.m3u8?t=${new Date().getTime()}`;
  };

  // --- RENDER ---

  if (error) {
    return <div className={styles.container}>Error: {error}</div>;
  }
  if (!featuredVideo) {
    return <div className={styles.container}>Loading...</div>;
  }

  // Render layout dari WelcomePage dengan data dinamis
  return (
    <div className={styles.container}>
      {/* (Efek latar belakang ... biarkan seperti aslinya) */}
      <div className={styles.backgroundEffects}>
        <img src="./assets/20174.svg" alt="gradasi latar 1" width={656} height={983} className={styles.ellipse1} />
        <img src="./assets/20175.svg" alt="gradasi latar 2" width={682} height={806} className={styles.ellipse2} />
        <img src="./assets/20176.svg" alt="gradasi latar 3" width={656} height={705} className={styles.ellipse3} />
      </div>

      {/* ===== Navbar ===== */}
      <Navbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLocationSelect={(location) => handleSearch(location)}
        showDropdown={true}
      />

      {/* ===== Konten Utama ===== */}
      <main className={styles.main}>
        <div className={styles.topSection}>
          <div className={styles.welcomeSection}>
            <h1 className={styles.welcomeTitle}>
              Selamat Datang di <br />
              <span className={styles.brandName}>Papais CCTV</span>
            </h1>
          </div>

          {/* Video Utama (TERHUBUNG) */}
          <div className={styles.mainVideoContainer}>
            <div className={styles.mainVideo}>
              <span className={styles.liveBadge}>LIVE</span>
              
              {/* MENGGANTI <iframe> DENGAN HlsPlayer */}
              <HlsPlayer
                url={getHlsUrl(featuredVideo.id)}
                playing={true}  // Autoplay
                controls={true} // Tampilkan controls
                muted={true}    // Wajib untuk autoplay
                className={styles.videoPlaceholder} // Pakai styling dari iframe
              />

              <div className={styles.videoOverlay}>
                <div className={styles.videoInfo}>
                  <h2 className={styles.videoTitle}>{featuredVideo.name}</h2>
                  <p className={styles.videoLocation}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                       <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="currentColor" strokeWidth="2" />
                       <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    {featuredVideo.location_text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Bagian Thumbnail CCTV (TERHUBUNG) ===== */}
        <div className={styles.thumbnailsSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Lihat Lebih Banyak</h3>
          </div>

          <div className={styles.thumbnailsGrid}>
            {/* MENGGANTI cctvLocations.map DENGAN cameras.map */}
            {cameras.map((cam) => (
              <div 
                key={cam.id} 
                className={styles.thumbnailCard}
                onClick={() => handleThumbnailClick(cam)} // <-- TERHUBUNG
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.thumbnailImageWrapper}>
                  <span className={styles.thumbnailLiveBadge}>LIVE</span>
                  
                  {/* MENGGANTI <iframe> DENGAN HlsPlayer */}
                  <HlsPlayer
                    url={getHlsUrl(cam.id)}
                    playing={false} // Jangan autoplay thumbnail
                    controls={false} // Jangan ada controls di thumbnail
                    muted={true}
                    className={styles.thumbnailImage} // Pakai styling dari iframe
                  />

                  {/* Kita bisa hapus tombol play statis karena HlsPlayer akan memutar video kecil */}
                  {/* <div className={styles.thumbnailPlayButton}> ... </div> */}

                  <div className={styles.thumbnailOverlay}>
                    <p className={styles.thumbnailTitle}>{cam.name}</p>
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