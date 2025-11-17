import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Camera, MapPin, LogOut, X } from 'lucide-react';
import styles from '../css/DashboardSidebar.module.css'; // Sesuaikan path CSS Anda

const SidebarMenu = ({ onLogout }) => (
  <>
    <div className={styles.logoContainer}>
      <h2>Papais CCTV</h2>
    </div>
    <nav className={styles.menu}>
      
      <NavLink
        to="/siadmin" // Path ke rute 'index'
        end // 'end' penting agar tidak 'active' saat di /cameras
        className={({ isActive }) => isActive ? styles.active : ''}
      >
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </NavLink>
      
      <NavLink
        to="/siadmin/cameras" // Path ke rute 'cameras'
        className={({ isActive }) => isActive ? styles.active : ''}
      >
        <Camera size={20} />
        <span>Manajemen Kamera</span>
      </NavLink>
      
      <NavLink
        to="/siadmin/locations" // Path ke rute 'locations'
        className={({ isActive }) => isActive ? styles.active : ''}
      >
        <MapPin size={20} />
        <span>Manajemen Lokasi</span>
      </NavLink>
    </nav>
  </>
);

const DashboardSidebar = ({ onLogout, isMobileMenuOpen, onCloseMobileMenu }) => {
  return (
    <>
      {/* Sidebar Desktop */}
      <div className={styles.sidebar}>
        <SidebarMenu 
          onLogout={onLogout}
        />
      </div>

      {/* Sidebar Mobile */}
      {isMobileMenuOpen && (
        <div className={styles.mobileSidebarOverlay} onClick={onCloseMobileMenu}>
          <div className={styles.mobileSidebar} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeMobileMenu} onClick={onCloseMobileMenu}>
              <X size={24} />
            </button>
            <SidebarMenu 
              onLogout={onLogout}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardSidebar;