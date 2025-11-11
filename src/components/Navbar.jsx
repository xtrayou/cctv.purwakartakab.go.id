import React, { useState, useEffect } from 'react';
import nav from './Navbar.module.css';

const Navbar = ({ 
  onLocationSelect, 
  searchQuery, 
  setSearchQuery,
  showDropdown = false,
  // BARU: Terima 'suggestionData' (ini adalah allCamerasMaster dari parent)
  suggestionData = [] 
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  
  // BARU: State untuk menyimpan saran yang sudah difilter
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  // ... (useEffect untuk scroll effect tidak berubah) ...
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(`.${nav.navbar}`);
      if (navbar) {
        if (window.scrollY > 10) {
          navbar.classList.add(nav.scrolled);
        } else {
          navbar.classList.remove(nav.scrolled);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery && showDropdown) {
      const lowerQuery = searchQuery.toLowerCase();
      
      const results = suggestionData.filter(cam =>
        (cam.name && cam.name.toLowerCase().includes(lowerQuery)) ||
        (cam.location_text && cam.location_text.toLowerCase().includes(lowerQuery))
      );
      
      setFilteredSuggestions(results);
      setIsDropdownVisible(results.length > 0);
    } else {
      setFilteredSuggestions([]);
      setIsDropdownVisible(false);
    }
  }, [searchQuery, suggestionData, showDropdown]);


  const handleLocationSelect = (cameraName) => {
    setSearchQuery(cameraName); 
    setIsDropdownVisible(false); 
    onLocationSelect(cameraName); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDropdownVisible(false); 
    onLocationSelect(searchQuery); 
  };

  const handleFocus = () => {
    if (showDropdown && searchQuery && filteredSuggestions.length > 0) {
      setIsDropdownVisible(true);
    }
  };

  const handleBlur = () => {
    // Beri sedikit delay agar onClick di dropdown bisa ter-trigger
    setTimeout(() => {
      setIsDropdownVisible(false);
    }, 150); 
  };

  return (
    <header className={nav.navbar}>
      <div className={nav.logo}>
        <img
          src="/assets/logo.png"
          alt="Logo aplikasi Papais CCTV"
          width={239}
          height={30}
          className={nav.logoImage}
        />
      </div>

      {/* MODIFIKASI: Bungkus search bar dengan <form> */}
      <form className={nav.searchContainer} onSubmit={handleSubmit}>
        <div className={nav.searchBar}>
          <input
            type="text"
            placeholder="Cari lokasi CCTV..."
            className={nav.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <button type="submit" className={nav.searchButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 21L15.0001 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* MODIFIKASI: Render dropdown berdasarkan 'filteredSuggestions' */}
        {showDropdown && isDropdownVisible && (
          <div className={nav.dropdownMenu}>
            {filteredSuggestions.length > 0 ? (
              // Ambil 10 hasil teratas saja untuk dropdown
              filteredSuggestions.slice(0, 10).map((cam) => (
                <div
                  key={cam._id || cam.id}
                  className={nav.dropdownItem}
                  // Gunakan onMouseDown alih-alih onClick untuk menangani blur
                  onMouseDown={() => handleLocationSelect(cam.name)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={nav.locationIcon}
                  >
                    <path
                      d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z"
                      stroke="currentColor" strokeWidth="2"
                    />
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  {/* Tampilkan 'name' dan 'location_text' */}
                  <div className={nav.locationInfo}>
                    <span className={nav.locationText}>{cam.name}</span>
                    <span className={nav.locationSubtext}>{cam.location_text}</span>
                  </div>
                </div>
              ))
            ) : null}
            {/* Tampilkan ini jika ada query tapi 0 hasil */}
            {searchQuery && filteredSuggestions.length === 0 && (
              <div className={nav.dropdownItem}>
                <span className={nav.noResults}>Lokasi tidak ditemukan</span>
              </div>
            )}
          </div>
        )}
      </form>
      
      {/* ... (Mungkin ada item nav lainnya di sini) ... */}
    </header>
  );
};

export default Navbar;