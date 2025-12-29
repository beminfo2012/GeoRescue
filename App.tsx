
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import SearchScreen from './components/SearchScreen';
import DetailsModal from './components/DetailsModal';
import { Installation } from './types';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInstallation, setSelectedInstallation] = useState<Installation | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setSelectedInstallation(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <span className="material-icons text-primary text-5xl animate-spin mb-4">sync</span>
          <p className="text-sm text-subtext-light dark:text-subtext-dark">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SearchScreen
        onSelectInstallation={setSelectedInstallation}
        onLogout={handleLogout}
      />

      {selectedInstallation && (
        <DetailsModal
          installation={selectedInstallation}
          onClose={() => setSelectedInstallation(null)}
        />
      )}
    </div>
  );
};

export default App;
