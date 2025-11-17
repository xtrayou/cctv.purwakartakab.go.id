import React from 'react';
import { LogOut, Menu } from 'lucide-react';
import styles from '../css/DashboardHeader.module.css';

const DashboardHeader = ({ onToggleMobileMenu, onLogout }) => {
  return (
    <header className={styles.header}>
      <button className={styles.mobileMenuToggle} onClick={onToggleMobileMenu}>
        <Menu size={24} />
      </button>
      
      <h2>Halo, Admin!</h2> 

      <div className={styles.headerActions}>
        <button onClick={onLogout} className={styles.headerLogoutBtn}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;