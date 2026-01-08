
import React, { useState, useEffect } from 'react';
import { Installation, SearchMode } from '../types';
import MapPreview from './MapPreview';
import SyncIndicator from './SyncIndicator';
import OfflineBanner from './OfflineBanner';
import { useSearch } from '../hooks/useSearch';
import { getCacheStats } from '../lib/db';

interface SearchScreenProps {
  onSelectInstallation: (inst: Installation) => void;
  onLogout: () => void;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ onSelectInstallation, onLogout }) => {
  const [searchMode, setSearchMode] = useState<SearchMode>(SearchMode.INSTALLATION);
  const [query, setQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('pt-BR', { hour12: false }));
  const [cacheStats, setCacheStats] = useState({ count: 0, lastSync: null as number | null });

  const { results, isLoading, error } = useSearch(query, searchMode);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('pt-BR', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadStats() {
      const stats = await getCacheStats();
      setCacheStats(stats);
    }
    loadStats();

    // Refresh stats every 10 seconds
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const getPlaceholder = () => {
    switch (searchMode) {
      case SearchMode.INSTALLATION:
        return 'Digite o número da UC (ex: 276.076)...';
      case SearchMode.NAME:
        return 'Digite o nome...';
      case SearchMode.ADDRESS:
        return 'Digite o endereço...';
      default:
        return 'Buscar...';
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Offline Banner */}
      <OfflineBanner />

      {/* Header */}
      <header className="bg-surface-light dark:bg-surface-dark px-4 py-3 shadow-sm z-10 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center justify-center border border-gray-200 dark:border-gray-700">
              <span className="material-icons text-primary">shield</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight dark:text-white">Sistema de Busca</h1>
              <p className="text-xs text-subtext-light dark:text-subtext-dark">Defesa Civil - GeoRescue</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <SyncIndicator />
            <button
              onClick={onLogout}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-subtext-light"
            >
              <span className="material-icons text-xl">logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Search Controls */}
      <div className="p-4 space-y-4 shrink-0 bg-background-light dark:bg-background-dark">
        <div className="flex bg-surface-variant-light dark:bg-surface-variant-dark rounded-lg p-1">
          {Object.values(SearchMode).map((mode) => (
            <button
              key={mode}
              onClick={() => setSearchMode(mode)}
              className={`flex-1 py-1.5 px-2 rounded text-xs sm:text-sm font-medium transition-all ${searchMode === mode
                ? 'bg-white dark:bg-gray-700 shadow-sm text-text-light dark:text-text-dark'
                : 'text-subtext-light dark:text-subtext-dark hover:text-text-light dark:hover:text-text-dark'
                }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons text-gray-400 text-xl">search</span>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full pl-10 pr-10 py-2.5 bg-surface-variant-light dark:bg-surface-variant-dark border-transparent rounded-lg focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black transition-colors text-text-light dark:text-text-dark placeholder-gray-500"
              placeholder={getPlaceholder()}
              type="text"
              inputMode={searchMode === SearchMode.INSTALLATION ? "numeric" : "text"}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              >
                <span className="material-icons text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg">close</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-between text-[10px] sm:text-xs text-subtext-light dark:text-subtext-dark px-1">
          <span>Total em Cache: {cacheStats.count.toLocaleString()}</span>
          <span>Resultados: {results.length}</span>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto no-scrollbar border-t border-gray-200 dark:border-gray-800">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <span className="material-icons text-primary text-3xl animate-spin">sync</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 text-red-500">
            <span className="material-icons mr-2">error</span>
            <span className="text-sm">{error}</span>
          </div>
        ) : results.length === 0 && query.length >= 2 ? (
          <div className="flex flex-col items-center justify-center py-12 text-subtext-light dark:text-subtext-dark">
            <span className="material-icons text-4xl mb-2">search_off</span>
            <span className="text-sm">Nenhum resultado encontrado</span>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-subtext-light dark:text-subtext-dark">
            <span className="material-icons text-4xl mb-2">search</span>
            <span className="text-sm">Digite para buscar Unidades Consumidoras</span>
          </div>
        ) : (
          results.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectInstallation(item)}
              className="p-4 border-b border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-surface-variant-dark transition-colors bg-white dark:bg-surface-dark"
            >
              <h3 className="font-bold text-sm text-text-light dark:text-text-dark uppercase">{item.name}</h3>
              <p className="text-xs font-bold text-primary mt-0.5">#{item.installation_number}</p>
              <p className="text-xs text-subtext-light dark:text-subtext-dark mt-1 truncate">
                {item.address || item.street}
              </p>
              <div className="flex items-center mt-1 text-[10px] text-subtext-light dark:text-subtext-dark">
                <span className="material-icons text-xs mr-1">location_on</span>
                <span>{item.pee_lat.toFixed(6)}, {item.pee_lng.toFixed(6)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Map Preview */}
      {results.length > 0 && (
        <div className="shrink-0 h-64 md:h-80 border-t border-gray-300 dark:border-gray-700">
          <MapPreview installations={results.slice(0, 10)} />
        </div>
      )}
    </div>
  );
};

export default SearchScreen;
