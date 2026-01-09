// ========================================
// MEMBERSHIP EMAIL TEMPLATE - FLEXIBLE
// Always-black dark theme enforced
// Handles success/failed payment states
// lib/mail/templates/membership-mail-template.ts
// ========================================

import { formatLicenseType, formatShortLicenseType } from '@/lib/constants';

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
              <p style="color: #52525b !important; font-size: 12px; margin: 0; letter-spacing: 0.5px;">CLUB DE MONTAÑA</p>
            </td>
          </tr>

          <!-- SUCCESS BADGE -->
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center; background-color: #0a0a0a !important;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #18181b !important; border: 1px solid #27272a; border-radius: 12px; padding: 24px 32px; text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 12px;">✓</div>
                    <h2 style="color: #fafafa !important; font-size: 18px; font-weight: 700; margin: 0 0 4px 0; letter-spacing: -0.5px;">Pago completado</h2>
                    <p style="color: #a1a1aa !important; font-size: 14px; margin: 0;">Tu membresía está activa</p>
                    ${props.amount ? `
                      <p style="color: #10b981 !important; font-size: 22px; font-weight: 700; margin: 16px 0 0 0;">${(props.amount / 100).toFixed(2)}€</p>
                    ` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="padding: 0 40px 48px 40px; background-color: #0a0a0a !important;">

              <p style="color: #fafafa !important; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Hola ${props.firstName},</p>
              <p style="color: #a1a1aa !important; font-size: 15px; margin: 0 0 32px 0; line-height: 1.7;">¡Gracias por unirte a nuestro club de montaña! Estamos encantados de tenerte como socio.</p>

              <!-- MEMBERSHIP DETAILS -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border: 1px solid #27272a; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                <tr>
                  <td>
                    <h3 style="color: #e4e4e7 !important; font-size: 14px; font-weight: 600; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 0.5px;">Detalles de tu membresía</h3>

                    ${props.memberNumber ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #27272a;">
                      <tr>
                        <td style="color: #71717a !important; font-size: 13px;">Número de Socio</td>
                        <td style="color: #fafafa !important; font-size: 14px; font-weight: 600; text-align: right;">${props.memberNumber}</td>
                      </tr>
                    </table>
                    ` : ''}

                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #27272a;">
                      <tr>
                        <td style="color: #71717a !important; font-size: 13px;">Nombre</td>
                        <td style="color: #fafafa !important; font-size: 14px; font-weight: 600; text-align: right;">${props.firstName} ${props.lastName}</td>
                      </tr>
                    </table>

                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: ${hasLicense ? '16px' : '0'}; ${hasLicense ? 'padding-bottom: 16px; border-bottom: 1px solid #27272a;' : ''}">
                      <tr>
                        <td style="color: #71717a !important; font-size: 13px;">Estado</td>
                        <td style="color: #10b981 !important; font-size: 14px; font-weight: 600; text-align: right;">ACTIVO</td>
                      </tr>
                    </table>

                    ${hasLicense && props.licenseType ? `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="color: #71717a !important; font-size: 13px;">Licencia FEDME</td>
                        <td style="color: #fafafa !important; font-size: 14px; font-weight: 600; text-align: right;">${formatShortLicenseType(props.licenseType)}</td>
                      </tr>
                    </table>
                    ` : ''}
                  </td>
                </tr>
              </table>

              ${hasLicense ? `
              <!-- LICENSE NOTE -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border-left: 3px solid #f97316; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
                <tr>
                  <td>
                    <p style="color: #fafafa !important; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">📋 Sobre tu licencia federativa</p>
                    <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0;">Tu licencia FEDME será procesada en 48-72 horas. Te notificaremos cuando esté activa.</p>
                  </td>
                </tr>
              </table>
              ` : ''}

              <p style="color: #a1a1aa !important; font-size: 15px; line-height: 1.7; margin: 0 0 32px 0;">Ya puedes participar en todas nuestras actividades. ¡Nos vemos en la montaña!</p>

              <!-- FOOTER -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding-top: 32px; border-top: 1px solid #27272a;">
                <tr>
                  <td style="text-align: center;">
                    <p style="color: #71717a !important; font-size: 13px; margin: 0 0 8px 0;">Bienvenido al club</p>
                    <p style="color: #f97316 !important; font-size: 14px; font-weight: 700; margin: 0 0 24px 0; letter-spacing: 0.5px;">EQUIPO PROYECTO CUMBRE</p>
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

function generateFailedHTML(props: MembershipMailProps): string {
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
              <p style="color: #52525b !important; font-size: 12px; margin: 0; letter-spacing: 0.5px;">CLUB DE MONTAÑA</p>
            </td>
          </tr>

          <!-- ERROR BADGE -->
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center; background-color: #0a0a0a !important;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #18181b !important; border: 1px solid #3f3f46; border-radius: 12px; padding: 24px 32px; text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 12px;">⚠️</div>
                    <h2 style="color: #fafafa !important; font-size: 18px; font-weight: 700; margin: 0 0 4px 0; letter-spacing: -0.5px;">No se pudo completar el pago</h2>
                    <p style="color: #a1a1aa !important; font-size: 14px; margin: 0;">Tu membresía no ha sido activada</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="padding: 0 40px 48px 40px; background-color: #0a0a0a !important;">

              <p style="color: #fafafa !important; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Hola ${props.firstName},</p>
              <p style="color: #a1a1aa !important; font-size: 15px; margin: 0 0 32px 0; line-height: 1.7;">Hemos recibido tu solicitud de membresía, pero hay un problema con el procesamiento del pago.</p>

              <!-- ERROR INFO -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border: 1px solid #27272a; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                <tr>
                  <td>
                    <p style="color: #fafafa !important; font-size: 14px; font-weight: 600; margin: 0 0 16px 0;">Qué ha ocurrido:</p>
                    <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0 0 8px 0;">• El pago fue rechazado o cancelado por tu banco</p>
                    <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0 0 8px 0;">• Tu membresía no ha sido activada</p>
                    <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0;">• No se te ha realizado ningún cargo</p>
                  </td>
                </tr>
              </table>

              <!-- SOLUTIONS -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border: 1px solid #27272a; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                <tr>
                  <td>
                    <h3 style="color: #e4e4e7 !important; font-size: 14px; font-weight: 600; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.5px;">¿Qué puedes hacer?</h3>
                    <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0 0 8px 0;">• <strong style="color: #fafafa !important;">Reintentar el pago</strong> desde nuestra web usando otra tarjeta</p>
                    <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0 0 8px 0;">• <strong style="color: #fafafa !important;">Contactarnos</strong> si crees que hay un error: info@proyecto-cumbre.es</p>
                    <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0;">• <strong style="color: #fafafa !important;">Verificar con tu banco</strong> que la tarjeta permite pagos online internacionales</p>
                  </td>
                </tr>
              </table>

              <!-- FOOTER -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding-top: 32px; border-top: 1px solid #27272a;">
                <tr>
                  <td style="text-align: center;">
                    <p style="color: #71717a !important; font-size: 13px; margin: 0 0 8px 0;">Estamos aquí para ayudarte</p>
                    <p style="color: #f97316 !important; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">📧 info@proyecto-cumbre.es</p>
                    <p style="color: #f97316 !important; font-size: 14px; font-weight: 700; margin: 0 0 24px 0; letter-spacing: 0.5px;">EQUIPO PROYECTO CUMBRE</p>
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
${hasLicense && props.licenseType ? `Licencia FEDME: ${formatShortLicenseType(props.licenseType)}` : 'Licencia FEDME: Sin licencia'}
${props.amount ? `Importe: ${(props.amount / 100).toFixed(2)}€` : ''}

${hasLicense ? '\n📋 SOBRE TU LICENCIA FEDERATIVA:\nTu licencia FEDME será procesada en 48-72 horas. Te notificaremos cuando esté activa.\n' : ''}

Ya puedes participar en todas nuestras actividades. ¡Nos vemos en la montaña!

Equipo Proyecto Cumbre
info@proyecto-cumbre.es
  `.trim();
}

function generateFailedText(props: MembershipMailProps): string {
  return `
PROBLEMA CON TU PAGO - PROYECTO CUMBRE

Hola ${props.firstName},

Hemos recibido tu solicitud de membresía, pero hay un problema con el procesamiento del pago.

QUÉ HA OCURRIDO:
• El pago fue rechazado o cancelado por tu banco
• Tu membresía no ha sido activada
• No se te ha realizado ningún cargo

¿QUÉ PUEDES HACER?
• Reintentar el pago desde nuestra web usando otra tarjeta
• Contactarnos si crees que hay un error: info@proyecto-cumbre.es
• Verificar con tu banco que la tarjeta permite pagos online internacionales

Estamos aquí para ayudarte.

Equipo Proyecto Cumbre
📧 info@proyecto-cumbre.es
  `.trim();
}
