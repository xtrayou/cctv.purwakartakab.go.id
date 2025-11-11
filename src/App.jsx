import './App.css';
import 'leaflet/dist/leaflet.css';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import VideoPage from './pages/VideoPage';
import Siadmin from './components/Siadmin';

function NavigationButtons() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Fungsi pengecekan yang lebih baik untuk highlight tombol
  const isVideoPageActive = () => {
    return currentPath === '/VideoPage' || currentPath.startsWith('/VideoPage/');
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      display: 'flex',
      gap: '10px',
      zIndex: 1000,
      flexWrap: 'wrap',
      justifyContent: 'flex-end'
    }}>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '12px 24px',
          background: currentPath === '/' ? '#2772F8' : '#444',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        Welcome Page
      </button>
      <button
        // MODIFIKASI: Ubah ke '/VideoPage' (V besar)
        onClick={() => navigate('/VideoPage')}
        style={{
          padding: '12px 24px',
          // MODIFIKASI: Gunakan fungsi pengecekan baru
          background: isVideoPageActive() ? '#2772F8' : '#444',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        Video Page
      </button>
      <button
        onClick={() => navigate('/siadmin')}
        style={{
          padding: '12px 24px',
          background: currentPath === '/siadmin' ? '#2772F8' : '#444',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        SI Admin
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/VideoPage" element={<VideoPage />} />
          <Route path="/VideoPage/:id" element={<VideoPage />} />
          <Route path="/siadmin" element={<Siadmin />} />
        </Routes>
        
        <NavigationButtons />
      </div>
    </Router>
  );
}

export default App;