'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, AlertCircle, AlertTriangle, Mountain } from 'lucide-react';

// Tipos de licencia
const LICENSE_TYPES = [
  {
    id: 'none',
    name: 'Sin Licencia FEDME',
    price: 0,
    coverage: 'Solo membresía del club',
    description: 'Podrás participar en actividades básicas del club, pero necesitarás seguro propio para actividades técnicas.',
    warning: true,
  },
  {
    id: 'a1',
    name: 'A1 - Media Temporada',
    price: 30,
    coverage: 'Cobertura en Andalucía, Ceuta y Melilla',
    description: 'Excursiones, Senderismo, Escalada, Vías Ferratas, Alpinismo, Esquí de Montaña, Descenso de Barrancos, Acampadas Alpinísticas, Raquetas de Nieve, Marcha Nórdica, Travesías y Carreras por Montaña.',
  },
  {
    id: 'a1plus',
    name: 'A1+ - Media Temporada Plus',
    price: 39,
    coverage: 'Cobertura en Andalucía, Ceuta y Melilla',
    description: 'Todo lo anterior + BTT, Espeleología y Esquí Nórdico no competitivos.',
  },
  {
    id: 'b1',
    name: 'B1 - Cobertura Ampliada',
    price: 46,
    coverage: 'España, Pirineo Francés, Portugal y Marruecos',
    description: 'Excursiones, Senderismo, Escalada, Vías Ferratas, Alpinismo, Esquí de Montaña, Descenso de Barrancos, Acampadas Alpinísticas, Raquetas de Nieve, Marcha Nórdica, Travesías y Carreras por Montaña.',
  },
  {
    id: 'b1plus',
    name: 'B1+ - Cobertura Ampliada Plus',
    price: 57,
    coverage: 'España, Pirineo Francés, Portugal y Marruecos',
    description: 'Todo lo anterior + BTT, Espeleología y Esquí Nórdico no competitivos.',
    recommended: true,
  },
];

const SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const PANTS_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const MEMBERSHIP_FEE = 50; // Cuota de socio anual

export default function MembershipPage() {
  const router = useRouter();
  
  // Forzar que el body permita scroll cuando se monte este componente
  useEffect(() => {
    // Restaurar scroll del body (CartDrawer lo bloquea cuando está abierto)
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    
    return () => {
      // Cleanup: dejar que otros componentes manejen el overflow
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, []);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    dni: '',
    licenseType: '',
    sex: '',
    province: '',
    address: '',
    phone: '',
    emergencyPhone: '',
    shirtSize: '',
    hoodieSize: '',
    pantsSize: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Payment states
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'El correo es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Correo inválido';
    
    if (!formData.firstName) newErrors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName) newErrors.lastName = 'Los apellidos son obligatorios';
    if (!formData.birthDate) newErrors.birthDate = 'La fecha de nacimiento es obligatoria';
    if (!formData.dni) newErrors.dni = 'El DNI/NIE es obligatorio';
    if (!formData.licenseType) newErrors.licenseType = 'Debes seleccionar una modalidad';
    if (!formData.sex) newErrors.sex = 'El sexo es obligatorio';
    if (!formData.province) newErrors.province = 'La provincia es obligatoria';
    if (!formData.address) newErrors.address = 'La dirección es obligatoria';
    if (!formData.phone) newErrors.phone = 'El teléfono es obligatorio';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.border-red-500');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Aquí iría la llamada a tu API para guardar los datos
      // await fetch('/api/members', { method: 'POST', body: JSON.stringify(formData) });

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setShowSuccess(true);

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error al procesar el formulario. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    const selectedLicense = LICENSE_TYPES.find(l => l.id === formData.licenseType);
    const licenseFee = selectedLicense?.price || 0;
    const total = MEMBERSHIP_FEE + licenseFee;
    const hasNoLicense = formData.licenseType === 'none';

    const handlePayment = async () => {
      setPaymentProcessing(true);
      
      try {
        // TODO: Integración con Stripe
        // const response = await fetch('/api/create-checkout-session', {
        //   method: 'POST',
        //   body: JSON.stringify({ formData, total })
        // });
        // const { url } = await response.json();
        // window.location.href = url;

        // Simular procesamiento de pago (2 segundos)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setPaymentSuccess(true);
      } catch (error) {
        console.error('Error processing payment:', error);
        alert('Error al procesar el pago. Por favor, inténtalo de nuevo.');
      } finally {
        setPaymentProcessing(false);
      }
    };

    // Pantalla de pago exitoso
    if (paymentSuccess) {
      return (
        <div className="min-h-screen bg-zinc-950 overflow-y-auto">
          <div className="container mx-auto px-4 max-w-lg py-24">
            <div className="bg-zinc-900 border-2 border-green-500 rounded-2xl p-8 text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-3">
                ¡Pago Realizado con Éxito!
              </h2>
              
              <p className="text-zinc-400 mb-2">
                Tu membresía ha sido activada
              </p>
              
              <div className="bg-zinc-800 rounded-lg p-4 my-6">
                <p className="text-zinc-500 text-sm mb-1">Monto pagado</p>
                <p className="text-orange-500 text-4xl font-bold">{total}€</p>
              </div>

              <div className="text-left bg-zinc-800/50 rounded-lg p-4 mb-6">
                <p className="text-zinc-300 text-sm mb-2">
                  <strong className="text-white">Próximos pasos:</strong>
                </p>
                <ul className="text-zinc-400 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Recibirás un email de confirmación</span>
                  </li>
                  {!hasNoLicense && (
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Tu licencia federativa será procesada en 48-72h</span>
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Te contactaremos para la entrega del merchandising</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => router.push('/')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Pantalla de resumen y pago
    return (
      <div className="min-h-screen bg-zinc-950 overflow-y-auto">
        <div className="container mx-auto px-4 max-w-lg py-24">
          {/* Success Card */}
          <div className="bg-zinc-900 border-2 border-orange-500 rounded-2xl p-8 mb-6">
            {/* Checkmark */}
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </div>
            
            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              ¡Formulario Completado!
            </h2>
            <p className="text-zinc-400 text-center mb-6">
              Tu solicitud ha sido procesada correctamente
            </p>

            {/* Divider */}
            <div className="border-t border-zinc-800 my-6"></div>

            {/* Summary */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg mb-4">Resumen de tu membresía</h3>
              
              {/* Items */}
              <div className="space-y-3">
                {/* Membership Fee */}
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <p className="text-white font-medium">Cuota de Socio Anual</p>
                    <p className="text-zinc-500 text-xs">Membresía del club</p>
                  </div>
                  <span className="text-white font-bold">{MEMBERSHIP_FEE}€</span>
                </div>

                {/* License Fee */}
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <p className="text-white font-medium">{selectedLicense?.name}</p>
                    <p className="text-zinc-500 text-xs">{selectedLicense?.coverage}</p>
                  </div>
                  <span className="text-white font-bold">
                    {licenseFee > 0 ? `${licenseFee}€` : 'Gratis'}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-zinc-700 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-lg">Total</span>
                  <span className="text-orange-500 font-bold text-2xl">{total}€</span>
                </div>
              </div>

              {/* Tax Info */}
              <p className="text-xs text-zinc-500 text-center">
                IVA incluido. Pago único anual.
              </p>
            </div>
          </div>

          {/* Warning para "Sin Licencia" */}
          {hasNoLicense && (
            <div className="bg-yellow-500/10 border-2 border-yellow-500/50 rounded-xl p-4 mb-6 flex gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-yellow-300 font-bold mb-2 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>Restricción importante</span>
                </p>
                <p className="text-yellow-200/90">
                  Algunas actividades del club requieren seguro de montaña obligatorio (alta montaña, vivacs, rutas técnicas). Sin licencia FEDME, deberás contratar tu propio seguro para participar en estas aventuras.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handlePayment}
              disabled={paymentProcessing}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
            >
              {paymentProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Procesando Pago...</span>
                </>
              ) : (
                <>
                  <span>Proceder al Pago</span>
                  <span className="text-lg">{total}€</span>
                </>
              )}
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full text-zinc-400 hover:text-white font-medium py-3 transition-colors"
            >
              Cancelar y Volver al Inicio
            </button>
          </div>

          {/* Info Note */}
          <div className="mt-6 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-zinc-300 mb-1">
                <strong className="text-white">Importante:</strong> Tu membresía se activará tras confirmar el pago.
              </p>
              <p className="text-zinc-500 text-xs">
                {hasNoLicense 
                  ? 'Recuerda que necesitarás seguro propio para actividades técnicas.'
                  : 'Recibirás un email con los detalles de tu licencia federativa.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 overflow-y-auto">
      <div className="container mx-auto px-4 max-w-4xl py-24 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Mountain className="w-12 h-12 text-orange-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Únete a <span className="text-orange-500">Proyecto Cumbre</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Completa este formulario para darte de alta como socio. 
            Necesitamos estos datos para tramitar tu licencia federativa y mantenerte informado.
          </p>
          
          {/* Precio destacado */}
          <div className="mt-6 inline-flex items-center gap-3 bg-orange-500/10 border border-orange-500/30 rounded-full px-6 py-3">
            <span className="text-zinc-300 font-medium">Cuota anual de socio:</span>
            <span className="text-orange-500 text-2xl font-bold">{MEMBERSHIP_FEE}€</span>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-8 flex gap-3">
          <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-orange-300">
            <p className="font-semibold mb-1">Inscripciones abiertas desde diciembre</p>
            <p className="text-orange-400">⛰️ Compra Proyecto Cumbre, compra monte.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Datos Personales */}
          <section className="bg-zinc-900 rounded-xl p-6 md:p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              Datos Personales
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Correo electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-zinc-800 border ${errors.email ? 'border-red-500' : 'border-zinc-700'} rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="tu@email.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-zinc-800 border ${errors.firstName ? 'border-red-500' : 'border-zinc-700'} rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="Juan"
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
              </div>

              {/* Apellidos */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Apellidos <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-zinc-800 border ${errors.lastName ? 'border-red-500' : 'border-zinc-700'} rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="García López"
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Fecha de nacimiento <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-zinc-800 border ${errors.birthDate ? 'border-red-500' : 'border-zinc-700'} rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors`}
                />
                {errors.birthDate && <p className="mt-1 text-sm text-red-500">{errors.birthDate}</p>}
              </div>

              {/* DNI/NIE */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  DNI o NIE <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-zinc-800 border ${errors.dni ? 'border-red-500' : 'border-zinc-700'} rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="12345678A"
                />
                {errors.dni && <p className="mt-1 text-sm text-red-500">{errors.dni}</p>}
              </div>

              {/* Sexo */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Sexo <span className="text-red-500">*</span>
                </label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-zinc-800 border ${errors.sex ? 'border-red-500' : 'border-zinc-700'} rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors`}
                >
                  <option value="">Selecciona...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
                {errors.sex && <p className="mt-1 text-sm text-red-500">{errors.sex}</p>}
              </div>
            </div>
          </section>

          {/* Modalidad de Licencia */}
          <section className="bg-zinc-900 rounded-xl p-6 md:p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Modalidad de Licencia FEDME
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Selecciona la licencia que mejor se adapte a tus necesidades. La cuota de socio ({MEMBERSHIP_FEE}€) se suma al precio de la licencia.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {LICENSE_TYPES.map((license) => (
                <label
                  key={license.id}
                  className={`relative cursor-pointer rounded-xl border-2 transition-all ${
                    formData.licenseType === license.id
                      ? 'border-orange-500 bg-orange-500/10'
                      : license.warning
                      ? 'border-yellow-500/50 hover:border-yellow-500 bg-yellow-500/5'
                      : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50'
                  } ${license.recommended ? 'ring-2 ring-orange-500/50' : ''}`}
                >
                  {license.recommended && (
                    <div className="absolute -top-3 left-4 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                      MÁS COMPLETO
                    </div>
                  )}
                  {license.warning && (
                    <div className="absolute -top-3 left-4 px-3 py-1 bg-yellow-500 text-zinc-900 text-xs font-bold rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>IMPORTANTE</span>
                    </div>
                  )}
                  <input
                    type="radio"
                    name="licenseType"
                    value={license.id}
                    checked={formData.licenseType === license.id}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-white text-lg pr-2">{license.name}</h3>
                      <span className={`text-2xl font-bold ${license.price > 0 ? 'text-orange-500' : 'text-green-500'}`}>
                        {license.price > 0 ? `+${license.price}€` : ''}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 mb-3">{license.coverage}</p>
                    <p className="text-xs text-zinc-500">{license.description}</p>
                  </div>
                </label>
              ))}
            </div>
            {errors.licenseType && <p className="mt-2 text-sm text-red-500">{errors.licenseType}</p>}

            {/* Warning dinámico cuando selecciona "Sin Licencia" */}
            {formData.licenseType === 'none' && (
              <div className="mt-6 bg-yellow-500/10 border-2 border-yellow-500/50 rounded-xl p-4 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-yellow-300 font-bold mb-2 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>Restricción importante</span>
                  </p>
                  <p className="text-yellow-200/90 leading-relaxed">
                    Algunas actividades del club requieren seguro de montaña obligatorio (alta montaña, vivacs, rutas técnicas). Sin licencia FEDME, deberás contratar tu propio seguro para participar en estas aventuras.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Dirección y Contacto */}
          <section className="bg-zinc-900 rounded-xl p-6 md:p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              Dirección y Contacto
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Provincia */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Provincia <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-zinc-800 border ${errors.province ? 'border-red-500' : 'border-zinc-700'} rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="Granada"
                />
                {errors.province && <p className="mt-1 text-sm text-red-500">{errors.province}</p>}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-zinc-800 border ${errors.phone ? 'border-red-500' : 'border-zinc-700'} rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="611435267"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>

              {/* Dirección */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Dirección completa <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 bg-zinc-800 border ${errors.address ? 'border-red-500' : 'border-zinc-700'} rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors resize-none`}
                  placeholder="Calle, número, piso, código postal..."
                />
                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
              </div>

              {/* Teléfono de Emergencia */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Teléfono de emergencia
                </label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Contacto de emergencia"
                />
              </div>
            </div>
          </section>

          {/* Tallas */}
          <section className="bg-zinc-900 rounded-xl p-6 md:p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              Tallas de Ropa
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Para que puedas ir fronteando con estilo CUMBRE
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Camiseta */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Camiseta
                </label>
                <select
                  name="shirtSize"
                  value={formData.shirtSize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
                >
                  <option value="">Selecciona...</option>
                  {SHIRT_SIZES.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              {/* Sudadera */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Sudadera
                </label>
                <select
                  name="hoodieSize"
                  value={formData.hoodieSize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
                >
                  <option value="">Selecciona...</option>
                  {SHIRT_SIZES.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              {/* Pantalón */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Pantalón
                </label>
                <select
                  name="pantsSize"
                  value={formData.pantsSize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
                >
                  <option value="">Selecciona...</option>
                  {PANTS_SIZES.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Resumen de costos */}
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/30 rounded-xl p-6">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span>💰</span>
              Resumen de costos
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-300">Cuota de socio anual</span>
                <span className="text-white font-bold">{MEMBERSHIP_FEE}€</span>
              </div>
              {formData.licenseType && (
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">
                    {LICENSE_TYPES.find(l => l.id === formData.licenseType)?.name}
                  </span>
                  <span className="text-white font-bold">
                    {LICENSE_TYPES.find(l => l.id === formData.licenseType)?.price || 0}€
                  </span>
                </div>
              )}
              <div className="border-t border-orange-500/30 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-lg">Total</span>
                  <span className="text-orange-500 font-bold text-2xl">
                    {MEMBERSHIP_FEE + (LICENSE_TYPES.find(l => l.id === formData.licenseType)?.price || 0)}€
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors disabled:bg-orange-500/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  Continuar al Pago
                  <Mountain className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-center text-zinc-500 text-sm">
            Al completar este formulario, procederás al pago de tu membresía.
          </p>
        </form>
      </div>
    </div>
  );
}
