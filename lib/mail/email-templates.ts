// ========================================
// EMAIL TEMPLATES - MINIMAL PROFESSIONAL
// Maquetación correcta con TABLES (email-safe)
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
  // MEMBERSHIP TEMPLATES (sin cambios)
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
  // 🆕 ORDER/SHOP TEMPLATES - MINIMAL PROFESSIONAL
  // Maquetación correcta con TABLES
  // ========================================

  /**
   * Email de confirmación inicial (sin cambios)
   */
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

  /**
   * 🆕 Email cuando el pedido está siendo procesado
   * MAQUETACIÓN CORRECTA CON TABLES
   */
  static orderProcessing(data: {
    email: string;
    name: string;
    orderNumber: string;
    items: Array<{
      name: string;
      quantity: number;
    }>;
  }): string {
    return new EmailTemplateBuilder().build(`
      <!-- HEADER MINIMALISTA CON TABLE -->
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; margin-bottom: 32px;">
        <tr>
          <td style="padding: 32px; text-align: center;">
            <!-- Emoji en círculo -->
            <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 16px auto;">
              <tr>
                <td style="width: 48px; height: 48px; background: #27272a; border-radius: 50%; text-align: center; vertical-align: middle;">
                  <span style="font-size: 20px; line-height: 48px;">⚙️</span>
                </td>
              </tr>
            </table>
            <!-- Título -->
            <h2 style="color: #fafafa; font-size: 20px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: -0.5px;">Preparando tu pedido</h2>
            <p style="color: #71717a; font-size: 14px; margin: 0; font-family: 'Courier New', monospace;">Pedido #${data.orderNumber}</p>
          </td>
        </tr>
      </table>

      <p style="color: #fafafa; font-size: 16px; margin-bottom: 8px;">
        Hola <strong>${data.name}</strong>,
      </p>

      <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">
        Tu pago ha sido confirmado y ya estamos preparando tu pedido para el envío.
      </p>

      <!-- PRODUCTOS CON TABLE -->
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; margin-bottom: 32px;">
        <tr>
          <td style="padding: 24px;">
            <h3 style="color: #e4e4e7; font-size: 14px; font-weight: 600; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 0.5px;">Productos en preparación</h3>
            ${data.items.map((item, index) => `
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: ${index < data.items.length - 1 ? '12px' : '0'}; ${index < data.items.length - 1 ? 'border-bottom: 1px solid #27272a; padding-bottom: 12px;' : ''}">
                <tr>
                  <td style="color: #a1a1aa; font-size: 14px; padding: 0;">${item.quantity}× ${item.name}</td>
                  <td style="color: #52525b; font-size: 18px; text-align: right; padding: 0;">✓</td>
                </tr>
              </table>
            `).join('')}
          </td>
        </tr>
      </table>

      <!-- TIMELINE CON TABLE -->
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; margin-bottom: 32px;">
        <tr>
          <td style="padding: 24px;">
            <h3 style="color: #e4e4e7; font-size: 14px; font-weight: 600; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 0.5px;">Próximos pasos</h3>
            
            <!-- Step 1 -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 20px;">
              <tr>
                <td style="width: 32px; padding-right: 16px; vertical-align: top;">
                  <div style="width: 20px; height: 20px; background: #27272a; border: 2px solid #52525b; border-radius: 50%;"></div>
                </td>
                <td style="vertical-align: top;">
                  <div style="color: #e4e4e7; font-size: 13px; font-weight: 600; margin-bottom: 4px;">Procesamiento</div>
                  <div style="color: #a1a1aa; font-size: 13px;">24-48 horas</div>
                </td>
              </tr>
            </table>
            
            <!-- Connector 1 -->
            <div style="width: 2px; height: 16px; background: #27272a; margin-left: 10px; margin-bottom: 4px;"></div>
            
            <!-- Step 2 -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 20px;">
              <tr>
                <td style="width: 32px; padding-right: 16px; vertical-align: top;">
                  <div style="width: 20px; height: 20px; background: #18181b; border: 2px solid #27272a; border-radius: 50%;"></div>
                </td>
                <td style="vertical-align: top;">
                  <div style="color: #a1a1aa; font-size: 13px; font-weight: 600; margin-bottom: 4px;">Envío con tracking</div>
                  <div style="color: #71717a; font-size: 13px;">Recibirás el número de seguimiento</div>
                </td>
              </tr>
            </table>
            
            <!-- Connector 2 -->
            <div style="width: 2px; height: 16px; background: #27272a; margin-left: 10px; margin-bottom: 4px;"></div>
            
            <!-- Step 3 -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="width: 32px; padding-right: 16px; vertical-align: top;">
                  <div style="width: 20px; height: 20px; background: #18181b; border: 2px solid #27272a; border-radius: 50%;"></div>
                </td>
                <td style="vertical-align: top;">
                  <div style="color: #a1a1aa; font-size: 13px; font-weight: 600; margin-bottom: 4px;">Entrega</div>
                  <div style="color: #71717a; font-size: 13px;">3-5 días laborables</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="margin-top: 40px; color: #71717a; font-size: 14px;">Gracias por tu paciencia,</p>
      <p style="color: #f97316; font-weight: 600; font-size: 14px; margin-top: 4px;">Equipo Proyecto Cumbre</p>
    `);
  }

  /**
   * 🆕 Email cuando el pedido ha sido enviado
   * MAQUETACIÓN CORRECTA CON TABLES
   */
  static orderShipped(data: {
    email: string;
    name: string;
    orderNumber: string;
    trackingNumber: string;
    trackingUrl: string;
    carrier: string;
  }): string {
    return new EmailTemplateBuilder().build(`
      <!-- HEADER CON TABLE -->
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; margin-bottom: 32px;">
        <tr>
          <td style="padding: 32px; text-align: center;">
            <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 16px auto;">
              <tr>
                <td style="width: 48px; height: 48px; background: #27272a; border-radius: 50%; text-align: center; vertical-align: middle;">
                  <span style="font-size: 20px; line-height: 48px;">📦</span>
                </td>
              </tr>
            </table>
            <h2 style="color: #fafafa; font-size: 20px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: -0.5px;">Pedido en camino</h2>
            <p style="color: #71717a; font-size: 14px; margin: 0; font-family: 'Courier New', monospace;">Pedido #${data.orderNumber}</p>
          </td>
        </tr>
      </table>

      <p style="color: #fafafa; font-size: 16px; margin-bottom: 8px;">
        Hola <strong>${data.name}</strong>,
      </p>

      <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">
        Tu pedido ya ha salido de nuestro almacén y está en camino.
      </p>

      <!-- INFO ENVÍO CON TABLE -->
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; margin-bottom: 24px;">
        <tr>
          <td style="padding: 24px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-bottom: 1px solid #27272a; padding-bottom: 12px; margin-bottom: 12px;">
              <tr>
                <td style="color: #71717a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Transportista</td>
                <td style="color: #e4e4e7; font-size: 14px; font-weight: 600; text-align: right;">${data.carrier}</td>
              </tr>
            </table>
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="color: #71717a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Nº seguimiento</td>
                <td style="color: #e4e4e7; font-size: 14px; font-weight: 600; text-align: right; font-family: 'Courier New', monospace;">${data.trackingNumber}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- CTA BOTÓN -->
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 32px 0;">
        <tr>
          <td style="text-align: center;">
            <a href="${data.trackingUrl}" style="display: inline-block; background: #fafafa; color: #09090b; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; letter-spacing: 0.3px;">
              Seguir mi pedido →
            </a>
          </td>
        </tr>
      </table>

      <!-- TIEMPO ESTIMADO -->
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; margin-bottom: 32px;">
        <tr>
          <td style="padding: 20px; text-align: center;">
            <p style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">Tiempo estimado</p>
            <p style="color: #e4e4e7; font-size: 16px; font-weight: 600; margin: 0;">3-5 días laborables</p>
          </td>
        </tr>
      </table>

      <!-- CONSEJOS -->
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #18181b; border-left: 2px solid #3f3f46; border-radius: 4px; margin-bottom: 32px;">
        <tr>
          <td style="padding: 16px 20px;">
            <p style="color: #a1a1aa; font-size: 13px; line-height: 1.7; margin: 0 0 8px 0;">• Mantén tu teléfono a mano</p>
            <p style="color: #a1a1aa; font-size: 13px; line-height: 1.7; margin: 0 0 8px 0;">• Asegúrate de que alguien pueda recibir el paquete</p>
            <p style="color: #a1a1aa; font-size: 13px; line-height: 1.7; margin: 0;">• Revisa el paquete al recibirlo</p>
          </td>
        </tr>
      </table>

      <p style="margin-top: 40px; color: #71717a; font-size: 14px;">Gracias por tu compra,</p>
      <p style="color: #f97316; font-weight: 600; font-size: 14px; margin-top: 4px;">Equipo Proyecto Cumbre</p>
    `);
  }

  /**
   * 🆕 Email cuando el pedido ha sido entregado
   * MAQUETACIÓN CORRECTA CON TABLES
   */
  static orderDelivered(data: {
    email: string;
    name: string;
    orderNumber: string;
  }): string {
    return new EmailTemplateBuilder().build(`
      <!-- HEADER CON TABLE -->
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; margin-bottom: 32px;">
        <tr>
          <td style="padding: 32px; text-align: center;">
            <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 16px auto;">
              <tr>
                <td style="width: 48px; height: 48px; background: #27272a; border-radius: 50%; text-align: center; vertical-align: middle;">
                  <span style="font-size: 24px; line-height: 48px;">✓</span>
                </td>
              </tr>
            </table>
            <h2 style="color: #fafafa; font-size: 20px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: -0.5px;">Pedido entregado</h2>
            <p style="color: #71717a; font-size: 14px; margin: 0; font-family: 'Courier New', monospace;">Pedido #${data.orderNumber}</p>
          </td>
        </tr>
      </table>

      <p style="color: #fafafa; font-size: 16px; margin-bottom: 8px;">
        Hola <strong>${data.name}</strong>,
      </p>

      <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">
        Tu pedido ha sido entregado correctamente. Esperamos que disfrutes de tus productos.
      </p>

      <!-- TODO CORRECTO -->
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; margin-bottom: 24px;">
        <tr>
          <td style="padding: 24px;">
            <h3 style="color: #e4e4e7; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">¿Todo correcto?</h3>
            <p style="color: #a1a1aa; font-size: 13px; line-height: 1.7; margin: 0 0 20px 0;">
              Si hay algún problema con tu pedido, contáctanos en las próximas 48 horas.
            </p>
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="text-align: center;">
                  <a href="mailto:info@proyecto-cumbre.es" style="display: inline-block; background: #27272a; color: #fafafa; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px;">
                    Contactar soporte
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- FEEDBACK -->
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; margin-bottom: 32px;">
        <tr>
          <td style="padding: 24px;">
            <h3 style="color: #e4e4e7; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">¿Te ha gustado tu experiencia?</h3>
            <p style="color: #a1a1aa; font-size: 13px; line-height: 1.7; margin: 0;">
              Tu opinión es muy importante para nosotros. Si estás satisfecho con tu compra, nos encantaría que compartieras tu experiencia.
            </p>
          </td>
        </tr>
      </table>

      <p style="margin-top: 40px; color: #71717a; font-size: 14px;">Nos vemos en la montaña,</p>
      <p style="color: #f97316; font-weight: 600; font-size: 14px; margin-top: 4px;">Equipo Proyecto Cumbre</p>
    `);
  }

  /**
   * 🆕 Email cuando el pedido ha sido cancelado
   * MAQUETACIÓN CORRECTA CON TABLES
   */
  static orderCancelled(data: {
    email: string;
    name: string;
    orderNumber: string;
    reason?: string;
    refundInfo?: string;
  }): string {
    return new EmailTemplateBuilder().build(`
      <!-- HEADER CON TABLE -->
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #18181b; border: 1px solid #3f3f46; border-radius: 12px; margin-bottom: 32px;">
        <tr>
          <td style="padding: 32px; text-align: center;">
            <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 16px auto;">
              <tr>
                <td style="width: 48px; height: 48px; background: #27272a; border-radius: 50%; text-align: center; vertical-align: middle;">
                  <span style="font-size: 24px; line-height: 48px; color: #fafafa;">×</span>
                </td>
              </tr>
            </table>
            <h2 style="color: #fafafa; font-size: 20px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: -0.5px;">Pedido cancelado</h2>
            <p style="color: #71717a; font-size: 14px; margin: 0; font-family: 'Courier New', monospace;">Pedido #${data.orderNumber}</p>
          </td>
        </tr>
      </table>

      <p style="color: #fafafa; font-size: 16px; margin-bottom: 8px;">
        Hola <strong>${data.name}</strong>,
      </p>

      <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">
        Te confirmamos que tu pedido <strong>#${data.orderNumber}</strong> ha sido cancelado.
      </p>

      ${data.reason ? `
      <!-- MOTIVO -->
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; margin-bottom: 24px;">
        <tr>
          <td style="padding: 24px;">
            <h3 style="color: #e4e4e7; font-size: 14px; font-weight: 600; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">Motivo</h3>
            <p style="color: #a1a1aa; font-size: 14px; line-height: 1.7; margin: 0;">${data.reason}</p>
          </td>
        </tr>
      </table>
      ` : ''}

      <!-- REEMBOLSO -->
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; margin-bottom: 24px;">
        <tr>
          <td style="padding: 24px;">
            <h3 style="color: #e4e4e7; font-size: 14px; font-weight: 600; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">Reembolso</h3>
            <p style="color: #a1a1aa; font-size: 13px; line-height: 1.7; margin: 0;">
              ${data.refundInfo || 'Si realizaste el pago, se procesará el reembolso automáticamente en los próximos 5-10 días laborables.'}
            </p>
          </td>
        </tr>
      </table>

      <!-- AYUDA -->
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; margin-bottom: 32px;">
        <tr>
          <td style="padding: 24px;">
            <h3 style="color: #e4e4e7; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">¿Necesitas ayuda?</h3>
            <p style="color: #a1a1aa; font-size: 13px; line-height: 1.7; margin: 0 0 20px 0;">
              Si tienes alguna pregunta sobre la cancelación o el reembolso, contáctanos.
            </p>
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="text-align: center;">
                  <a href="mailto:info@proyecto-cumbre.es" style="display: inline-block; background: #27272a; color: #fafafa; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px;">
                    Contactar soporte
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="margin-top: 40px; color: #71717a; font-size: 14px;">Lamentamos las molestias,</p>
      <p style="color: #f97316; font-weight: 600; font-size: 14px; margin-top: 4px;">Equipo Proyecto Cumbre</p>
    `);
  }

  // ========================================
  // CONTACT FORM (sin cambios)
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
