import React from "react";
import "./LoadingPage.css";

const LoadingPage: React.FC = () => {
  return (
    <div className="loading-page">
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>

        <div className="loading-content">
          <h1 className="loading-title">Initializing Chart</h1>
          <p className="loading-subtitle">Connecting to trading platform...</p>

          <div className="loading-progress">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <span className="progress-text">Establishing connection</span>
          </div>
        </div>

        <div className="loading-footer">
          <p className="loading-note">
            Please wait while we set up your trading environment
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
