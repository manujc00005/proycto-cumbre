// ========================================
// MEMBERSHIP EMAIL TEMPLATE - NEUTRAL (LIGHT/DARK SAFE)
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

// ===================
// HTML SUCCESS
// ===================

function generateSuccessHTML(props: MembershipMailProps): string {
  const hasLicense = props.licenseType && props.licenseType !== 'none';

  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Bienvenido a Proyecto Cumbre</title>
    <style>
      /* Reset básico para emails */
      html, body {
        margin: 0;
        padding: 0;
      }
      body {
        background-color: #e5e5e5;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      table {
        border-spacing: 0;
        border-collapse: collapse;
      }
      img {
        border: 0;
        display: block;
        max-width: 100%;
        height: auto;
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:#e5e5e5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#e5e5e5;padding:24px 8px;">
      <tr>
        <td align="center">
          <!-- Card principal -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
            <tr>
              <td style="background-color:#ffffff;border-radius:10px 10px 10px 10px;overflow:hidden;border:1px solid #e5e5e5;">
                <!-- HEADER -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" style="padding:24px 24px 16px 24px;">
                      <p style="margin:0;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;">Club de montaña</p>
                      <h1 style="margin:4px 0 0 0;font-size:22px;line-height:1.3;font-weight:800;letter-spacing:0.08em;color:#f97316;">PROYECTO CUMBRE</h1>
                    </td>
                  </tr>
                </table>

                <!-- STATUS BADGE -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" style="padding:8px 24px 0 24px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:520px;background-color:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
                        <tr>
                          <td align="center" style="padding:18px 18px 16px 18px;">
                            <div style="font-size:20px;line-height:1;margin-bottom:6px;">✓</div>
                            <p style="margin:0 0 2px 0;font-size:16px;font-weight:600;color:#111827;">Pago completado</p>
                            <p style="margin:0;font-size:13px;color:#6b7280;">Tu membresía está activa</p>
                            ${
                              props.amount
                                ? `<p style="margin:10px 0 0 0;font-size:20px;font-weight:700;color:#059669;">${(
                                    props.amount / 100
                                  ).toFixed(2)}€</p>`
                                : ''
                            }
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- CONTENT -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding:24px 24px 8px 24px;">
                      <p style="margin:0 0 6px 0;font-size:15px;font-weight:600;color:#111827;">
                        Hola ${props.firstName},
                      </p>
                      <p style="margin:0 0 18px 0;font-size:14px;line-height:1.6;color:#4b5563;">
                        ¡Gracias por unirte a nuestro club de montaña! Estamos encantados de tenerte como socio.
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- MEMBERSHIP DETAILS CARD -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding:0 24px 24px 24px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:8px;border:1px solid:#e5e7eb;">
                        <tr>
                          <td style="padding:18px 18px 8px 18px;">
                            <p style="margin:0 0 10px 0;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;">
                              Detalles de tu membresía
                            </p>
                          </td>
                        </tr>

                        ${
                          props.memberNumber
                            ? `
                        <tr>
                          <td style="padding:0 18px 10px 18px;border-bottom:1px solid #e5e7eb;">
                            <p style="margin:0 0 2px 0;font-size:12px;color:#6b7280;">Número de socio</p>
                            <p style="margin:0;font-size:14px;font-weight:600;color:#111827;">${props.memberNumber}</p>
                          </td>
                        </tr>
                        `
                            : ''
                        }

                        <tr>
                          <td style="padding:10px 18px;border-bottom:${
                            hasLicense ? '1px solid #e5e7eb' : '0'
                          };">
                            <p style="margin:0 0 2px 0;font-size:12px;color:#6b7280;">Nombre</p>
                            <p style="margin:0;font-size:14px;font-weight:600;color:#111827;">
                              ${props.firstName} ${props.lastName}
                            </p>
                          </td>
                        </tr>

                        <tr>
                          <td style="padding:10px 18px;border-bottom:${
                            hasLicense ? '1px solid #e5e7eb' : '0'
                          };">
                            <p style="margin:0 0 2px 0;font-size:12px;color:#6b7280;">Estado</p>
                            <p style="margin:0;font-size:14px;font-weight:600;color:#059669;">
                              ACTIVO
                            </p>
                          </td>
                        </tr>

                        ${
                          hasLicense && props.licenseType
                            ? `
                        <tr>
                          <td style="padding:10px 18px 16px 18px;">
                            <p style="margin:0 0 2px 0;font-size:12px;color:#6b7280;">Licencia FEDME</p>
                            <p style="margin:0;font-size:14px;font-weight:600;color:#111827;">
                              ${formatShortLicenseType(props.licenseType)}
                            </p>
                          </td>
                        </tr>
                        `
                            : ''
                        }
                      </table>
                    </td>
                  </tr>
                </table>

                ${
                  hasLicense
                    ? `
                <!-- LICENSE NOTE -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding:0 24px 24px 24px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fff7ed;border-radius:8px;border:1px solid #fed7aa;">
                        <tr>
                          <td style="padding:14px 16px;">
                            <p style="margin:0 0 4px 0;font-size:13px;font-weight:600;color:#9a3412;">
                              📋 Sobre tu licencia federativa
                            </p>
                            <p style="margin:0;font-size:13px;line-height:1.6;color:#7c2d12;">
                              Tu licencia FEDME será procesada en 48-72 horas. Te notificaremos cuando esté activa.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                `
                    : ''
                }

                <!-- Closing text -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding:0 24px 24px 24px;">
                      <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#4b5563;">
                        Ya puedes participar en todas nuestras actividades. ¡Nos vemos en la montaña!
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- FOOTER -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #e5e7eb;">
                  <tr>
                    <td align="center" style="padding:18px 24px 18px 24px;">
                      <p style="margin:0 0 4px 0;font-size:12px;color:#9ca3af;">Bienvenido al club</p>
                      <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;letter-spacing:0.08em;color:#f97316;">
                        PROYECTO CUMBRE
                      </p>
                      <p style="margin:0 0 4px 0;font-size:12px;color:#9ca3af;">📧 info@proyecto-cumbre.es</p>
                      <p style="margin:0;font-size:11px;color:#9ca3af;">
                        Email automático ·
                        <a href="mailto:info@proyecto-cumbre.es" style="color:#6b7280;text-decoration:underline;">Contacto</a>
                      </p>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>
          </table>
          <!-- /Card principal -->
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
}

// ===================
// HTML FAILED
// ===================

function generateFailedHTML(props: MembershipMailProps): string {
  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Problema con tu pago - Proyecto Cumbre</title>
    <style>
      html, body {
        margin: 0;
        padding: 0;
      }
      body {
        background-color: #e5e5e5;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      table {
        border-spacing: 0;
        border-collapse: collapse;
      }
      img {
        border: 0;
        display: block;
        max-width: 100%;
        height: auto;
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:#e5e5e5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#e5e5e5;padding:24px 8px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
            <tr>
              <td style="background-color:#ffffff;border-radius:10px 10px 10px 10px;overflow:hidden;border:1px solid #e5e5e5;">
                <!-- HEADER -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" style="padding:24px 24px 16px 24px;">
                      <p style="margin:0;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;">Club de montaña</p>
                      <h1 style="margin:4px 0 0 0;font-size:22px;line-height:1.3;font-weight:800;letter-spacing:0.08em;color:#f97316;">PROYECTO CUMBRE</h1>
                    </td>
                  </tr>
                </table>

                <!-- ERROR BADGE -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" style="padding:8px 24px 0 24px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:520px;background-color:#fef2f2;border-radius:8px;border:1px solid:#fecaca;">
                        <tr>
                          <td align="center" style="padding:18px 18px 16px 18px;">
                            <div style="font-size:20px;line-height:1;margin-bottom:6px;">⚠️</div>
                            <p style="margin:0 0 2px 0;font-size:16px;font-weight:600;color:#b91c1c;">No se ha podido completar el pago</p>
                            <p style="margin:0;font-size:13px;color:#7f1d1d;">Tu membresía no ha sido activada</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- CONTENT -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding:24px 24px 8px 24px;">
                      <p style="margin:0 0 6px 0;font-size:15px;font-weight:600;color:#111827;">
                        Hola ${props.firstName},
                      </p>
                      <p style="margin:0 0 14px 0;font-size:14px;line-height:1.6;color:#4b5563;">
                        Hemos recibido tu solicitud de membresía, pero ha habido un problema al procesar el pago.
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- INFO LIST -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding:0 24px 16px 24px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9fafb;border-radius:8px;border:1px solid:#e5e7eb;">
                        <tr>
                          <td style="padding:14px 16px;">
                            <p style="margin:0 0 6px 0;font-size:13px;font-weight:600;color:#111827;">Qué ha ocurrido</p>
                            <p style="margin:0 0 4px 0;font-size:13px;line-height:1.5;color:#4b5563;">• El pago fue rechazado o cancelado por tu banco.</p>
                            <p style="margin:0 0 4px 0;font-size:13px;line-height:1.5;color:#4b5563;">• Tu membresía no ha sido activada.</p>
                            <p style="margin:0;font-size:13px;line-height:1.5;color:#4b5563;">• No se te ha realizado ningún cargo.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- ACTIONS -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding:0 24px 24px 24px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fff7ed;border-radius:8px;border:1px solid:#fed7aa;">
                        <tr>
                          <td style="padding:14px 16px;">
                            <p style="margin:0 0 6px 0;font-size:13px;font-weight:600;color:#9a3412;">¿Qué puedes hacer?</p>
                            <p style="margin:0 0 4px 0;font-size:13px;line-height:1.5;color:#7c2d12;">• Reintentar el pago desde nuestra web usando otra tarjeta.</p>
                            <p style="margin:0 0 4px 0;font-size:13px;line-height:1.5;color:#7c2d12;">• Contactarnos si crees que hay un error: <a href="mailto:info@proyecto-cumbre.es" style="color:#9a3412;text-decoration:underline;">info@proyecto-cumbre.es</a></p>
                            <p style="margin:0;font-size:13px;line-height:1.5;color:#7c2d12;">• Verificar con tu banco que la tarjeta permite pagos online.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- FOOTER -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid:#e5e7eb;">
                  <tr>
                    <td align="center" style="padding:18px 24px 18px 24px;">
                      <p style="margin:0 0 4px 0;font-size:12px;color:#9ca3af;">Estamos aquí para ayudarte</p>
                      <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;letter-spacing:0.08em;color:#f97316;">
                        PROYECTO CUMBRE
                      </p>
                      <p style="margin:0 0 4px 0;font-size:12px;color:#9ca3af;">📧 info@proyecto-cumbre.es</p>
                      <p style="margin:0;font-size:11px;color:#9ca3af;">
                        Email automático ·
                        <a href="mailto:info@proyecto-cumbre.es" style="color:#6b7280;text-decoration:underline;">Contacto</a>
                      </p>
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

// ===================
// TEXT VERSIONS
// ===================

function generateSuccessText(props: MembershipMailProps): string {
  const hasLicense = props.licenseType && props.licenseType !== 'none';

  return `
¡BIENVENIDO A PROYECTO CUMBRE!

Hola ${props.firstName},

¡Gracias por unirte a nuestro club de montaña! Estamos encantados de tenerte como socio.

DETALLES DE TU MEMBRESÍA:
${props.memberNumber ? `Número de Socio: ${props.memberNumber}\n` : ''}Nombre: ${
    props.firstName
  } ${props.lastName}
Estado: ACTIVO
${
  hasLicense && props.licenseType
    ? `Licencia FEDME: ${formatShortLicenseType(props.licenseType)}\n`
    : ''
}${props.amount ? `Importe: ${(props.amount / 100).toFixed(2)}€\n` : ''}${
    hasLicense
      ? '\nSobre tu licencia federativa:\nTu licencia FEDME será procesada en 48-72 horas. Te notificaremos cuando esté activa.\n'
      : ''
  }
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
• El pago fue rechazado o cancelado por tu banco.
• Tu membresía no ha sido activada.
• No se te ha realizado ningún cargo.

QUÉ PUEDES HACER:
• Reintentar el pago desde nuestra web usando otra tarjeta.
• Contactarnos si crees que hay un error: info@proyecto-cumbre.es.
• Verificar con tu banco que la tarjeta permite pagos online.

Estamos aquí para ayudarte.

Equipo Proyecto Cumbre
info@proyecto-cumbre.es
  `.trim();
}
