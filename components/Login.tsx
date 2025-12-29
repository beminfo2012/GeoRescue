
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message === 'Invalid login credentials'
          ? 'Credenciais inválidas'
          : authError.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        onLogin();
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background-light dark:bg-background-dark antialiased">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl dark:shadow-none flex items-center justify-center mb-4 border border-gray-200 dark:border-border-dark relative overflow-hidden">
            <div className="absolute inset-0 bg-primary opacity-5"></div>
            {/* Logo image */}
            <img
              src="/logogeo.png"
              alt="GeoRescue Logo"
              className="w-20 h-20 object-contain"
              onError={(e) => {
                // Fallback to icon if logo not found
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <span className="material-icons text-primary text-5xl hidden">security</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">GeoRescue</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Sistema de Busca Defesa Civil</p>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl dark:shadow-none dark:border dark:border-border-dark p-8 w-full">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bem-vindo</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Faça login para acessar o sistema.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide" htmlFor="email">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-icons text-gray-400 text-lg">person</span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-border-dark rounded-lg leading-5 bg-white dark:bg-input-dark text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
                  id="email"
                  placeholder="seu@email.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide" htmlFor="password">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-icons text-gray-400 text-lg">lock</span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-border-dark rounded-lg leading-5 bg-white dark:bg-input-dark text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
                  id="password"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center space-x-2">
                <span className="material-icons text-red-600 dark:text-red-400 text-sm">error</span>
                <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
              </div>
            )}

            <button
              disabled={isLoading}
              className={`w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark shadow-md transition-all duration-200 transform active:scale-[0.98] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              type="submit"
            >
              {isLoading ? (
                <>
                  <span className="material-icons animate-spin mr-2">sync</span>
                  Acessando...
                </>
              ) : (
                'Entrar no Sistema'
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center space-y-1">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Defesa Civil
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Santa Maria de Jetibá
          </p>
        </div>
      </div>
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
    </div>
  );
};

export default Login;
