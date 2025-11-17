import React from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import styles from '../css/TableContent.module.css';

const LocationTableContent = ({ locations, searchQuery, onSearchChange, onAddNew, onEdit, onDelete }) => {
  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Manajemen Lokasi</h1>
        <button className={styles.addBtn} onClick={onAddNew}>
          <Plus size={18} />
          Tambah Lokasi
        </button>
      </div>
      <div className={styles.searchBar}>
        <Search size={20} />
        <input
          type="text"
          placeholder="Cari lokasi..."
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Nama Lokasi</th>
              <th>Alamat</th>
              <th>Koordinat (Lat, Lng)</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr key={loc._id}>
                <td>{loc.name}</td>
                <td>{loc.address}</td>
                <td>{loc.latitude}, {loc.longitude}</td>
                <td className={styles.actions}>
                  <button className={`${styles.actionBtn} ${styles.edit}`} title="Edit" onClick={() => onEdit(loc)}>
                    <Edit2 size={16} />
                  </button>
                  <button className={`${styles.actionBtn} ${styles.delete}`} title="Hapus" onClick={() => onDelete(loc)}>
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

export default LocationTableContent;