import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, UserRound } from "lucide-react";
import "./login-page.css";

const API_URL = "http://localhost:8000/api/admin";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Hapus error saat pengguna mulai mengetik
    if (errors[name] || errors.general) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
        general: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username wajib diisi";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password wajib diisi";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // MODIFIKASI: Ini adalah fungsi handleSubmit yang terhubung ke backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Tangkap pesan error dari backend (misal: "password salah")
        throw new Error(data.error || `Error ${response.status}: Login gagal`);
      }

      // --- LOGIN BERHASIL ---
      if (data.token) {
        // Simpan token ke localStorage
        localStorage.setItem('admin_token', data.token);
        
        // Arahkan ke dashboard admin
        navigate('/siadmin'); // Ganti dari /splashscreen
      } else {
        throw new Error('Token tidak diterima dari server.');
      }

    } catch (error) {
      // Tangkap error (baik dari fetch network atau dari throw di atas)
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // --- JSX (Tampilan Lama Anda) ---
  // (Tidak ada perubahan di bawah ini)
  return (
    <div className="login-page">
      {/* 1. Latar Belakang Dekoratif (Blobs) */}
      <div className="background-blobs">
        <div className="blob blob-blue-1" />
        <div className="blob blob-blue-2" />
        <div className="blob blob-orange" />
      </div>

      {/* 2. Konten Utama (Grid 2 Kolom) */}
      <main className="login-card">
        
        {/* Kolom Kiri: Branding */}
        <section className="branding-section">
          <img
            src="/assets/judul.png"
            alt="Judul Papais CCTV"
            className="branding-title-img"
          />
          <img
            src="/assets/logo.png"
            alt="Logo Purwakarta"
            className="branding-logo-img"
          />
          <p className="branding-description">
            Sistem monitoring CCTV yang dikelola oleh pemerintah daerah,
            seperti Pemerintah Kabupaten Purwakarta. Sistem ini menampilkan
            lokasi kamera CCTV yang terpasang di berbagai area publik,
            memungkinkan pengguna melihat siaran langsung melalui website
            resminya.
          </p>
        </section>

        {/* Kolom Kanan: Form Login */}
        <section className="login-form-section">
          <UserRound className="login-avatar" />
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <User className="input-icon" />
              <input
                type="text"
                name="username"
                className="input-field"
                placeholder="Username"
                aria-label="Username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            {/* Tampilkan error validasi username */}
            {errors.username && <div className="error-text-validation">{errors.username}</div>}

            <div className="input-group">
              <Lock className="input-icon" />
              <input
                type="password"
                name="password"
                className="input-field"
                placeholder="Password"
                aria-label="Password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            {/* Tampilkan error validasi password */}
            {errors.password && <div className="error-text-validation">{errors.password}</div>}

            {/* Tampilkan error umum (misal: "Password salah") */}
            {errors.general && (
              <div style={{
                color: '#ef4444',
                fontSize: '0.875rem',
                textAlign: 'center',
                marginBottom: '1rem'
              }}>
                {errors.general}
              </div>
            )}

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
          </form>

        </section>
        
      </main>
    </div>
  );
};

export default LoginPage;