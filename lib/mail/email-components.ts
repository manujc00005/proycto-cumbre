// ========================================
// EMAIL COMPONENTS - MODULAR & REUSABLE
// Dark theme guaranteed across all clients
// Premium minimalist design for mountain club
// lib/mail/email-components.ts
// ========================================

/**
 * Base HTML structure with guaranteed dark theme
 */
export function emailBase(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  </style>
</head>
<body bgcolor="#000000" style="margin: 0; padding: 0; background-color: #000000 !important;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#000000" style="background-color: #000000 !important; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#0a0a0a" style="max-width: 600px; background-color: #0a0a0a !important;">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Brand header - Proyecto Cumbre
 */
export function emailHeader(subtitle?: string): string {
  return `
<tr>
  <td bgcolor="#0a0a0a" style="padding: 48px 40px 32px 40px; text-align: center; background-color: #0a0a0a !important;">
    <h1 style="color: #f97316 !important; font-size: 26px; font-weight: 900; margin: 0 0 8px 0; letter-spacing: 1.5px; line-height: 1.2;">PROYECTO CUMBRE</h1>
    ${subtitle ? `<p style="color: #52525b !important; font-size: 11px; margin: 0; letter-spacing: 1px; text-transform: uppercase; font-weight: 600;">${subtitle}</p>` : ''}
  </td>
</tr>
  `.trim();
}

/**
 * Status badge - Minimal and professional
 */
export interface StatusBadgeProps {
  icon: string;
  title: string;
  subtitle: string;
  accentColor?: string;
  amount?: string;
}

export function statusBadge(props: StatusBadgeProps): string {
  const color = props.accentColor || '#10b981';
  
  return `
<tr>
  <td bgcolor="#0a0a0a" style="padding: 0 40px 40px 40px; text-align: center; background-color: #0a0a0a !important;">
    <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto; background-color: #18181b !important; border: 1px solid #27272a; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="padding: 24px 32px; text-align: center;">
          <div style="font-size: 28px; margin-bottom: 10px; line-height: 1;">${props.icon}</div>
          <h2 style="color: #fafafa !important; font-size: 17px; font-weight: 700; margin: 0 0 4px 0; letter-spacing: -0.3px; line-height: 1.3;">${props.title}</h2>
          <p style="color: #a1a1aa !important; font-size: 13px; margin: 0; line-height: 1.4;">${props.subtitle}</p>
          ${props.amount ? `<p style="color: ${color} !important; font-size: 22px; font-weight: 700; margin: 12px 0 0 0; line-height: 1;">${props.amount}</p>` : ''}
        </td>
      </tr>
    </table>
  </td>
</tr>
  `.trim();
}

/**
 * Greeting section
 */
export function greetingSection(name: string, message: string): string {
  return `
<p style="color: #ffffff !important; font-size: 15px; margin: 0 0 8px 0; font-weight: 600; line-height: 1.4;">Hola ${name},</p>
<p style="color: #a1a1aa !important; font-size: 14px; margin: 0 0 32px 0; line-height: 1.7;">${message}</p>
  `.trim();
}

/**
 * Content box - Dark themed card
 */
export interface ContentBoxProps {
  title: string;
  accentColor?: string;
  content: string;
  marginBottom?: string;
}

export function contentBox(props: ContentBoxProps): string {
  const borderColor = props.accentColor ? `border-left: 3px solid ${props.accentColor};` : 'border: 1px solid #27272a;';
  const margin = props.marginBottom || '32px';
  
  return `
<table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#18181b" style="background-color: #18181b !important; ${borderColor} border-radius: 8px; margin-bottom: ${margin};">
  <tr>
    <td style="padding: 24px;">
      <h3 style="color: #e4e4e7 !important; font-size: 13px; font-weight: 600; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.8px; line-height: 1.3;">${props.title}</h3>
      ${props.content}
    </td>
  </tr>
</table>
  `.trim();
}

/**
 * Detail row - Key-value pair
 */
export function detailRow(label: string, value: string, options?: {
  valueColor?: string;
  valueFontWeight?: string;
  valueFontSize?: string;
  isLast?: boolean;
  fontFamily?: string;
}): string {
  const opts = {
    valueColor: options?.valueColor || '#fafafa',
    valueFontWeight: options?.valueFontWeight || '600',
    valueFontSize: options?.valueFontSize || '14px',
    isLast: options?.isLast || false,
    fontFamily: options?.fontFamily || 'inherit',
  };
  
  const borderBottom = opts.isLast ? '' : 'border-bottom: 1px solid #27272a;';
  const paddingBottom = opts.isLast ? '0' : '14px';
  const marginBottom = opts.isLast ? '0' : '14px';
  
  return `
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: ${marginBottom}; padding-bottom: ${paddingBottom}; ${borderBottom}">
  <tr>
    <td style="color: #71717a !important; font-size: 12px; padding-bottom: 4px; line-height: 1.4;">${label}</td>
  </tr>
  <tr>
    <td style="color: ${opts.valueColor} !important; font-weight: ${opts.valueFontWeight}; font-size: ${opts.valueFontSize}; font-family: ${opts.fontFamily}; line-height: 1.5;">${value}</td>
  </tr>
</table>
  `.trim();
}

/**
 * Info box with icon
 */
export interface InfoBoxProps {
  icon: string;
  title: string;
  message: string;
  accentColor?: string;
  marginBottom?: string;
}

export function infoBox(props: InfoBoxProps): string {
  const borderColor = props.accentColor || '#f97316';
  const margin = props.marginBottom || '32px';
  
  return `
<table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#18181b" style="background-color: #18181b !important; border-left: 3px solid ${borderColor}; border-radius: 6px; margin-bottom: ${margin};">
  <tr>
    <td style="padding: 20px 24px;">
      <p style="color: #fafafa !important; font-size: 13px; font-weight: 600; margin: 0 0 8px 0; line-height: 1.4;">${props.icon} ${props.title}</p>
      <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0;">${props.message}</p>
    </td>
  </tr>
</table>
  `.trim();
}

/**
 * WhatsApp block - Prominent call to action
 */
export interface WhatsAppBlockProps {
  link: string;
  message: string;
  marginBottom?: string;
}

export function whatsAppBlock(props: WhatsAppBlockProps): string {
  const margin = props.marginBottom || '40px';
  
  return `
<table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#18181b" style="background-color: #18181b !important; border: 2px solid #27272a; border-radius: 10px; margin-bottom: ${margin};">
  <tr>
    <td style="padding: 28px 32px;">
      <h3 style="color: #ffffff !important; font-size: 14px; font-weight: 700; margin: 0 0 12px 0; letter-spacing: 0.3px; line-height: 1.4;">Información importante</h3>
      <p style="color: #e4e4e7 !important; font-size: 13px; line-height: 1.8; margin: 0 0 20px 0;">${props.message}</p>
      <p style="color: #a1a1aa !important; font-size: 12px; line-height: 1.6; margin: 0 0 24px 0;">Es necesario unirse para poder participar correctamente.</p>
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td align="center">
            <a href="${props.link}" bgcolor="#16a34a" style="display: inline-block; background-color: #16a34a !important; color: #ffffff !important; padding: 13px 28px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 13px; letter-spacing: 0.3px; line-height: 1;">
              Unirme al grupo de WhatsApp
            </a>
          </td>
        </tr>
      </table>
      <p style="color: #71717a !important; font-size: 11px; margin: 10px 0 0 0; text-align: center; line-height: 1.5;">Obligatorio para recibir la información del evento</p>
    </td>
  </tr>
</table>
  `.trim();
}

/**
 * Event detail row with icon
 */
export function eventDetailRow(icon: string, label: string, value: string, isLast?: boolean): string {
  const marginBottom = isLast ? '0' : '18px';
  
  return `
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: ${marginBottom};">
  <tr>
    <td width="28" valign="top" style="padding-right: 14px;">
      <span style="font-size: 17px; line-height: 1;">${icon}</span>
    </td>
    <td>
      <div style="color: #71717a !important; font-size: 11px; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.3;">${label}</div>
      <div style="color: #ffffff !important; font-size: 14px; font-weight: 600; line-height: 1.5;">${value}</div>
    </td>
  </tr>
</table>
  `.trim();
}

/**
 * Feature item
 */
export function featureItem(icon: string, title: string, description?: string, isLast?: boolean): string {
  const marginBottom = isLast ? '0' : '16px';
  
  return `
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: ${marginBottom};">
  <tr>
    <td width="28" valign="top" style="padding-right: 14px;">
      <span style="font-size: 17px; line-height: 1;">${icon}</span>
    </td>
    <td>
      <div style="color: #ffffff !important; font-weight: 600; font-size: 13px; margin-bottom: ${description ? '3px' : '0'}; line-height: 1.4;">${title}</div>
      ${description ? `<div style="color: #71717a !important; font-size: 12px; line-height: 1.6;">${description}</div>` : ''}
    </td>
  </tr>
</table>
  `.trim();
}

/**
 * Primary button
 */
export function primaryButton(text: string, url: string, color?: string): string {
  const bgColor = color || '#f97316';
  
  return `
<table cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td align="center" style="padding: 8px 0;">
      <a href="${url}" bgcolor="${bgColor}" style="display: inline-block; background-color: ${bgColor} !important; color: #ffffff !important; padding: 13px 28px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 13px; letter-spacing: 0.3px; line-height: 1;">
        ${text}
      </a>
    </td>
  </tr>
</table>
  `.trim();
}

/**
 * Secondary button
 */
export function secondaryButton(text: string, url: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td align="center" style="padding: 8px 0;">
      <a href="${url}" bgcolor="#27272a" style="display: inline-block; background-color: #27272a !important; color: #ffffff !important; padding: 13px 28px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 13px; letter-spacing: 0.3px; line-height: 1;">
        ${text}
      </a>
    </td>
  </tr>
</table>
  `.trim();
}

/**
 * Footer
 */
export function emailFooter(message?: string, showContact?: boolean): string {
  const footerMessage = message || 'Nos vemos en la montaña';
  
  return `
<tr>
  <td bgcolor="#0a0a0a" style="padding: 0 40px 48px 40px; background-color: #0a0a0a !important;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding-top: 32px; border-top: 1px solid #27272a;">
      <tr>
        <td style="text-align: center;">
          <p style="color: #71717a !important; font-size: 12px; margin: 0 0 8px 0; line-height: 1.5;">${footerMessage}</p>
          <p style="color: #f97316 !important; font-size: 13px; font-weight: 700; margin: 0 0 ${showContact ? '8px' : '20px'} 0; letter-spacing: 0.8px; line-height: 1.3;">PROYECTO CUMBRE</p>
          ${showContact ? `<p style="color: #71717a !important; font-size: 12px; margin: 0 0 20px 0; line-height: 1.5;">📧 info@proyecto-cumbre.es</p>` : ''}
          <p style="color: #52525b !important; font-size: 10px; margin: 0; line-height: 1.4;">Email automático${showContact ? ' · <a href="mailto:info@proyecto-cumbre.es" style="color: #71717a !important; text-decoration: none;">Contacto</a>' : ''}</p>
        </td>
      </tr>
    </table>
  </td>
</tr>
  `.trim();
}

/**
 * Content wrapper - Used for body content
 */
export function contentWrapper(content: string): string {
  return `
<tr>
  <td bgcolor="#0a0a0a" style="padding: 0 40px 32px 40px; background-color: #0a0a0a !important;">
    ${content}
  </td>
</tr>
  `.trim();
}

/**
 * Divider
 */
export function divider(marginTop?: string, marginBottom?: string): string {
  return `
<div style="border-top: 1px solid #27272a; margin-top: ${marginTop || '20px'}; margin-bottom: ${marginBottom || '20px'};"></div>
  `.trim();
}

/**
 * HTML escape utility
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
