import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Komponen
import HlsPlayer from '../components/HlsPlayer';
import Navbar from '../components/Navbar';
import MapComponent from '../components/Map'; 
import Footer from '../components/footer';
// Styles
import styles from './VideoPage.module.css';


// URL API backend Go Anda
const API_URL = 'http://localhost:8000/api';

const VideoPage = () => {
  // --- States ---
  const [cameras, setCameras] = useState([]); // Daftar yang DIFILTER (untuk sidebar)
  const [locations, setLocations] = useState([]); 
  const [allCamerasMaster, setAllCamerasMaster] = useState([]); // Daftar MASTER (untuk peta)
  const [featuredVideo, setFeaturedVideo] = useState(null); 
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('purwakarta');

  // --- React Router Hooks ---
  const { id } = useParams(); 
  const navigate = useNavigate();

  // --- Data Fetching (Tidak Berubah) ---
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setError(null); 
        
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
        
        if (activeCameras.length > 0) {
          let selectedCam = null;
          if (id) {
            selectedCam = activeCameras.find(cam => (cam._id || cam.id) === id);
          }
          if (selectedCam) {
            setFeaturedVideo(selectedCam);
          } else {
            if(id) console.warn(`Kamera dengan ID ${id} tidak ditemukan, menampilkan default.`);
            setFeaturedVideo(activeCameras[0]);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err); 
      }
    };
    fetchInitialData();
  }, [id]);

  // Hook ini akan berjalan setiap kali 'searchQuery' berubah (setiap kali Anda mengetik)
  useEffect(() => {
    if (searchQuery === "") {
      // Jika pencarian kosong, tampilkan SEMUA kamera di sidebar
      setCameras(allCamerasMaster);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();

    // Filter daftar MASTER
    const filtered = allCamerasMaster.filter(cam => 
      (cam.name && cam.name.toLowerCase().includes(lowerQuery)) ||
      (cam.location_text && cam.location_text.toLowerCase().includes(lowerQuery))
    );
    
    // Update state 'cameras' (yang terhubung ke sidebar) dengan hasil filter
    setCameras(filtered);
    
  }, [searchQuery, allCamerasMaster]); // Dependensi


  // --- Handlers ---

  const handleSearch = (query) => {
    // Cek apakah 'query' adalah nama persis dari salah satu kamera
    const clickedCamera = allCamerasMaster.find(cam => cam.name === query);
    
    if (clickedCamera) {
      handleThumbnailClick(clickedCamera);
      
      // Update search bar dengan nama lengkap
      setSearchQuery(clickedCamera.name);
    } else {
      setSearchQuery(query);
    }
  };
  
  // Fungsi ini (TIDAK BERUBAH) sekarang dipanggil oleh handleSearch
  const handleThumbnailClick = (camera) => {
    setFeaturedVideo(camera);
    navigate(`/VideoPage/${camera._id || camera.id}`, { replace: true }); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getHlsUrl = (videoId) => {
    if (!videoId) return '';
    return `http://localhost:8000/live/${videoId}/index.m3u8?t=${new Date().getTime()}`;
  };

  // --- RENDER ---
  return (
    <div className={styles.container}>
      {/* ... (Latar belakang) ... */}
      <div className={styles.backgroundEffects}>
        {/* ... */}
      </div>

      {/* ===== Navbar ===== */}
      <Navbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery} // Ini penting untuk 'useEffect'
        onLocationSelect={handleSearch}  // Terhubung ke handleSearch baru
        showDropdown={true}
        suggestionData={allCamerasMaster} 
      />

      {/* ... (Peringatan Error) ... */}
      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(255, 100, 100, 0.2)',
          border: '1px solid #ff6464',
          color: 'white',
          borderRadius: '8px',
          margin: '1rem 60px 0 60px',
          textAlign: 'center',
          zIndex: 5
        }}>
          <strong>Koneksi Gagal:</strong> {error}. <br/>
          Pastikan server backend di <code>http://localhost:8000</code> sudah berjalan.
        </div>
      )}

      {/* ===== Konten Utama ===== */}
      <main className={styles.main}>
        <div className={styles.videoSection}>
          
          {featuredVideo ? (
            <div className={styles.contentWrapper}>
              
              {/* Video Utama (Kiri) */}
              <div className={styles.mainSection}>
                <div className={styles.videoWrapper}>
                  <span className={styles.liveBadge}>LIVE</span>
                  <HlsPlayer
                    url={getHlsUrl(featuredVideo._id || featuredVideo.id)}
                    playing={true}
                    controls={true}
                    muted={true}
                    className={styles.videoPlaceholder}
                  />
                </div>
                <div className={styles.videoInfoBelow}>
                  <h2 className={styles.videoTitle}>{featuredVideo.name}</h2>
                  <p className={styles.videoLocation}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {featuredVideo.location_text}
                  </p>
                </div>
              </div>
              
              {/* Sidebar Thumbnail (Kanan) */}
              <div className={styles.sidebar}>
                
                {/* Daftar ini sekarang akan menampilkan hasil filter 'real-time' */}
                <div className={styles.thumbnailsList}>
                  {/* .map() di sini menggunakan 'cameras' (state yang difilter) */}
                  {cameras.length > 0 ? (
                    cameras.map((cam) => (
                      <div 
                        key={cam._id || cam.id} 
                        className={`${styles.thumbnailCard} ${featuredVideo._id === (cam._id || cam.id) ? styles.activeThumbnail : ''}`}
                        onClick={() => handleThumbnailClick(cam)}
                      >
                        <div className={styles.thumbnailImageWrapper}>
                          <HlsPlayer
                            url={getHlsUrl(cam._id || cam.id)}
                            playing={false} 
                            controls={false}
                            muted={true}
                            className={styles.thumbnailImage}
                          />
                        </div>
                        <div className={styles.thumbnailInfo}>
                          <h4 className={styles.thumbnailTitle}>{cam.name}</h4>
                          <p className={styles.thumbnailLocation}>{cam.location_text}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Tampilkan pesan yang sesuai jika tidak ada hasil
                    <div style={{ color: 'white', opacity: 0.7, padding: '1rem', textAlign: 'center' }}>
                      {error ? "Gagal memuat kamera." : (searchQuery ? "Kamera tidak ditemukan." : "Memuat kamera...")}
                    </div>
                  )}
                </div>
              </div> 
            </div> 
          ) : (
            // Placeholder saat loading
            <div className={styles.contentWrapper} style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center', 
              color: 'white', minHeight: '500px', backgroundColor: '#222'
            }}>
              <p>{error ? "Gagal memuat video" : "Memuat data video..."}</p>
            </div>
          )}
        </div> 

        {/* --- Bagian Peta --- */}
        <div className={styles.mapSection}>
          <div className={styles.mapPlaceholder}>
            <MapComponent 
              cameras={allCamerasMaster} 
              activeCamera={featuredVideo}
              onMarkerClick={handleThumbnailClick} 
            />
          </div>
        </div>
        
      </main>
      <Footer />
    </div>
  );
};

export default VideoPage;
