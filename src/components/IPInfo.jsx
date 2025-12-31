import React from 'react';
import { motion } from 'framer-motion';
import { Loader, AlertCircle } from 'lucide-react';
import './IPInfo.css';

const IPInfo = ({ ipData, loading, error }) => {
  if (loading) {
    return (
      <div className="ip-info-skeleton glass">
        <div className="skeleton-header">
          <Loader className="w-5 h-5 animate-spin text-cyan-400" />
          <span className="text-slate-400 font-mono">Scanning network...</span>
        </div>
        <div className="ip-info-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="info-item opacity-50">
              <div className="skeleton-label" />
              <div className="skeleton-value" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="ip-info-error glass"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AlertCircle className="w-5 h-5" />
        {error}
      </motion.div>
    );
  }

  if (!ipData) {
    return <div className="ip-info-placeholder">Loading IP information...</div>;
  }

  const infoItems = [
    { label: 'IP Address', value: ipData.ip, isMonospace: true },
    { label: 'City', value: ipData.city || 'N/A' },
    { label: 'Region', value: ipData.region || 'N/A' },
    { label: 'Country', value: ipData.country || 'N/A' },
    { label: 'Latitude', value: ipData.loc?.split(',')[0] || 'N/A', isMonospace: true },
    { label: 'Longitude', value: ipData.loc?.split(',')[1] || 'N/A', isMonospace: true },
  ];

  return (
    <motion.div
      className="ip-info-card glass"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="ip-info-grid">
        {infoItems.map((item, idx) => (
          <motion.div
            key={idx}
            className="info-item"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <label className="info-label">{item.label}</label>
            <span className={`info-value ${item.isMonospace ? 'font-mono' : ''}`}>
              {item.value}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default IPInfo;
