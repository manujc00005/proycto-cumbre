// ========================================
// ORDER EMAIL TEMPLATE - MODULAR & STATUS-DRIVEN
// Dark theme guaranteed across all clients
// Single template for all order states
// lib/mail/templates/order-mail-template.ts
// ========================================

import {
  emailBase,
  emailHeader,
  statusBadge,
  contentWrapper,
  greetingSection,
  contentBox,
  detailRow,
  infoBox,
  emailFooter,
  divider,
} from '../email-components';

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
  
  // Order number subtitle
  const orderNumberText = `<p style="color: #71717a !important; font-size: 12px; margin: 16px 0 0 0; font-family: 'Courier New', monospace; line-height: 1;">Pedido #${props.orderNumber}</p>`;
  
  // Build items list
  let itemsContent = props.items.map((item, index) => {
    const isLast = index === props.items.length - 1;
    const borderBottom = isLast && !showFullDetails ? '' : 'border-bottom: 1px solid #27272a;';
    const paddingBottom = isLast && !showFullDetails ? '0' : '12px';
    const marginBottom = isLast && !showFullDetails ? '0' : '12px';
    
    return `
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: ${marginBottom}; padding-bottom: ${paddingBottom}; ${borderBottom}">
        <tr>
          <td style="color: #a1a1aa !important; font-size: 13px; padding: 0; line-height: 1.5;">${item.quantity}× ${item.name}</td>
          <td style="color: #e4e4e7 !important; font-size: 14px; font-weight: 600; text-align: right; padding: 0; line-height: 1.5;">${(item.price / 100).toFixed(2)}€</td>
        </tr>
      </table>
    `;
  }).join('');
  
  // Add subtotal and shipping if shown
  if (showFullDetails) {
    itemsContent += '<div style="border-top: 2px solid #27272a; margin: 15px 0;"></div>';
    
    if (props.subtotal !== undefined) {
      itemsContent += `
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 8px;">
          <tr>
            <td style="color: #a1a1aa !important; font-size: 13px; line-height: 1.5;">Subtotal</td>
            <td style="color: #e4e4e7 !important; font-size: 14px; font-weight: 600; text-align: right; line-height: 1.5;">${(props.subtotal / 100).toFixed(2)}€</td>
          </tr>
        </table>
      `;
    }
    
    if (props.shipping !== undefined) {
      itemsContent += `
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 12px;">
          <tr>
            <td style="color: #a1a1aa !important; font-size: 13px; line-height: 1.5;">Envío</td>
            <td style="color: #e4e4e7 !important; font-size: 14px; font-weight: 600; text-align: right; line-height: 1.5;">${props.shipping === 0 ? 'GRATIS' : `${(props.shipping / 100).toFixed(2)}€`}</td>
          </tr>
        </table>
      `;
    }
  }
  
  // Total row
  itemsContent += `
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="color: #fafafa !important; font-size: 15px; font-weight: 700; line-height: 1.4;">Total</td>
        <td style="color: ${config.accentColor} !important; font-size: 17px; font-weight: 700; text-align: right; line-height: 1.4;">${(props.total / 100).toFixed(2)}€</td>
      </tr>
    </table>
  `;
  
  // Tracking info
  let trackingBox = '';
  if (showTracking) {
    const trackingContent = 
      detailRow('Transportista', props.carrier || 'N/A') +
      detailRow('Nº seguimiento', props.trackingNumber!, {
        fontFamily: "'Courier New', monospace",
        isLast: true,
      });
    
    trackingBox = contentBox({
      title: 'Información de envío',
      content: trackingContent,
    });
    
    if (props.trackingUrl) {
      trackingBox += `
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 32px 0;">
          <tr>
            <td align="center">
              <a href="${props.trackingUrl}" bgcolor="#fafafa" style="display: inline-block; background-color: #fafafa !important; color: #09090b !important; padding: 13px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 13px; letter-spacing: 0.3px; line-height: 1;">
                Seguir mi pedido →
              </a>
            </td>
          </tr>
        </table>
      `;
    }
  }
  
  // Timeline for processing
  let timelineBox = '';
  if (showTimeline) {
    const timelineContent = `
      <h3 style="color: #e4e4e7 !important; font-size: 13px; font-weight: 600; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 0.8px; line-height: 1.3;">Próximos pasos</h3>

      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px;">
        <tr>
          <td style="width: 32px; padding-right: 16px; vertical-align: top;">
            <div style="width: 18px; height: 18px; background: #27272a; border: 2px solid #52525b; border-radius: 50%;"></div>
          </td>
          <td style="vertical-align: top;">
            <div style="color: #e4e4e7 !important; font-size: 13px; font-weight: 600; margin-bottom: 4px; line-height: 1.4;">Procesamiento</div>
            <div style="color: #a1a1aa !important; font-size: 12px; line-height: 1.5;">24-48 horas</div>
          </td>
        </tr>
      </table>

      <div style="width: 2px; height: 16px; background: #27272a; margin-left: 10px; margin-bottom: 4px;"></div>

      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px;">
        <tr>
          <td style="width: 32px; padding-right: 16px; vertical-align: top;">
            <div style="width: 18px; height: 18px; background: #18181b; border: 2px solid #27272a; border-radius: 50%;"></div>
          </td>
          <td style="vertical-align: top;">
            <div style="color: #a1a1aa !important; font-size: 13px; font-weight: 600; margin-bottom: 4px; line-height: 1.4;">Envío con tracking</div>
            <div style="color: #71717a !important; font-size: 12px; line-height: 1.5;">Recibirás el número de seguimiento</div>
          </td>
        </tr>
      </table>

      <div style="width: 2px; height: 16px; background: #27272a; margin-left: 10px; margin-bottom: 4px;"></div>

      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="width: 32px; padding-right: 16px; vertical-align: top;">
            <div style="width: 18px; height: 18px; background: #18181b; border: 2px solid #27272a; border-radius: 50%;"></div>
          </td>
          <td style="vertical-align: top;">
            <div style="color: #a1a1aa !important; font-size: 13px; font-weight: 600; margin-bottom: 4px; line-height: 1.4;">Entrega</div>
            <div style="color: #71717a !important; font-size: 12px; line-height: 1.5;">3-5 días laborables</div>
          </td>
        </tr>
      </table>
    `;
    
    timelineBox = contentBox({
      title: '',
      content: timelineContent,
    });
  }
  
  // Refund info
  let refundBox = '';
  if (showRefundInfo) {
    const refundContent = `
      <h3 style="color: #e4e4e7 !important; font-size: 13px; font-weight: 600; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.8px; line-height: 1.3;">${props.status === 'REFUNDED' ? 'Reembolso procesado' : 'Información de reembolso'}</h3>
      ${props.reason ? `<p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0 0 14px 0;"><strong style="color: #e4e4e7 !important;">Motivo:</strong> ${props.reason}</p>` : ''}
      <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0;">
        ${props.refundInfo || 'El reembolso se procesará automáticamente en los próximos 5-10 días laborables a tu método de pago original.'}
      </p>
    `;
    
    refundBox = contentBox({
      title: '',
      content: refundContent,
    });
  }
  
  // Shipping address
  let addressBox = '';
  if (showFullDetails && props.shippingAddress) {
    const addressContent = `
      <h3 style="color: #e4e4e7 !important; font-size: 13px; font-weight: 600; margin: 0 0 14px 0; text-transform: uppercase; letter-spacing: 0.8px; line-height: 1.3;">Dirección de envío</h3>
      <p style="color: #fafafa !important; font-size: 13px; line-height: 1.8; margin: 0;">
        ${props.name}<br />
        ${props.shippingAddress.street}<br />
        ${props.shippingAddress.postalCode} ${props.shippingAddress.city}<br />
        ${props.shippingAddress.province}
      </p>
    `;
    
    addressBox = contentBox({
      title: '',
      content: addressContent,
    });
  }
  
  // Products box title
  const productsTitle = props.status === 'PROCESSING' ? 'Productos en preparación' : 'Productos';
  
  // Build content sections
  const greeting = greetingSection(props.name, getStatusMessage(props.status));
  
  const productsBox = contentBox({
    title: productsTitle,
    content: itemsContent,
  });
  
  // Assemble email
  const content = [
    emailHeader('TIENDA'),
    statusBadge({
      icon: config.icon,
      title: config.title,
      subtitle: config.subtitle,
      accentColor: config.accentColor,
    }),
    contentWrapper(orderNumberText),
    contentWrapper(
      greeting +
      trackingBox +
      timelineBox +
      productsBox +
      addressBox +
      refundBox
    ),
    emailFooter(getFooterMessage(props.status), true),
  ].join('');
  
  return emailBase(content);
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
    CANCELLED: 'Te confirmamos que tu pedido ha sido cancelado.',
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
