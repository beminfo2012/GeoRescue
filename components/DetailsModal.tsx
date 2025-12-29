
import React, { useState } from 'react';
import { Installation } from '../types';

interface DetailsModalProps {
  installation: Installation;
  onClose: () => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ installation, onClose }) => {
  const [copied, setCopied] = useState(false);

  const openGoogleMaps = () => {
    const lat = installation.pee_lat;
    const lng = installation.pee_lng;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const viewOnGoogleMaps = () => {
    const lat = installation.pee_lat;
    const lng = installation.pee_lng;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const copyCoordinates = () => {
    const coords = `${installation.pee_lat}, ${installation.pee_lng}`;
    navigator.clipboard.writeText(coords);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-surface-light dark:bg-surface-dark h-[95vh] sm:h-auto sm:max-h-[90vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-transparent sm:border-gray-200 dark:sm:border-gray-800 animate-in slide-in-from-bottom duration-300">

        {/* Header */}
        <div className="pt-6 pb-4 px-6 relative flex flex-col items-center shrink-0 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <span className="material-icons text-2xl">close</span>
          </button>
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <span className="material-icons text-primary text-2xl">location_on</span>
          </div>
          <h1 className="text-xl font-bold tracking-wide uppercase text-center text-text-light dark:text-white">
            {installation.name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Instalação: <span className="font-mono text-primary dark:text-orange-500">#{installation.installation_number}</span>
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 no-scrollbar">
          {/* Address Info */}
          <div className="bg-white dark:bg-surface-variant-dark/30 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-start space-x-3">
              <span className="material-icons text-gray-400 mt-0.5">home</span>
              <div className="flex-1">
                <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-1">Endereço</label>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug">
                  {installation.address || installation.street || 'Não informado'}
                </p>
              </div>
            </div>
          </div>

          {/* Coordinates Info */}
          <div className="bg-white dark:bg-surface-variant-dark/30 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <span className="material-icons text-gray-400 mt-0.5">my_location</span>
                <div className="flex-1">
                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-1">Coordenadas (PEE)</label>
                  <p className="text-sm font-mono text-gray-900 dark:text-gray-100">
                    {installation.pee_lat.toFixed(6)}, {installation.pee_lng.toFixed(6)}
                  </p>
                  {installation.client_lat && installation.client_lng && (
                    <>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-1 mt-2">Coordenadas (Cliente)</label>
                      <p className="text-sm font-mono text-gray-900 dark:text-gray-100">
                        {installation.client_lat.toFixed(6)}, {installation.client_lng.toFixed(6)}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={copyCoordinates}
                className="ml-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Copiar coordenadas"
              >
                <span className="material-icons text-sm text-gray-400">
                  {copied ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>
          </div>

          {/* Map Preview */}
          <div className="bg-white dark:bg-surface-variant-dark/30 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="aspect-video bg-gray-200 dark:bg-gray-800 relative">
              <img
                src={`https://staticmap.openstreetmap.de/staticmap.php?center=${installation.pee_lat},${installation.pee_lng}&zoom=15&size=400x300&markers=${installation.pee_lat},${installation.pee_lng},red-pushpin`}
                alt="Mapa"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center text-gray-400">
                        <div class="text-center">
                          <span class="material-icons text-4xl mb-2">map</span>
                          <p class="text-xs">Preview do mapa</p>
                        </div>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-surface-light dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 shrink-0 space-y-3">
          {/* Primary Action - Navigate */}
          <button
            onClick={openGoogleMaps}
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
          >
            <span className="material-icons text-xl">navigation</span>
            Navegar no Google Maps
          </button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={viewOnGoogleMaps}
              className="bg-white dark:bg-surface-variant-dark border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium py-3 px-4 rounded-xl active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
            >
              <span className="material-icons text-base">map</span>
              Ver no Mapa
            </button>
            <button
              onClick={onClose}
              className="bg-white dark:bg-surface-variant-dark border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium py-3 px-4 rounded-xl active:scale-95 transition-all text-sm flex items-center justify-center"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
