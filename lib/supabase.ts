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
export async function getAllInstallations() {
    const { data, error } = await supabase
        .from('electrical_installations')
        .select('*')
        .order('installation_number')

    if (error) throw error
    return data as Installation[]
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
