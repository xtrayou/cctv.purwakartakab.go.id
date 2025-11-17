import React from 'react';
import { Save, X } from 'lucide-react';
import styles from '../css/Modal.module.css';

const LocationModal = ({ show, onClose, form, setForm, isEditing, onSave }) => {
  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{isEditing ? 'Edit Lokasi' : 'Tambah Lokasi Baru'}</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label>Nama Lokasi</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Contoh: Perempatan Pemda"/>
          </div>
          <div className={styles.formGroup}>
            <label>Alamat Lengkap</label>
            <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Masukkan alamat lengkap"/>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Latitude</label>
              <input type="text" name="latitude" value={form.latitude} onChange={handleChange} placeholder="-6.560702"/>
            </div>
            <div className={styles.formGroup}>
              <label>Longitude</label>
              <input type="text" name="longitude" value={form.longitude} onChange={handleChange} placeholder="107.437491"/>
            </div>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Batal</button>
          <button className={styles.saveBtn} onClick={onSave}>
            <Save size={18} /> Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;