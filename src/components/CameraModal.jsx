import React from 'react';
import { Save, X } from 'lucide-react';
import styles from '../css/Modal.module.css';

const CameraModal = ({ show, onClose, form, setForm, locations, isEditing, onSave }) => {
  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{isEditing ? 'Edit Kamera' : 'Tambah Kamera Baru'}</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label>Nama Kamera</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Contoh: CCTV Perempatan A"/>
          </div>
          <div className={styles.formGroup}>
            <label>Lokasi</label>
            <select name="location_id" value={form.location_id} onChange={handleChange}>
              <option value="">Pilih Lokasi</option>
              {locations.map(loc => (
                <option key={loc._id} value={loc._id}>{loc.name}</option>
              ))}
            </select>
          </div>
          <div className={`${styles.formGroup} ${styles.formGroupCheckbox}`}>
            <label htmlFor="enabled">Kamera Aktif (Enabled)</label>
            <input type="checkbox" id="enabled" name="enabled" checked={form.enabled} onChange={handleChange}/>
          </div>
          <hr style={{borderColor: '#334155'}}/>
          <p className={styles.formSubtitle}>Konfigurasi Source (RTSP)</p>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>IP Address</label>
              <input type="text" name="ip" value={form.ip} onChange={handleChange} placeholder="192.168.1.100"/>
            </div>
            <div className={styles.formGroup}>
              <label>Port</label>
              <input type="number" name="port" value={form.port} onChange={handleChange} placeholder="554"/>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Path</label>
            <input type="text" name="path" value={form.path} onChange={handleChange} placeholder="/Streaming/Channels/101"/>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Username</label>
              <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="admin"/>
            </div>
            <div className={styles.formGroup}>
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="******"/>
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

export default CameraModal;