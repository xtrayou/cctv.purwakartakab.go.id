import React from "react";
import { User, Lock, UserRound } from "lucide-react";
import "./login-page.css";

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="group">
        <div className="ellipse" />
        <div className="div" />
        <div className="ellipse-2" />
      </div>

      <div className="group-wrapper">
        <div className="group-2">
          <img
                    src="/assets/judul.png"
                    alt="Logo aplikasi Papais CCTV"
                    
        
                  />
          
          <img
                    src="/assets/logo.png"
                    alt="Logo aplikasi Papais CCTV"
                
                  />

          <p className="text-wrapper">
            CCTV monitoring system managed by a regional government, such as the
            Purwakarta Regency Government. This system displays the locations of
            CCTV cameras installed in various public areas, allowing users to
            view the real-time feeds through its official website.
          </p>
        </div>
      </div>

      <div className="frame">
        <div className="text-wrapper-2">Login</div>
      </div>

      <div className="si-user-alt-line-wrapper">
        <User className="si-user-alt-line" />
      </div>

      <div className="solar-lock-linear-wrapper">
        <Lock className="solar-lock-linear" />
      </div>

      <UserRound className="mingcute-user-fill" />
    </div>
  );
};
    export default LoginPage;