// ========================================
// EMAIL TEMPLATES - LEGACY (Memberships & Orders)
// lib/email/email-templates.ts
// ========================================

import { formatLicenseType, formatShortLicenseType } from '../constants';
import EmailTemplateBuilder from './email-template-builder';
import {
  ContactFormData,
  LicenseActivatedData,
  MembershipEmailData,
  OrderEmailData,
} from './types';

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

  static membershipFailed(data: MembershipEmailData): string {
    return new EmailTemplateBuilder().build(`
      <h2>Hola ${data.firstName},</h2>
      <p>Hemos recibido tu solicitud de membresía, pero hay un problema con el procesamiento del pago.</p>
      
      <div class="error-box">
        <span class="error-icon">⚠️</span>
        <strong>No se pudo completar el pago</strong>
        <p>• El pago fue rechazado o cancelado por tu banco</p>
        <p>• Tu membresía no ha sido activada</p>
        <p>• No se te ha realizado ningún cargo</p>
      </div>

      <div class="info-box">
        <h3>¿Qué puedes hacer?</h3>
        <ul>
          <li><strong>Reintentar el pago</strong> desde nuestra web usando otra tarjeta</li>
          <li><strong>Contactarnos</strong> si crees que hay un error: info@proyecto-cumbre.es</li>
          <li><strong>Verificar con tu banco</strong> que la tarjeta permite pagos online internacionales</li>
        </ul>
      </div>

      <p style="margin-top: 30px; color: #fafafa;">Estamos aquí para ayudarte:</p>
      <p style="color: #f97316; font-weight: 600;">📧 info@proyecto-cumbre.es</p>
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
