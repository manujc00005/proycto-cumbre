'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Loader2,
  Mountain,
  Mail,
  Phone,
  Shirt,
  Calendar,
  Ticket,
  Download
} from 'lucide-react';

interface Member {
  id: string;
  member_number: string;
  first_name: string;
  last_name: string;
  phone: string;
  license_type: string;
  fedme_status: string;
  membership_status: string;
}

interface Payment {
  id: string;
  payment_type: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  description?: string;
  member?: {
    member_number: string;
    first_name: string;
    last_name: string;
  };
  event_registration?: {
    participant_name: string;
    participant_email: string;
    event: {
      name: string;
      slug: string;
    };
  };
  order?: {
    order_number: string;
    customer_name: string;
  };
  subject?: string;
  reference?: string;
}

interface MisaRegistration {
  id: string;
  participant_name: string;
  participant_email: string;
  participant_phone: string;
  custom_data: {
    shirt_size?: string;
  };
  status: string;
  registered_at: string;
  payment?: {
    status: string;
    amount: number;
  };
}

export default function GestorPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [misaRegistrations, setMisaRegistrations] = useState<MisaRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'members' | 'payments' | 'misa'>('members');
  const [processingLicense, setProcessingLicense] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [membersRes, paymentsRes, misaRes] = await Promise.all([
        fetch('/api/gestor/members'),
        fetch('/api/gestor/payments'),
        fetch('/api/gestor/misa-registrations')
      ]);

      const membersData = await membersRes.json();
      const paymentsData = await paymentsRes.json();
      const misaData = await misaRes.json();

      if (membersData.success) setMembers(membersData.members);
      if (paymentsData.success) setPayments(paymentsData.payments);
      if (misaData.success) setMisaRegistrations(misaData.registrations);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const processLicense = async (memberId: string, memberNumber: string) => {
    try {
      setProcessingLicense(memberId);
      
      const response = await fetch('/api/gestor/process-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, memberNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar licencia');
      }

      alert('✅ Licencia marcada como procesada');
      fetchData();
    } catch (err: any) {
      alert(`❌ Error: ${err.message}`);
    } finally {
      setProcessingLicense(null);
    }
  };

  const exportMisaData = () => {
    const csvContent = [
      ['Nombre', 'Email', 'Teléfono', 'Talla', 'Estado Inscripción', 'Estado Pago', 'Monto', 'Fecha'].join(','),
      ...misaRegistrations.map(reg => [
        `"${reg.participant_name}"`,
        reg.participant_email,
        reg.participant_phone,
        reg.custom_data?.shirt_size || 'N/A',
        reg.status,
        reg.payment?.status || 'N/A',
        reg.payment ? `${(reg.payment.amount / 100).toFixed(2)}€` : 'N/A',
        new Date(reg.registered_at).toLocaleDateString('es-ES')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `misa-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getPaymentSubject = (payment: Payment) => {
    if (payment.subject) return payment.subject;
    
    switch (payment.payment_type) {
      case 'membership':
        return payment.member 
          ? `${payment.member.first_name} ${payment.member.last_name}`
          : 'Socio eliminado';
      case 'event':
        return payment.event_registration?.participant_name || 'Participante';
      case 'order':
        return payment.order?.customer_name || 'Cliente';
      default:
        return 'N/A';
    }
  };

  const getPaymentReference = (payment: Payment) => {
    if (payment.reference) return payment.reference;
    
    switch (payment.payment_type) {
      case 'membership':
        return payment.member?.member_number || 'N/A';
      case 'event':
        return payment.event_registration?.event.name || 'Evento';
      case 'order':
        return payment.order?.order_number || 'N/A';
      default:
        return 'N/A';
    }
  };

  const getPaymentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      membership: 'Membresía',
      event: 'Evento',
      order: 'Pedido',
      license_renewal: 'Renovación'
    };
    return types[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { bg: string; text: string; icon: any }> = {
      active: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle },
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: Clock },
      failed: { bg: 'bg-red-500/20', text: 'text-red-400', icon: AlertCircle },
      completed: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle },
      confirmed: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle },
      cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', icon: AlertCircle },
    };

    const variant = variants[status] || variants.pending;
    const Icon = variant.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${variant.bg} ${variant.text}`}>
        <Icon className="w-3 h-3" />
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  const confirmedMisaRegistrations = misaRegistrations.filter(r => r.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Panel de Gestión</h1>
          <p className="text-zinc-400">Administración de socios, pagos y eventos</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm mb-1">Total Socios</p>
                <p className="text-3xl font-bold text-white">{members.length}</p>
              </div>
              <Users className="w-12 h-12 text-orange-500 opacity-20" />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm mb-1">Total Pagos</p>
                <p className="text-3xl font-bold text-white">{payments.length}</p>
              </div>
              <CreditCard className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm mb-1">Licencias Pendientes</p>
                <p className="text-3xl font-bold text-white">
                  {members.filter(m => m.fedme_status === 'pending').length}
                </p>
              </div>
              <AlertCircle className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm mb-1">MISA Confirmados</p>
                <p className="text-3xl font-bold text-white">{confirmedMisaRegistrations}</p>
              </div>
              <Mountain className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'members'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Socios
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'payments'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4 inline mr-2" />
            Pagos
          </button>
          <button
            onClick={() => setActiveTab('misa')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'misa'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Mountain className="w-4 h-4 inline mr-2" />
            MISA
          </button>
        </div>

        {/* Content */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          
          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Nº Socio</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Nombre</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Teléfono</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Licencia</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Estado FEDME</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Membresía</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-zinc-800/30 transition">
                      <td className="px-6 py-4 text-sm text-white font-mono">
                        {member.member_number || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {member.first_name} {member.last_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-300">
                        {member.phone}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-medium">
                          {member.license_type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(member.fedme_status)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(member.membership_status)}
                      </td>
                      <td className="px-6 py-4">
                        {member.fedme_status === 'pending' && member.license_type !== 'none' && (
                          <button
                            onClick={() => processLicense(member.id, member.member_number)}
                            disabled={processingLicense === member.id}
                            className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-xs font-medium transition disabled:opacity-50"
                          >
                            {processingLicense === member.id ? (
                              <Loader2 className="w-3 h-3 animate-spin inline" />
                            ) : (
                              'Procesar Licencia'
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Tipo</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Sujeto</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Referencia</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Monto</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Estado</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-zinc-800/30 transition">
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          payment.payment_type === 'membership' 
                            ? 'bg-blue-500/20 text-blue-400'
                            : payment.payment_type === 'event'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-cyan-500/20 text-cyan-400'
                        }`}>
                          {payment.payment_type === 'membership' && <Users className="w-3 h-3" />}
                          {payment.payment_type === 'event' && <Ticket className="w-3 h-3" />}
                          {payment.payment_type === 'order' && <CreditCard className="w-3 h-3" />}
                          {getPaymentTypeLabel(payment.payment_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {getPaymentSubject(payment)}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-300 font-mono text-xs">
                        {getPaymentReference(payment)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="font-bold text-green-400">
                          {(payment.amount / 100).toFixed(2)}€
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">
                        {new Date(payment.created_at).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* MISA Tab */}
          {activeTab === 'misa' && (
            <>
              {/* Header con botón de exportar */}
              <div className="px-6 py-4 bg-zinc-800/50 border-b border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold">Inscripciones MISA 2026</h3>
                  <p className="text-zinc-400 text-sm">
                    {confirmedMisaRegistrations} confirmados de {misaRegistrations.length} total
                  </p>
                </div>
                <button
                  onClick={exportMisaData}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Nombre</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Teléfono</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Talla</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Estado</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Pago</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Monto</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {misaRegistrations.map((registration) => (
                      <tr key={registration.id} className="hover:bg-zinc-800/30 transition">
                        <td className="px-6 py-4 text-sm text-white font-medium">
                          {registration.participant_name}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2 text-zinc-300">
                            <Mail className="w-3 h-3 text-zinc-500" />
                            {registration.participant_email}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2 text-zinc-300">
                            <Phone className="w-3 h-3 text-zinc-500" />
                            {registration.participant_phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Shirt className="w-3 h-3 text-orange-500" />
                            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-bold">
                              {registration.custom_data?.shirt_size || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(registration.status)}
                        </td>
                        <td className="px-6 py-4">
                          {registration.payment ? (
                            getStatusBadge(registration.payment.status)
                          ) : (
                            <span className="text-zinc-500 text-xs">Sin pago</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {registration.payment ? (
                            <span className="font-bold text-green-400">
                              {(registration.payment.amount / 100).toFixed(2)}€
                            </span>
                          ) : (
                            <span className="text-zinc-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(registration.registered_at).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {misaRegistrations.length === 0 && (
                  <div className="text-center py-12">
                    <Mountain className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-500 text-lg">No hay inscripciones todavía</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
