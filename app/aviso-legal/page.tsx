import { Metadata } from "next";
import Link from "next/link";
import { Scale, ArrowLeft, Mail, MapPin, Phone, Building } from "lucide-react";
import { DEFAULT_ORGANIZER } from "@/lib/organizer";

export const metadata: Metadata = {
  title: "Aviso Legal | Proyecto Cumbre",
  description: "Aviso Legal y Condiciones de Uso de Proyecto Cumbre",
};

export default function AvisoLegalPage() {
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
            <Scale className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Aviso Legal
          </h1>
          <p className="text-zinc-400">
            Última actualización: 11 de diciembre de 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-zinc max-w-none">
          {/* Section 1 */}
          <section className="mb-12 bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">1.</span>
              Datos Identificativos
            </h2>

            <div className="space-y-4 text-zinc-300">
              <p className="leading-relaxed">
                En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de
                julio, de Servicios de la Sociedad de la Información y Comercio
                Electrónico (LSSI-CE), se informa de los siguientes datos:
              </p>

              <div className="bg-zinc-800/50 rounded-lg p-6 space-y-3">
                <p className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                  <span>
                    <strong className="text-white">Denominación social:</strong>{" "}
                    {DEFAULT_ORGANIZER.name.toUpperCase()}
                  </span>
                </p>
                <p>
                  <strong className="text-white">NIF:</strong>
                  {DEFAULT_ORGANIZER.nif}
                </p>
                <p className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                  <span>
                    <strong className="text-white">Domicilio social:</strong>{" "}
                    {DEFAULT_ORGANIZER.address}
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span>
                    <strong className="text-white">Email:</strong>{" "}
                    <a
                      href="mailto:info@proyecto-cumbre.es"
                      className="text-orange-500 hover:text-orange-400"
                    >
                      {DEFAULT_ORGANIZER.email}
                    </a>
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span>
                    <strong className="text-white">Teléfono:</strong>{" "}
                    {DEFAULT_ORGANIZER.phone}
                  </span>
                </p>
                <p>
                  <strong className="text-white">Sitio web:</strong>{" "}
                  <a
                    href="https://proyecto-cumbre.es"
                    className="text-orange-500 hover:text-orange-400"
                  >
                    {DEFAULT_ORGANIZER.web}
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-12 bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">2.</span>
              Objeto
            </h2>

            <div className="space-y-4 text-zinc-300">
              <p className="leading-relaxed">
                Proyecto Cumbre es un club de montaña dedicado a la organización
                de actividades deportivas de montañismo, senderismo, trail
                running y deportes relacionados. Este sitio web tiene como
                finalidad:
              </p>

              <ul className="space-y-2 list-none">
                <li className="flex items-start gap-3">
                  <span className="text-orange-500">•</span>
                  <span>
                    Proporcionar información sobre el club y sus actividades
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500">•</span>
                  <span>Gestionar altas de socios y licencias federativas</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500">•</span>
                  <span>Facilitar la inscripción a eventos deportivos</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500">•</span>
                  <span>Vender merchandising oficial del club</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500">•</span>
                  <span>Comunicarse con socios y participantes</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-12 bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">3.</span>
              Condiciones de Uso
            </h2>

            <div className="space-y-6 text-zinc-300">
              <div>
                <h3 className="text-white font-bold text-lg mb-3">
                  3.1 Generalidades
                </h3>
                <p className="leading-relaxed mb-3">
                  El acceso y uso de este sitio web atribuye la condición de
                  usuario y supone la aceptación plena de todas las condiciones
                  incluidas en este Aviso Legal y en la Política de Privacidad.
                </p>
                <p className="leading-relaxed">
                  El usuario se compromete a hacer un uso adecuado del sitio web
                  y de los contenidos, de conformidad con:
                </p>
                <ul className="mt-2 space-y-2 list-none ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">✓</span>
                    <span>La legislación aplicable en cada momento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">✓</span>
                    <span>Las presentes Condiciones Generales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">✓</span>
                    <span>
                      La moral y buenas costumbres generalmente aceptadas
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">✓</span>
                    <span>El orden público</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-bold text-lg mb-3">
                  3.2 Uso responsable
                </h3>
                <p className="leading-relaxed mb-3">
                  El usuario se compromete a{" "}
                  <strong className="text-white">NO</strong>:
                </p>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <ul className="space-y-2 list-none">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      <span>
                        Hacer uso no autorizado o fraudulento del sitio web
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      <span>
                        Acceder a áreas restringidas del sistema informático
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      <span>Introducir virus o código malicioso</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      <span>
                        Realizar actividades publicitarias sin autorización
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      <span>
                        Realizar ingeniería inversa o modificar el código fuente
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      <span>Suplantar la identidad de otros usuarios</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      <span>
                        Reproducir, copiar o distribuir contenidos sin
                        autorización
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-12 bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">4.</span>
              Propiedad Intelectual e Industrial
            </h2>

            <div className="space-y-6 text-zinc-300">
              <div>
                <h3 className="text-white font-bold text-lg mb-3">
                  4.1 Derechos de autor
                </h3>
                <p className="leading-relaxed">
                  Todos los contenidos del sitio web (textos, fotografías,
                  gráficos, imágenes, iconos, tecnología, software, diseño
                  gráfico, código fuente, etc.) son propiedad intelectual de
                  Proyecto Cumbre o de sus legítimos titulares.
                </p>
                <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded mt-3">
                  <p className="text-sm text-orange-300">
                    <strong>⚠️</strong> Quedan expresamente prohibidas la
                    reproducción, distribución y comunicación pública, incluida
                    su modalidad de puesta a disposición, de la totalidad o
                    parte de los contenidos sin autorización previa y por
                    escrito.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-bold text-lg mb-3">
                  4.2 Marcas
                </h3>
                <p className="leading-relaxed">
                  <strong className="text-orange-500">"Proyecto Cumbre"</strong>
                  , <strong className="text-orange-500">"MISA"</strong> y demás
                  signos distintivos son marcas registradas. Queda prohibido su
                  uso sin autorización expresa.
                </p>
              </div>

              <div>
                <h3 className="text-white font-bold text-lg mb-3">
                  4.3 Contenido generado por usuarios
                </h3>
                <p className="leading-relaxed mb-3">
                  Si subes fotografías o contenido al sitio web o grupos de
                  WhatsApp:
                </p>
                <ul className="space-y-2 list-none ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Conservas tus derechos de autor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>
                      Nos concedes una licencia para usarlas en nuestra web,
                      redes sociales y material promocional del club
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>
                      Garantizas que tienes derecho a compartir dicho contenido
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>
                      Aceptas que otros participantes puedan también conservar y
                      compartir dichas fotografías
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-12 bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">5.</span>
              Limitación de Responsabilidad
            </h2>

            <div className="space-y-6 text-zinc-300">
              <div>
                <h3 className="text-white font-bold text-lg mb-3">
                  5.1 Contenidos
                </h3>
                <p className="leading-relaxed">
                  Proyecto Cumbre no garantiza la ausencia de errores en el
                  acceso al sitio web, en su contenido, ni que este se encuentre
                  actualizado, aunque desarrollará los mejores esfuerzos para
                  evitarlos y actualizarlos.
                </p>
              </div>

              <div>
                <h3 className="text-white font-bold text-lg mb-3">
                  5.2 Disponibilidad
                </h3>
                <p className="leading-relaxed">
                  No se garantiza la disponibilidad continua del sitio web.
                  Proyecto Cumbre no será responsable de interrupciones del
                  servicio por mantenimiento, actualizaciones o causas técnicas.
                </p>
              </div>

              <div>
                <h3 className="text-white font-bold text-lg mb-3">
                  5.3 Enlaces externos
                </h3>
                <p className="leading-relaxed">
                  El sitio web puede contener enlaces a sitios de terceros.
                  Proyecto Cumbre no se hace responsable del contenido de dichos
                  sitios ni de sus políticas de privacidad.
                </p>
              </div>

              <div>
                <h3 className="text-white font-bold text-lg mb-3">
                  5.4 Actividades deportivas
                </h3>
                <div className="bg-yellow-500/10 border-2 border-yellow-500/50 rounded-lg p-6">
                  <p className="text-yellow-300 font-bold mb-3 flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    IMPORTANTE
                  </p>
                  <p className="leading-relaxed mb-3">
                    Las actividades de montaña implican riesgos inherentes. Al
                    inscribirte en eventos:
                  </p>
                  <ul className="space-y-2 list-none">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>
                        Declaras estar en condiciones físicas adecuadas
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>Asumes los riesgos propios de la actividad</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>
                        Te comprometes a llevar el material recomendado
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>
                        Aceptas seguir las indicaciones de los organizadores
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>
                        Liberas de responsabilidad al club por accidentes
                        derivados de tu negligencia
                      </span>
                    </li>
                  </ul>
                  <div className="bg-zinc-900/50 rounded p-4 mt-4">
                    <p className="text-sm">
                      <strong className="text-white">
                        Se recomienda encarecidamente contar con:
                      </strong>
                    </p>
                    <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
                      <li>Seguro de accidentes personal</li>
                      <li>
                        Licencia federativa FEDME (incluye seguro de RC y
                        accidentes)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-12 bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">6.</span>
              Política de Pagos y Devoluciones
            </h2>

            <div className="space-y-6 text-zinc-300">
              <div>
                <h3 className="text-white font-bold text-lg mb-3">
                  6.1 Formas de pago
                </h3>
                <p className="leading-relaxed mb-3">
                  Los pagos se procesan mediante{" "}
                  <strong className="text-white">Stripe</strong>, cumpliendo con
                  el estándar PCI-DSS. Aceptamos:
                </p>
                <ul className="space-y-2 list-none ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">💳</span>
                    <span>
                      Tarjetas de crédito/débito (Visa, Mastercard, American
                      Express)
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-bold text-lg mb-3">
                  6.2 Precios
                </h3>
                <p className="leading-relaxed">
                  Todos los precios incluyen{" "}
                  <strong className="text-white">IVA</strong>. Los precios
                  pueden modificarse sin previo aviso, aunque se respetarán los
                  precios mostrados en el momento de la compra.
                </p>
              </div>

              <div>
                <h3 className="text-white font-bold text-lg mb-3">
                  6.3 Cuotas de socio
                </h3>
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <p className="leading-relaxed">
                    Las cuotas de membresía son{" "}
                    <strong className="text-orange-500">anuales</strong> y{" "}
                    <strong className="text-orange-500">
                      no reembolsables
                    </strong>{" "}
                    una vez pagadas, salvo causa justificada (enfermedad grave,
                    traslado de residencia, etc.) que será evaluada caso por
                    caso.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-bold text-lg mb-3">
                  6.4 Inscripciones a eventos
                </h3>
                <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                  <p className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✗</span>
                    <span>
                      Las inscripciones a eventos son{" "}
                      <strong className="text-white">NO REEMBOLSABLES</strong>{" "}
                      salvo cancelación del evento por parte del club
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>
                      Si el evento se cancela, se devolverá el{" "}
                      <strong className="text-white">100% del importe</strong>
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✗</span>
                    <span>
                      Las bajas voluntarias no dan derecho a devolución
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">↔</span>
                    <span>
                      Es posible{" "}
                      <strong className="text-white">
                        transferir tu plaza
                      </strong>{" "}
                      a otro participante notificando con{" "}
                      <strong className="text-white">48h de antelación</strong>
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-bold text-lg mb-3">
                  6.5 Productos (merchandising)
                </h3>
                <p className="leading-relaxed mb-3">
                  Derecho de desistimiento según la Ley General para la Defensa
                  de los Consumidores y Usuarios:
                </p>
                <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                  <p className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>
                      <strong className="text-white">14 días naturales</strong>{" "}
                      desde la recepción del producto
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>
                      El producto debe estar{" "}
                      <strong className="text-white">sin usar</strong> y en su{" "}
                      <strong className="text-white">embalaje original</strong>
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>
                      Los gastos de devolución corren a cargo del comprador
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>
                      Reembolso en un plazo máximo de 14 días desde la recepción
                      del producto devuelto
                    </span>
                  </p>
                </div>
                <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded mt-3">
                  <p className="text-sm text-orange-300">
                    <strong>Excepciones:</strong> Productos personalizados o
                    fabricados bajo pedido no admiten devolución.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-12 bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">7.</span>
              Ley Aplicable y Jurisdicción
            </h2>

            <div className="space-y-4 text-zinc-300">
              <p className="leading-relaxed">
                Las presentes Condiciones se rigen por la{" "}
                <strong className="text-white">legislación española</strong>.
              </p>

              <p className="leading-relaxed">
                Para la resolución de cualquier controversia, las partes se
                someterán a los{" "}
                <strong className="text-white">
                  Juzgados y Tribunales del domicilio del usuario consumidor
                </strong>
                . En caso de usuarios no consumidores, a los Juzgados y
                Tribunales de <strong className="text-white">Málaga</strong>.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-12 bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">8.</span>
              Modificaciones
            </h2>

            <div className="space-y-4 text-zinc-300">
              <p className="leading-relaxed">
                Proyecto Cumbre se reserva el derecho a modificar este Aviso
                Legal en cualquier momento. Los cambios serán efectivos desde su
                publicación en el sitio web.
              </p>

              <p className="leading-relaxed">
                Se recomienda revisar periódicamente las presentes Condiciones.
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
                Para cualquier consulta sobre este Aviso Legal:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                  <p className="text-sm text-zinc-400 mb-1">Email</p>
                  <a
                    href="mailto:info@proyecto-cumbre.es"
                    className="text-orange-500 hover:text-orange-400 font-bold"
                  >
                    info@proyecto-cumbre.es
                  </a>
                </div>

                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                  <p className="text-sm text-zinc-400 mb-1">Teléfono</p>
                  <a href="tel:+34692085193" className="text-white font-bold">
                    692 085 193
                  </a>
                </div>

                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800 md:col-span-2">
                  <p className="text-sm text-zinc-400 mb-1">Dirección postal</p>
                  <p className="text-white">
                    PS De los Tilos n. 67, planta/piso 2 puerta 2<br />
                    29006 Málaga (MÁLAGA)
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-zinc-500 text-sm">
          <p>Fecha de última revisión: 11 de diciembre de 2025</p>
        </div>

        {/* Back to top */}
        <div className="mt-8 text-center">
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
