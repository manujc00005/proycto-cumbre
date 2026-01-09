// ========================================
// MEMBERSHIP EMAIL TEMPLATE - GMAIL OPTIMIZED
// Dark theme FORCED for Gmail iOS
// lib/mail/templates/membership-mail-template-gmail-optimized.ts
// ========================================

import { formatShortLicenseType } from '@/lib/constants';

export type MembershipPaymentStatus = 'success' | 'failed' | 'pending';

export interface MembershipMailProps {
  paymentStatus: MembershipPaymentStatus;
  email: string;
  firstName: string;
  lastName: string;
  memberNumber?: string;
  licenseType?: string;
  amount?: number;
  currency?: string;
  validUntil?: Date;
}

export function buildMembershipMail(props: MembershipMailProps): {
  subject: string;
  html: string;
  text: string;
} {
  const isSuccess = props.paymentStatus === 'success';
  const subject = isSuccess
    ? '¡Bienvenido a Proyecto Cumbre! 🏔️'
    : props.paymentStatus === 'pending'
    ? '⏳ Procesando tu membresía - Proyecto Cumbre'
    : '⚠️ Problema con tu pago - Proyecto Cumbre';

  return {
    subject,
    html: isSuccess ? generateSuccessHTML(props) : generateFailedHTML(props),
    text: isSuccess ? generateSuccessText(props) : generateFailedText(props),
  };
}

function generateSuccessHTML(props: MembershipMailProps): string {
  const hasLicense = props.licenseType && props.licenseType !== 'none';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <meta name="x-apple-disable-message-reformatting">
  <style>
    /* Gmail dark mode fix */
    @media (prefers-color-scheme: dark) {
      .dark-bg { background-color: #000000 !important; }
      .dark-container { background-color: #0a0a0a !important; }
      .dark-box { background-color: #18181b !important; }
      .dark-border { border-color: #27272a !important; }
      .text-white { color: #ffffff !important; }
      .text-light { color: #fafafa !important; }
      .text-gray { color: #a1a1aa !important; }
      .text-gray-dark { color: #71717a !important; }
    }
    /* Force dark everywhere */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    /* Override Gmail auto-styling */
    u + .body .dark-bg { background: #000000 !important; }
    u + .body .dark-container { background: #0a0a0a !important; }
    u + .body .dark-box { background: #18181b !important; }
  </style>
</head>
<body class="body" bgcolor="#000000" style="margin: 0; padding: 0; background-color: #000000 !important;">
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
  
  <div style="display: none; max-height: 0; overflow: hidden;">
    ¡Bienvenido a Proyecto Cumbre! Tu membresía está activa.
  </div>
  
  <table cellpadding="0" cellspacing="0" border="0" width="100%" class="dark-bg" bgcolor="#000000" style="background-color: #000000 !important; padding: 40px 20px;" role="presentation">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" class="dark-container" bgcolor="#0a0a0a" style="max-width: 600px; background-color: #0a0a0a !important; border-radius: 0;" role="presentation">
          
          <!-- HEADER -->
          <tr>
            <td class="dark-container" bgcolor="#0a0a0a" style="padding: 48px 40px 32px 40px; text-align: center; background-color: #0a0a0a !important;">
              <h1 class="text-white" style="color: #f97316 !important; font-size: 26px; font-weight: 900; margin: 0 0 8px 0; letter-spacing: 1.5px; line-height: 1.2;">PROYECTO CUMBRE</h1>
              <p class="text-gray-dark" style="color: #52525b !important; font-size: 11px; margin: 0; letter-spacing: 1px; text-transform: uppercase; font-weight: 600;">CLUB DE MONTAÑA</p>
            </td>
          </tr>
          
          <!-- STATUS BADGE -->
          <tr>
            <td class="dark-container" bgcolor="#0a0a0a" style="padding: 0 40px 40px 40px; text-align: center; background-color: #0a0a0a !important;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto; background-color: #18181b !important; border: 1px solid #27272a; border-radius: 8px; overflow: hidden;" class="dark-box dark-border" role="presentation">
                <tr>
                  <td style="padding: 24px 32px; text-align: center;">
                    <div style="font-size: 28px; margin-bottom: 10px; line-height: 1;">✓</div>
                    <h2 class="text-light" style="color: #fafafa !important; font-size: 17px; font-weight: 700; margin: 0 0 4px 0; letter-spacing: -0.3px; line-height: 1.3;">Pago completado</h2>
                    <p class="text-gray" style="color: #a1a1aa !important; font-size: 13px; margin: 0; line-height: 1.4;">Tu membresía está activa</p>
                    ${props.amount ? `<p style="color: #10b981 !important; font-size: 22px; font-weight: 700; margin: 12px 0 0 0; line-height: 1;">${(props.amount / 100).toFixed(2)}€</p>` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- CONTENT -->
          <tr>
            <td class="dark-container" bgcolor="#0a0a0a" style="padding: 0 40px 32px 40px; background-color: #0a0a0a !important;">
              
              <!-- Greeting -->
              <p class="text-white" style="color: #ffffff !important; font-size: 15px; margin: 0 0 8px 0; font-weight: 600; line-height: 1.4;">Hola ${props.firstName},</p>
              <p class="text-gray" style="color: #a1a1aa !important; font-size: 14px; margin: 0 0 32px 0; line-height: 1.7;">¡Gracias por unirte a nuestro club de montaña! Estamos encantados de tenerte como socio.</p>
              
              <!-- Membership Details Box -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" class="dark-box dark-border" bgcolor="#18181b" style="background-color: #18181b !important; border: 1px solid #27272a; border-radius: 8px; margin-bottom: 32px;" role="presentation">
                <tr>
                  <td style="padding: 24px;">
                    <h3 class="text-light" style="color: #e4e4e7 !important; font-size: 13px; font-weight: 600; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.8px; line-height: 1.3;">Detalles de tu membresía</h3>
                    
                    ${props.memberNumber ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #27272a;" class="dark-border" role="presentation">
                      <tr>
                        <td style="color: #71717a !important; font-size: 12px; padding-bottom: 4px; line-height: 1.4;" class="text-gray-dark">Número de Socio</td>
                      </tr>
                      <tr>
                        <td style="color: #fafafa !important; font-weight: 600; font-size: 14px; line-height: 1.5;" class="text-light">${props.memberNumber}</td>
                      </tr>
                    </table>
                    ` : ''}
                    
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #27272a;" class="dark-border" role="presentation">
                      <tr>
                        <td style="color: #71717a !important; font-size: 12px; padding-bottom: 4px; line-height: 1.4;" class="text-gray-dark">Nombre</td>
                      </tr>
                      <tr>
                        <td style="color: #fafafa !important; font-weight: 600; font-size: 14px; line-height: 1.5;" class="text-light">${props.firstName} ${props.lastName}</td>
                      </tr>
                    </table>
                    
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: ${hasLicense ? '14px' : '0'}; padding-bottom: ${hasLicense ? '14px' : '0'}; ${hasLicense ? 'border-bottom: 1px solid #27272a;' : ''}" class="dark-border" role="presentation">
                      <tr>
                        <td style="color: #71717a !important; font-size: 12px; padding-bottom: 4px; line-height: 1.4;" class="text-gray-dark">Estado</td>
                      </tr>
                      <tr>
                        <td style="color: #10b981 !important; font-weight: 600; font-size: 14px; line-height: 1.5;">ACTIVO</td>
                      </tr>
                    </table>
                    
                    ${hasLicense && props.licenseType ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" role="presentation">
                      <tr>
                        <td style="color: #71717a !important; font-size: 12px; padding-bottom: 4px; line-height: 1.4;" class="text-gray-dark">Licencia FEDME</td>
                      </tr>
                      <tr>
                        <td style="color: #fafafa !important; font-weight: 600; font-size: 14px; line-height: 1.5;" class="text-light">${formatShortLicenseType(props.licenseType)}</td>
                      </tr>
                    </table>
                    ` : ''}
                  </td>
                </tr>
              </table>
              
              ${hasLicense ? `
              <!-- License Note -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" class="dark-box" bgcolor="#18181b" style="background-color: #18181b !important; border-left: 3px solid #f97316; border-radius: 6px; margin-bottom: 32px;" role="presentation">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p class="text-light" style="color: #fafafa !important; font-size: 13px; font-weight: 600; margin: 0 0 8px 0; line-height: 1.4;">📋 Sobre tu licencia federativa</p>
                    <p class="text-gray" style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0;">Tu licencia FEDME será procesada en 48-72 horas. Te notificaremos cuando esté activa.</p>
                  </td>
                </tr>
              </table>
              ` : ''}
              
              <p class="text-gray" style="color: #a1a1aa !important; font-size: 14px; line-height: 1.7; margin: 0 0 32px 0;">Ya puedes participar en todas nuestras actividades. ¡Nos vemos en la montaña!</p>
              
            </td>
          </tr>
          
          <!-- FOOTER -->
          <tr>
            <td class="dark-container" bgcolor="#0a0a0a" style="padding: 0 40px 48px 40px; background-color: #0a0a0a !important;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding-top: 32px; border-top: 1px solid #27272a;" class="dark-border" role="presentation">
                <tr>
                  <td style="text-align: center;">
                    <p class="text-gray-dark" style="color: #71717a !important; font-size: 12px; margin: 0 0 8px 0; line-height: 1.5;">Bienvenido al club</p>
                    <p style="color: #f97316 !important; font-size: 13px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: 0.8px; line-height: 1.3;">PROYECTO CUMBRE</p>
                    <p class="text-gray-dark" style="color: #71717a !important; font-size: 12px; margin: 0 0 20px 0; line-height: 1.5;">📧 info@proyecto-cumbre.es</p>
                    <p class="text-gray-dark" style="color: #52525b !important; font-size: 10px; margin: 0; line-height: 1.4;">Email automático · <a href="mailto:info@proyecto-cumbre.es" style="color: #71717a !important; text-decoration: none;">Contacto</a></p>
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

function generateFailedHTML(props: MembershipMailProps): string {
  // Similar structure with Gmail optimization...
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <style>
    @media (prefers-color-scheme: dark) {
      .dark-bg { background-color: #000000 !important; }
      .dark-container { background-color: #0a0a0a !important; }
      .dark-box { background-color: #18181b !important; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  </style>
</head>
<body class="body" bgcolor="#000000" style="margin: 0; padding: 0; background-color: #000000 !important;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#000000" class="dark-bg" style="background-color: #000000 !important; padding: 40px 20px;">
    <tr><td align="center">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#0a0a0a" class="dark-container" style="max-width: 600px; background-color: #0a0a0a !important;">
        <!-- Similar structure... -->
        <tr><td style="padding: 48px 40px 32px 40px; text-align: center; background-color: #0a0a0a !important;">
          <h1 style="color: #f97316 !important; font-size: 26px; font-weight: 900; margin: 0 0 8px 0;">PROYECTO CUMBRE</h1>
          <p style="color: #52525b !important; font-size: 11px; margin: 0; text-transform: uppercase;">CLUB DE MONTAÑA</p>
        </td></tr>
        <tr><td style="padding: 0 40px 32px 40px;">
          <p style="color: #ffffff !important; font-size: 15px; margin: 0 0 8px 0; font-weight: 600;">Hola ${props.firstName},</p>
          <p style="color: #a1a1aa !important; font-size: 14px; margin: 0;">Hemos recibido tu solicitud de membresía, pero hay un problema con el procesamiento del pago.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function generateSuccessText(props: MembershipMailProps): string {
  const hasLicense = props.licenseType && props.licenseType !== 'none';
  return `
¡BIENVENIDO A PROYECTO CUMBRE!

Hola ${props.firstName},

¡Gracias por unirte a nuestro club de montaña! Estamos encantados de tenerte como socio.

DETALLES DE TU MEMBRESÍA:
${props.memberNumber ? `Número de Socio: ${props.memberNumber}` : ''}
Nombre: ${props.firstName} ${props.lastName}
Estado: ACTIVO
${hasLicense && props.licenseType ? `Licencia FEDME: ${formatShortLicenseType(props.licenseType)}` : ''}
${props.amount ? `Importe: ${(props.amount / 100).toFixed(2)}€` : ''}

${hasLicense ? 'Tu licencia FEDME será procesada en 48-72 horas.\n' : ''}
Ya puedes participar en todas nuestras actividades.

Equipo Proyecto Cumbre
info@proyecto-cumbre.es
  `.trim();
}

function generateFailedText(props: MembershipMailProps): string {
  return `
PROBLEMA CON TU PAGO

Hola ${props.firstName},

Hemos recibido tu solicitud pero hay un problema con el pago.

Equipo Proyecto Cumbre
info@proyecto-cumbre.es
  `.trim();
}
