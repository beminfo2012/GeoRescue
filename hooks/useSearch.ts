import { useState, useEffect, useCallback } from 'react'
import { Installation, SearchMode } from '../types'
import { searchInstallations } from '../lib/supabase'
import { searchCachedInstallations } from '../lib/db'
import { useOnlineStatus } from './useOnlineStatus'

export function useSearch(query: string, mode: SearchMode) {
    const [results, setResults] = useState<Installation[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const isOnline = useOnlineStatus()

    const search = useCallback(async () => {
        if (!query || query.length < 2) {
            setResults([])
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            let searchMode: 'installation' | 'name' | 'address' = 'installation'
            if (mode === SearchMode.NAME) searchMode = 'name'
            if (mode === SearchMode.ADDRESS) searchMode = 'address'

            let data: Installation[]

            if (isOnline) {
                // Try online first
                try {
                    data = await searchInstallations(query, searchMode)
                } catch (err) {
                    // Fallback to cache if online search fails
                    console.warn('Online search failed, using cache:', err)
                    data = await searchCachedInstallations(query, searchMode)
                }
            } else {
                // Use cache when offline
                data = await searchCachedInstallations(query, searchMode)
            }

            setResults(data)
        } catch (err) {
            console.error('Search error:', err)
            setError(err instanceof Error ? err.message : 'Erro ao buscar')
            setResults([])
        } finally {
            setIsLoading(false)
        }
    }, [query, mode, isOnline])

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            search()
        }, 300)

        return () => clearTimeout(timer)
    }, [search])

    return { results, isLoading, error }
}
