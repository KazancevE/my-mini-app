import React from 'react';
import './LoadingScreen.scss';

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <div className="loading-spinner">
        <div className="spinner-sector spinner-sector-primary"></div>
        <div className="spinner-sector spinner-sector-secondary"></div>
        <div className="spinner-sector spinner-sector-tertiary"></div>
      </div>
      <p className="loading-text">Загрузка...</p>
    </div>
  );
};

export default LoadingScreen;