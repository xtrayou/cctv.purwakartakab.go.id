const SplashScreen = () => {
  return (
    <>
      <div className="login-page">
        <div className="group">
          <div className="ellipse" />
          <div className="div" />
          <div className="ellipse-2" />
        </div>

        <div className="content-center">
          <div className="judul">Selamat Datang di</div>
          <img
            src="/assets/logo.png"
            alt="Logo aplikasi Papais CCTV"
            className="logo" 
            
          />
        </div>
      </div>

      {/* CSS Langsung di File React */}
      <style>{`
        .login-page {
          background-color: #121212;
          min-height: 100vh;
          min-width: 100vw;
          overflow: hidden;
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-page .group {
          height: 925px;
          left: -100px;
          position: absolute;
          top: 50px;
          width: 1614px;
        }

        .login-page .ellipse {
          aspect-ratio: 1;
          background-color: #000cff80;
          border-radius: 178px;
          filter: blur(200px);
          height: 356px;
          left: 0;
          position: absolute;
          top: 391px;
          width: 356px;
        }

        .login-page .div {
          aspect-ratio: 1;
          background-color: #000cff80;
          border-radius: 178px;
          filter: blur(200px);
          height: 356px;
          left: 1258px;
          position: absolute;
          top: 0;
          width: 356px;
        }

        .login-page .ellipse-2 {
          aspect-ratio: 1;
          background-color: #ff610080;
          border-radius: 178px;
          filter: blur(150px);
          height: 356px;
          left: 100px;
          position: absolute;
          top: 569px;
          width: 356px;
        }

        .content-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
          position: relative;
        }

        .login-page .judul {
          color: #ffffff;
          font-family: "Inter-Regular", Helvetica, Arial, sans-serif;
          font-size: 36px;
          font-weight: 400;
          letter-spacing: 0;
          line-height: 1.2;
          white-space: nowrap;
          margin-bottom: 20px;
          text-align: center;
        }

        .login-page .logo {
          height: auto;
          width: 600px;
          max-width: 80vw;
          object-fit: contain;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .login-page .judul {
            font-size: 28px;
          }

          .login-page .logo {
            width: 250px;
          }
        }

        @media (max-width: 480px) {
          .login-page .judul {
            font-size: 24px;
          }

          .login-page .logo {
            width: 200px;
          }
        }
      `}</style>
    </>
  );
};

export default SplashScreen;