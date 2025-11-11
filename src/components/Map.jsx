import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet

// --- PERBAIKAN UNTUK IKON LEAFLET ---
// Ini memperbaiki masalah umum di mana ikon marker tidak muncul
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41] // Titik anchor ikon
});
L.Marker.prototype.options.icon = DefaultIcon;
// --- AKHIR PERBAIKAN IKON ---


// Komponen helper untuk mengubah pusat peta saat video berganti
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 15); // Pindah dengan animasi
    }
  }, [center, zoom, map]); // Jalankan jika center berubah
  return null;
}

const MapComponent = ({ cameras, activeCamera, onMarkerClick }) => {
  // Tentukan posisi tengah berdasarkan kamera yang aktif
  const centerPosition = activeCamera 
    ? [activeCamera.latitude, activeCamera.longitude]
    : [-6.55, 107.44]; // Posisi default (misal: pusat Purwakarta) jika tidak ada

  return (
    <MapContainer 
      center={centerPosition} 
      zoom={13} 
      style={{ height: '100%', width: '100%', borderRadius: '16px' }}
    >
      {/* Helper untuk memindahkan peta */}
      <ChangeView center={centerPosition} zoom={16} />

      {/* Tile Peta (OpenStreetMap) */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Tampilkan Marker untuk setiap kamera */}
      {cameras.map((camera) => {
        // Pastikan kamera punya koordinat
        if (!camera.latitude || !camera.longitude) {
          return null; 
        }

        return (
          <Marker 
            key={camera._id} 
            position={[camera.latitude, camera.longitude]}
            eventHandlers={{
              click: () => {
                onMarkerClick(camera); 
              },
            }}
          >
            <Popup>
              <b>{camera.name}</b>
              <p>{camera.location_text}</p>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;