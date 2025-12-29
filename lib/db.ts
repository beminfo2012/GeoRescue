import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { Installation } from './supabase'

interface GeoRescueDB extends DBSchema {
    installations: {
        key: string
        value: Installation
        indexes: {
            'by-number': string
            'by-name': string
        }
    }
    sync_metadata: {
        key: string
        value: {
            key: string
            timestamp: number
            count: number
        }
    }
}

let dbInstance: IDBPDatabase<GeoRescueDB> | null = null

export async function getDB() {
    if (dbInstance) return dbInstance

    dbInstance = await openDB<GeoRescueDB>('georescue-db', 1, {
        upgrade(db) {
            // Installations store
            if (!db.objectStoreNames.contains('installations')) {
                const installationStore = db.createObjectStore('installations', {
                    keyPath: 'id'
                })
                installationStore.createIndex('by-number', 'installation_number')
                installationStore.createIndex('by-name', 'name')
            }

            // Sync metadata store
            if (!db.objectStoreNames.contains('sync_metadata')) {
                db.createObjectStore('sync_metadata', {
                    keyPath: 'key'
                })
            }
        }
    })

    return dbInstance
}

// Cache all installations
export async function cacheInstallations(installations: Installation[]) {
    const db = await getDB()
    const tx = db.transaction('installations', 'readwrite')
    const store = tx.objectStore('installations')

    // Clear existing to ensure fresh state
    await store.clear()

    for (const installation of installations) {
        await store.put(installation)
    }

    await tx.done

    // Update sync metadata
    await setSyncMetadata('last_sync', {
        key: 'last_sync',
        timestamp: Date.now(),
        count: installations.length
    })
}

// Get all cached installations
export async function getAllCachedInstallations(): Promise<Installation[]> {
    const db = await getDB()
    return db.getAll('installations')
}

// Search cached installations
export async function searchCachedInstallations(
    query: string,
    mode: 'installation' | 'name' | 'address'
): Promise<Installation[]> {
    const db = await getDB()
    const allInstallations = await db.getAll('installations')

    const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    return allInstallations.filter(installation => {
        let searchField = ''
        if (mode === 'installation') searchField = installation.installation_number
        if (mode === 'name') searchField = installation.name
        if (mode === 'address') searchField = installation.address || installation.street || ''

        const normalizedField = searchField.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        return normalizedField.includes(normalizedQuery)
    }).slice(0, 100) // Limit to 100 results
}

// Get installation by number from cache
export async function getCachedInstallationByNumber(number: string): Promise<Installation | undefined> {
    const db = await getDB()
    const index = db.transaction('installations').store.index('by-number')
    return index.get(number)
}

// Sync metadata helpers
export async function getSyncMetadata(key: string) {
    const db = await getDB()
    return db.get('sync_metadata', key)
}

export async function setSyncMetadata(key: string, value: any) {
    const db = await getDB()
    await db.put('sync_metadata', value)
}

// Clear all cached data
export async function clearCache() {
    const db = await getDB()
    await db.clear('installations')
    await db.clear('sync_metadata')
}

// Get cache statistics
export async function getCacheStats() {
    const db = await getDB()
    const count = await db.count('installations')
    const syncMeta = await getSyncMetadata('last_sync')

    return {
        count,
        lastSync: syncMeta?.timestamp || null,
        lastSyncCount: syncMeta?.count || 0
    }
}
