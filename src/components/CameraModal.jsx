import React, { useState, useEffect } from "react";
import { Save, X, Eye, EyeOff } from 'lucide-react'; 
import styles from '../css/Modal.module.css';

const PATH_PRESETS = {
  Hikvision: "/Streaming/Channels/101",
  Dahua: "/cam/realmonitor?channel=1&subtype=0",
  Lainnya: ""
};

const CameraModal = ({ show, onClose, form, setForm, locations, isEditing, onSave }) => {
  
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    if (form.brand === 'Hikvision') {
      setForm(prev => ({ ...prev, path: PATH_PRESETS.Hikvision }));
    } else if (form.brand === 'Dahua') {
      setForm(prev => ({ ...prev, path: PATH_PRESETS.Dahua }));
    } else if (form.brand === 'Lainnya') {
      setForm(prev => ({ ...prev, path: PATH_PRESETS.Lainnya }));
    }
  }, [form.brand, setForm]);
  
  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    if (name === 'name' && !isEditing) { 
      const newId = "cctv_" + value
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/[^a-z0-9_]/g, '');

      setForm(prev => ({
        ...prev,
        name: val,
        id: newId
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: val
      }));
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{isEditing ? 'Edit Kamera' : 'Tambah Kamera Baru'}</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
        </div>
        
        <div className={styles.modalBody}>
          {/* --- INFORMASI DASAR --- */}
          
          {!isEditing && (
            <div className={styles.formGroup}>
              <label>ID Kamera (Otomatis dari Nama)</label>
              <input 
                type="text" 
                name="id"
                value={form.id || ''} 
                readOnly 
                style={{ backgroundColor: '#1e293b' }}
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Nama Kamera</label>
            <input 
              type="text" 
              name="name" 
              value={form.name || ''} 
              onChange={handleChange} 
              placeholder="Contoh: CCTV Perempatan Parcom"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Kecamatan</label>
            <select name="location_id" value={form.location_id || ''} onChange={handleChange}>
              <option value="">Pilih Lokasi</option>
              {Array.isArray(locations) && locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option> 
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Lokasi (Alamat Spesifik)</label>
            <input 
              type="text" 
              name="location_text" 
              value={form.location_text || ''} 
              onChange={handleChange} 
              placeholder="Contoh: Jl. Letjen Jl. Basuki Rahmat"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Latitude</label>
              <input 
                type="number" 
                name="latitude" 
                value={form.latitude || ''} 
                onChange={handleChange} 
                placeholder="-6.551286"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Longitude</label>
              <input 
                type="number" 
                name="longitude" 
                value={form.longitude || ''} 
                onChange={handleChange} 
                placeholder="107.443749"
              />
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.formGroupCheckbox}`}>
            <label htmlFor="enabled">Kamera Aktif (Enabled)</label>
            <input type="checkbox" id="enabled" name="enabled" checked={form.enabled || false} onChange={handleChange}/>
          </div>
          
          <hr style={{borderColor: '#334155'}}/>
          
          
          <p className={styles.formSubtitle}>Fitur & Brand</p>
          <div className={styles.formRow}>
            {/* ... (Brand) ... */}
            <div className={styles.formGroup}>
              <label>Brand</label>
              <select name="brand" value={form.brand || ''} onChange={handleChange}>
                <option value="">Pilih Brand</option>
                <option value="Hikvision">Hikvision</option>
                <option value="Dahua">Dahua</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            {/* ... (PTZ/Audio) ... */}
            <div className={styles.formGroup} style={{ justifyContent: 'space-around' }}>
              <div className={`${styles.formGroup} ${styles.formGroupCheckbox}`}>
                <label htmlFor="ptz">Support PTZ</label>
                <input type="checkbox" id="ptz" name="ptz" checked={form.ptz || false} onChange={handleChange}/>
              </div>
              <div className={`${styles.formGroup} ${styles.formGroupCheckbox}`}>
                <label htmlFor="audio">Support Audio</label>
                <input type="checkbox" id="audio" name="audio" checked={form.audio || false} onChange={handleChange}/>
              </div>
            </div>
          </div>
          
          <hr style={{borderColor: '#334155'}}/>
          
          <p className={styles.formSubtitle}>Konfigurasi Source (RTSP)</p>
          {/* ... (IP, Port, Path, User, Pass) ... */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>IP Address</label>
              <input type="text" name="ip" value={form.ip || ''} onChange={handleChange} placeholder="10.232.88.57"/>
            </div>
            <div className={styles.formGroup}>
              <label>Port</label>
              <input type="number" name="port" value={form.port || 554} onChange={handleChange} placeholder="554"/>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Path (Otomatis terisi jika brand dipilih)</label>
            <input 
              type="text" 
              name="path" 
              value={form.path || ''} 
              onChange={handleChange} 
              placeholder="/Streaming/Channels/101"
              readOnly={form.brand === 'Hikvision' || form.brand === 'Dahua'}
              style={form.brand === 'Hikvision' || form.brand === 'Dahua' ? { backgroundColor: '#1e293b' } : {}}
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Username</label>
              <input type="text" name="username" value={form.username || 'admin'} onChange={handleChange} placeholder="admin"/>
            </div>
            <div className={styles.formGroup}>
              <label>Password</label>
              <div className={styles.passwordInputWrapper}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={form.password || ''} 
                  onChange={handleChange} 
                  placeholder="******"
                />
                <button 
                  type="button" 
                  className={styles.passwordToggleBtn} 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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