import React from 'react';
import { Plus, Edit2, Trash2, Search, Eye } from 'lucide-react';
import styles from '../css/TableContent.module.css';

const CameraTableContent = ({ cameras, locations, searchQuery, onSearchChange, onAddNew, onEdit, onDelete }) => {

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Manajemen Kamera</h1>
        <button className={styles.addBtn} onClick={onAddNew}>
          <Plus size={18} />
          Tambah Kamera
        </button>
      </div>
      <div className={styles.searchBar}>
        <Search size={20} />
        <input
          type="text"
          placeholder="Cari kamera..."
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Nama Kamera</th>
              <th>Lokasi</th>
              <th>Status</th>
              <th>IP Address</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(cameras) && cameras.map((cam) => (
              <tr key={cam.id}>
                <td>{cam.name}</td>
                
                <td>{cam.location_text}</td>
                
                <td>
                  <span className={`${styles.status} ${cam.enabled ? styles.active : styles.inactive}`}>
                    {cam.enabled ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </td>
                
                <td>{cam.source ? cam.source.ip : 'N/A'}</td>
                
                <td className={styles.actions}>
                  <button className={`${styles.actionBtn} ${styles.view}`} title="Lihat">
                    <Eye size={16} />
                  </button>
                  <button className={`${styles.actionBtn} ${styles.edit}`} title="Edit" onClick={() => onEdit(cam)}>
                    <Edit2 size={16} />
                  </button>
                  <button className={`${styles.actionBtn} ${styles.delete}`} title="Hapus" onClick={() => onDelete(cam)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CameraTableContent;