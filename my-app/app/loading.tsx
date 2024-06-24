import React from "react";
import "./globals.css";
const loading = () => {
  return (
    <div className="loader  ">
      <div className="loader__bar"></div>
      <div className="loader__bar"></div>
      <div className="loader__bar"></div>
      <div className="loader__bar"></div>
      <div className="loader__bar"></div>
      <div className="loader__ball"></div>
    </div>
  );
};

export default loading;
