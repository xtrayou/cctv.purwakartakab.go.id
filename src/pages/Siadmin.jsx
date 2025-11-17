import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom'; 
import { Camera, MapPin, Video } from 'lucide-react';

// Pastikan path CSS ini benar sesuai struktur folder Anda
import styles from '../css/Siadmin.module.css';
import statsStyles from '../css/Stats.module.css';

// Impor komponen-komponen anak
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHeader from '../components/DashboardHeader';
import CameraTableContent from '../components/CameraTableContent';
import LocationTableContent from '../components/LocationTableContent';
import CameraModal from '../components/CameraModal';
import LocationModal from '../components/LocationModal';

// --- Konstanta API (Tidak Berubah) ---
const API_URL_PUBLIC = 'http://localhost:8000/api';
const API_URL_ADMIN = 'http://localhost:8000/api/admin';
const getToken = () => localStorage.getItem('admin_token');
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});


const PapaisCCTVDashboard = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cameras, setCameras] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State Form (Struktur flat untuk form)
  const [cameraForm, setCameraForm] = useState({
    name: '',
    location_id: '',
    enabled: true,
    ip: '', port: 554, path: '', username: 'admin', password: ''
  });
  const [locationForm, setLocationForm] = useState({
    name: '', slug: '', type: 'Kecamatan'
  });

  // --- LOGIKA & HANDLER (Tidak Berubah) ---

  // Fetching Data
  const fetchCameras = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL_PUBLIC}/cameras`);
      if (!response.ok) throw new Error('Gagal mengambil data kamera');
      const data = await response.json();
      setCameras(data || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchLocations = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL_PUBLIC}/locations`);
      if (!response.ok) throw new Error('Gagal mengambil data lokasi');
      const data = await response.json();
      setLocations(data || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // useEffect untuk memuat data awal
  useEffect(() => {
    // Anda bisa tambahkan pengecekan token di sini
    if (!getToken()) {
      navigate('/login'); // Arahkan ke login jika tidak ada token
      return;
    }

    setIsLoading(true);
    Promise.all([fetchCameras(), fetchLocations()]).then(() => {
      setIsLoading(false);
    });
  }, [fetchCameras, fetchLocations, navigate]);

  // Handler Logout
  const handleLogout = () => {
    localStorage.removeItem('admin_token'); 
    navigate('/login');
  };

  // --- Handler Kamera ---
  const handleAddNewCamera = () => {
    setEditingCamera(null);
    setCameraForm({
      name: '', location_id: '', enabled: true,
      ip: '', port: 554, path: '', username: 'admin', password: ''
    });
    setShowCameraModal(true);
  };

  const handleEditCamera = (camera) => {
    setEditingCamera(camera);
    setCameraForm({
      name: camera.name,
      location_id: camera.location_id,
      enabled: camera.enabled,
      ip: camera.source.ip,
      port: camera.source.port,
      path: camera.source.path,
      username: camera.source.username,
      password: camera.source.password
    });
    setShowCameraModal(true);
  };

  const handleSaveCamera = async () => {
    // 'Nest' data form agar sesuai schema backend
    const payload = {
      name: cameraForm.name,
      location_id: cameraForm.location_id,
      enabled: cameraForm.enabled,
      location_text: locations.find(l => l._id === cameraForm.location_id)?.slug || '',
      latitude: locations.find(l => l._id === cameraForm.location_id)?.latitude || 0,
      longitude: locations.find(l => l._id === cameraForm.location_id)?.longitude || 0,
      source: {
        type: 'RTSP',
        ip: cameraForm.ip,
        port: Number(cameraForm.port),
        path: cameraForm.path,
        username: cameraForm.username,
        password: cameraForm.password
      },
      features: { ptz: false, audio: false, brand: '' }
    };

    const url = editingCamera
      ? `${API_URL_ADMIN}/cameras/${editingCamera._id}`
      : `${API_URL_ADMIN}/cameras`;
    const method = editingCamera ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload) 
      });
      if (!response.ok) throw new Error('Gagal menyimpan kamera');
      setShowCameraModal(false);
      setEditingCamera(null);
      fetchCameras(); // Refresh data
    } catch (error) {
      console.error("Error saving camera:", error);
    }
  };

  const handleDeleteCamera = async (camera) => {
    if (!window.confirm(`Anda yakin ingin menghapus kamera "${camera.name}"?`)) return;
    try {
      const response = await fetch(`${API_URL_ADMIN}/cameras/${camera._id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Gagal menghapus kamera');
      fetchCameras(); // Refresh data
    } catch (error) {
      console.error("Error deleting camera:", error);
    }
  };

  // --- Handler Lokasi ---
  const handleAddNewLocation = () => {
    setEditingLocation(null);
    setLocationForm({ name: '', slug: '', type: 'Kecamatan' });
    setShowLocationModal(true);
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setLocationForm({
      name: location.name,
      slug: location.slug,
      type: location.type
    });
    setShowLocationModal(true);
  };

  const handleSaveLocation = async () => {
    const payload = {
      name: locationForm.name,
      slug: locationForm.slug,
      type: locationForm.type
    };

    const url = editingLocation
      ? `${API_URL_ADMIN}/locations/${editingLocation.id}`
      : `${API_URL_ADMIN}/locations`;
    const method = editingLocation ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Gagal menyimpan lokasi');
      setShowLocationModal(false);
      setEditingLocation(null);
      fetchLocations(); // Refresh data
      fetchCameras(); // Refresh kamera (krn location_text mungkin berubah)
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };
  
  const handleDeleteLocation = async (location) => {
    if (!window.confirm(`Anda yakin ingin menghapus lokasi "${location.name}"?`)) return;
    try {
      const response = await fetch(`${API_URL_ADMIN}/locations/${location.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Gagal menghapus lokasi');
      fetchLocations(); // Refresh data
      fetchCameras(); // Refresh data
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // --- Filter (useMemo tidak berubah) ---
  const filteredCameras = useMemo(() => 
    cameras.filter(cam =>
      (cam.name && cam.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (cam.location_text && cam.location_text.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (cam.source && cam.source.ip && cam.source.ip.toLowerCase().includes(searchQuery.toLowerCase()))
    ), [cameras, searchQuery]
  );

  const filteredLocations = useMemo(() =>
    locations.filter(loc =>
      (loc.name && loc.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (loc.slug && loc.slug.toLowerCase().includes(searchQuery.toLowerCase()))
    ), [locations, searchQuery]
  );

  // --- JSX ---
  return (
    <div className={styles.dashboardContainer}>
      <DashboardSidebar
        onLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      <div className={styles.mainContent}>
        <DashboardHeader
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onLogout={handleLogout}
        />

        <main className={styles.dashboardMain}>
          {isLoading ? (
            <div className={styles.loadingSpinner}></div> 
          ) : (
            <Routes>
              
              <Route index element={
                <div className={statsStyles.statsGrid}>
                  <div className={statsStyles.statCard}>
                    <Camera size={32} />
                    <div>
                      <h3>Total Kamera</h3>
                      <span>{cameras.length}</span>
                    </div>
                  </div>
                  <div className={statsStyles.statCard}>
                    <MapPin size={32} />
                    <div>
                      <h3>Total Lokasi</h3>
                      <span>{locations.length}</span>
                    </div>
                  </div>
                  <div className={statsStyles.statCard}>
                    <Video size={32} />
                    <div>
                      <h3>Kamera Aktif</h3>
                      <span>{cameras.filter(c => c.enabled).length}</span>
                    </div>
                  </div>
                </div>
              } />

              <Route path="cameras" element={
                <CameraTableContent
                  cameras={filteredCameras}
                  locations={locations}
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                  onAddNew={handleAddNewCamera}
                  onEdit={handleEditCamera}
                  onDelete={handleDeleteCamera}
                />
              } />

              <Route path="locations" element={
                <LocationTableContent
                  locations={filteredLocations}
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                  onAddNew={handleAddNewLocation}
                  onEdit={handleEditLocation}
                  onDelete={handleDeleteLocation}
                />
              } />

              <Route path="*" element={<h2>Halaman tidak ditemukan</h2>} />
              
            </Routes>
          )}
        </main>
      </div>

      <CameraModal
        show={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        form={cameraForm}
        setForm={setCameraForm}
        locations={locations}
        isEditing={!!editingCamera}
        onSave={handleSaveCamera}
      />
      
      <LocationModal
        show={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        form={locationForm}
        setForm={setLocationForm}
        isEditing={!!editingLocation}
        onSave={handleSaveLocation}
      />
    </div>
  );
};

export default PapaisCCTVDashboard;