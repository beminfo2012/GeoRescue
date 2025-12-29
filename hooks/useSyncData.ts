import { useState, useEffect, useCallback } from 'react'
import { getAllInstallations } from '../lib/supabase'
import { cacheInstallations, getSyncMetadata, getCacheStats } from '../lib/db'
import { useOnlineStatus } from './useOnlineStatus'

interface SyncState {
    isSyncing: boolean
    lastSync: number | null
    error: string | null
    progress: number
    totalRecords: number
}

export function useSyncData() {
    const isOnline = useOnlineStatus()
    const [syncState, setSyncState] = useState<SyncState>({
        isSyncing: false,
        lastSync: null,
        error: null,
        progress: 0,
        totalRecords: 0
    })

    // Load sync metadata on mount
    useEffect(() => {
        async function loadSyncMeta() {
            const stats = await getCacheStats()
            setSyncState(prev => ({
                ...prev,
                lastSync: stats.lastSync,
                totalRecords: stats.count
            }))
        }
        loadSyncMeta()
    }, [])

    // Auto-sync on mount if needed (>24h or no data)
    useEffect(() => {
        async function autoSync() {
            if (!isOnline) return

            const stats = await getCacheStats()
            const now = Date.now()
            const dayInMs = 24 * 60 * 60 * 1000

            // Sync if no data or last sync > 24h ago
            if (stats.count === 0 || !stats.lastSync || (now - stats.lastSync) > dayInMs) {
                await syncData()
            }
        }
        autoSync()
    }, [isOnline])

    const syncData = useCallback(async () => {
        if (!isOnline) {
            setSyncState(prev => ({
                ...prev,
                error: 'Sem conexão com a internet'
            }))
            return false
        }

        setSyncState(prev => ({
            ...prev,
            isSyncing: true,
            error: null,
            progress: 0
        }))

        try {
            // Fetch all installations from Supabase with progress tracking
            const installations = await getAllInstallations((count) => {
                setSyncState(prev => ({
                    ...prev,
                    progress: Math.min(Math.round((count / 21510) * 80), 80) // up to 80% for download
                }))
            })

            setSyncState(prev => ({
                ...prev,
                progress: 90 // Processing/Caching
            }))

            // Cache in IndexedDB
            await cacheInstallations(installations)

            setSyncState(prev => ({
                ...prev,
                progress: 100,
                isSyncing: false,
                lastSync: Date.now(),
                totalRecords: installations.length
            }))

            return true
        } catch (error) {
            console.error('Sync error:', error)
            setSyncState(prev => ({
                ...prev,
                isSyncing: false,
                error: error instanceof Error ? error.message : 'Erro ao sincronizar',
                progress: 0
            }))
            return false
        }
    }, [isOnline])

    return {
        ...syncState,
        syncData,
        isOnline
    }
}
