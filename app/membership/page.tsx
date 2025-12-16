'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Check, AlertCircle, AlertTriangle, Mountain, X } from 'lucide-react';
import LicenseConfigurator from './LicenseConfigurator';
import { AgeCategory, calculateAge, calculateAgeCategory, getCategoryLabel, getLicensePrice, LICENSE_TYPES, MEMBERSHIP_FEE } from '@/lib/constants';
import { logger } from '@/lib/logger';
import styles from './page.module.css';
import React from 'react';
import GDPRConsentEvent from '../components/gdpr/gdpr-consent-event';

const SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const PANTS_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function MembershipPage() {
  const router = useRouter();
  const errorBannerRef = useRef<HTMLDivElement>(null);

  const handleConsentChange = React.useCallback((next: ConsentState) => {
    setConsents(next);
  }, []);

  // Forzar que el body permita scroll cuando se monte este componente
  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';

    return () => {
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
    city: '',
    address: '',
    postalCode: '',
    phone: '',
    emergencyPhone: '',
    emergencyContactName: '',
    shirtSize: '',
    hoodieSize: '',
    pantsSize: '',
  });

  // Estado de consentimientos RGPD
  const [consents, setConsents] = useState<ConsentState>({
    privacyPolicy: false,
    whatsapp: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Payment states
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);

  // Categoría calculada automáticamente
  const [ageCategory, setAgeCategory] = useState<AgeCategory | null>(null);
  const [userAge, setUserAge] = useState<number | null>(null);

  // Calcular categoría cuando cambia la fecha de nacimiento
  useEffect(() => {
    if (formData.birthDate) {
      try {
        const category = calculateAgeCategory(formData.birthDate);
        const age = calculateAge(formData.birthDate);
        setAgeCategory(category);
        setUserAge(age);

        // Si hay una licencia seleccionada que ya no está disponible, limpiarla
        if (formData.licenseType) {
          const selectedLicense = LICENSE_TYPES.find(l => l.id === formData.licenseType);
          if (selectedLicense && category === 'mayor') {
            // Si es licencia familiar y el usuario es mayor, limpiar selección
            setFormData(prev => ({ ...prev, licenseType: '' }));
          }
        }
      } catch (error) {
        setAgeCategory(null);
        setUserAge(null);
      }
    } else {
      setAgeCategory(null);
      setUserAge(null);
    }
  }, [formData.birthDate]);

  // Scroll to error banner when errors appear
  useEffect(() => {
    if (showErrorBanner && errorBannerRef.current) {
      errorBannerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showErrorBanner]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Hide error banner if all errors are cleared
    if (Object.keys(errors).length <= 1) {
      setShowErrorBanner(false);
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validateField(fieldName);
  };

  const validateField = (fieldName: string) => {
    const value = formData[fieldName as keyof typeof formData];
    let error = '';

    switch (fieldName) {
      case 'email':
        if (!value) error = 'El correo es obligatorio';
        else if (!/\S+@\S+\.\S+/.test(value)) error = 'Correo inválido';
        break;
      case 'firstName':
        if (!value) error = 'El nombre es obligatorio';
        break;
      case 'lastName':
        if (!value) error = 'Los apellidos son obligatorios';
        break;
      case 'birthDate':
        if (!value) {
          error = 'La fecha de nacimiento es obligatoria';
        } else {
          const today = new Date();
          const birth = new Date(value);
          const age = today.getFullYear() - birth.getFullYear();
          const monthDiff = today.getMonth() - birth.getMonth();
          const dayDiff = today.getDate() - birth.getDate();

          const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

          if (birth > today) {
            error = 'La fecha de nacimiento no puede ser futura';
          } else if (actualAge < 14) {
            error = 'Debes tener al menos 14 años';
          } else if (actualAge > 100) {
            error = 'La edad no puede superar los 100 años';
          }
        }
        break;
      case 'dni':
        if (!value) error = 'El DNI/NIE es obligatorio';
        else if (!/^[0-9]{8}[A-Z]$|^[XYZ][0-9]{7}[A-Z]$/i.test(value))
          error = 'Formato inválido (Ej: 12345678A)';
        break;
      case 'licenseType':
        if (!value) error = 'Debes seleccionar una modalidad';
        break;
      case 'sex':
        if (!value) error = 'El sexo es obligatorio';
        break;
      case 'province':
        if (!value) error = 'La provincia es obligatoria';
        break;
      case 'address':
        if (!value) error = 'La dirección es obligatoria';
        break;
      case 'shirtSize':
        if (!value) error = 'Debes seleccionar una talla de camiseta';
        break;
      case 'phone':
        if (!value) error = 'El teléfono es obligatorio';
        else if (!/^[0-9]{9}$/.test(value.replace(/\s/g, '')))
          error = 'Debe tener 9 dígitos';
        break;
    }

    if (error) {
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'El correo es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Correo inválido';

    if (!formData.firstName) newErrors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName) newErrors.lastName = 'Los apellidos son obligatorios';
    if (!formData.birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es obligatoria';
    } else {
      const today = new Date();
      const birth = new Date(formData.birthDate);
      const age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      const dayDiff = today.getDate() - birth.getDate();

      const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

      if (birth > today) {
        newErrors.birthDate = 'La fecha de nacimiento no puede ser futura';
      } else if (actualAge < 14) {
        newErrors.birthDate = 'Debes tener al menos 14 años';
      } else if (actualAge > 100) {
        newErrors.birthDate = 'La edad no puede superar los 100 años';
      }
    }

    if (!formData.dni) newErrors.dni = 'El DNI/NIE es obligatorio';
    else if (!/^[0-9]{8}[A-Z]$|^[XYZ][0-9]{7}[A-Z]$/i.test(formData.dni))
      newErrors.dni = 'Formato inválido (Ej: 12345678A)';

    if (!formData.licenseType) newErrors.licenseType = 'Debes seleccionar una modalidad';
    if (!formData.sex) newErrors.sex = 'El sexo es obligatorio';
    if (!formData.province) newErrors.province = 'La provincia es obligatoria';
    if (!formData.address) newErrors.address = 'La dirección es obligatoria';

    if (!formData.phone) newErrors.phone = 'El teléfono es obligatorio';
    else if (!/^[0-9]{9}$/.test(formData.phone.replace(/\s/g, '')))
      newErrors.phone = 'Debe tener 9 dígitos';

    if (!formData.shirtSize) {
      newErrors.shirtSize = 'Debes seleccionar una talla de camiseta';
    }

    // 🚨 Validar consentimientos OBLIGATORIOS
    if (!consents.privacyPolicy) {
      newErrors.privacy = 'Debes aceptar la Política de Privacidad';
    }

    // 🚨 Validar WhatsApp obligatorio para socios
    if (!consents.whatsapp) {
      newErrors.whatsapp = 'Debes aceptar compartir tus datos en WhatsApp para formar parte del club';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const scrollToFirstError = () => {
    if (errorBannerRef.current) {
      errorBannerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const firstErrorField = document.querySelector('.border-red-500');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allFields = Object.keys(formData);
    const touchedFields = allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {});
    setTouched(touchedFields);

    if (!validateForm()) {
      setShowErrorBanner(true);
      setTimeout(scrollToFirstError, 100);
      return;
    }

    setIsSubmitting(true);
    setShowErrorBanner(false);

    try {
      logger.log('📤 Enviando datos a la API...');

      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ageCategory: ageCategory,
          overwrite: true,
          consents: {
            privacy_accepted: consents.privacyPolicy,
            privacy_accepted_at: consents.privacyPolicy ? new Date().toISOString() : null,
            whatsapp_consent: consents.whatsapp,
            whatsapp_consent_at: consents.whatsapp ? new Date().toISOString() : null,
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
          setShowErrorBanner(true);
          setTimeout(scrollToFirstError, 100);
          return;
        }
        throw new Error(data.error || 'Error al guardar los datos');
      }

      logger.log('✅ Socio guardado exitosamente:', data);

      if (data.member?.id) {
        setMemberId(data.member.id);
      }

      setShowSuccess(true);
      setShowErrorBanner(false);

    } catch (error: any) {
      logger.error('❌ Error submitting form:', error);

      setErrors({ submit: error.message || 'Error al procesar el formulario' });
      setShowErrorBanner(true);
      setTimeout(scrollToFirstError, 100);

    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    const selectedLicense = LICENSE_TYPES.find(l => l.id === formData.licenseType);
    const licenseFee = ageCategory && selectedLicense ? getLicensePrice(selectedLicense, ageCategory) : 0;
    const total = MEMBERSHIP_FEE + licenseFee;
    const hasNoLicense = formData.licenseType === 'none';

    const handlePayment = async () => {
      setPaymentProcessing(true);

      try {
        logger.log('💳 Iniciando proceso de pago...');

        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            memberId: memberId,
            total: total,
            memberData: {
              email: formData.email,
              firstName: formData.firstName,
              lastName: formData.lastName,
              licenseType: formData.licenseType,
              ageCategory: ageCategory,
            }
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error al crear sesión de pago');
        }

        logger.log('✅ Sesión creada:', data.sessionId);

        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('No se recibió URL de Stripe');
        }

      } catch (error: any) {
        logger.error('❌ Error al procesar pago:', error);
        alert('Error al procesar el pago. Por favor, inténtalo de nuevo.');
        setPaymentProcessing(false);
      }
    };

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

    return (
      <div className="min-h-screen bg-zinc-950 overflow-y-auto">
        <div className="container mx-auto px-4 max-w-lg py-24">
          <div className="bg-zinc-900 border-2 border-orange-500 rounded-2xl p-8 mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              ¡Datos Guardados Exitosamente!
            </h2>
            <p className="text-zinc-400 text-center mb-6">
              Tu información ha sido registrada en el sistema
            </p>

            <div className="border-t border-zinc-800 my-6"></div>

            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg mb-4">Resumen de tu membresía</h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <p className="text-white font-medium">Cuota de Socio Anual</p>
                    <p className="text-zinc-500 text-xs">Membresía del club</p>
                  </div>
                  <span className="text-white font-bold">{MEMBERSHIP_FEE}€</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div>
                    <p className="text-white font-medium">{selectedLicense?.name}</p>
                    <p className="text-zinc-500 text-xs">{selectedLicense?.coverage.substring(0, 50)}...</p>
                    {ageCategory && (
                      <p className="text-orange-400 text-xs mt-1">
                        Precio {getCategoryLabel(ageCategory)}
                      </p>
                    )}
                  </div>
                  <span className="text-white font-bold">
                    {licenseFee > 0 ? `${licenseFee}€` : 'Gratis'}
                  </span>
                </div>
              </div>

              <div className="border-t border-zinc-700 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-lg">Total</span>
                  <span className="text-orange-500 font-bold text-2xl">{total}€</span>
                </div>
              </div>

              <p className="text-xs text-zinc-500 text-center">
                IVA incluido. Pago único anual.
              </p>
            </div>
          </div>

          {hasNoLicense && (
            <div className="bg-yellow-500/10 border-2 border-yellow-500/50 rounded-xl p-4 mb-6 flex gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-yellow-300 font-bold mb-2 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>Restricción importante</span>
                </p>
                <p className="text-yellow-200/90">
                  Algunas actividades del club requieren seguro de montaña obligatorio. Sin licencia FEDME, deberás contratar tu propio seguro.
                </p>
              </div>
            </div>
          )}

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

  const errorCount = Object.keys(errors).length;

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

          <div className="mt-6 inline-flex items-center gap-3 bg-orange-500/10 border border-orange-500/30 rounded-full px-6 py-3">
            <span className="text-zinc-300 font-medium">Cuota anual de socio:</span>
            <span className="text-orange-500 text-2xl font-bold">{MEMBERSHIP_FEE}€</span>
          </div>
        </div>

        {/* Error Banner */}
        {showErrorBanner && errorCount > 0 && (
          <div
            ref={errorBannerRef}
            className="sticky top-4 z-50 mb-6 bg-red-500/10 border-2 border-red-500 rounded-xl p-4 backdrop-blur-sm animate-in slide-in-from-top duration-300"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-400 font-bold mb-2 flex items-center justify-between">
                  <span>
                    {errorCount === 1
                      ? '1 campo requiere tu atención'
                      : `${errorCount} campos requieren tu atención`}
                  </span>
                  <button
                    onClick={() => setShowErrorBanner(false)}
                    className="text-red-400 hover:text-red-300 transition-colors ml-4"
                    aria-label="Cerrar banner de errores"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </h3>
                <ul className="space-y-1 text-sm text-red-300">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field} className="flex items-start gap-2">
                      <span className="text-red-500 font-bold mt-0.5">•</span>
                      <span><strong>{getFieldLabel(field)}:</strong> {error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

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
                  onBlur={() => handleBlur('email')}
                  className={`w-full px-4 py-3 bg-zinc-800 border-2 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-orange-500'
                    } rounded-lg text-white placeholder-zinc-500 focus:outline-none transition-all`}
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
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
                  onBlur={() => handleBlur('firstName')}
                  className={`w-full px-4 py-3 bg-zinc-800 border-2 ${errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-orange-500'
                    } rounded-lg text-white placeholder-zinc-500 focus:outline-none transition-all`}
                  placeholder="Juan"
                />
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.firstName}
                  </p>
                )}
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
                  onBlur={() => handleBlur('lastName')}
                  className={`w-full px-4 py-3 bg-zinc-800 border-2 ${errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-orange-500'
                    } rounded-lg text-white placeholder-zinc-500 focus:outline-none transition-all`}
                  placeholder="García López"
                />
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.lastName}
                  </p>
                )}
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
                  onBlur={() => handleBlur('birthDate')}
                  max={(() => {
                    const today = new Date();
                    const maxDate = new Date(today.getFullYear() - 14, today.getMonth(), today.getDate());
                    return maxDate.toISOString().split('T')[0];
                  })()}
                  min={(() => {
                    const today = new Date();
                    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
                    return minDate.toISOString().split('T')[0];
                  })()}
                  className={`${styles.dateInput} w-full px-4 py-3 bg-zinc-800 border-2 ${errors.birthDate ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-orange-500'
                    } rounded-lg text-white focus:outline-none transition-all`}
                />
                {errors.birthDate && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.birthDate}
                  </p>
                )}
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
                  onBlur={() => handleBlur('dni')}
                  className={`w-full px-4 py-3 bg-zinc-800 border-2 ${errors.dni ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-orange-500'
                    } rounded-lg text-white placeholder-zinc-500 focus:outline-none transition-all`}
                  placeholder="12345678A"
                />
                {errors.dni && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.dni}
                  </p>
                )}
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
                  onBlur={() => handleBlur('sex')}
                  className={`w-full px-4 py-3 bg-zinc-800 border-2 ${errors.sex ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-orange-500'
                    } rounded-lg text-white focus:outline-none transition-all`}
                >
                  <option value="">Selecciona...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
                {errors.sex && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.sex}
                  </p>
                )}
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
              Te guiaremos paso a paso para encontrar la licencia perfecta para ti
            </p>

            <LicenseConfigurator
              selectedLicense={formData.licenseType}
              onSelectLicense={(licenseId: string) => {
                setFormData(prev => ({ ...prev, licenseType: licenseId }));
                if (errors.licenseType) {
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.licenseType;
                    return newErrors;
                  });
                }
              }}
              ageCategory={ageCategory}
              hasError={!!errors.licenseType}
            />

            {errors.licenseType && (
              <p className="mt-3 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.licenseType}
              </p>
            )}
          </section>

          {/* Dirección y Contacto */}
          <section className="bg-zinc-900 rounded-xl p-6 md:p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              Dirección y Contacto
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
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
                  onBlur={() => handleBlur('phone')}
                  className={`w-full px-4 py-3 bg-zinc-800 border-2 ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-orange-500'
                    } rounded-lg text-white placeholder-zinc-500 focus:outline-none transition-all`}
                  placeholder="611435267"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Teléfono de Emergencia */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Teléfono de emergencia
                </label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 focus:border-orange-500 rounded-lg text-white placeholder-zinc-500 focus:outline-none transition-all"
                  placeholder="Contacto de emergencia"
                />
              </div>

              {/* Nombre del contacto de emergencia */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Nombre del contacto de emergencia
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 focus:border-orange-500 rounded-lg text-white placeholder-zinc-500 focus:outline-none transition-all"
                  placeholder="Nombre completo"
                />
              </div>

              {/* Divider visual */}
              <div className="md:col-span-2 border-t border-zinc-800 my-2"></div>

              {/* Dirección */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Dirección (calle y número) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={() => handleBlur('address')}
                  className={`w-full px-4 py-3 bg-zinc-800 border-2 ${errors.address ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-orange-500'
                    } rounded-lg text-white placeholder-zinc-500 focus:outline-none transition-all`}
                  placeholder="Calle Mayor, 123, 2ºA"
                />
                {errors.address && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Código Postal */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Código postal
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  maxLength={5}
                  className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 focus:border-orange-500 rounded-lg text-white placeholder-zinc-500 focus:outline-none transition-all"
                  placeholder="18001"
                />
              </div>

              {/* Ciudad */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Ciudad
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 focus:border-orange-500 rounded-lg text-white placeholder-zinc-500 focus:outline-none transition-all"
                  placeholder="Granada"
                />
              </div>

              {/* Provincia */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Provincia <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  onBlur={() => handleBlur('province')}
                  className={`w-full px-4 py-3 bg-zinc-800 border-2 ${errors.province ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-orange-500'
                    } rounded-lg text-white placeholder-zinc-500 focus:outline-none transition-all`}
                  placeholder="Granada"
                />
                {errors.province && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.province}
                  </p>
                )}
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

            {/* 🎯 INFO BOX DESTACADO */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 mb-6 flex gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-300">
                <p className="font-semibold">¡Incluida en tu membresía!</p>
                <p className="text-orange-400 text-xs mt-1">
                  Recibirás tu camiseta oficial del club con el logo de Proyecto Cumbre
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Camiseta - CAMPO PRINCIPAL */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Talla de Camiseta  <span className="text-red-500">*</span>
                </label>
                <select
                  name="shirtSize"
                  value={formData.shirtSize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 focus:border-orange-500 rounded-lg text-white focus:outline-none transition-all"
                >
                  <option value="">Selecciona tu talla...</option>
                  {SHIRT_SIZES.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>

              </div>
            </div>
          </section>

          {/* SECCIÓN 5: PROTECCIÓN DE DATOS (RGPD) */}
          <section className="bg-zinc-900 rounded-xl p-6 md:p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
              Protección de Datos
            </h2>

            <p className="text-zinc-400 text-sm mb-6">
              Tus datos están seguros. Lee nuestra política antes de continuar.
            </p>

            {/* Componente RGPD */}
            <GDPRConsentEvent
              onConsentChange={handleConsentChange}
              whatsappContext="club"
              includeWhatsApp={true}
              whatsappRequired={true}
            />


            {/* Error de privacidad */}
            {errors.privacy && (
              <p className="mt-4 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.privacy}
              </p>
            )}

            {/* 🚨 Error de WhatsApp */}
            {errors.whatsapp && (
              <p className="mt-4 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.whatsapp}
              </p>
            )}
          </section>

          {/* Resumen de costos */}
          {ageCategory && formData.licenseType && (
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
                    <div className="flex flex-col">
                      <span className="text-zinc-300">
                        {LICENSE_TYPES.find(l => l.id === formData.licenseType)?.name}
                      </span>
                      <span className="text-xs text-orange-400">
                        {getCategoryLabel(ageCategory)}
                      </span>
                    </div>
                    <span className="text-white font-bold">
                      {(() => {
                        const license = LICENSE_TYPES.find(l => l.id === formData.licenseType);
                        return license ? getLicensePrice(license, ageCategory) : 0;
                      })()}€
                    </span>
                  </div>
                )}
                <div className="border-t border-orange-500/30 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-lg">Total</span>
                    <span className="text-orange-500 font-bold text-2xl">
                      {(() => {
                        const license = LICENSE_TYPES.find(l => l.id === formData.licenseType);
                        const licensePrice = license ? getLicensePrice(license, ageCategory) : 0;
                        return MEMBERSHIP_FEE + licensePrice;
                      })()}€
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

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
              // 🚨 AQUÍ ESTÁ EL CAMBIO CRÍTICO: validar privacy Y whatsapp
              disabled={isSubmitting || !consents.privacyPolicy || !consents.whatsapp}
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors disabled:bg-orange-500/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Guardando datos...
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
            Al hacer clic en "Continuar al Pago", aceptas nuestra Política de Privacidad y Aviso Legal.
          </p>
        </form>
      </div>
    </div>
  );
}

function getFieldLabel(field: string): string {
  const labels: Record<string, string> = {
    email: 'Email',
    firstName: 'Nombre',
    lastName: 'Apellidos',
    birthDate: 'Fecha de nacimiento',
    dni: 'DNI/NIE',
    licenseType: 'Modalidad de licencia',
    sex: 'Sexo',
    province: 'Provincia',
    city: 'Ciudad',
    address: 'Dirección',
    postalCode: 'Código postal',
    shirtSize: 'Talla de camiseta',
    phone: 'Teléfono',
    emergencyPhone: 'Teléfono de emergencia',
    emergencyContactName: 'Nombre del contacto de emergencia',
    privacy: 'Política de Privacidad',
    whatsapp: 'Consentimiento de WhatsApp', // 🚨 AÑADIDO
    submit: 'Error del servidor'
  };
  return labels[field] || field;
}
