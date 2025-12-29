
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

  // Open in Google Maps (works without API key)
  const openInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${centerLat},${centerLng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full h-full relative bg-gray-200 dark:bg-gray-800">
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 dark:text-gray-400 p-4">
        <span className="material-icons text-6xl mb-4 text-primary">location_on</span>
        <p className="text-sm font-medium mb-2">{installations.length} instalação(ões) encontrada(s)</p>
        <p className="text-xs text-center mb-4">
          Centro: {centerLat.toFixed(6)}, {centerLng.toFixed(6)}
        </p>
        <button
          onClick={openInMaps}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <span className="material-icons text-base">map</span>
          Ver no Google Maps
        </button>
      </div>

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
