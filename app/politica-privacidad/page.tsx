import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, ArrowLeft, Mail, MapPin, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Proyecto Cumbre',
  description: 'Política de Privacidad y Protección de Datos de Proyecto Cumbre',
};

export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        
        {/* Back button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-orange-500 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Política de Privacidad
          </h1>
          <p className="text-zinc-400">
            Última actualización: 12 de diciembre de 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-zinc max-w-none">
          
          {/* Section 1 */}
          <section className="mb-12 bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">1.</span>
              Responsable del Tratamiento
            </h2>
            
            <div className="space-y-4 text-zinc-300">
              <p className="leading-relaxed">
                En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales (RGPD), te informamos:
              </p>

              <div className="bg-zinc-800/50 rounded-lg p-6 space-y-2">
                <p><strong className="text-white">Responsable:</strong> CLUB DEPORTIVO PROYECTO CUMBRE</p>
                <p><strong className="text-white">NIF:</strong> G75790246</p>
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                  <span><strong className="text-white">Dirección:</strong> PS De los Tilos n. 67 planta/piso 2 puerta 2, 29006 – MÁLAGA (MÁLAGA)</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-500" />
                  <strong className="text-white">Email:</strong> 
                  <a href="mailto:privacidad@proyecto-cumbre.es" className="text-orange-500 hover:text-orange-400">
                    privacidad@proyecto-cumbre.es
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-500" />
                  <strong className="text-white">Teléfono:</strong> 692 085 193
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-12 bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">2.</span>
              Finalidades del Tratamiento
            </h2>
            
            <div className="space-y-4 text-zinc-300">
              <p className="leading-relaxed">
                Tratamos tus datos personales para las siguientes finalidades:
              </p>

              <div className="space-y-4">
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-2">📋 Gestión de membresías</h3>
                  <p className="text-sm">Alta como socio del club, renovación anual y gestión administrativa de la membresía.</p>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-2">🏔️ Inscripción a eventos deportivos</h3>
                  <p className="text-sm">Gestión de inscripciones a actividades como MISA, rutas, salidas de montaña y otros eventos organizados por el club.</p>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-2">🎫 Tramitación de licencias FEDME</h3>
                  <p className="text-sm">Gestión de licencias federativas con la Federación Española de Deportes de Montaña y Escalada, incluyendo el envío de tu información personal y certificado médico (si procede).</p>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-2">💳 Gestión de pagos</h3>
                  <p className="text-sm">Procesamiento de cuotas de socio, inscripciones a eventos y venta de merchandising mediante pasarela de pago Stripe.</p>
                </div>

                {/* 🆕 SECCIÓN ACTUALIZADA: Comunicaciones del club */}
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-2">📧 Comunicaciones del club</h3>
                  <p className="text-sm mb-3">
                    <strong className="text-orange-400">Base legal: Interés legítimo (Art. 6.1.f RGPD)</strong>
                  </p>
                  <p className="text-sm mb-3">
                    Como socio del club, te mantendremos informado sobre:
                  </p>
                  <ul className="text-sm space-y-1 ml-4 list-disc list-inside mb-3">
                    <li>Eventos y salidas programadas del club</li>
                    <li>Nuevas actividades y convocatorias</li>
                    <li>Información relevante para socios (asambleas, cambios en estatutos, etc.)</li>
                    <li>Avisos importantes sobre el funcionamiento del club</li>
                    <li>Noticias y actualizaciones de la comunidad</li>
                  </ul>
                  <div className="bg-blue-500/10 border-l-4 border-blue-400 p-3 rounded mt-3">
                    <p className="text-xs text-blue-300">
                      <strong>Nuestro interés legítimo:</strong> Facilitar la participación activa de los socios en las actividades del club y garantizar el buen funcionamiento de nuestra comunidad deportiva. La comunicación fluida con nuestros socios es esencial para cumplir los fines asociativos del club.
                    </p>
                    <p className="text-xs text-blue-300 mt-2">
                      <strong>Tu derecho de oposición:</strong> Puedes oponerte en cualquier momento escribiendo a{' '}
                      <a href="mailto:privacidad@proyecto-cumbre.es" className="text-blue-200 hover:underline">
                        privacidad@proyecto-cumbre.es
                      </a>
                      , aunque esto podría limitar tu participación activa en el club.
                    </p>
                  </div>
                </div>

                {/* 🆕 NUEVA SECCIÓN: Comunicaciones comerciales opcionales */}
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-2">📬 Comunicaciones comerciales opcionales</h3>
                  <p className="text-sm mb-3">
                    <strong className="text-orange-400">Base legal: Consentimiento (Art. 6.1.a RGPD)</strong>
                  </p>
                  <p className="text-sm mb-3">
                    Si nos das tu consentimiento explícito (checkbox opcional en el formulario), también podremos enviarte:
                  </p>
                  <ul className="text-sm space-y-1 ml-4 list-disc list-inside mb-3">
                    <li>Ofertas especiales en productos del club (merchandising)</li>
                    <li>Descuentos en actividades opcionales</li>
                    <li>Información sobre patrocinadores y colaboradores</li>
                    <li>Promociones de terceros relacionadas con montañismo</li>
                  </ul>
                  <div className="bg-green-500/10 border-l-4 border-green-400 p-3 rounded mt-3">
                    <p className="text-xs text-green-300">
                      Este consentimiento es <strong>completamente opcional</strong> y no afecta a tu membresía del club. Puedes darlo o retirarlo en cualquier momento utilizando el enlace de "darme de baja" en cada email o escribiendo a privacidad@proyecto-cumbre.es
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-2">📱 Grupos de WhatsApp</h3>
                  <p className="text-sm mb-3">
                    <strong className="text-orange-400">Base legal: Consentimiento (Art. 6.1.a RGPD)</strong>
                  </p>
                  <p className="text-sm">
                    Compartir tu nombre y teléfono con otros socios del club en grupos de WhatsApp para la gestión y coordinación de actividades (solo si diste tu consentimiento explícito en el formulario de registro).
                  </p>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-2">🛍️ Venta de productos</h3>
                  <p className="text-sm">Gestión de pedidos de merchandising oficial, envío de productos y facturación.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-12 bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">3.</span>
              Base Legal del Tratamiento
            </h2>
            
            <div className="space-y-4 text-zinc-300">
              <p className="leading-relaxed">
                El tratamiento de tus datos se basa en:
              </p>

              <ul className="space-y-3 list-none">
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span><strong className="text-white">Ejecución de un contrato:</strong> Gestión de tu membresía, inscripciones a eventos y procesamiento de pagos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span><strong className="text-white">Consentimiento explícito:</strong> Comunicaciones comerciales opcionales, grupos de WhatsApp y tratamiento de datos de salud (certificados médicos para licencias FEDME).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span><strong className="text-white">Obligación legal:</strong> Conservación de datos fiscales y contables durante 10 años según normativa tributaria.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span><strong className="text-white">Interés legítimo:</strong> Comunicaciones informativas del club con socios, mejora de nuestros servicios y seguridad de las actividades deportivas.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-12 bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">4.</span>
              Datos que Recopilamos
            </h2>
            
            <div className="space-y-6 text-zinc-300">
              <div>
                <h3 className="text-white font-bold mb-3">📝 Datos de identificación</h3>
                <p className="text-sm bg-zinc-800/30 p-3 rounded">
                  Nombre, apellidos, DNI/NIE, fecha de nacimiento, sexo, fotografía (si la proporcionas).
                </p>
              </div>

              <div>
                <h3 className="text-white font-bold mb-3">📞 Datos de contacto</h3>
                <p className="text-sm bg-zinc-800/30 p-3 rounded">
                  Email, teléfono, dirección postal, ciudad, provincia, código postal.
                </p>
              </div>

              <div>
                <h3 className="text-white font-bold mb-3">🚨 Datos de emergencia</h3>
                <p className="text-sm bg-zinc-800/30 p-3 rounded">
                  Nombre y teléfono de contacto de emergencia.
                </p>
              </div>

              <div>
                <h3 className="text-white font-bold mb-3">🏥 Datos de salud (categoría especial)</h3>
                <p className="text-sm bg-zinc-800/30 p-3 rounded mb-2">
                  Tallas de ropa (camiseta, sudadera, pantalón), certificado médico-deportivo (solo para tramitación de licencias federativas que lo requieran).
                </p>
                <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded">
                  <p className="text-sm text-orange-300">
                    <strong>⚠️ Importante:</strong> El tratamiento de datos de salud requiere tu consentimiento explícito. Tu certificado médico será compartido únicamente con FEDME para la tramitación de tu licencia federativa.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-bold mb-3">💳 Datos de pago</h3>
                <p className="text-sm bg-zinc-800/30 p-3 rounded">
                  Información de tarjeta bancaria (procesada directamente por Stripe, nunca almacenamos tus datos bancarios completos).
                </p>
              </div>

              <div>
                <h3 className="text-white font-bold mb-3">🖥️ Datos de navegación</h3>
                <p className="text-sm bg-zinc-800/30 p-3 rounded">
                  Dirección IP, tipo de navegador, páginas visitadas, cookies técnicas necesarias para el funcionamiento del sitio web.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-12 bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">5.</span>
              Destinatarios de los Datos
            </h2>
            
            <div className="space-y-4 text-zinc-300">
              <p className="leading-relaxed">
                Tus datos pueden ser comunicados a:
              </p>

              <div className="space-y-3">
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-2">🏔️ FEDME (Federación Española de Deportes de Montaña)</h3>
                  <p className="text-sm">Para tramitación de licencias federativas. Compartimos: nombre, apellidos, DNI, fecha de nacimiento, sexo, dirección, certificado médico (si procede).</p>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-2">💳 Stripe (Procesador de pagos)</h3>
                  <p className="text-sm">Cumple con PCI-DSS para garantizar la seguridad de tus datos bancarios. <a href="https://stripe.com/es/privacy" target="_blank" rel="noopener" className="text-orange-500 hover:underline">Ver política de Stripe</a></p>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-2">📧 Resend (Plataforma de envío de emails)</h3>
                  <p className="text-sm">Para enviar confirmaciones de registro, emails transaccionales y comunicaciones del club.</p>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-2">📱 Participantes en eventos</h3>
                  <p className="text-sm">Otros participantes del mismo evento podrán ver tu nombre y teléfono en grupos de WhatsApp (solo si diste tu consentimiento).</p>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-2">📦 Empresas de mensajería</h3>
                  <p className="text-sm">Para el envío de merchandising: nombre, dirección de envío.</p>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-2">⚖️ Administraciones públicas</h3>
                  <p className="text-sm">Cuando sea legalmente obligatorio (Agencia Tributaria, juzgados, etc.).</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-12 bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">6.</span>
              Transferencias Internacionales
            </h2>
            
            <div className="space-y-4 text-zinc-300">
              <p className="leading-relaxed">
                Algunos de nuestros proveedores están ubicados fuera del Espacio Económico Europeo (EEE):
              </p>

              <div className="bg-zinc-800/50 rounded-lg p-4">
                <p className="mb-2">
                  <strong className="text-white">Stripe y Resend (Estados Unidos):</strong>
                </p>
                <p className="text-sm">
                  Transferencias protegidas mediante el <strong className="text-orange-500">Data Privacy Framework (DPF)</strong> EU-US, reconocido por la Comisión Europea como mecanismo adecuado de protección de datos.
                </p>
              </div>

              <p className="text-sm">
                Puedes obtener más información sobre las garantías aplicadas en{' '}
                <a href="https://commission.europa.eu/law/law-topic/data-protection_es" target="_blank" rel="noopener" className="text-orange-500 hover:underline">
                  la web de la Comisión Europea
                </a>.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-12 bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">7.</span>
              Conservación de Datos
            </h2>
            
            <div className="space-y-4 text-zinc-300">
              <p className="leading-relaxed">
                Conservaremos tus datos durante:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-700">
                      <th className="text-left py-3 px-4 text-white">Tipo de dato</th>
                      <th className="text-left py-3 px-4 text-white">Plazo de conservación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    <tr>
                      <td className="py-3 px-4">Socios activos</td>
                      <td className="py-3 px-4">Mientras dure tu membresía + 1 año adicional</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Datos fiscales/contables</td>
                      <td className="py-3 px-4">10 años (obligación legal tributaria)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Inscripciones a eventos</td>
                      <td className="py-3 px-4">3 meses tras el evento (salvo datos fiscales)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Consentimientos marketing</td>
                      <td className="py-3 px-4">Hasta que retires tu consentimiento</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Fotografías/vídeos eventos</td>
                      <td className="py-3 px-4">Hasta que solicites su eliminación</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 8 - Derechos */}
          <section className="mb-12 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-xl p-8 border-2 border-orange-500/30">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">8.</span>
              Tus Derechos (ARCO)
            </h2>
            
            <div className="space-y-4 text-zinc-300">
              <p className="leading-relaxed text-white font-medium">
                Tienes derecho a ejercer los siguientes derechos en cualquier momento:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                  <h3 className="text-orange-500 font-bold mb-2">✓ Acceso</h3>
                  <p className="text-sm">Obtener información sobre qué datos personales tuyos estamos tratando.</p>
                </div>

                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                  <h3 className="text-orange-500 font-bold mb-2">✓ Rectificación</h3>
                  <p className="text-sm">Corregir datos inexactos o incompletos.</p>
                </div>

                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                  <h3 className="text-orange-500 font-bold mb-2">✓ Supresión</h3>
                  <p className="text-sm">Solicitar la eliminación de tus datos cuando ya no sean necesarios.</p>
                </div>

                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                  <h3 className="text-orange-500 font-bold mb-2">✓ Oposición</h3>
                  <p className="text-sm">Oponerte al tratamiento de tus datos en determinadas circunstancias.</p>
                </div>

                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                  <h3 className="text-orange-500 font-bold mb-2">✓ Limitación</h3>
                  <p className="text-sm">Solicitar que se restrinja el tratamiento en determinados casos.</p>
                </div>

                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                  <h3 className="text-orange-500 font-bold mb-2">✓ Portabilidad</h3>
                  <p className="text-sm">Recibir tus datos en formato estructurado y transmitirlos a otro responsable.</p>
                </div>
              </div>

              {/* 🆕 SECCIÓN AÑADIDA: Derecho de oposición específico */}
              <div className="bg-blue-500/10 border-l-4 border-blue-400 p-6 rounded mt-6">
                <h3 className="text-white font-bold mb-3">🔒 Derecho de oposición específico (Art. 21 RGPD)</h3>
                <p className="text-sm mb-3">
                  Si nos basamos en el <strong className="text-blue-300">interés legítimo del club</strong> para enviarte comunicaciones informativas (como avisos de eventos y actividades), tienes derecho a oponerte a este tratamiento en cualquier momento.
                </p>
                <p className="text-sm mb-3">
                  Puedes ejercer este derecho escribiendo a{' '}
                  <a href="mailto:privacidad@proyecto-cumbre.es" className="text-blue-300 hover:text-blue-200 underline">
                    privacidad@proyecto-cumbre.es
                  </a>
                  {' '}indicando "Oposición a comunicaciones del club".
                </p>
                <p className="text-sm text-blue-200">
                  Ten en cuenta que ejercer este derecho puede limitar tu participación activa en el club, ya que no recibirás información sobre eventos y salidas programadas.
                </p>
              </div>

              <div className="bg-orange-500/10 border-l-4 border-orange-500 p-6 rounded mt-6">
                <h3 className="text-white font-bold mb-3">📬 ¿Cómo ejercer tus derechos?</h3>
                <p className="text-sm mb-4">
                  Envía un email a{' '}
                  <a href="mailto:privacidad@proyecto-cumbre.es" className="text-orange-500 hover:text-orange-400 font-bold">
                    privacidad@proyecto-cumbre.es
                  </a>
                  {' '}indicando:
                </p>
                <ul className="space-y-2 text-sm list-disc list-inside">
                  <li>Nombre completo y DNI</li>
                  <li>Derecho que deseas ejercer</li>
                  <li>Domicilio a efectos de notificaciones (opcional)</li>
                  <li>Copia de tu DNI o documento acreditativo</li>
                </ul>
                <p className="text-sm mt-4">
                  <strong className="text-white">Plazo de respuesta:</strong> 1 mes desde la recepción de tu solicitud.
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-700 p-6 rounded mt-4">
                <h3 className="text-white font-bold mb-3">⚖️ Derecho a reclamar ante la autoridad de control</h3>
                <p className="text-sm mb-2">
                  Si consideras que el tratamiento de tus datos vulnera la normativa, puedes presentar una reclamación ante:
                </p>
                <div className="bg-zinc-800/50 p-4 rounded mt-2">
                  <p className="text-sm"><strong className="text-white">Agencia Española de Protección de Datos (AEPD)</strong></p>
                  <p className="text-sm">C/ Jorge Juan, 6 – 28001 Madrid</p>
                  <p className="text-sm">
                    Web:{' '}
                    <a href="https://www.aepd.es" target="_blank" rel="noopener" className="text-orange-500 hover:underline">
                      www.aepd.es
                    </a>
                  </p>
                  <p className="text-sm">Teléfono: 901 100 099 / 912 663 517</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section className="mb-12 bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">9.</span>
              Seguridad de los Datos
            </h2>
            
            <div className="space-y-4 text-zinc-300">
              <p className="leading-relaxed">
                Hemos implementado medidas técnicas y organizativas apropiadas para proteger tus datos:
              </p>

              <ul className="space-y-3 list-none">
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 text-xl">🔒</span>
                  <span>Conexión HTTPS cifrada (SSL/TLS)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 text-xl">🛡️</span>
                  <span>Contraseñas cifradas con algoritmos seguros</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 text-xl">💳</span>
                  <span>Pasarela de pago certificada PCI-DSS (Stripe)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 text-xl">👥</span>
                  <span>Acceso restringido a datos personales solo al personal autorizado</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 text-xl">💾</span>
                  <span>Copias de seguridad periódicas</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 text-xl">🔍</span>
                  <span>Auditorías de seguridad regulares</span>
                </li>
              </ul>

              <p className="text-sm mt-4 bg-zinc-800/30 p-4 rounded">
                A pesar de implementar estas medidas, ningún sistema es 100% seguro. En caso de brecha de seguridad que suponga un riesgo para tus derechos, te notificaremos en un plazo máximo de 72 horas.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="mb-12 bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">10.</span>
              Menores de Edad
            </h2>
            
            <div className="space-y-4 text-zinc-300">
              <p className="leading-relaxed">
                Para darte de alta como socio debes tener al menos <strong className="text-white">14 años</strong>.
              </p>

              <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded">
                <p className="text-sm text-orange-300">
                  <strong>⚠️ Menores de 18 años:</strong> Si eres menor de 18 años, necesitas el consentimiento de tus padres o tutores legales. Al registrarte, declaras contar con dicha autorización.
                </p>
              </div>
            </div>
          </section>

          {/* Section 11 */}
          <section className="mb-12 bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">11.</span>
              Modificaciones
            </h2>
            
            <div className="space-y-4 text-zinc-300">
              <p className="leading-relaxed">
                Nos reservamos el derecho a modificar esta Política de Privacidad para adaptarla a cambios legislativos o en nuestros servicios.
              </p>

              <p className="leading-relaxed">
                Te notificaremos cualquier cambio sustancial por email o mediante aviso destacado en la web.
              </p>

              <p className="text-sm bg-zinc-800/30 p-4 rounded">
                <strong className="text-white">Fecha de última modificación:</strong> 12 de diciembre de 2025
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-xl p-8 border-2 border-orange-500/30">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-orange-500" />
              Contacto
            </h2>
            
            <div className="space-y-4 text-zinc-300">
              <p className="leading-relaxed">
                Para cualquier duda sobre esta Política de Privacidad o el tratamiento de tus datos:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                  <p className="text-sm text-zinc-400 mb-1">Email de privacidad</p>
                  <a href="mailto:privacidad@proyecto-cumbre.es" className="text-orange-500 hover:text-orange-400 font-bold">
                    privacidad@proyecto-cumbre.es
                  </a>
                </div>

                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                  <p className="text-sm text-zinc-400 mb-1">Email general</p>
                  <a href="mailto:info@proyecto-cumbre.es" className="text-orange-500 hover:text-orange-400 font-bold">
                    info@proyecto-cumbre.es
                  </a>
                </div>

                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                  <p className="text-sm text-zinc-400 mb-1">Teléfono</p>
                  <a href="tel:+34692085193" className="text-white font-bold">
                    692 085 193
                  </a>
                </div>

                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                  <p className="text-sm text-zinc-400 mb-1">Dirección postal</p>
                  <p className="text-white text-sm">
                    PS De los Tilos n. 67, 2º-2<br />
                    29006 Málaga
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Back to top */}
        <div className="mt-12 text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>

      </div>
    </div>
  );
}
