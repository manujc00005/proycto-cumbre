'use client';

import { useState, useEffect } from 'react';
import { Lock, AlertCircle, Loader2, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GestorAuthProps {
  children: React.ReactNode;
}

const STORAGE_KEY = 'gestor_auth';
const MAX_ATTEMPTS = 3;

export default function GestorAuth({ children }: GestorAuthProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    // Verificar si ya está autenticado
    const authData = localStorage.getItem(STORAGE_KEY);
    if (authData) {
      const { authenticated, timestamp } = JSON.parse(authData);
      
      // Sesión válida por 24 horas
      const isValid = authenticated && (Date.now() - timestamp < 24 * 60 * 60 * 1000);
      
      if (isValid) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) return;
    
    setError('');

    try {
      // Validar PIN con API
      const response = await fetch('/api/gestor/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // PIN correcto
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          authenticated: true,
          timestamp: Date.now(),
        }));
        
        setIsAuthenticated(true);
        setPin('');
      } else {
        // PIN incorrecto
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= MAX_ATTEMPTS) {
          setIsBlocked(true);
          setError(`Demasiados intentos fallidos. Redirigiendo...`);
          
          // Redirigir después de 3 segundos
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } else {
          setError(`PIN incorrecto. Intento ${newAttempts}/${MAX_ATTEMPTS}`);
          setPin('');
        }
      }
    } catch (err) {
      setError('Error al validar el PIN');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
    setAttempts(0);
    setError('');
  };

  // Loading inicial
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  // Si está autenticado, mostrar contenido
  if (isAuthenticated) {
    return (
      <>
        {/* Botón de logout flotante */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg transition text-sm font-medium"
            title="Cerrar sesión"
          >
            <Lock className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
        {children}
      </>
    );
  }

  // Pantalla de autenticación
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Card de autenticación */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4">
              {isBlocked ? (
                <ShieldAlert className="w-8 h-8 text-red-500" />
              ) : (
                <Lock className="w-8 h-8 text-orange-500" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isBlocked ? 'Acceso Bloqueado' : 'Panel de Gestión'}
            </h1>
            <p className="text-zinc-400 text-sm">
              {isBlocked 
                ? 'Has excedido el número máximo de intentos'
                : 'Introduce el código de acceso'
              }
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${
              isBlocked
                ? 'bg-red-500/10 border-red-500/50 text-red-400'
                : 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400'
            }`}>
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm">{error}</p>
                {!isBlocked && (
                  <p className="text-xs mt-1 opacity-75">
                    Te quedan {MAX_ATTEMPTS - attempts} intentos
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          {!isBlocked && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="pin" className="block text-sm font-medium text-zinc-300 mb-2">
                  Código PIN
                </label>
                <input
                  id="pin"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••••"
                  autoFocus
                  maxLength={10}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-center text-lg tracking-widest font-mono focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                  required
                  disabled={isBlocked}
                />
              </div>

              {/* Indicador de intentos */}
              <div className="flex gap-2 justify-center">
                {[...Array(MAX_ATTEMPTS)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-12 rounded-full transition-colors ${
                      i < attempts
                        ? 'bg-red-500'
                        : 'bg-zinc-700'
                    }`}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={!pin || isBlocked}
                className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Acceder
              </button>
            </form>
          )}

          {/* Bloqueado - botón volver */}
          {isBlocked && (
            <button
              onClick={() => router.push('/')}
              className="w-full px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition"
            >
              Volver a Inicio
            </button>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center">
          <p className="text-zinc-500 text-xs">
            🔒 Acceso restringido · Solo personal autorizado
          </p>
        </div>
      </div>
    </div>
  );
}
