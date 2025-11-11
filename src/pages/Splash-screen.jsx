
const SplashScreen = () => {
  return (
    <>
      <div className="login-page">
        <div className="group">
          <div className="ellipse" />
          <div className="div" />
          <div className="ellipse-2" />
        </div>

        <img
                  src="/assets/logo.png"
                  alt="Logo aplikasi Papais CCTV"
                />

        <div className="judul-wrapper">
          <div className="judul">Selamat Datang di</div>
        </div>


      </div>

      {/* CSS Langsung di File React */}
      <style>{`
        .login-page {
          background-color: #121212;
          min-height: 1024px;
          min-width: 1440px;
          overflow: hidden;
          position: relative;
          width: 100%;
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

        .login-page .logo {
          height: 78px;
          left: 409px;
          object-fit: cover;
          position: absolute;
          top: 454px;
          width: 621px;
        }

        .login-page .judul-wrapper {
          display: flex;
          height: 98px;
          left: 466px;
          position: absolute;
          top: 356px;
          width: 510px;
        }

        .login-page .judul {
          color: #ffffff;
          font-family: "Inter-Regular", Helvetica, Arial, sans-serif;
          font-size: 50px;
          font-weight: 400;
          height: 98px;
          letter-spacing: 0;
          line-height: 100px;
          white-space: nowrap;
        }
      `}</style>
    </>
  );
};

export default SplashScreen;