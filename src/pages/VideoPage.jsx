import React, { useState, useEffect } from 'react';
import styles from './VideoPage.module.css';
// Pastikan path ke HlsPlayer.jsx ini benar
import HlsPlayer from '../components/HlsPlayer'; // <-- MENGGUNAKAN HLS.JS
import Navbar from '../components/navbar'; // Import komponen Navbar baru


// URL API backend Go Anda
const API_URL = 'http://localhost:8000/api';

const VideoPage = () => {
  // --- STATE DARI HomePage.jsx ---
  const [cameras, setCameras] = useState([]);
  const [locations, setLocations] = useState([]); // Untuk filter/pencarian di masa depan
  const [featuredVideo, setFeaturedVideo] = useState(null); // Menggantikan 'selectedVideo'
  const [error, setError] = useState(null);

  // --- STATE ASLI DARI VideoPage.jsx ---
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('purwakarta'); // 'terdekat' or 'purwakarta'
  // const [isPlaying, setIsPlaying] = useState(true); // Tidak perlu, di-handle oleh HlsPlayer
  
  // --- FUNGSI useEffect DARI HomePage.jsx ---
  // (Untuk mengambil data dari API saat halaman dimuat)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Ambil data kamera dan lokasi secara bersamaan
        const [camerasRes, locationsRes] = await Promise.all([
          fetch(`${API_URL}/cameras`),
          fetch(`${API_URL}/locations`)
        ]);

        if (!camerasRes.ok || !locationsRes.ok) {
          throw new Error('Gagal mengambil data dari server');
        }

        const camerasData = await camerasRes.json();
        const locationsData = await locationsRes.json();
        
        // Filter hanya kamera yang 'enabled'
        const activeCameras = camerasData.filter(cam => cam.enabled);

        setCameras(activeCameras);
        setLocations(locationsData);

        // Set video pertama sebagai video utama
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
    // Jika query kosong, reset dan tampilkan semua kamera aktif
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
    // Jika ada query, cari ke backend
    try {
      const res = await fetch(`${API_URL}/cameras/search/${query}`); // Sesuai router.go
      const data = await res.json();
      setCameras(data); // Backend sudah memfilter
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // Handler untuk mengganti video utama saat thumbnail diklik
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
  // Tampilkan loading jika video utama (featuredVideo) belum di-set
  if (!featuredVideo) {
    return <div className={styles.container}>Loading...</div>;
  }

  // Jika semua sudah siap, render halaman
  return (
    <div className={styles.container}>
      {/* Navbar (Komponen Baru) */}
      <Navbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLocationSelect={(location) => handleSearch(location)}
        showDropdown={true}
      />

      {/* Main Content */}

      {/* Main Content - Maps */}
      <main className={styles.main}>
        {/* Video Section */}
        <div className={styles.videoSection}>
          <div className={styles.contentWrapper}>
            {/* Main Video (TERHUBUNG) */}
            <div className={styles.mainSection}>
              {/* Video Player */}
              <div className={styles.mainVideo}>
                <span className={styles.liveBadge}>LIVE</span>
                
                {/* MENGGANTI <iframe> DENGAN HlsPlayer */}
                <HlsPlayer
                  url={getHlsUrl(featuredVideo.id)}
                  playing={true}
                  controls={true}
                  muted={true}
                  className={styles.videoPlaceholder} // Pakai styling dari iframe
                />
                
                {/* (Video Controls opsional, HlsPlayer sudah punya 'controls=true') */}
                {/* Anda bisa hapus div styles.videoControls jika mau */}
              </div>
              
              {/* Video Info (TERHUBUNG) */}
              <div className={styles.mainVideoInfo}>
                <div className={styles.videoInfoHeader}>
                  <div>
                    {/* Menggunakan data dari featuredVideo */}
                    <h2 className={styles.videoTitle}>{featuredVideo.name}</h2> 
                    <p className={styles.videoLocation}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      {featuredVideo.location_text}
                    </p>
                  </div>
                  {/* ... (Tombol share) ... */}
                </div>
              </div>
            </div>

            {/* Sidebar with thumbnails (TERHUBUNG) */}
            <div className={styles.sidebar}>
              <div className={styles.tabButtons}>
                {/* (Logika tab 'terdekat' belum diimplementasi, sama seperti file asli) */}
                <button 
                  className={`${styles.tabButton} ${activeTab === 'terdekat' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('terdekat')}
                >
                  Terdekat
                </button>
                <button 
                  className={`${styles.tabButton} ${activeTab === 'purwakarta' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('purwakarta')}
                >
                  Purwakarta
                </button>
              </div>
              
              <div className={styles.thumbnailsList}>
                {/* Mengganti cctvLocations.map dengan cameras.map */}
                {cameras.map((cam) => (
                  <div 
                    key={cam.id} 
                    // Ganti logika 'active'
                    className={`${styles.thumbnailCard} ${featuredVideo.id === cam.id ? styles.active : ''}`}
                    onClick={() => handleThumbnailClick(cam)} // Ganti handler
                  >
                    <div className={styles.thumbnailImageWrapper}>
                      {<span className={styles.thumbnailLiveBadge}>LIVE</span>}
                      
                      {/* MENGGANTI <iframe> DENGAN HlsPlayer */}
                      <HlsPlayer
                        url={getHlsUrl(cam.id)}
                        playing={false}
                        controls={false}
                        muted={true}
                        className={styles.thumbnailImage} // Pakai styling dari iframe
                      />
                    </div>
                    <div className={styles.thumbnailInfo}>
                      <p className={styles.thumbnailTitle}>{cam.name}</p>
                      <p className={styles.thumbnailLocation}>{cam.location_text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Section (TERHUBUNG) */}
        <div className={styles.mapSection}>
          <div className={styles.mapHeader}>
            <h2 className={styles.mapTitle}>Peta Lokasi CCTV Purwakarta</h2>
            <p className={styles.mapSubtitle}>Pantau seluruh titik CCTV di Kabupaten Purwakarta</p>
          </div>

          {/* (Map Iframe masih statis, Anda perlu logika map yang dinamis nanti) */}
          <div className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126515.89634234387!2d107.38339894785156!3d-6.5568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e690f2a84f34e09%3A0x4027a76e352e460!2sPurwakarta%2C%20Kec.%20Purwakarta%2C%20Kabupaten%20Purwakarta%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1730707000000!5m2!1sid!2sid"
              className={styles.mapIframe}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Purwakarta, Jawa Barat"
            ></iframe>
          </div>

          {/* Location Cards (TERHUBUNG) */}
          <div className={styles.locationSection}>
            <h3 className={styles.locationTitle}>Titik CCTV Aktif</h3>
            <div className={styles.locationGrid}>
              {/* Mengganti cctvLocations.map dengan cameras.map */}
              {cameras.map((cam) => (
                <div key={cam.id} className={styles.locationCard}>
                  <div className={styles.locationCardHeader}>
                    {<span className={styles.locationLiveBadge}>
                        <span className={styles.liveDot}></span>
                        LIVE
                      </span>}
                  </div>
                  <h4 className={styles.locationCardTitle}>{cam.name}</h4>
                  <p className={styles.locationCardAddress}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {cam.location_text}
                  </p>
                  <a 
                    onClick={() => handleThumbnailClick(cam)} // Ganti href dengan onClick
                    style={{cursor: 'pointer'}} // Tambahkan pointer
                    className={styles.viewButton}
                  >
                    Lihat CCTV
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoPage;