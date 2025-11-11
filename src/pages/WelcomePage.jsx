import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HlsPlayer from '../components/HlsPlayer';
import styles from './WelcomePage.module.css';
import Navbar from '../components/navbar';

// URL API backend Go Anda
const API_URL = 'http://localhost:8000/api';
// Tentukan berapa banyak thumbnail untuk dimuat per "halaman"
const CAMERAS_PER_PAGE = 8;

const WelcomePage = () => {
  // --- States ---
  const [cameras, setCameras] = useState([]);
  const [locations, setLocations] = useState([]);
  const [allCamerasMaster, setAllCamerasMaster] = useState([]);
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCamerasCount, setVisibleCamerasCount] = useState(CAMERAS_PER_PAGE);

  const navigate = useNavigate();

  // --- Data Fetching ---
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
        setAllCamerasMaster(activeCameras);
        setLocations(locationsData);

        // Set video pertama sebagai video utama
        if (activeCameras.length > 0) {
          setFeaturedVideo(activeCameras[0]);
        }

      } catch (err) {
        // Tangkap error 'Failed to fetch' di sini
        setError(err.message);
        console.error("Fetch error:", err);
      }
    };

    fetchInitialData();
  }, []);

  // --- Handlers ---
  const handleSearch = (query) => {
    setSearchQuery(query); // Tetap update input field
    setVisibleCamerasCount(CAMERAS_PER_PAGE); // Reset pagination

    if (query === "") {
      // Jika query kosong, kembalikan ke daftar penuh
      setCameras(allCamerasMaster);
      return;
    }

    const lowerQuery = query.toLowerCase();

    // Filter berdasarkan 'name' ATAU 'location_text' (case-insensitive)
    const filtered = allCamerasMaster.filter(cam => 
      (cam.name && cam.name.toLowerCase().includes(lowerQuery)) ||
      (cam.location_text && cam.location_text.toLowerCase().includes(lowerQuery))
    );
    
    setCameras(filtered);
  };

  const handleThumbnailClick = (camera) => {
    navigate(`/VideoPage/${camera.id}`);
  };

  // Handler untuk tombol "Lihat Lebih Banyak"
  const handleLoadMore = () => {
    setVisibleCamerasCount((prevCount) => prevCount + CAMERAS_PER_PAGE);
  };

  // Fungsi untuk mendapatkan URL HLS dengan cache-busting
  const getHlsUrl = (id) => {
    return `http://localhost:8000/live/${id}/index.m3u8?t=${new Date().getTime()}`;
  };

  // --- RENDER ---
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
        onLocationSelect={handleSearch} 
        showDropdown={true}
        suggestionData={allCamerasMaster} 
      />

      {/* ===== Peringatan Error (Non-Blokir) ===== */}
      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(255, 100, 100, 0.2)',
          border: '1px solid #ff6464',
          color: 'white',
          borderRadius: '8px',
          margin: '1rem 60px 0 60px', // Sesuaikan margin
          textAlign: 'center'
        }}>
          <strong>Koneksi Gagal:</strong> {error}. <br/>
          Pastikan server sudah berjalan!
        </div>
      )}

      {/* ===== Konten Utama ===== */}
      <main className={styles.main}>
        <div className={styles.topSection}>
          <div className={styles.welcomeSection}>
            <h1 className={styles.welcomeTitle}>
              Selamat Datang di <br />
              <span className={styles.brandName}>Papais CCTV</span>
            </h1>
          </div>

          {/* Video Utama (dengan pelindung) */}
          <div className={styles.mainVideoContainer}>
            {featuredVideo ? (
              <div className={styles.mainVideo}>
                <span className={styles.liveBadge}>LIVE</span>
                <HlsPlayer
                  url={getHlsUrl(featuredVideo.id)}
                  playing={true}
                  controls={false}
                  muted={true}
                  className={styles.videoPlaceholder}
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
            ) : (
              // Placeholder jika loading atau error
              <div className={styles.mainVideo} style={{ 
                backgroundColor: '#222', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                minHeight: '400px' // Samakan dengan min-height video
              }}>
                <p>{error ? "Gagal memuat video utama" : "Memuat video..."}</p>
              </div>
            )}
          </div>
        </div>

        {/* ===== Bagian Thumbnail CCTV (dengan pagination) ===== */}
        <div className={styles.thumbnailsSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>
              {searchQuery ? `Hasil Pencarian untuk "${searchQuery}"` : "Lihat Lebih Banyak"}
            </h3>
          </div>

          {cameras.length > 0 ? (
            <>
              <div className={styles.thumbnailsGrid}>
                {/* Gunakan .slice(0, visibleCamerasCount) 
                  untuk memotong array cameras sesuai jumlah yang terlihat
                */}
                {cameras.slice(0, visibleCamerasCount).map((cam) => (
                  <div 
                    key={cam._id || cam.id} 
                    className={styles.thumbnailCard}
                    onClick={() => handleThumbnailClick(cam)}
                  >
                    <div className={styles.thumbnailImageWrapper}>
                      <span className={styles.thumbnailLiveBadge}>LIVE</span>
                      <HlsPlayer
                        url={getHlsUrl(cam._id || cam.id)}
                        playing={true} 
                        controls={false}
                        muted={true}
                        className={styles.thumbnailImage}
                      />
                      <div className={styles.thumbnailOverlay}>
                        <p className={styles.thumbnailTitle}>{cam.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tombol "Lihat Lebih Banyak" */}
              {!searchQuery && visibleCamerasCount < cameras.length && (
                <div className={styles.loadMoreContainer}>
                  <button 
                    onClick={handleLoadMore} 
                    className={styles.loadMoreButton}
                  >
                    Lihat Lebih Banyak
                  </button>
                </div>
              )}
            </>
          ) : (
            // Placeholder jika kamera kosong
            <div style={{ color: 'white', opacity: 0.7, padding: '1rem 0' }}>
              {error ? "Gagal memuat daftar kamera." : "Tidak ada kamera untuk ditampilkan."}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WelcomePage;