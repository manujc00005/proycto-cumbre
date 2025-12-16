// ========================================
// TABLA RGPD CON API UNIFICADA
// components/gestor/rgpd-table-unified.tsx
// ========================================

'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface RGPDUser {
  id: string;
  name: string;
  email: string;
  type: 'member' | 'event_only' | 'both';
  member_id?: string | null;
  member_number?: string | null;
  privacy_policy_version: string;
  whatsapp_consent: boolean;
  whatsapp_revoked_at: Date | null;
  marketing_consent: boolean | null;
  marketing_revoked_at: Date | null;
  event_registrations?: Array<{
    event_name: string;
    event_slug: string;
    registered_at: Date;
  }>;
}

interface Stats {
  total: number;
  members_only: number;
  events_only: number;
  both: number;
  whatsapp_active: number;
  marketing_active: number;
}

export default function RGPDTableUnified() {
  const [users, setUsers] = useState<RGPDUser[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'member' | 'event_only' | 'both'>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gestor/rgpd-users');
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching RGPD users:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    return user.type === filter;
  });

  // ========================================
  // ACCIONES - API UNIFICADA
  // ========================================

  const handleRevokeConsent = async (userId: string, email: string, consentType: 'whatsapp' | 'marketing') => {
    const label = consentType === 'whatsapp' ? 'WhatsApp' : 'Marketing';
    
    if (!confirm(`¿Revocar ${label} de ${email}?`)) return;

    try {
      const response = await fetch('/api/gestor/revoke-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, consentType })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`${label} revocado correctamente`);
        fetchUsers();
      } else {
        toast.error(data.error || `Error al revocar ${label}`);
      }
    } catch (error) {
      toast.error(`Error al revocar ${label}`);
    }
  };

  const handleDeleteConsent = async (userId: string, email: string) => {
    const reason = prompt(`¿Motivo de eliminación para ${email}?`);
    if (reason === null) return; // Cancelado

    try {
      const response = await fetch('/api/gestor/rgpd/soft-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reason: reason || undefined })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Usuario eliminado (soft delete)');
        fetchUsers();
      } else {
        toast.error(data.error || 'Error al eliminar');
      }
    } catch (error) {
      toast.error('Error al eliminar consentimientos');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header con estadísticas */}
      <div className="bg-zinc-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Gestión RGPD</h2>
        <p className="text-zinc-400 mb-6">Protección de datos y consentimientos</p>
        
        {/* Warning */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="font-bold text-yellow-500 mb-1">Uso responsable</h3>
              <p className="text-sm text-yellow-200/80">
                Las acciones de revocación y soft delete son permanentes. Usa estas funciones solo cuando sea necesario por cumplimiento RGPD o solicitud del usuario.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-xs text-zinc-400 uppercase">Total usuarios</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400">{stats.members_only}</div>
              <div className="text-xs text-blue-300 uppercase">Solo miembros</div>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-400">{stats.events_only}</div>
              <div className="text-xs text-orange-300 uppercase">Solo eventos</div>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-400">{stats.both}</div>
              <div className="text-xs text-purple-300 uppercase">Ambos</div>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">{stats.whatsapp_active}</div>
              <div className="text-xs text-green-300 uppercase">WhatsApp activo</div>
            </div>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'all'
              ? 'bg-orange-500 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          Todos ({stats?.total || 0})
        </button>
        <button
          onClick={() => setFilter('member')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'member'
              ? 'bg-blue-500 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          Solo miembros ({stats?.members_only || 0})
        </button>
        <button
          onClick={() => setFilter('event_only')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'event_only'
              ? 'bg-orange-500 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          Solo eventos ({stats?.events_only || 0})
        </button>
        <button
          onClick={() => setFilter('both')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'both'
              ? 'bg-purple-500 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          Ambos ({stats?.both || 0})
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase">Nombre</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase">Tipo</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase">Versión</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-zinc-400 uppercase">WhatsApp</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-zinc-400 uppercase">Marketing</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-zinc-400 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-800/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{user.name}</span>
                      {user.member_number && (
                        <span className="text-xs text-zinc-500">#{user.member_number}</span>
                      )}
                    </div>
                    {user.event_registrations && user.event_registrations.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {user.event_registrations.map((event, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30"
                          >
                            {event.event_name}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-zinc-300 text-sm">{user.email}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.type === 'member' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        👤 Miembro
                      </span>
                    )}
                    {user.type === 'event_only' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">
                        🎫 Evento
                      </span>
                    )}
                    {user.type === 'both' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        ⭐ Ambos
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-purple-500/20 text-purple-400">
                      v{user.privacy_policy_version}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.whatsapp_consent && !user.whatsapp_revoked_at ? (
                      <svg className="w-5 h-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : user.whatsapp_revoked_at ? (
                      <span className="text-xs text-red-400">Revocado</span>
                    ) : (
                      <span className="text-xs text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.marketing_consent !== null ? (
                      user.marketing_consent && !user.marketing_revoked_at ? (
                        <svg className="w-5 h-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : user.marketing_revoked_at ? (
                        <span className="text-xs text-red-400">Revocado</span>
                      ) : (
                        <span className="text-xs text-zinc-600">—</span>
                      )
                    ) : (
                      <span className="text-xs text-zinc-600">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      
                      {/* Revocar Marketing */}
                      {user.marketing_consent && !user.marketing_revoked_at && (
                        <button
                          onClick={() => handleRevokeConsent(user.id, user.email, 'marketing')}
                          className="p-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg transition"
                          title="Revocar Marketing"
                        >
                          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </button>
                      )}

                      {/* Revocar WhatsApp (solo members) */}
                      {user.whatsapp_consent && !user.whatsapp_revoked_at && user.type !== 'event_only' && (
                        <button
                          onClick={() => handleRevokeConsent(user.id, user.email, 'whatsapp')}
                          className="p-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 rounded-lg transition"
                          title="Revocar WhatsApp"
                        >
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                        </button>
                      )}

                      {/* Eliminar (solo members) */}
                      {user.type !== 'event_only' && (
                        <button
                          onClick={() => handleDeleteConsent(user.id, user.email)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition"
                          title="Eliminar (soft delete)"
                        >
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-400">No hay usuarios con este filtro</p>
          </div>
        )}
      </div>
    </div>
  );
}
