import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Installation {
    id: string
    installation_number: string
    name: string
    address: string
    street: string
    client_lat: number | null
    client_lng: number | null
    pee_lat: number
    pee_lng: number
    created_at?: string
}

// Helper functions
export async function getAllInstallations(onProgress?: (count: number) => void) {
    let allData: Installation[] = []
    let page = 0
    const pageSize = 1000
    let hasMore = true

    while (hasMore) {
        const { data, error, count } = await supabase
            .from('electrical_installations')
            .select('*', { count: 'exact' })
            .order('installation_number')
            .range(page * pageSize, (page + 1) * pageSize - 1)

        if (error) throw error

        if (data) {
            allData = [...allData, ...(data as Installation[])]
            if (onProgress) onProgress(allData.length)
        }

        hasMore = data.length === pageSize
        page++
    }

    return allData
}

export async function searchInstallations(query: string, mode: 'installation' | 'name' | 'address') {
    let column = 'installation_number'
    if (mode === 'name') column = 'name'
    if (mode === 'address') column = 'address'

    const { data, error } = await supabase
        .from('electrical_installations')
        .select('*')
        .ilike(column, `%${query}%`)
        .limit(100)

    if (error) throw error
    return data as Installation[]
}

export async function getInstallationByNumber(number: string) {
    const { data, error } = await supabase
        .from('electrical_installations')
        .select('*')
        .eq('installation_number', number)
        .single()

    if (error) throw error
    return data as Installation
}
