// ========================================
// ORDER EMAIL TEMPLATE - FLEXIBLE & STATUS-DRIVEN
// Single template for all order states
// Always-black dark theme enforced
// lib/mail/templates/order-mail-template.ts
// ========================================

export type OrderStatus =
  | 'CREATED'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'EXPIRED';

export interface OrderMailProps {
  status: OrderStatus;
  email: string;
  name: string;
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal?: number;
  shipping?: number;
  total: number;
  shippingAddress?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  reason?: string;
  refundInfo?: string;
  createdAt?: Date;
  paidAt?: Date;
}

interface StatusConfig {
  icon: string;
  title: string;
  subtitle: string;
  accentColor: string;
}

const STATUS_CONFIGS: Record<OrderStatus, StatusConfig> = {
  CREATED: {
    icon: '📝',
    title: 'Pedido creado',
    subtitle: 'Esperando confirmación de pago',
    accentColor: '#71717a',
  },
  PAID: {
    icon: '✓',
    title: 'Pedido confirmado',
    subtitle: 'Hemos recibido tu pedido correctamente',
    accentColor: '#10b981',
  },
  PROCESSING: {
    icon: '⚙️',
    title: 'Preparando tu pedido',
    subtitle: 'Tu pago ha sido confirmado',
    accentColor: '#3b82f6',
  },
  SHIPPED: {
    icon: '📦',
    title: 'Pedido en camino',
    subtitle: 'Tu pedido ya ha salido de nuestro almacén',
    accentColor: '#f97316',
  },
  DELIVERED: {
    icon: '✓',
    title: 'Pedido entregado',
    subtitle: 'Tu pedido ha sido entregado correctamente',
    accentColor: '#10b981',
  },
  CANCELLED: {
    icon: '×',
    title: 'Pedido cancelado',
    subtitle: 'Este pedido ha sido cancelado',
    accentColor: '#ef4444',
  },
  REFUNDED: {
    icon: '↩',
    title: 'Pedido reembolsado',
    subtitle: 'El reembolso ha sido procesado',
    accentColor: '#a855f7',
  },
  EXPIRED: {
    icon: '⏱',
    title: 'Pedido expirado',
    subtitle: 'Este pedido ha expirado',
    accentColor: '#71717a',
  },
};

export function buildOrderMail(props: OrderMailProps): {
  subject: string;
  html: string;
  text: string;
} {
  const config = STATUS_CONFIGS[props.status];
  const subject = `${config.icon} ${config.title} #${props.orderNumber}`;

  return {
    subject,
    html: generateOrderHTML(props, config),
    text: generateOrderText(props, config),
  };
}

function generateOrderHTML(props: OrderMailProps, config: StatusConfig): string {
  const showFullDetails = ['PAID', 'CREATED'].includes(props.status);
  const showTracking = props.status === 'SHIPPED' && props.trackingNumber;
  const showTimeline = props.status === 'PROCESSING';
  const showRefundInfo = ['CANCELLED', 'REFUNDED'].includes(props.status);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark only">
  <meta name="supported-color-schemes" content="dark">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      color-scheme: dark only !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #000000 !important;
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #000000 !important;">

  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #000000 !important; padding: 40px 20px;">
    <tr>
      <td align="center">

        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #0a0a0a !important;">

          <!-- HEADER -->
          <tr>
            <td style="padding: 48px 40px 32px 40px; text-align: center; background-color: #0a0a0a !important;">
              <h1 style="color: #f97316 !important; font-size: 28px; font-weight: 900; margin: 0 0 8px 0; letter-spacing: 1px;">PROYECTO CUMBRE</h1>
              <p style="color: #52525b !important; font-size: 12px; margin: 0; letter-spacing: 0.5px;">TIENDA</p>
            </td>
          </tr>

          <!-- STATUS BADGE -->
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center; background-color: #0a0a0a !important;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #18181b !important; border: 1px solid #27272a; border-radius: 12px; padding: 24px 32px; text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 12px;">${config.icon}</div>
                    <h2 style="color: #fafafa !important; font-size: 18px; font-weight: 700; margin: 0 0 4px 0; letter-spacing: -0.5px;">${config.title}</h2>
                    <p style="color: #a1a1aa !important; font-size: 14px; margin: 0;">${config.subtitle}</p>
                  </td>
                </tr>
              </table>
              <p style="color: #71717a !important; font-size: 13px; margin: 16px 0 0 0; font-family: 'Courier New', monospace;">Pedido #${props.orderNumber}</p>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="padding: 0 40px 48px 40px; background-color: #0a0a0a !important;">

              <p style="color: #fafafa !important; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Hola ${props.name},</p>
              <p style="color: #a1a1aa !important; font-size: 15px; margin: 0 0 32px 0; line-height: 1.7;">${getStatusMessage(props.status)}</p>

              ${showTracking ? `
              <!-- TRACKING INFO -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border: 1px solid #27272a; border-radius: 12px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="color: #e4e4e7 !important; font-size: 14px; font-weight: 600; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 0.5px;">Información de envío</h3>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-bottom: 1px solid #27272a; padding-bottom: 12px; margin-bottom: 12px;">
                      <tr>
                        <td style="color: #71717a !important; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Transportista</td>
                        <td style="color: #e4e4e7 !important; font-size: 14px; font-weight: 600; text-align: right;">${props.carrier || 'N/A'}</td>
                      </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="color: #71717a !important; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Nº seguimiento</td>
                        <td style="color: #e4e4e7 !important; font-size: 14px; font-weight: 600; text-align: right; font-family: 'Courier New', monospace;">${props.trackingNumber}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${props.trackingUrl ? `
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 32px 0;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${props.trackingUrl}" style="display: inline-block; background: #fafafa !important; color: #09090b !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; letter-spacing: 0.3px;">
                      Seguir mi pedido →
                    </a>
                  </td>
                </tr>
              </table>
              ` : ''}
              ` : ''}

              ${showTimeline ? `
              <!-- TIMELINE -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border: 1px solid #27272a; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                <tr>
                  <td>
                    <h3 style="color: #e4e4e7 !important; font-size: 14px; font-weight: 600; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 0.5px;">Próximos pasos</h3>

                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px;">
                      <tr>
                        <td style="width: 32px; padding-right: 16px; vertical-align: top;">
                          <div style="width: 20px; height: 20px; background: #27272a; border: 2px solid #52525b; border-radius: 50%;"></div>
                        </td>
                        <td style="vertical-align: top;">
                          <div style="color: #e4e4e7 !important; font-size: 13px; font-weight: 600; margin-bottom: 4px;">Procesamiento</div>
                          <div style="color: #a1a1aa !important; font-size: 13px;">24-48 horas</div>
                        </td>
                      </tr>
                    </table>

                    <div style="width: 2px; height: 16px; background: #27272a; margin-left: 10px; margin-bottom: 4px;"></div>

                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px;">
                      <tr>
                        <td style="width: 32px; padding-right: 16px; vertical-align: top;">
                          <div style="width: 20px; height: 20px; background: #18181b; border: 2px solid #27272a; border-radius: 50%;"></div>
                        </td>
                        <td style="vertical-align: top;">
                          <div style="color: #a1a1aa !important; font-size: 13px; font-weight: 600; margin-bottom: 4px;">Envío con tracking</div>
                          <div style="color: #71717a !important; font-size: 13px;">Recibirás el número de seguimiento</div>
                        </td>
                      </tr>
                    </table>

                    <div style="width: 2px; height: 16px; background: #27272a; margin-left: 10px; margin-bottom: 4px;"></div>

                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="width: 32px; padding-right: 16px; vertical-align: top;">
                          <div style="width: 20px; height: 20px; background: #18181b; border: 2px solid #27272a; border-radius: 50%;"></div>
                        </td>
                        <td style="vertical-align: top;">
                          <div style="color: #a1a1aa !important; font-size: 13px; font-weight: 600; margin-bottom: 4px;">Entrega</div>
                          <div style="color: #71717a !important; font-size: 13px;">3-5 días laborables</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- PRODUCTOS -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border: 1px solid #27272a; border-radius: 12px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="color: #e4e4e7 !important; font-size: 14px; font-weight: 600; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 0.5px;">${props.status === 'PROCESSING' ? 'Productos en preparación' : 'Productos'}</h3>
                    ${props.items.map((item, index) => `
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: ${index < props.items.length - 1 ? '12px' : '0'}; ${index < props.items.length - 1 ? 'border-bottom: 1px solid #27272a; padding-bottom: 12px;' : ''}">
                        <tr>
                          <td style="color: #a1a1aa !important; font-size: 14px; padding: 0;">${item.quantity}× ${item.name}</td>
                          <td style="color: #e4e4e7 !important; font-size: 14px; font-weight: 600; text-align: right; padding: 0;">${(item.price / 100).toFixed(2)}€</td>
                        </tr>
                      </table>
                    `).join('')}
                    ${showFullDetails && (props.subtotal !== undefined || props.shipping !== undefined) ? `
                      <hr style="border: none; border-top: 2px solid #27272a; margin: 15px 0;" />
                      ${props.subtotal !== undefined ? `
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 8px;">
                        <tr>
                          <td style="color: #a1a1aa !important; font-size: 14px;">Subtotal</td>
                          <td style="color: #e4e4e7 !important; font-size: 14px; font-weight: 600; text-align: right;">${(props.subtotal / 100).toFixed(2)}€</td>
                        </tr>
                      </table>
                      ` : ''}
                      ${props.shipping !== undefined ? `
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 12px;">
                        <tr>
                          <td style="color: #a1a1aa !important; font-size: 14px;">Envío</td>
                          <td style="color: #e4e4e7 !important; font-size: 14px; font-weight: 600; text-align: right;">${props.shipping === 0 ? 'GRATIS' : `${(props.shipping / 100).toFixed(2)}€`}</td>
                        </tr>
                      </table>
                      ` : ''}
                    ` : ''}
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="color: #fafafa !important; font-size: 16px; font-weight: 700;">Total</td>
                        <td style="color: ${config.accentColor} !important; font-size: 18px; font-weight: 700; text-align: right;">${(props.total / 100).toFixed(2)}€</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${showFullDetails && props.shippingAddress ? `
              <!-- DIRECCIÓN -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border: 1px solid #27272a; border-radius: 12px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="color: #e4e4e7 !important; font-size: 14px; font-weight: 600; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.5px;">Dirección de envío</h3>
                    <p style="color: #fafafa !important; font-size: 14px; line-height: 1.8; margin: 0;">
                      ${props.name}<br />
                      ${props.shippingAddress.street}<br />
                      ${props.shippingAddress.postalCode} ${props.shippingAddress.city}<br />
                      ${props.shippingAddress.province}
                    </p>
                  </td>
                </tr>
              </table>
              ` : ''}

              ${showRefundInfo ? `
              <!-- REEMBOLSO INFO -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border: 1px solid #27272a; border-radius: 12px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="color: #e4e4e7 !important; font-size: 14px; font-weight: 600; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">${props.status === 'REFUNDED' ? 'Reembolso procesado' : 'Información de reembolso'}</h3>
                    ${props.reason ? `<p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0 0 16px 0;"><strong style="color: #e4e4e7 !important;">Motivo:</strong> ${props.reason}</p>` : ''}
                    <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0;">
                      ${props.refundInfo || 'El reembolso se procesará automáticamente en los próximos 5-10 días laborables a tu método de pago original.'}
                    </p>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- FOOTER -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding-top: 32px; border-top: 1px solid #27272a;">
                <tr>
                  <td style="text-align: center;">
                    <p style="color: #71717a !important; font-size: 13px; margin: 0 0 8px 0;">${getFooterMessage(props.status)}</p>
                    <p style="color: #f97316 !important; font-size: 14px; font-weight: 700; margin: 0 0 24px 0; letter-spacing: 0.5px;">PROYECTO CUMBRE</p>
                    <p style="color: #52525b !important; font-size: 11px; margin: 0;">Email automático · <a href="mailto:info@proyecto-cumbre.es" style="color: #71717a !important; text-decoration: none;">Contacto</a></p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
}

function generateOrderText(props: OrderMailProps, config: StatusConfig): string {
  return `
${config.title.toUpperCase()} #${props.orderNumber}

Hola ${props.name},

${getStatusMessage(props.status)}

PRODUCTOS:
${props.items.map(item => `${item.quantity}× ${item.name} - ${(item.price / 100).toFixed(2)}€`).join('\n')}

TOTAL: ${(props.total / 100).toFixed(2)}€

${props.trackingNumber ? `\nNÚMERO DE SEGUIMIENTO: ${props.trackingNumber}\nTRANSPORTISTA: ${props.carrier || 'N/A'}` : ''}

${getFooterMessage(props.status)}

Proyecto Cumbre
info@proyecto-cumbre.es
  `.trim();
}

function getStatusMessage(status: OrderStatus): string {
  const messages: Record<OrderStatus, string> = {
    CREATED: 'Tu pedido ha sido creado. Estamos esperando la confirmación del pago.',
    PAID: 'Gracias por tu pedido. A continuación encontrarás todos los detalles.',
    PROCESSING: 'Tu pago ha sido confirmado y ya estamos preparando tu pedido para el envío.',
    SHIPPED: 'Tu pedido ya ha salido de nuestro almacén y está en camino.',
    DELIVERED: 'Tu pedido ha sido entregado correctamente. Esperamos que disfrutes de tus productos.',
    CANCELLED: `Te confirmamos que tu pedido ha sido cancelado.`,
    REFUNDED: 'El reembolso de tu pedido ha sido procesado correctamente.',
    EXPIRED: 'Este pedido ha expirado debido a falta de pago o tiempo límite excedido.',
  };
  return messages[status];
}

function getFooterMessage(status: OrderStatus): string {
  const messages: Record<OrderStatus, string> = {
    CREATED: 'Esperando confirmación de pago',
    PAID: '¡Gracias por tu compra!',
    PROCESSING: 'Gracias por tu paciencia',
    SHIPPED: 'Gracias por tu compra',
    DELIVERED: 'Nos vemos en la montaña',
    CANCELLED: 'Lamentamos las molestias',
    REFUNDED: 'Lamentamos las molestias',
    EXPIRED: 'Esperamos verte pronto',
  };
  return messages[status];
}
