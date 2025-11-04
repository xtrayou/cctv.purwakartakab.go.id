import './App.css';
import { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import VideoPage from './components/VideoPage';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome'); // 'welcome' or 'video'

  return (
    <div className="App">
      {currentPage === 'welcome' ? (
        <WelcomePage onNavigate={() => setCurrentPage('video')} />
      ) : (
        <VideoPage onNavigate={() => setCurrentPage('welcome')} />
      )}
      
      {/* Navigation buttons for demo */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        gap: '10px',
        zIndex: 1000
      }}>
        <button
          onClick={() => setCurrentPage('welcome')}
          style={{
            padding: '12px 24px',
            background: currentPage === 'welcome' ? '#2772F8' : '#444',
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
          onClick={() => setCurrentPage('video')}
          style={{
            padding: '12px 24px',
            background: currentPage === 'video' ? '#2772F8' : '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Video Page
        </button>
      </div>
    </div>
  );
}

export default App;
