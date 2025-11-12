import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Plus, Edit2, Trash2, Save, X, Eye, Video, LogOut } from 'lucide-react';
import { Bg } from './bg';
import './Siadmin.css';

const PapaisCCTVDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    // Clear login data
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userInfo");
    
    // Redirect to login
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <Bg />
      
      {/* Mobile Menu Toggle */}
    
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        <Camera size={20} />
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay" 
          onClick={closeMobileMenu}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="logo">
          <img 
            src="/assets/logo.png" 
            alt="Logo" 
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'contain',
              marginRight: '8px'
            }}
          />
          <div>
            <div className="logo-title">Si Admin</div>
            <div className="logo-subtitle">Papais cctv</div>
          </div>
        </div>

        <div className="menu">
          <div 
            className={`menu-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveMenu('dashboard')}
          >
            <MapPin size={20} />
            <span>Dashboard</span>
          </div>
          <div 
            className={`menu-item ${activeMenu === 'camera' ? 'active' : ''}`}
            onClick={() => setActiveMenu('camera')}
          >
            <Camera size={20} />
            <span>Camera</span>
          </div>
          <div 
            className={`menu-item ${activeMenu === 'location' ? 'active' : ''}`}
            onClick={() => setActiveMenu('location')}
          >
            <MapPin size={20} />
            <span>Location</span>
          </div>
          
          {/* Logout Button */}
          <div 
            className="menu-item logout-item"
            onClick={handleLogout}
            style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <div className="header-left">
            <h2>Selamat datang di</h2>
            <h1>Dashboard Papais Cctv</h1>
          </div>
          <input 
            type="text" 
            placeholder="Cari Titik ..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Dashboard View */}
        {activeMenu === 'dashboard' && (
          <div className="content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Camera size={32} color="#4f46e5" />
                </div>
                <div>
                  <div className="stat-value">{cameras.length}</div>
                  <div className="stat-label">Total Kamera</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <MapPin size={32} color="#10b981" />
                </div>
                <div>
                  <div className="stat-value">{locations.length}</div>
                  <div className="stat-label">Total Lokasi</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Eye size={32} color="#f59e0b" />
                </div>
                <div>
                  <div className="stat-value">{cameras.filter(c => c.status === 'active').length}</div>
                  <div className="stat-label">Kamera Aktif</div>
                </div>
              </div>
            </div>

            <div className="section">
              <h3 className="section-title">Kamera Terbaru</h3>
              <div className="camera-grid">
                {cameras.slice(0, 6).map(camera => (
                  <div key={camera.id} className="camera-card">
                    <div className="camera-preview">
                      <Video size={48} color="#6b7280" />
                    </div>
                    <div className="camera-info">
                      <h4 className="camera-name">{camera.name}</h4>
                      <p className="camera-location">{getLocationName(camera.locationId)}</p>
                      <span className={`status ${camera.status === 'active' ? 'status-active' : 'status-inactive'}`}>
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
          <div className="content">
            <div className="table-header">
              <h3 className="section-title">Manajemen Kamera</h3>
              <button className="add-button" onClick={handleAddCamera}>
                <Plus size={20} />
                Tambah Kamera
              </button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nama Kamera</th>
                    <th>Lokasi</th>
                    <th>IP Address</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {cameras.map(camera => (
                    <tr key={camera.id}>
                      <td>{camera.name}</td>
                      <td>{getLocationName(camera.locationId)}</td>
                      <td>{camera.ip}</td>
                      <td>
                        <span className={`status ${camera.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                          {camera.status === 'active' ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="edit-btn" onClick={() => handleEditCamera(camera)}>
                            <Edit2 size={16} />
                          </button>
                          <button className="delete-btn" onClick={() => handleDeleteCamera(camera.id)}>
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
          <div className="content">
            <div className="table-header">
              <h3 className="section-title">Manajemen Lokasi</h3>
              <button className="add-button" onClick={handleAddLocation}>
                <Plus size={20} />
                Tambah Lokasi
              </button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nama Lokasi</th>
                    <th>Alamat</th>
                    <th>Koordinat</th>
                    <th>Jumlah Kamera</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map(location => (
                    <tr key={location.id}>
                      <td>{location.name}</td>
                      <td>{location.address}</td>
                      <td>{location.lat}, {location.lng}</td>
                      <td>{getCameraCountByLocation(location.id)}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="edit-btn" onClick={() => handleEditLocation(location)}>
                            <Edit2 size={16} />
                          </button>
                          <button className="delete-btn" onClick={() => handleDeleteLocation(location.id)}>
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
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingCamera ? 'Edit Kamera' : 'Tambah Kamera'}
              </h3>
              <button className="close-btn" onClick={() => setShowCameraModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nama Kamera</label>
                <input
                  type="text"
                  value={cameraForm.name}
                  onChange={(e) => setCameraForm({...cameraForm, name: e.target.value})}
                  placeholder="Masukkan nama kamera"
                />
              </div>
              <div className="form-group">
                <label>Lokasi</label>
                <select
                  value={cameraForm.locationId}
                  onChange={(e) => setCameraForm({...cameraForm, locationId: parseInt(e.target.value)})}
                >
                  <option value="">Pilih Lokasi</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>IP Address</label>
                <input
                  type="text"
                  value={cameraForm.ip}
                  onChange={(e) => setCameraForm({...cameraForm, ip: e.target.value})}
                  placeholder="192.168.1.100"
                />
              </div>
              <div className="form-group">
                <label>Video URL</label>
                <input
                  type="text"
                  value={cameraForm.videoUrl}
                  onChange={(e) => setCameraForm({...cameraForm, videoUrl: e.target.value})}
                  placeholder="rtsp://192.168.1.100:554/stream"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={cameraForm.status}
                  onChange={(e) => setCameraForm({...cameraForm, status: e.target.value})}
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowCameraModal(false)}>
                Batal
              </button>
              <button className="save-btn" onClick={handleSaveCamera}>
                <Save size={18} />
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingLocation ? 'Edit Lokasi' : 'Tambah Lokasi'}
              </h3>
              <button className="close-btn" onClick={() => setShowLocationModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nama Lokasi</label>
                <input
                  type="text"
                  value={locationForm.name}
                  onChange={(e) => setLocationForm({...locationForm, name: e.target.value})}
                  placeholder="Masukkan nama lokasi"
                />
              </div>
              <div className="form-group">
                <label>Alamat</label>
                <input
                  type="text"
                  value={locationForm.address}
                  onChange={(e) => setLocationForm({...locationForm, address: e.target.value})}
                  placeholder="Masukkan alamat lengkap"
                />
              </div>
              <div className="form-group">
                <label>Latitude</label>
                <input
                  type="text"
                  value={locationForm.lat}
                  onChange={(e) => setLocationForm({...locationForm, lat: e.target.value})}
                  placeholder="-6.2088"
                />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input
                  type="text"
                  value={locationForm.lng}
                  onChange={(e) => setLocationForm({...locationForm, lng: e.target.value})}
                  placeholder="106.8456"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowLocationModal(false)}>
                Batal
              </button>
              <button className="save-btn" onClick={handleSaveLocation}>
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