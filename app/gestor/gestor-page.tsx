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
  Download,
  Shield,
  Trash2,
  RefreshCw,
  XCircle,
  FileText,
  AlertTriangle,
  Package,
  Truck,
  Eye,
  Edit,
  MapPin,
  ShoppingBag,
  Box,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import RGPDTableUnified from './rgpd-table-unified';

// ========================================
// INTERFACES
// ========================================

interface Member {
  id: string;
  member_number: string;
  first_name: string;
  last_name: string;
  dni?: string | null;
  birth_date: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code?: string | null;
  license_type: string;
  fedme_status: string;
  fedme_license_number?: string | null;
  membership_status: string;
  membership_start_date?: string | null;
  membership_end_date?: string | null;
  privacy_policy_version?: string;
  marketing_consent?: boolean;
  marketing_revoked_at?: string | null;
  whatsapp_consent?: boolean;
  whatsapp_revoked_at?: string | null;
  deleted_at?: string | null;
  created_at?: string;
  latestPayment?: {
    id: string;
    status: string;
    amount: number;
    created_at: string;
  } | null;
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

interface RGPDStats {
  total: {
    active: number;
    deleted: number;
  };
  policy_versions: Array<{ privacy_policy_version: string | null; _count: number }>;
  whatsapp: {
    active: number;
    revoked: number;
    percentage: number;
  };
  marketing: {
    active: number;
    revoked: number;
    percentage: number;
  };
}

interface OrderItem {
  id: string;
  product_name: string;
  product_slug: string;
  variant_data?: {
    size?: string;
    color?: string;
  };
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: {
    street?: string;
    address?: string;
    city: string;
    province: string;
    postalCode: string;
    country?: string;
  };
  subtotal: number;
  shipping_cost: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  status: string;
  tracking_number?: string;
  shipped_at?: string;
  delivered_at?: string;
  customer_notes?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  member?: {
    id: string;
    member_number: string;
    first_name: string;
    last_name: string;
  };
}

const downloadWaiverPdf = (registration: MisaRegistration) => {
  const url = `/api/events/waiver-pdf?registrationId=${encodeURIComponent(registration.id)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

export default function GestorPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [misaRegistrations, setMisaRegistrations] = useState<MisaRegistration[]>([]);
  const [rgpdStats, setRgpdStats] = useState<RGPDStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'members' | 'payments' | 'misa' | 'orders' | 'rgpd'>('members');
  const [processingLicense, setProcessingLicense] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sortField, setSortField] = useState<'created_at' | 'first_name' | 'last_name' | 'member_number' | 'fedme_status'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const requests = [
        fetch('/api/gestor/members'),
        fetch('/api/gestor/payments'),
        fetch('/api/gestor/misa-registrations'),
        fetch('/api/gestor/orders'),
      ];

      if (activeTab === 'rgpd') {
        requests.push(fetch('/api/gestor/rgpd-stats'));
      }

      const responses = await Promise.all(requests);
      const [membersData, paymentsData, misaData, ordersData, rgpdData] = await Promise.all(
        responses.map(r => r.json())
      );

      if (membersData.success) setMembers(membersData.members);
      if (paymentsData.success) setPayments(paymentsData.payments);
      if (misaData.success) setMisaRegistrations(misaData.registrations);
      if (ordersData?.success) setOrders(ordersData.orders);
      if (rgpdData?.success) setRgpdStats(rgpdData.stats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setProcessingAction(orderId);
      
      const response = await fetch('/api/gestor/update-order-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar estado');
      }

      alert('✅ Estado actualizado correctamente');
      fetchData();
    } catch (err: any) {
      alert(`❌ Error: ${err.message}`);
    } finally {
      setProcessingAction(null);
    }
  };

  const addTrackingNumber = async (orderId: string, orderNumber: string) => {
    const trackingNumber = prompt(`Introduce el número de seguimiento para el pedido ${orderNumber}:`);
    
    if (!trackingNumber) return;

    try {
      setProcessingAction(orderId);
      
      const response = await fetch('/api/gestor/add-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, trackingNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al añadir seguimiento');
      }

      alert('✅ Número de seguimiento añadido');
      fetchData();
    } catch (err: any) {
      alert(`❌ Error: ${err.message}`);
    } finally {
      setProcessingAction(null);
    }
  };

  const exportOrdersData = () => {
    const csvContent = [
      ['Nº Pedido', 'Cliente', 'Email', 'Teléfono', 'Total', 'Estado', 'Productos', 'Fecha'].join(','),
      ...orders.map(order => [
        order.order_number,
        `"${order.customer_name}"`,
        order.customer_email,
        order.customer_phone || 'N/A',
        `${(order.total / 100).toFixed(2)}€`,
        order.status,
        order.items.length,
        new Date(order.created_at).toLocaleDateString('es-ES')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pedidos-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
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
      paid: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: CheckCircle },
      processing: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: Clock },
      shipped: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', icon: Truck },
      delivered: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle },
      refunded: { bg: 'bg-orange-500/20', text: 'text-orange-400', icon: AlertCircle },
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

  const getOrderStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      paid: 'Pagado',
      processing: 'Procesando',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
      refunded: 'Reembolsado',
    };
    return labels[status] || status;
  };

  function SimpleProductsDropdown({ items }: { items: OrderItem[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
      <div className="w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg transition"
        >
          <div className="text-left">
            <p className="text-sm font-medium text-white">
              {items.length} {items.length === 1 ? 'producto' : 'productos'}
            </p>
            <p className="text-xs text-zinc-500">{totalUnits} unidades</p>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-zinc-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="mt-2 space-y-1.5">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between p-2.5 bg-zinc-800/30 rounded border border-zinc-700/50"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-1.5">
                    <Box className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{item.product_name}</p>
                      {item.variant_data?.size && (
                        <p className="text-xs text-zinc-500 mt-0.5">Talla: {item.variant_data.size}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  <span className="text-xs text-zinc-400">×{item.quantity}</span>
                  <span className="text-sm font-bold text-orange-400">
                    {(item.total_price / 100).toFixed(2)}€
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'created_at' ? 'desc' : 'asc');
    }
  };

  const getSortedMembers = () => {
    const sorted = [...activeMembers].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'created_at':
          aValue = new Date(a.created_at || 0).getTime();
          bValue = new Date(b.created_at || 0).getTime();
          break;
        case 'first_name':
          aValue = a.first_name.toLowerCase();
          bValue = b.first_name.toLowerCase();
          break;
        case 'last_name':
          aValue = a.last_name.toLowerCase();
          bValue = b.last_name.toLowerCase();
          break;
        case 'member_number':
          aValue = a.member_number || '';
          bValue = b.member_number || '';
          break;
        case 'fedme_status':
          aValue = a.fedme_status;
          bValue = b.fedme_status;
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return sorted;
  };

  const SortableHeader = ({ 
    field, 
    label, 
    className = '' 
  }: { 
    field: typeof sortField; 
    label: string; 
    className?: string;
  }) => {
    const isActive = sortField === field;
    
    return (
      <th 
        className={`px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase cursor-pointer hover:text-white hover:bg-zinc-800/50 transition ${className}`}
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center gap-2 select-none">
          <span>{label}</span>
          <div className="flex flex-col">
            <ChevronUp 
              className={`w-3 h-3 -mb-1 transition ${
                isActive && sortDirection === 'asc' 
                  ? 'text-orange-500' 
                  : 'text-zinc-600'
              }`}
            />
            <ChevronDown 
              className={`w-3 h-3 transition ${
                isActive && sortDirection === 'desc' 
                  ? 'text-orange-500' 
                  : 'text-zinc-600'
              }`}
            />
          </div>
        </div>
      </th>
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
  const activeMembers = members.filter(m => !m.deleted_at);
  const deletedMembers = members.filter(m => m.deleted_at);

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'paid').length;
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled' && o.status !== 'refunded')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Panel de Gestión</h1>
          <p className="text-zinc-400">Administración de socios, pagos, pedidos, eventos y RGPD</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm mb-1">Socios Activos</p>
                <p className="text-3xl font-bold text-white">{activeMembers.length}</p>
                {deletedMembers.length > 0 && (
                  <p className="text-xs text-red-400 mt-1">{deletedMembers.length} eliminados</p>
                )}
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
                <p className="text-zinc-400 text-sm mb-1">Pedidos Pendientes</p>
                <p className="text-3xl font-bold text-white">{pendingOrders}</p>
                <p className="text-xs text-zinc-500 mt-1">{orders.length} total</p>
              </div>
              <Package className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm mb-1">Licencias Pendientes</p>
                <p className="text-3xl font-bold text-white">
                  {activeMembers.filter(m => m.fedme_status === 'pending').length}
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
        <div className="flex gap-2 mb-6 border-b border-zinc-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
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
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'payments'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4 inline mr-2" />
            Pagos
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'orders'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Pedidos
          </button>
          <button
            onClick={() => setActiveTab('misa')}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'misa'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Mountain className="w-4 h-4 inline mr-2" />
            MISA
          </button>
          <button
            onClick={() => {
              setActiveTab('rgpd');
              fetchData();
            }}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'rgpd'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            RGPD
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
                    <SortableHeader field="member_number" label="Nº Socio" />
                    <SortableHeader field="first_name" label="Nombre" />
                    <SortableHeader field="last_name" label="Apellido" />
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">DNI/NIE</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Fecha Nac.</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Teléfono</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Dirección</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Licencia</th>
                    <SortableHeader field="fedme_status" label="Estado FEDME" />
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Membresía</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Estado Pago</th>
                    <SortableHeader field="created_at" label="Fecha Alta" />
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {getSortedMembers().map((member) => (
                    <tr key={member.id} className="hover:bg-zinc-800/30 transition">
                      {/* Nº Socio */}
                      <td className="px-6 py-4 text-sm text-white font-mono">
                        {member.member_number || 'N/A'}
                      </td>
                      
                      {/* Nombre */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">
                          {member.first_name}
                        </div>
                      </td>
                      
                      {/* Apellido */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">
                          {member.last_name}
                        </div>
                        {member.city && (
                          <div className="text-xs text-zinc-500 mt-0.5">
                            {member.city}, {member.province}
                          </div>
                        )}
                      </td>
                      
                      {/* DNI/NIE */}
                      <td className="px-6 py-4">
                        {member.dni ? (
                          <span className="text-sm font-mono text-zinc-300">{member.dni}</span>
                        ) : (
                          <span className="text-xs text-zinc-600">Sin DNI</span>
                        )}
                      </td>
                      
                      {/* Fecha Nacimiento */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-zinc-300">
                          {new Date(member.birth_date).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {(() => {
                            const today = new Date();
                            const birthDate = new Date(member.birth_date);
                            let age = today.getFullYear() - birthDate.getFullYear();
                            const m = today.getMonth() - birthDate.getMonth();
                            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                              age--;
                            }
                            return `${age} años`;
                          })()}
                        </div>
                      </td>
                      
                      {/* Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                          <span className="text-sm text-zinc-300 truncate max-w-[200px]">
                            {member.email}
                          </span>
                        </div>
                      </td>
                      
                      {/* Teléfono */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                          <span className="text-sm text-zinc-300 font-mono">
                            {member.phone}
                          </span>
                        </div>
                      </td>
                      
                      {/* Dirección */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-zinc-300 max-w-[250px]">
                          <div className="truncate">{member.address}</div>
                          <div className="text-xs text-zinc-500 mt-1">
                            {member.postal_code && `${member.postal_code}, `}
                            {member.city}
                          </div>
                        </div>
                      </td>
                      
                      {/* Licencia */}
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-medium">
                          {member.license_type.toUpperCase()}
                        </span>
                        {member.fedme_license_number && (
                          <div className="text-xs text-zinc-500 mt-1 font-mono">
                            {member.fedme_license_number}
                          </div>
                        )}
                      </td>
                      
                      {/* Estado FEDME */}
                      <td className="px-6 py-4">
                        {getStatusBadge(member.fedme_status)}
                      </td>
                      
                      {/* Membresía */}
                      <td className="px-6 py-4">
                        {getStatusBadge(member.membership_status)}
                        {member.membership_end_date && (
                          <div className="text-xs text-zinc-500 mt-1">
                            Hasta {new Date(member.membership_end_date).toLocaleDateString('es-ES')}
                          </div>
                        )}
                      </td>
                      
                      {/* 🆕 ESTADO PAGO */}
                      <td className="px-6 py-4">
                        {member.latestPayment ? (
                          <div className="flex flex-col gap-1">
                            {getStatusBadge(member.latestPayment.status)}
                            <div className="text-xs text-zinc-500">
                              {(member.latestPayment.amount / 100).toFixed(2)}€
                            </div>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-medium">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Sin pago</span>
                          </div>
                        )}
                      </td>
                      
                      {/* Fecha Alta */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-zinc-300">
                          {new Date(member.created_at || '').toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {new Date(member.created_at || '').toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      
                      {/* 🔥 ACCIONES CON VALIDACIÓN DE PAGO */}
                      <td className="px-6 py-4">
                        {(() => {
                          const hasValidPayment = member.latestPayment && 
                            (member.latestPayment.status === 'completed' || member.latestPayment.status === 'paid');
                          
                          const isPending = member.fedme_status === 'pending';
                          const hasLicense = member.license_type !== 'none';
                          const isActive = member.fedme_status === 'active';

                          if (!hasLicense) {
                            return (
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-500 text-xs font-medium">
                                <AlertCircle className="w-3 h-3" />
                                <span>Sin Licencia</span>
                              </div>
                            );
                          }

                          if (isActive) {
                            return (
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-xs font-medium">
                                <CheckCircle className="w-3 h-3" />
                                <span>Licencia Activa</span>
                              </div>
                            );
                          }

                          if (isPending && !hasValidPayment) {
                            return (
                              <div className="flex flex-col gap-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-medium">
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>Pago Pendiente</span>
                                </div>
                                <p className="text-xs text-zinc-500">
                                  Esperar confirmación del pago
                                </p>
                              </div>
                            );
                          }

                          if (isPending && hasValidPayment) {
                            return (
                              <button
                                onClick={() => processLicense(member.id, member.member_number)}
                                disabled={processingLicense === member.id}
                                className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
                              >
                                {processingLicense === member.id ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Procesando...</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span>Activar Licencia</span>
                                  </>
                                )}
                              </button>
                            );
                          }

                          return null;
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {activeMembers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500 text-lg">No hay socios activos</p>
                </div>
              )}
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

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <>
              <div className="px-6 py-4 bg-zinc-800/50 border-b border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold">Gestión de Pedidos</h3>
                  <p className="text-zinc-400 text-sm">
                    {orders.length} pedidos · {pendingOrders} pendientes · {(totalRevenue / 100).toFixed(2)}€ total
                  </p>
                </div>
                <button
                  onClick={exportOrdersData}
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
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Nº Pedido</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Cliente</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Contacto</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Productos</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Total</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Estado</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Envío</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Fecha</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-zinc-800/30 transition">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-mono font-bold text-white">{order.order_number}</span>
                            {order.member && (
                              <span className="text-xs text-blue-400 mt-0.5">Socio: {order.member.member_number}</span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">{order.customer_name}</div>
                          <div className="text-xs text-zinc-500 mt-0.5">
                            {order.shipping_address.city}, {order.shipping_address.province}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-xs text-zinc-300">
                              <Mail className="w-3 h-3 text-zinc-500" />
                              <span className="truncate max-w-[150px]">{order.customer_email}</span>
                            </div>
                            {order.customer_phone && (
                              <div className="flex items-center gap-2 text-xs text-zinc-300">
                                <Phone className="w-3 h-3 text-zinc-500" />
                                <span className="font-mono">{order.customer_phone}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <SimpleProductsDropdown items={order.items} />
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-base font-bold text-green-400">
                              {(order.total / 100).toFixed(2)}€
                            </span>
                            <span className="text-xs text-zinc-500">
                              Envío: {order.shipping_cost === 0 ? 'GRATIS' : `${(order.shipping_cost / 100).toFixed(2)}€`}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {getStatusBadge(order.status)}
                          <div className="mt-2">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              disabled={processingAction === order.id}
                              className="text-xs bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-white focus:outline-none focus:border-orange-500"
                            >
                              <option value="pending">Pendiente</option>
                              <option value="paid">Pagado</option>
                              <option value="processing">Procesando</option>
                              <option value="shipped">Enviado</option>
                              <option value="delivered">Entregado</option>
                              <option value="cancelled">Cancelado</option>
                            </select>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {order.tracking_number ? (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <Truck className="w-3 h-3 text-cyan-500" />
                                <span className="text-xs font-mono text-cyan-400">{order.tracking_number}</span>
                              </div>
                              {order.shipped_at && (
                                <span className="text-xs text-zinc-500">
                                  {new Date(order.shipped_at).toLocaleDateString('es-ES')}
                                </span>
                              )}
                            </div>
                          ) : order.status === 'paid' || order.status === 'processing' ? (
                            <button
                              onClick={() => addTrackingNumber(order.id, order.order_number)}
                              disabled={processingAction === order.id}
                              className="text-xs px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded transition"
                            >
                              Añadir tracking
                            </button>
                          ) : (
                            <span className="text-xs text-zinc-600">Sin seguimiento</span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-sm text-zinc-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(order.created_at).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                          </div>
                          <div className="text-xs text-zinc-600 mt-0.5">
                            {new Date(order.created_at).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition text-xs font-medium"
                          >
                            <Eye className="w-3 h-3" />
                            Ver detalles
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {orders.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-500 text-lg">No hay pedidos todavía</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* MISA Tab */}
          {activeTab === 'misa' && (
            <>
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
                      <th className="px-6 py-4 text-right text-xs font-medium text-zinc-400 uppercase">Docs</th>
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
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => downloadWaiverPdf(registration)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg
                                      bg-zinc-800/60 hover:bg-zinc-700/60
                                      border border-zinc-700 hover:border-zinc-600
                                      text-zinc-300 hover:text-white transition"
                            title="Descargar pliego (PDF)"
                            aria-label="Descargar pliego (PDF)"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
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

          {/* RGPD Tab */}
          {activeTab === 'rgpd' && <RGPDTableUnified />}
        </div>
      </div>

      {/* Modal de Detalles de Pedido */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setSelectedOrder(null)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-900 z-10">
              <div>
                <h3 className="text-xl font-bold text-white">Pedido #{selectedOrder.order_number}</h3>
                <p className="text-sm text-zinc-400">{getOrderStatusLabel(selectedOrder.status)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-zinc-400 hover:text-white transition"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-500" />
                  Información del cliente
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-zinc-500">Nombre</p>
                    <p className="text-sm text-white font-medium">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Email</p>
                    <p className="text-sm text-white">{selectedOrder.customer_email}</p>
                  </div>
                  {selectedOrder.customer_phone && (
                    <div>
                      <p className="text-xs text-zinc-500">Teléfono</p>
                      <p className="text-sm text-white font-mono">{selectedOrder.customer_phone}</p>
                    </div>
                  )}
                  {selectedOrder.member && (
                    <div>
                      <p className="text-xs text-zinc-500">Nº Socio</p>
                      <p className="text-sm text-blue-400 font-mono">{selectedOrder.member.member_number}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-4">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  Dirección de envío
                </h4>
                <p className="text-sm text-white leading-relaxed">
                  {selectedOrder.shipping_address.street || selectedOrder.shipping_address.address}<br />
                  {selectedOrder.shipping_address.postalCode} {selectedOrder.shipping_address.city}<br />
                  {selectedOrder.shipping_address.province}
                  {selectedOrder.shipping_address.country && `, ${selectedOrder.shipping_address.country}`}
                </p>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-4">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-orange-500" />
                  Productos ({selectedOrder.items.length})
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between pb-3 border-b border-zinc-700 last:border-0">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{item.product_name}</p>
                        {item.variant_data?.size && (
                          <p className="text-xs text-zinc-500 mt-0.5">Talla: {item.variant_data.size}</p>
                        )}
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {item.quantity} × {(item.unit_price / 100).toFixed(2)}€
                        </p>
                      </div>
                      <p className="text-sm font-bold text-white">{(item.total_price / 100).toFixed(2)}€</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-700 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Subtotal</span>
                    <span className="text-white">{(selectedOrder.subtotal / 100).toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Envío</span>
                    <span className="text-white">
                      {selectedOrder.shipping_cost === 0 ? 'GRATIS' : `${(selectedOrder.shipping_cost / 100).toFixed(2)}€`}
                    </span>
                  </div>
                  {selectedOrder.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">IVA</span>
                      <span className="text-white">{(selectedOrder.tax / 100).toFixed(2)}€</span>
                    </div>
                  )}
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">Descuento</span>
                      <span className="text-green-400">-{(selectedOrder.discount / 100).toFixed(2)}€</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-zinc-700">
                    <span className="text-white">TOTAL</span>
                    <span className="text-orange-500">{(selectedOrder.total / 100).toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              {selectedOrder.tracking_number && (
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-cyan-400" />
                    Número de seguimiento
                  </h4>
                  <p className="text-sm font-mono text-cyan-400">{selectedOrder.tracking_number}</p>
                  {selectedOrder.shipped_at && (
                    <p className="text-xs text-zinc-400 mt-1">
                      Enviado el {new Date(selectedOrder.shipped_at).toLocaleDateString('es-ES')}
                    </p>
                  )}
                </div>
              )}

              {(selectedOrder.customer_notes || selectedOrder.admin_notes) && (
                <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                  {selectedOrder.customer_notes && (
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 mb-1">Notas del cliente</h4>
                      <p className="text-sm text-white">{selectedOrder.customer_notes}</p>
                    </div>
                  )}
                  {selectedOrder.admin_notes && (
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 mb-1">Notas internas</h4>
                      <p className="text-sm text-white">{selectedOrder.admin_notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
