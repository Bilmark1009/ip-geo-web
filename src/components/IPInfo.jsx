import React from 'react';
import './IPInfo.css';

const IPInfo = ({ ipData, loading, error }) => {
  if (!ipData && !loading) {
    return <div className="ip-info-placeholder">Loading IP information...</div>;
  }

  if (loading) {
    return <div className="ip-info-placeholder">Fetching IP information...</div>;
  }

  if (error) {
    return <div className="ip-info-error">{error}</div>;
  }

  if (!ipData) {
    return null;
  }

  return (
    <div className="ip-info-card">
      <h3>IP Information</h3>
      <div className="ip-info-grid">
        <div className="info-item">
          <label>IP Address</label>
          <span className="info-value">{ipData.ip}</span>
        </div>
        <div className="info-item">
          <label>City</label>
          <span className="info-value">{ipData.city || 'N/A'}</span>
        </div>
        <div className="info-item">
          <label>Region</label>
          <span className="info-value">{ipData.region || 'N/A'}</span>
        </div>
        <div className="info-item">
          <label>Country</label>
          <span className="info-value">{ipData.country || 'N/A'}</span>
        </div>
        <div className="info-item">
          <label>Latitude</label>
          <span className="info-value">{ipData.loc?.split(',')[0] || 'N/A'}</span>
        </div>
        <div className="info-item">
          <label>Longitude</label>
          <span className="info-value">{ipData.loc?.split(',')[1] || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default IPInfo;
