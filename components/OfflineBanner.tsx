import React, { useState } from 'react'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

const OfflineBanner: React.FC = () => {
    const isOnline = useOnlineStatus()
    const [dismissed, setDismissed] = useState(false)

    if (isOnline || dismissed) return null

    return (
        <div className="bg-orange-100 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-800 px-4 py-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="material-icons text-orange-600 dark:text-orange-400 text-sm">
                        wifi_off
                    </span>
                    <p className="text-xs text-orange-800 dark:text-orange-300 font-medium">
                        Modo Offline - Usando dados em cache. Buscas e visualização funcionam normalmente.
                    </p>
                </div>
                <button
                    onClick={() => setDismissed(true)}
                    className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200"
                >
                    <span className="material-icons text-sm">close</span>
                </button>
            </div>
        </div>
    )
}

export default OfflineBanner
