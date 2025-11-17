import React from 'react';
import { Save, X } from 'lucide-react';
import styles from '../css/Modal.module.css';

const LocationModal = ({ show, onClose, form, setForm, isEditing, onSave }) => {
  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      const newSlug = value.toLowerCase().replace(/ /g, '');
      
      setForm(prev => ({ 
        ...prev, 
        name: value,     
        slug: newSlug,   
        type: "Kecamatan" 
      }));
    } 
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
            <input 
              type="text" 
              name="name" 
              value={form.name || ''} 
              onChange={handleChange} 
              placeholder="Contoh: Purwakarta"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Slug</label><span>Slug adalah bagian dari URL</span>
            <input 
              type="text" 
              name="slug" 
              value={form.slug || ''} 
              readOnly 
              placeholder="Contoh: purwakarta"
              style={{ backgroundColor: '#1e293b' }}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Tipe Lokasi</label>
            <input 
              type="text" 
              name="type" 
              value="Kecamatan" // Nilai di-hardcode
              readOnly 
              style={{ backgroundColor: '#1e293b' }}
            />
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