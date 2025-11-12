import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, UserRound } from "lucide-react";
import "./login-page.css";
import Footer from "../components/footer";

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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call - ganti dengan API sesungguhnya
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validasi credentials (ganti dengan validasi sesungguhnya)
      if (formData.username === "admin" && formData.password === "admin123") {
        // Set login status ke localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userInfo", JSON.stringify({
          username: formData.username,
          loginTime: new Date().toISOString()
        }));
        
        // Redirect ke splash screen
        navigate("/splashscreen");
      } else {
        setErrors({ general: "Username atau password salah!" });
      }
    } catch (error) {
      setErrors({ general: "Login gagal. Silakan coba lagi." });
    } finally {
      setIsLoading(false);
    }
  };

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

          {/* Demo credentials info */}
          <div style={{
            marginTop: '1rem',
            fontSize: '0.8rem',
            color: '#94a3b8',
            textAlign: 'center'
          }}>
            Demo: admin / admin123
          </div>
        </section>
        
      </main>
    </div>
  );
};

export default LoginPage;
export { Footer };