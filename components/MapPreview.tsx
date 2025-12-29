
import React from 'react';
import { Installation } from '../types';

interface MapPreviewProps {
  installations?: Installation[];
}

const MapPreview: React.FC<MapPreviewProps> = ({ installations = [] }) => {
  if (installations.length === 0) {
    return (
      <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center text-subtext-light dark:text-subtext-dark">
          <span className="material-icons text-4xl mb-2">map</span>
          <p className="text-sm">Selecione uma instalação para ver no mapa</p>
        </div>
      </div>
    );
  }

  // Calculate center
  const lats = installations.map(i => i.pee_lat);
  const lngs = installations.map(i => i.pee_lng);
  const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
  const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

  // Use OpenStreetMap Static Map API (free, no API key needed)
  const zoom = 13;
  const width = 600;
  const height = 400;

  // Create markers for first installation
  const markerLat = installations[0].pee_lat;
  const markerLng = installations[0].pee_lng;

  // Using StaticMap.org (free OpenStreetMap static maps)
  const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${centerLat},${centerLng}&zoom=${zoom}&size=${width}x${height}&markers=${markerLat},${markerLng},red-pushpin`;

  return (
    <div className="w-full h-full relative bg-gray-200 dark:bg-gray-800">
      <img
        src={mapUrl}
        alt="Mapa de instalações"
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback if map fails to load
          e.currentTarget.style.display = 'none';
          const parent = e.currentTarget.parentElement;
          if (parent) {
            parent.innerHTML = `
              <div class="w-full h-full flex flex-col items-center justify-center text-gray-500 p-4">
                <span class="material-icons text-5xl mb-3">map</span>
                <p class="text-sm font-medium mb-2">${installations.length} instalação(ões) encontrada(s)</p>
                <p class="text-xs text-center">Centro: ${centerLat.toFixed(6)}, ${centerLng.toFixed(6)}</p>
              </div>
            `;
          }
        }}
      />

      {/* Overlay with count */}
      <div className="absolute top-2 left-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg px-3 py-1.5 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="material-icons text-primary text-sm">location_on</span>
          <span className="text-xs font-bold text-text-light dark:text-text-dark">
            {installations.length} {installations.length === 1 ? 'local' : 'locais'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MapPreview;
