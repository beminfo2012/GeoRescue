
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

  // Calculate center and bounds
  const lats = installations.map(i => i.pee_lat);
  const lngs = installations.map(i => i.pee_lng);
  const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
  const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

  // Create markers string for Google Maps Static API
  const markers = installations.slice(0, 10).map((inst, idx) =>
    `markers=color:red%7Clabel:${idx + 1}%7C${inst.pee_lat},${inst.pee_lng}`
  ).join('&');

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Use Google Maps Static API if key is available, otherwise show placeholder
  const mapUrl = apiKey
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${centerLat},${centerLng}&zoom=13&size=600x400&${markers}&key=${apiKey}`
    : null;

  return (
    <div className="w-full h-full relative bg-gray-200 dark:bg-gray-800">
      {mapUrl ? (
        <img
          src={mapUrl}
          alt="Mapa de instalações"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-subtext-light dark:text-subtext-dark p-4">
          <span className="material-icons text-5xl mb-3">map</span>
          <p className="text-sm font-medium mb-2">{installations.length} instalação(ões) encontrada(s)</p>
          <p className="text-xs text-center">
            Centro: {centerLat.toFixed(6)}, {centerLng.toFixed(6)}
          </p>
          <p className="text-xs mt-2 text-center opacity-70">
            Configure VITE_GOOGLE_MAPS_API_KEY para visualizar o mapa
          </p>
        </div>
      )}

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
