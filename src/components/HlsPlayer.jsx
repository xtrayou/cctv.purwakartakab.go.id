import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const HlsPlayer = ({ url, controls = false, playing = false, muted = false, className = "" }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null); // <-- 1. Buat ref untuk menyimpan instance HLS

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 2. Hancurkan instance LAMA (jika ada) sebelum membuat yang baru
    // Ini memperbaiki bug 'destroy'
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // 3. Logika HLS
    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls; // <-- 4. Simpan instance BARU di ref
      
      hls.loadSource(url);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (playing) {
          video.play().catch(error => {
            console.error('Autoplay Gagal:', error);
          });
        }
      });

      // Menangani error HLS
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('HLS Network Error:', data);
              hls.startLoad(); // Coba lagi
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('HLS Media Error:', data);
              hls.recoverMediaError();
              break;
            default:
              console.error('HLS Error Fatal:', data);
              hls.destroy();
              break;
          }
        }
      });

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Dukungan HLS asli (misalnya Safari)
      video.src = url;
      if (playing) {
        video.play().catch(error => console.error('Autoplay Gagal:', error));
      }
    }

    // 5. Cleanup function untuk saat komponen benar-benar unmount
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [url, playing, muted]); // Tetap jalankan ulang effect jika prop ini berubah

  return (
    <video
      ref={videoRef}
      controls={controls}
      muted={muted}
      style={{ width: '100%', height: '100%' }}
      playsInline
      className={className} // <-- 6. Tambahkan className agar styling tetap berfungsi
    />
  );
};

export default HlsPlayer;