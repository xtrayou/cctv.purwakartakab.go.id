import React from "react";
import { PlayArrowFilledWrapper } from "./PlayArrowFilledWrapper";
import image from "./image.svg";
import judul from "./judul.png";
import logo from "./logo.png";
import "./style.css";
import vector2 from "./vector-2.svg";
import vector3 from "./vector-3.svg";
import vector4 from "./vector-4.svg";
import vector5 from "./vector-5.svg";
import vector from "./vector.svg";

export const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="group">
        <div className="ellipse" />

        <div className="div" />

        <div className="ellipse-2" />
      </div>

      <PlayArrowFilledWrapper />
      <div className="group-wrapper">
        <div className="group-2">
          <img className="judul" alt="Judul" src={judul} />

          <img className="logo" alt="Logo" src={logo} />

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
        <div className="si-user-alt-line">
          <div className="group-3">
            <img className="vector" alt="Vector" src={vector2} />

            <img className="img" alt="Vector" src={vector3} />
          </div>
        </div>
      </div>

      <div className="solar-lock-linear-wrapper">
        <div className="solar-lock-linear">
          <div className="group-4">
            <img className="vector-2" alt="Vector" src={vector4} />

            <img className="vector-3" alt="Vector" src={vector5} />
          </div>
        </div>
      </div>

      <div className="mingcute-user-fill">
        <div className="group-5">
          <img className="vector-4" alt="Vector" src={vector} />

          <img className="vector-5" alt="Vector" src={image} />
        </div>
      </div>
    </div>
  );
};
