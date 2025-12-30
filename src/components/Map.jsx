import React, { useEffect, useRef } from 'react';
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

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
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

    // Add new marker
    const customIcon = L.divIcon({
      html: `<div class="map-marker">📍</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
      className: 'custom-marker'
    });

    L.marker([latitude, longitude], { icon: customIcon })
      .bindPopup(`<div class="marker-popup"><strong>${city || 'Location'}</strong><br/>IP: ${ip}</div>`)
      .addTo(mapInstanceRef.current)
      .openPopup();

  }, [latitude, longitude, city, ip]);

  return (
    <div className="map-container">
      <h3>Location Map</h3>
      <div ref={mapRef} className="map"></div>
    </div>
  );
};

export default Map;
