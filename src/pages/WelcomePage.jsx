import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HlsPlayer from '../components/HlsPlayer';
import styles from './WelcomePage.module.css';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';

const API_URL = 'http://localhost:8000/api';
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
  const [sortOrder, setSortOrder] = useState('default'); // 'default', 'asc', 'desc'

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

        setAllCamerasMaster(activeCameras);
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

  useEffect(() => {
    let processingList = [...allCamerasMaster];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      processingList = allCamerasMaster.filter(cam => 
        (cam.name && cam.name.toLowerCase().includes(lowerQuery)) ||
        (cam.location_text && cam.location_text.toLowerCase().includes(lowerQuery))
      );
    }

    if (sortOrder === 'asc') {
      // localeCompare adalah cara yg aman untuk sort string A-Z
      processingList.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'desc') {
      // Z-A
      processingList.sort((a, b) => b.name.localeCompare(a.name));
    }
    setCameras(processingList);

  }, [searchQuery, sortOrder, allCamerasMaster]); // Dependensi
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    setVisibleCamerasCount(CAMERAS_PER_PAGE); // Reset pagination
  };

  // BARU: Handler untuk tombol sort
  const handleSort = (newOrder) => {
    if (newOrder === sortOrder) {
      setSortOrder('default');
    } else {
      setSortOrder(newOrder);
    }
    setVisibleCamerasCount(CAMERAS_PER_PAGE); // Reset pagination
  };

  const handleThumbnailClick = (camera) => {
    navigate(`/VideoPage/${camera._id || camera.id}`);
  };

  const handleLoadMore = () => {
    setVisibleCamerasCount((prevCount) => prevCount + CAMERAS_PER_PAGE);
  };

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
            <div className={styles.sortContainer}>
              <button
                className={`${styles.sortButton} ${sortOrder === 'asc' ? styles.activeSort : ''}`}
                onClick={() => handleSort('asc')}
                title="Urutkan A-Z"
              >
                A-Z
              </button>
              <button
                className={`${styles.sortButton} ${sortOrder === 'desc' ? styles.activeSort : ''}`}
                onClick={() => handleSort('desc')}
                title="Urutkan Z-A"
              >
                Z-A
              </button>
            </div>
          </div>

          {cameras.length > 0 ? (
            <>
              <div className={styles.thumbnailsGrid}>
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
              {visibleCamerasCount < cameras.length && (
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
            <div style={{ color: 'white', opacity: 0.7, padding: '1rem 0' }}>
              {searchQuery ? "Tidak ada kamera yang cocok dengan pencarian Anda." : (error ? "Gagal memuat kamera." : "Memuat...")}
            </div>
          )}
          
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WelcomePage;