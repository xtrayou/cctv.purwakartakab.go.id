import React, { useState } from 'react';
import styles from './VideoPage.module.css';

const VideoPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(0);
  const [activeTab, setActiveTab] = useState('terdekat'); // 'terdekat' or 'purwakarta'
  const [isPlaying, setIsPlaying] = useState(true);

  // Data lokasi CCTV dengan koordinat untuk marker di peta
  const cctvLocations = [
    {
      id: 1,
      title: 'Halte Usman 2',
      location: 'Jl. Nasional 4, Nagri Kaler, Kec. Purwakarta',
      embedUrl: 'https://cctv.purwakartakab.go.id/node/halte-usman-2',
      isLive: true,
      lat: -6.5568,
      lng: 107.4431
    },
    {
      id: 2,
      title: 'Perempatan Pemda',
      location: 'Jl. Ganda Negara, Nagri Kidul, Kec. Purwakarta',
      embedUrl: 'https://cctv.purwakartakab.go.id/node/perempatan-pemda',
      isLive: true,
      lat: -6.5570,
      lng: 107.4433
    },
    {
      id: 3,
      title: 'Perempatan Sudirman',
      location: 'Jl. Jendral Sudirman, Kec. Nagri Tengah',
      embedUrl: 'https://cctv.purwakartakab.go.id/node/perempatan-sudirman',
      isLive: true,
      lat: -6.5573,
      lng: 107.4438
    },
    {
      id: 4,
      title: 'Gapura Pemda',
      location: 'Jl. Ipik Gandamanah, Kec. Purwakarta',
      embedUrl: 'https://cctv.purwakartakab.go.id/node/gapura-pemda',
      isLive: true,
      lat: -6.5565,
      lng: 107.4428
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <img
            src="/assets/logo.png"
            alt="Logo aplikasi Papais CCTV"
            width={239}
            height={30}
            className={styles.logoImage}
          />
        </div>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Cari Titik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content - Maps */}
      <main className={styles.main}>
        {/* Video Section */}
        <div className={styles.videoSection}>
          <div className={styles.contentWrapper}>
            {/* Main Video */}
            <div className={styles.mainSection}>
              {/* Video Player */}
              <div className={styles.mainVideo}>
                <span className={styles.liveBadge}>LIVE</span>
                <iframe
                  src={cctvLocations[selectedVideo].embedUrl}
                  title={cctvLocations[selectedVideo].title}
                  className={styles.videoPlaceholder}
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; fullscreen"
                />
                
                {/* Video Controls */}
                <div className={styles.videoControls}>
                  <button 
                    className={styles.controlButton}
                    onClick={() => setIsPlaying(!isPlaying)}
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white">
                        <path d="M6 1H3c-.6 0-1 .4-1 1v14c0 .6.4 1 1 1h3c.6 0 1-.4 1-1V2c0-.6-.4-1-1-1m6 0c-.6 0-1 .4-1 1v14c0 .6.4 1 1 1h3c.6 0 1-.4 1-1V2c0-.6-.4-1-1-1z"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white">
                        <path d="M5 3l12 9-12 9V3z"/>
                      </svg>
                    )}
                  </button>
                  
                  <span className={styles.liveIndicator}>LIVE</span>
                  
                  <div className={styles.controlSpacer}></div>
                  
                  <a 
                    href={cctvLocations[selectedVideo].embedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.controlButton}
                    title="Buka di tab baru"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white">
                      <path d="M13.293 3.293 7.022 9.564l1.414 1.414 6.271-6.271L17 7V1h-6z"/>
                      <path d="M13 15H3V5h5V3H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6h-2z"/>
                    </svg>
                  </a>
                  
                  <button className={styles.controlButton} title="Fullscreen">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white">
                      <path d="M10 3h3.6l-4 4L11 8.4l4-4V8h2V1h-7zM7 9.6l-4 4V10H1v7h7v-2H4.4l4-4z"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Video Info */}
              <div className={styles.mainVideoInfo}>
                <div className={styles.videoInfoHeader}>
                  <div>
                    <h2 className={styles.videoTitle}>{cctvLocations[selectedVideo].title}</h2>
                    <p className={styles.videoLocation}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      {cctvLocations[selectedVideo].location}
                    </p>
                  </div>
                  <button className={styles.shareButton}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3"/>
                      <circle cx="6" cy="12" r="3"/>
                      <circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/>
                      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
                    </svg>
                    Bagikan
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar with thumbnails */}
            <div className={styles.sidebar}>
              {/* Tab Buttons */}
              <div className={styles.tabButtons}>
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
                {cctvLocations.map((location, index) => (
                  <div 
                    key={location.id} 
                    className={`${styles.thumbnailCard} ${selectedVideo === index ? styles.active : ''}`}
                    onClick={() => setSelectedVideo(index)}
                  >
                    <div className={styles.thumbnailImageWrapper}>
                      {location.isLive && <span className={styles.thumbnailLiveBadge}>LIVE</span>}
                      <iframe
                        src={location.embedUrl}
                        title={location.title}
                        className={styles.thumbnailImage}
                        frameBorder="0"
                        scrolling="no"
                        allow="autoplay"
                      />
                    </div>
                    <div className={styles.thumbnailInfo}>
                      <p className={styles.thumbnailTitle}>{location.title}</p>
                      <p className={styles.thumbnailLocation}>{location.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className={styles.mapSection}>
          <div className={styles.mapHeader}>
            <h2 className={styles.mapTitle}>Peta Lokasi CCTV Purwakarta</h2>
            <p className={styles.mapSubtitle}>Pantau seluruh titik CCTV di Kabupaten Purwakarta</p>
          </div>

          {/* Google Maps Embed */}
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

          {/* Location Cards */}
          <div className={styles.locationSection}>
            <h3 className={styles.locationTitle}>Titik CCTV Aktif</h3>
            <div className={styles.locationGrid}>
              {cctvLocations.map((location) => (
                <div key={location.id} className={styles.locationCard}>
                  <div className={styles.locationCardHeader}>
                    {location.isLive && (
                      <span className={styles.locationLiveBadge}>
                        <span className={styles.liveDot}></span>
                        LIVE
                      </span>
                    )}
                  </div>
                  <h4 className={styles.locationCardTitle}>{location.title}</h4>
                  <p className={styles.locationCardAddress}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {location.location}
                  </p>
                  <a 
                    href={location.embedUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
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
