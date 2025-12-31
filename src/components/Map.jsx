import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

const Map = ({ latitude, longitude, city, ip }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!latitude || !longitude || !mapRef.current) return;

    // Initialize map if not already done
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([latitude, longitude], 10);

      // Add dark tile layer (CartoDB dark)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors & CARTO',
        maxZoom: 19,
        className: 'dark-tiles'
      }).addTo(mapInstanceRef.current);
    }

    // Update map view and marker
    mapInstanceRef.current.setView([latitude, longitude], 10);

    // Remove existing markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Add new marker with custom styling
    const customIcon = L.divIcon({
      html: `<div class="map-marker-wrapper"><div class="map-marker-pulse"></div><div class="map-marker-icon">📍</div></div>`,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [0, -50],
      className: 'custom-marker'
    });

    L.marker([latitude, longitude], { icon: customIcon })
      .bindPopup(`<div class="marker-popup"><div class="marker-title">${city || 'Location'}</div><div class="marker-ip">${ip}</div></div>`, {
        className: 'custom-popup'
      })
      .addTo(mapInstanceRef.current)
      .openPopup();

  }, [latitude, longitude, city, ip]);

  return (
    <motion.div
      className="map-container glass rounded-2xl overflow-hidden border border-slate-700/50"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div ref={mapRef} className="map" />
    </motion.div>
  );
};

export default Map;
