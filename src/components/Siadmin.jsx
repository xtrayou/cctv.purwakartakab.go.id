import React, { useState } from 'react';
import { Camera, MapPin, Plus, Edit2, Trash2, Save, X, Eye, Video } from 'lucide-react';

const PapaisCCTVDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Cameras State
  const [cameras, setCameras] = useState([]);

  // Locations State
  const [locations, setLocations] = useState([]);

  // Camera Form State
  const [cameraForm, setCameraForm] = useState({
    name: '',
    locationId: '',
    status: 'active',
    ip: '',
    videoUrl: ''
  });

  // Location Form State
  const [locationForm, setLocationForm] = useState({
    name: '',
    address: '',
    lat: '',
    lng: ''
  });

  // Camera Functions
  const handleAddCamera = () => {
    setEditingCamera(null);
    setCameraForm({ name: '', locationId: '', status: 'active', ip: '', videoUrl: '' });
    setShowCameraModal(true);
  };

  const handleEditCamera = (camera) => {
    setEditingCamera(camera);
    setCameraForm(camera);
    setShowCameraModal(true);
  };

  const handleSaveCamera = () => {
    if (editingCamera) {
      setCameras(cameras.map(cam => cam.id === editingCamera.id ? { ...cameraForm, id: cam.id } : cam));
    } else {
      setCameras([...cameras, { ...cameraForm, id: Date.now() }]);
    }
    setShowCameraModal(false);
  };

  const handleDeleteCamera = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus kamera ini?')) {
      setCameras(cameras.filter(cam => cam.id !== id));
    }
  };

  // Location Functions
  const handleAddLocation = () => {
    setEditingLocation(null);
    setLocationForm({ name: '', address: '', lat: '', lng: '' });
    setShowLocationModal(true);
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setLocationForm(location);
    setShowLocationModal(true);
  };

  const handleSaveLocation = () => {
    if (editingLocation) {
      setLocations(locations.map(loc => loc.id === editingLocation.id ? { ...locationForm, id: loc.id } : loc));
    } else {
      setLocations([...locations, { ...locationForm, id: Date.now() }]);
    }
    setShowLocationModal(false);
  };

  const handleDeleteLocation = (id) => {
    const camerasInLocation = cameras.filter(cam => cam.locationId === id);
    if (camerasInLocation.length > 0) {
      alert('Tidak dapat menghapus lokasi yang masih memiliki kamera!');
      return;
    }
    if (confirm('Apakah Anda yakin ingin menghapus lokasi ini?')) {
      setLocations(locations.filter(loc => loc.id !== id));
    }
  };

  const getLocationName = (locationId) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : 'Unknown';
  };

  const getCameraCountByLocation = (locationId) => {
    return cameras.filter(cam => cam.locationId === locationId).length;
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          <Camera size={32} color="#fff" />
          <div>
            <div style={styles.logoTitle}>Dashboard</div>
            <div style={styles.logoSubtitle}>papais cctv</div>
          </div>
        </div>

        <div style={styles.menu}>
          <div 
            style={{...styles.menuItem, ...(activeMenu === 'dashboard' ? styles.menuItemActive : {})}}
            onClick={() => setActiveMenu('dashboard')}
          >
            <MapPin size={20} />
            <span>Dashboard</span>
          </div>
          <div 
            style={{...styles.menuItem, ...(activeMenu === 'camera' ? styles.menuItemActive : {})}}
            onClick={() => setActiveMenu('camera')}
          >
            <Camera size={20} />
            <span>Camera</span>
          </div>
          <div 
            style={{...styles.menuItem, ...(activeMenu === 'location' ? styles.menuItemActive : {})}}
            onClick={() => setActiveMenu('location')}
          >
            <MapPin size={20} />
            <span>Location</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.greeting}>Selamat datang di</h2>
            <h1 style={styles.title}>Dashboard Papais Cctv</h1>
          </div>
          <input 
            type="text" 
            placeholder="Cari Titik ..." 
            style={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Dashboard View */}
        {activeMenu === 'dashboard' && (
          <div style={styles.content}>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>
                  <Camera size={32} color="#4f46e5" />
                </div>
                <div>
                  <div style={styles.statValue}>{cameras.length}</div>
                  <div style={styles.statLabel}>Total Kamera</div>
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>
                  <MapPin size={32} color="#10b981" />
                </div>
                <div>
                  <div style={styles.statValue}>{locations.length}</div>
                  <div style={styles.statLabel}>Total Lokasi</div>
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>
                  <Eye size={32} color="#f59e0b" />
                </div>
                <div>
                  <div style={styles.statValue}>{cameras.filter(c => c.status === 'active').length}</div>
                  <div style={styles.statLabel}>Kamera Aktif</div>
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Kamera Terbaru</h3>
              <div style={styles.cameraGrid}>
                {cameras.slice(0, 6).map(camera => (
                  <div key={camera.id} style={styles.cameraCard}>
                    <div style={styles.cameraPreview}>
                      <Video size={48} color="#6b7280" />
                    </div>
                    <div style={styles.cameraInfo}>
                      <h4 style={styles.cameraName}>{camera.name}</h4>
                      <p style={styles.cameraLocation}>{getLocationName(camera.locationId)}</p>
                      <span style={{...styles.status, ...(camera.status === 'active' ? styles.statusActive : styles.statusInactive)}}>
                        {camera.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Camera Management */}
        {activeMenu === 'camera' && (
          <div style={styles.content}>
            <div style={styles.tableHeader}>
              <h3 style={styles.sectionTitle}>Manajemen Kamera</h3>
              <button style={styles.addButton} onClick={handleAddCamera}>
                <Plus size={20} />
                Tambah Kamera
              </button>
            </div>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Nama Kamera</th>
                    <th style={styles.th}>Lokasi</th>
                    <th style={styles.th}>IP Address</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {cameras.map(camera => (
                    <tr key={camera.id} style={styles.tr}>
                      <td style={styles.td}>{camera.name}</td>
                      <td style={styles.td}>{getLocationName(camera.locationId)}</td>
                      <td style={styles.td}>{camera.ip}</td>
                      <td style={styles.td}>
                        <span style={{...styles.status, ...(camera.status === 'active' ? styles.statusActive : styles.statusInactive)}}>
                          {camera.status === 'active' ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          <button style={styles.editBtn} onClick={() => handleEditCamera(camera)}>
                            <Edit2 size={16} />
                          </button>
                          <button style={styles.deleteBtn} onClick={() => handleDeleteCamera(camera.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Location Management */}
        {activeMenu === 'location' && (
          <div style={styles.content}>
            <div style={styles.tableHeader}>
              <h3 style={styles.sectionTitle}>Manajemen Lokasi</h3>
              <button style={styles.addButton} onClick={handleAddLocation}>
                <Plus size={20} />
                Tambah Lokasi
              </button>
            </div>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Nama Lokasi</th>
                    <th style={styles.th}>Alamat</th>
                    <th style={styles.th}>Koordinat</th>
                    <th style={styles.th}>Jumlah Kamera</th>
                    <th style={styles.th}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map(location => (
                    <tr key={location.id} style={styles.tr}>
                      <td style={styles.td}>{location.name}</td>
                      <td style={styles.td}>{location.address}</td>
                      <td style={styles.td}>{location.lat}, {location.lng}</td>
                      <td style={styles.td}>{getCameraCountByLocation(location.id)}</td>
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          <button style={styles.editBtn} onClick={() => handleEditLocation(location)}>
                            <Edit2 size={16} />
                          </button>
                          <button style={styles.deleteBtn} onClick={() => handleDeleteLocation(location.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Camera Modal */}
      {showCameraModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editingCamera ? 'Edit Kamera' : 'Tambah Kamera'}
              </h3>
              <button style={styles.closeBtn} onClick={() => setShowCameraModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nama Kamera</label>
                <input
                  type="text"
                  style={styles.input}
                  value={cameraForm.name}
                  onChange={(e) => setCameraForm({...cameraForm, name: e.target.value})}
                  placeholder="Masukkan nama kamera"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Lokasi</label>
                <select
                  style={styles.input}
                  value={cameraForm.locationId}
                  onChange={(e) => setCameraForm({...cameraForm, locationId: parseInt(e.target.value)})}
                >
                  <option value="">Pilih Lokasi</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>IP Address</label>
                <input
                  type="text"
                  style={styles.input}
                  value={cameraForm.ip}
                  onChange={(e) => setCameraForm({...cameraForm, ip: e.target.value})}
                  placeholder="192.168.1.100"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Video URL</label>
                <input
                  type="text"
                  style={styles.input}
                  value={cameraForm.videoUrl}
                  onChange={(e) => setCameraForm({...cameraForm, videoUrl: e.target.value})}
                  placeholder="rtsp://192.168.1.100:554/stream"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select
                  style={styles.input}
                  value={cameraForm.status}
                  onChange={(e) => setCameraForm({...cameraForm, status: e.target.value})}
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={() => setShowCameraModal(false)}>
                Batal
              </button>
              <button style={styles.saveBtn} onClick={handleSaveCamera}>
                <Save size={18} />
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editingLocation ? 'Edit Lokasi' : 'Tambah Lokasi'}
              </h3>
              <button style={styles.closeBtn} onClick={() => setShowLocationModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nama Lokasi</label>
                <input
                  type="text"
                  style={styles.input}
                  value={locationForm.name}
                  onChange={(e) => setLocationForm({...locationForm, name: e.target.value})}
                  placeholder="Masukkan nama lokasi"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Alamat</label>
                <input
                  type="text"
                  style={styles.input}
                  value={locationForm.address}
                  onChange={(e) => setLocationForm({...locationForm, address: e.target.value})}
                  placeholder="Masukkan alamat lengkap"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Latitude</label>
                <input
                  type="text"
                  style={styles.input}
                  value={locationForm.lat}
                  onChange={(e) => setLocationForm({...locationForm, lat: e.target.value})}
                  placeholder="-6.2088"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Longitude</label>
                <input
                  type="text"
                  style={styles.input}
                  value={locationForm.lng}
                  onChange={(e) => setLocationForm({...locationForm, lng: e.target.value})}
                  placeholder="106.8456"
                />
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={() => setShowLocationModal(false)}>
                Batal
              </button>
              <button style={styles.saveBtn} onClick={handleSaveLocation}>
                <Save size={18} />
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PapaisCCTVDashboard;