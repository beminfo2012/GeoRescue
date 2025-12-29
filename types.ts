
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
  highlighted?: boolean
}

export enum SearchMode {
  NAME = 'Por Nome',
  INSTALLATION = 'Por Instalação',
  ADDRESS = 'Por Endereço'
}

export interface AppState {
  isLoggedIn: boolean
  selectedInstallation: Installation | null
  searchQuery: string
  searchMode: SearchMode
}

export interface SyncStatus {
  isSyncing: boolean
  lastSync: number | null
  error: string | null
  progress: number
  totalRecords: number
}

export interface User {
  id: string
  email: string
}
