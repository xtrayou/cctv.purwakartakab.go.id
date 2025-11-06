import React, { useState, useEffect } from 'react';
import styles from './Navbar.css';

const Navbar = ({ 
  onLocationSelect, 
  searchQuery, 
  setSearchQuery,
  showDropdown = false
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Scroll effect untuk navbar
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(`.${styles.navbar}`);
      if (navbar) {
        if (window.scrollY > 10) {
          navbar.classList.add(styles.scrolled);
        } else {
          navbar.classList.remove(styles.scrolled);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Daftar semua lokasi CCTV yang tersedia
  const allCctvLocations = [
    'PINTU TIMUR SITU BULEUD 02',
    'PERTIGAAN GENTONG-01',
    'PATUNG SUDIRMAN 02',
    'PERTIGAAN GENTONG-02',
    'PATUNG EGRANG 02',
    'GAPURA PEMDA 02',
    'PEREMPATAN-PEMDA 02',
    'BKPSDM 02',
    'PERTIGAAN TELKOM 02',
    'PATUNG EGRANG 01',
    'HALTE USMAN 01',
    'PEREMPATAN-PEMDA 01',
    'HALTE USMAN 02',
    'PINTU TIMUR SITU BULEUD 01',
    'Taman Pasanggrahan',
    'DISDUK UMAMA',
    'Pintu Barat Taman Air Mancur Sribaduga 1 - 01',
    'PEREMPATAN-PEMDA03 (IP Baru)',
    'Depan Mako Polres Purwakarta-01',
    'Depan Mako Polres Purwakarta-02',
    'Patung Tugu Kecelakaan 01',
    'Patung Tugu Kecelakaan 02',
    'SIMPANG JALAN KOPI 01',
    'SIMPANG JALAN KOPI 02',
    'Perempatan Haji Iming',
    'Perempatan Sadang',
    'SIMPANG SMPN 05 PURWAKARTA-01',
    'SIMPANG SMPN 05 PURWAKARTA-02',
    'Pertigaan Golden Futsal-BJI- 01',
    'Pertigaan Golden Futsal-BJI- 02',
    'Pertigaan Rel Kereta Api Munjul',
    'Rel Kereta Api Simpang',
    'Perempatan Parcom'
  ];

  // Filter lokasi berdasarkan search query
  const filteredLocations = allCctvLocations.filter(location =>
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fungsi untuk handle input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsDropdownVisible(true);
  };

  // Fungsi untuk handle pilih dari dropdown
  const handleLocationSelect = (location) => {
    setSearchQuery(location);
    setIsDropdownVisible(false);
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  return (
    <nav className={styles.navbar}>
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

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Cari Titik..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => showDropdown && setIsDropdownVisible(true)}
            onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)}
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
          
          {/* Dropdown Results */}
          {showDropdown && isDropdownVisible && (searchQuery || filteredLocations.length > 0) && (
            <div className={styles.searchDropdown}>
              {filteredLocations.length > 0 ? (
                filteredLocations.slice(0, 10).map((location, index) => (
                  <div
                    key={index}
                    className={styles.dropdownItem}
                    onClick={() => handleLocationSelect(location)}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      className={styles.locationIcon}
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
                    <span className={styles.locationText}>{location}</span>
                  </div>
                ))
              ) : searchQuery ? (
                <div className={styles.dropdownItem}>
                  <span className={styles.noResults}>Lokasi tidak ditemukan</span>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
