import React from 'react'
import { useSyncData } from '../hooks/useSyncData'

interface SyncIndicatorProps {
    className?: string
}

const SyncIndicator: React.FC<SyncIndicatorProps> = ({ className = '' }) => {
    const { isSyncing, lastSync, isOnline, syncData, progress, error } = useSyncData()

    const formatLastSync = (timestamp: number | null) => {
        if (!timestamp) return 'Nunca'

        const now = Date.now()
        const diff = now - timestamp
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return 'Agora'
        if (minutes < 60) return `${minutes}min atrás`
        if (hours < 24) return `${hours}h atrás`
        return `${days}d atrás`
    }

    return (
        <div className={`flex items-center space-x-3 ${className}`}>
            {/* Online/Offline Status */}
            <div className="flex items-center space-x-1.5">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                <span className="text-xs text-subtext-light dark:text-subtext-dark font-medium">
                    {isOnline ? 'Online' : 'Offline'}
                </span>
            </div>

            {/* Sync Status */}
            <div className="flex items-center space-x-2">
                {isSyncing ? (
                    <>
                        <span className="material-icons text-primary text-sm animate-spin">sync</span>
                        <span className="text-xs text-subtext-light dark:text-subtext-dark">
                            Sincronizando... {progress}%
                        </span>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => syncData()}
                            disabled={!isOnline}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Sincronizar dados"
                        >
                            <span className="material-icons text-sm text-subtext-light dark:text-subtext-dark">
                                sync
                            </span>
                        </button>
                        <span className="text-xs text-subtext-light dark:text-subtext-dark">
                            {formatLastSync(lastSync)}
                        </span>
                    </>
                )}
            </div>

            {/* Error Indicator */}
            {error && (
                <div className="flex items-center space-x-1 text-red-500">
                    <span className="material-icons text-sm">error</span>
                    <span className="text-xs">{error}</span>
                </div>
            )}
        </div>
    )
}

export default SyncIndicator
