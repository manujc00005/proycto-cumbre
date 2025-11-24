'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, Users, CreditCard, RefreshCw } from 'lucide-react';

interface Member {
  id: string;
  member_number: string | null;
  first_name: string;
  last_name: string;
  phone: string;
  license_type: string;
  fedme_status: string;
  membership_status: string;
}

interface Payment {
  id: string;
  member_id: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  member: {
    member_number: string | null;
    first_name: string;
    last_name: string;
  };
}

export default function GestorPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingMemberId, setProcessingMemberId] = useState<string | null>(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch members
      const membersRes = await fetch('/api/gestor/members');
      const membersData = await membersRes.json();
      
      // Fetch payments
      const paymentsRes = await fetch('/api/gestor/payments');
      const paymentsData = await paymentsRes.json();

      if (membersData.success) {
        setMembers(membersData.members);
      }
      
      if (paymentsData.success) {
        setPayments(paymentsData.payments);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsProcessed = async (memberId: string, memberNumber: string) => {
    if (!confirm('¿Marcar esta licencia como procesada?')) return;

    setProcessingMemberId(memberId);

    try {
      const response = await fetch('/api/gestor/process-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, memberNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Licencia marcada como procesada');
        fetchData(); // Recargar datos
      } else {
        alert(data.error || 'Error al procesar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la licencia');
    } finally {
      setProcessingMemberId(null);
    }
  };

  const getLicenseStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" />
            Pendiente
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
            <RefreshCw className="w-3 h-3" />
            Procesando
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Activa
          </span>
        );
      case 'none':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-500/20 text-zinc-400 text-xs font-medium rounded-full">
            Sin Licencia
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-zinc-500/20 text-zinc-400 text-xs font-medium rounded-full">
            {status}
          </span>
        );
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Completado
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" />
            Pendiente
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">
            <XCircle className="w-3 h-3" />
            Fallido
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-zinc-500/20 text-zinc-400 text-xs font-medium rounded-full">
            {status}
          </span>
        );
    }
  };

  const getLicenseTypeName = (type: string) => {
    const names: Record<string, string> = {
      none: 'Sin Licencia',
      a1: 'A1',
      a1_plus: 'A1+',
      b1: 'B1',
      b1_plus: 'B1+',
    };
    return names[type] || type;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Cargando datos...</p>
        </div>
      </div>
    );
  }

  // Ordenar miembros: pendientes primero
  const sortedMembers = [...members].sort((a, b) => {
    if (a.fedme_status === 'pending' && b.fedme_status !== 'pending') return -1;
    if (a.fedme_status !== 'pending' && b.fedme_status === 'pending') return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-zinc-950 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Gestor de <span className="text-orange-500">Socios</span>
          </h1>
          <p className="text-zinc-400">
            Gestiona socios, licencias y pagos del club
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-zinc-500 text-sm">Total Socios</p>
                <p className="text-white text-2xl font-bold">{members.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-zinc-500 text-sm">Licencias Pendientes</p>
                <p className="text-white text-2xl font-bold">
                  {members.filter(m => m.fedme_status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-zinc-500 text-sm">Pagos Completados</p>
                <p className="text-white text-2xl font-bold">
                  {payments.filter(p => p.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Socios */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-8">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              Socios Registrados
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    N° Socio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Apellido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Tipo Licencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Estado Licencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {sortedMembers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-zinc-500">
                      No hay socios registrados
                    </td>
                  </tr>
                ) : (
                  sortedMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-orange-500 font-mono text-sm font-medium">
                          {member.member_number || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-white font-medium">{member.first_name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-white">{member.last_name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-zinc-400">{member.phone}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-zinc-300">
                          {getLicenseTypeName(member.license_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getLicenseStatusBadge(member.fedme_status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {member.fedme_status === 'pending' && member.license_type !== 'none' ? (
                          <button
                            onClick={() => handleMarkAsProcessed(member.id, member.member_number || '')}
                            disabled={processingMemberId === member.id}
                            className="px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                          >
                            {processingMemberId === member.id ? (
                              <>
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                Procesando...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Marcar Procesada
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-zinc-500 text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabla de Pagos */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-500" />
              Historial de Pagos
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Pago ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    N° Socio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Apellido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-zinc-500">
                      No hay pagos registrados
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-zinc-400 font-mono text-xs">
                          {payment.id.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-orange-500 font-mono text-sm font-medium">
                          {payment.member.member_number || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-white font-medium">
                          {payment.member.first_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-white">{payment.member.last_name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-zinc-400 text-sm">
                          {payment.description || 'Sin descripción'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-white font-bold">
                          {(payment.amount / 100).toFixed(2)} {payment.currency.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPaymentStatusBadge(payment.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}