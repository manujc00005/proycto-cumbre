import { formatLicenseType, formatShortLicenseType } from "../constants";
import EmailTemplateBuilder from "./email-template-builder";
import { BaseEventEmailData, ContactFormData, LicenseActivatedData, MembershipEmailData, OrderEmailData } from "./types";

// ========================================
// EMAIL TEMPLATES
// ========================================

export default class EmailTemplates {
  // ========================================
  // MEMBERSHIP TEMPLATES
  // ========================================
  static membershipSuccess(data: MembershipEmailData): string {
    const hasLicense = data.licenseType && data.licenseType !== 'none';
    
    return new EmailTemplateBuilder().build(`
      <h2>Hola ${data.firstName},</h2>
      <p>¡Gracias por unirte a nuestro club de montaña! Estamos encantados de tenerte como socio.</p>
      
      <div class="success-box">
        <div class="success-icon">✅</div>
        <div class="success-title">Pago Completado</div>
        <div class="success-subtitle">Tu membresía está activa</div>
        ${data.amount ? `<div style="font-size: 36px; font-weight: 700; color: #10b981; margin-top: 15px;">${(data.amount / 100).toFixed(2)}€</div>` : ''}
      </div>

      <div class="info-box">
        <h3>Detalles de tu membresía</h3>
        <ul>
          <li><strong>Número de Socio:</strong> ${data.memberNumber}</li>
          <li><strong>Nombre:</strong> ${data.firstName} ${data.lastName}</li>
          <li><strong>Estado:</strong> <span style="color: #10b981; font-weight: 600;">ACTIVO</span></li>
          ${hasLicense ? `<li><strong>Licencia FEDME:</strong> ${formatShortLicenseType(data.licenseType)}</li>` : '<li><strong>Licencia FEDME:</strong> Sin licencia</li>'}
        </ul>
      </div>

      ${hasLicense ? `
        <div class="alert-box">
          <p><strong>📋 Sobre tu licencia federativa</strong></p>
          <p>Tu licencia FEDME será procesada en 48-72 horas. Te notificaremos cuando esté activa.</p>
        </div>
      ` : ''}

      <p>Ya puedes participar en todas nuestras actividades. ¡Nos vemos en la montaña!</p>
      <p style="margin-top: 30px; color: #f97316; font-weight: 600;">Equipo Proyecto Cumbre</p>
    `);
  }

  static licenseActivated(data: LicenseActivatedData): string {
    return new EmailTemplateBuilder().build(`
      <h2>Hola ${data.firstName},</h2>
      <p>Tu licencia FEDME ya está activa y lista para usar.</p>
      
      <div class="success-box">
        <div style="background-color: #064e3b; color: #6ee7b7; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 18px; border: 1px solid #065f46;">
          LICENCIA: ${formatShortLicenseType(data.licenseType)} ACTIVA ✓
        </div>
      </div>

      <div class="info-box">
        <h3>Detalles de tu licencia</h3>
        <ul>
          <li><strong>Número de Socio:</strong> ${data.memberNumber}</li>
          <li><strong>Tipo:</strong> ${formatLicenseType(data.licenseType)}</li>
          <li><strong>Válida hasta:</strong> ${data.validUntil.toLocaleDateString('es-ES', { dateStyle: 'long' })}</li>
        </ul>
      </div>

      <div class="alert-box">
        <p><strong>📱 Accede en la app FEDME</strong></p>
        <p>Descarga la app oficial para tener tu licencia siempre disponible.</p>
      </div>

      <p style="margin-top: 30px; color: #f97316; font-weight: 600;">Equipo Proyecto Cumbre</p>
    `);
  }

  // ========================================
  // EVENT TEMPLATES (GENÉRICO)
  // ========================================
  static eventConfirmation(data: BaseEventEmailData, eventConfig?: {
    whatsappLink?: string;
    features?: string[];
    customMessage?: string;
  }): string {
    return new EmailTemplateBuilder().build(`
      <div class="success-box">
        <div class="success-icon">✅</div>
        <div class="success-title">¡PLAZA CONFIRMADA!</div>
        <div class="success-subtitle">Tu inscripción está completa</div>
      </div>

      <p style="color: #fafafa; font-size: 18px; margin-bottom: 20px;">
        Hola <strong>${data.name}</strong>,
      </p>

      <p>Tu inscripción para <strong>${data.eventName}</strong> ha sido confirmada.</p>

      <div class="info-box">
        <h3>📋 Detalles de tu reserva</h3>
        <div class="info-row">
          <span class="info-label">Nombre</span>
          <span class="info-value">${data.name}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email</span>
          <span class="info-value">${data.email}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Móvil</span>
          <span class="info-value">${data.phone}</span>
        </div>
        ${data.shirtSize ? `
        <div class="info-row">
          <span class="info-label">Talla camiseta</span>
          <span class="info-value">${data.shirtSize}</span>
        </div>
        ` : ''}
        ${data.eventDate ? `
        <div class="info-row">
          <span class="info-label">Fecha del evento</span>
          <span class="info-value">${data.eventDate.toLocaleDateString('es-ES', { dateStyle: 'long' })}</span>
        </div>
        ` : ''}
        <div class="info-row">
          <span class="info-label">Importe pagado</span>
          <span class="info-value">${(data.amount / 100).toFixed(2)}€</span>
        </div>
      </div>

      ${eventConfig?.features ? `
        <div class="info-box">
          <h3>🎁 ¿Qué incluye?</h3>
          <ul>
            ${eventConfig.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      ${eventConfig?.customMessage ? `
        <div class="alert-box">
          ${eventConfig.customMessage}
        </div>
      ` : ''}

      ${eventConfig?.whatsappLink ? `
        <div style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
          <h3 style="color: #ffffff; font-size: 22px; margin-bottom: 15px;">💬 Únete al grupo de WhatsApp</h3>
          <p style="color: #d1fae5; margin-bottom: 20px;">Toda la información clave se compartirá en el grupo privado.</p>
          <a href="${eventConfig.whatsappLink}" class="cta-button" style="background-color: #25D366;">
            Unirse al grupo →
          </a>
        </div>
      ` : ''}

      <p style="margin-top: 40px; color: #fafafa;">Nos vemos en la montaña 🏔️</p>
      <p style="color: #f97316; font-weight: 600;">Equipo Proyecto Cumbre</p>
    `);
  }

  // ========================================
  // MISA TEMPLATE (ESPECIALIZADO)
  // ========================================
  static misaConfirmation(data: BaseEventEmailData, whatsappLink: string): string {
    const customStyles = `
      .misa-header {
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        padding: 50px 30px;
      }
      .misa-header h1 {
        color: #ffffff;
        font-size: 48px;
        font-weight: 900;
        text-transform: uppercase;
      }
      .misa-header .tm {
        font-size: 20px;
        vertical-align: super;
        opacity: 0.7;
      }
    `;

    const content = `
      <div class="success-box">
        <div class="success-icon">✅</div>
        <div class="success-title">¡PLAZA CONFIRMADA!</div>
        <div class="success-subtitle">El pago se ha completado correctamente</div>
      </div>

      <p style="color: #fafafa; font-size: 18px; margin-bottom: 20px;">
        Hola <strong>${data.name}</strong>,
      </p>

      <p>Tu reserva para MISA ha sido confirmada. Ya formas parte de este ritual único.</p>

      <div class="info-box">
        <h3>📋 Detalles de tu reserva</h3>
        <div class="info-row">
          <span class="info-label">Nombre</span>
          <span class="info-value">${data.name}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email</span>
          <span class="info-value">${data.email}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Móvil</span>
          <span class="info-value">${data.phone}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Talla camiseta</span>
          <span class="info-value">${data.shirtSize}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Importe pagado</span>
          <span class="info-value">${(data.amount / 100).toFixed(2)}€</span>
        </div>
      </div>

      <div class="info-box">
        <h3>🎁 ¿Qué incluye tu plaza?</h3>
        <ul>
          <li>👕 Camiseta exclusiva para corredores (talla ${data.shirtSize})</li>
          <li>📍 Coordenadas exactas 2h antes del evento</li>
          <li>📲 Track en vivo 1h antes del inicio</li>
          <li>🔒 Acceso al grupo privado de WhatsApp</li>
          <li>🍻 Post clandestino tras el evento</li>
        </ul>
      </div>

      <div style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
        <h3 style="color: #ffffff; font-size: 22px; margin-bottom: 15px;">💬 Únete al grupo de WhatsApp</h3>
        <p style="color: #d1fae5; margin-bottom: 20px;">
          Toda la información clave se compartirá únicamente en el grupo privado. Si quieres estar preparado, ya sabes dónde entrar.
        </p>
        <a href="${whatsappLink}" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px;">
          Unirse al grupo →
        </a>
      </div>

      <div class="alert-box">
        <p><strong>⏰ Recordatorio importante</strong></p>
        <p>Recibirás las coordenadas exactas 2 horas antes del evento. Mantén activas tus notificaciones.</p>
      </div>

      <p style="margin-top: 40px; color: #fafafa;">Nos vemos en la montaña 🏔️</p>
      <p style="color: #f97316; font-weight: 600;">Equipo Proyecto Cumbre</p>
    `;

    return new EmailTemplateBuilder()
      .withCustomStyles(customStyles)
      .withCustomHeader('MISA™', 'background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 50px 30px;')
      .build(content);
  }

  // ========================================
  // ORDER/SHOP TEMPLATES
  // ========================================
  
  static orderConfirmation(data: OrderEmailData): string {
    return new EmailTemplateBuilder().build(`
      <div class="success-box">
        <div class="success-icon">✅</div>
        <div class="success-title">¡PEDIDO CONFIRMADO!</div>
        <div class="success-subtitle">Hemos recibido tu pedido correctamente</div>
      </div>

      <p style="color: #fafafa; font-size: 18px; margin-bottom: 20px;">
        Hola <strong>${data.name}</strong>,
      </p>

      <p>Gracias por tu pedido. A continuación encontrarás todos los detalles.</p>

      <div class="info-box">
        <h3>📦 Resumen del pedido</h3>
        <div class="info-row">
          <span class="info-label">Número de pedido</span>
          <span class="info-value">#${data.orderNumber}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Fecha</span>
          <span class="info-value">${new Date().toLocaleDateString('es-ES', { dateStyle: 'long' })}</span>
        </div>
      </div>

      <div class="info-box">
        <h3>🛒 Productos</h3>
        ${data.items.map(item => `
          <div class="info-row">
            <span class="info-label">${item.quantity}x ${item.name}</span>
            <span class="info-value">${(item.price / 100).toFixed(2)}€</span>
          </div>
        `).join('')}
        <hr style="border: none; border-top: 2px solid #3f3f46; margin: 15px 0;" />
        <div class="info-row">
          <span class="info-label">Subtotal</span>
          <span class="info-value">${(data.subtotal / 100).toFixed(2)}€</span>
        </div>
        <div class="info-row">
          <span class="info-label">Envío</span>
          <span class="info-value">${data.shipping === 0 ? 'GRATIS' : `${(data.shipping / 100).toFixed(2)}€`}</span>
        </div>
        <div class="info-row" style="font-size: 18px;">
          <span class="info-label"><strong>Total</strong></span>
          <span class="info-value" style="color: #f97316; font-size: 20px;"><strong>${(data.total / 100).toFixed(2)}€</strong></span>
        </div>
      </div>

      <div class="info-box">
        <h3>📍 Dirección de envío</h3>
        <p style="color: #fafafa; line-height: 1.8;">
          ${data.name}<br />
          ${data.shippingAddress.street}<br />
          ${data.shippingAddress.postalCode} ${data.shippingAddress.city}<br />
          ${data.shippingAddress.province}
        </p>
      </div>

      <div class="alert-box">
        <p><strong>📅 ¿Cuándo recibiré mi pedido?</strong></p>
        <p>Procesaremos tu pedido en 24-48 horas. Te enviaremos un email con el número de seguimiento cuando se envíe.</p>
      </div>

      <p style="margin-top: 40px; color: #fafafa;">¡Gracias por tu compra!</p>
      <p style="color: #f97316; font-weight: 600;">Equipo Proyecto Cumbre</p>
    `);
  }

  static orderShipped(data: {
    email: string;
    name: string;
    orderNumber: string;
    trackingNumber: string;
    trackingUrl: string;
    carrier: string;
  }): string {
    return new EmailTemplateBuilder().build(`
      <div class="success-box">
        <div class="success-icon">📦</div>
        <div class="success-title">¡TU PEDIDO ESTÁ EN CAMINO!</div>
        <div class="success-subtitle">Pedido #${data.orderNumber}</div>
      </div>

      <p style="color: #fafafa; font-size: 18px; margin-bottom: 20px;">
        Hola <strong>${data.name}</strong>,
      </p>

      <p>Tu pedido ya ha sido enviado y está en camino. Puedes seguir su estado en tiempo real.</p>

      <div class="info-box">
        <h3>🚚 Información de envío</h3>
        <div class="info-row">
          <span class="info-label">Transportista</span>
          <span class="info-value">${data.carrier}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Número de seguimiento</span>
          <span class="info-value">${data.trackingNumber}</span>
        </div>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.trackingUrl}" class="cta-button">
          Seguir mi pedido →
        </a>
      </div>

      <div class="alert-box">
        <p><strong>⏰ Tiempo estimado de entrega</strong></p>
        <p>Tu pedido llegará en 3-5 días laborables. Recibirás una notificación cuando esté próximo a entregarse.</p>
      </div>

      <p style="margin-top: 40px; color: #f97316; font-weight: 600;">Equipo Proyecto Cumbre</p>
    `);
  }

  // ========================================
  // CONTACT FORM
  // ========================================
  static contactForm(data: ContactFormData): string {
    return new EmailTemplateBuilder().build(`
      <h2>Nuevo mensaje de contacto</h2>
      
      <div class="info-box">
        <h3>Información del remitente</h3>
        <p><strong>Nombre:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Asunto:</strong> ${data.subject}</p>
      </div>

      <div style="background-color: #09090b; border-left: 4px solid #f97316; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="color: #e4e4e7; white-space: pre-wrap; line-height: 1.8;">${data.message}</p>
      </div>

      <p style="color: #a1a1aa; font-size: 14px;">
        Responde directamente a este email para contactar con ${data.name}.
      </p>
    `);
  }
}