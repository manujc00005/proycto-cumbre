// ========================================
// LICENSE EMAIL TEMPLATE - NEUTRAL (LIGHT/DARK SAFE)
// Notifica activación, renovación, caducidad de licencia FEDME
// lib/mail/templates/license-mail-template.ts
// ========================================

import { formatLicenseType } from '@/lib/constants';

export type LicenseStatus = 'activated' | 'renewed' | 'expiring' | 'expired';

export interface LicenseMailProps {
  status: LicenseStatus;
  email: string;
  firstName: string;
  lastName?: string;
  memberNumber: string;
  licenseType: string;
  validFrom?: Date;
  validUntil: Date;
  licenseNumber?: string;
}

interface StatusConfig {
  icon: string;
  title: string;
  subtitle: string;
  accentColor: string;
  bgSoft: string;
  borderSoft: string;
}

const STATUS_CONFIGS: Record<LicenseStatus, StatusConfig> = {
  activated: {
    icon: '✓',
    title: 'Licencia activa',
    subtitle: 'Tu licencia FEDME está lista para usar',
    accentColor: '#059669',
    bgSoft: '#ecfdf3',
    borderSoft: '#bbf7d0',
  },
  renewed: {
    icon: '↻',
    title: 'Licencia renovada',
    subtitle: 'Tu licencia FEDME ha sido renovada correctamente',
    accentColor: '#2563eb',
    bgSoft: '#eff6ff',
    borderSoft: '#bfdbfe',
  },
  expiring: {
    icon: '⚠️',
    title: 'Licencia próxima a expirar',
    subtitle: 'Renueva tu licencia antes de que expire',
    accentColor: '#d97706',
    bgSoft: '#fffbeb',
    borderSoft: '#fed7aa',
  },
  expired: {
    icon: '×',
    title: 'Licencia expirada',
    subtitle: 'Tu licencia FEDME ya no está activa',
    accentColor: '#b91c1c',
    bgSoft: '#fef2f2',
    borderSoft: '#fecaca',
  },
};

export function buildLicenseMail(props: LicenseMailProps): {
  subject: string;
  html: string;
  text: string;
} {
  const subjectMap: Record<LicenseStatus, string> = {
    activated: '✅ Tu licencia FEDME está activa',
    renewed: '✅ Tu licencia FEDME ha sido renovada',
    expiring: '⚠️ Tu licencia FEDME expira pronto',
    expired: '❌ Tu licencia FEDME ha expirado',
  };

  return {
    subject: subjectMap[props.status],
    html: generateLicenseHTML(props),
    text: generateLicenseText(props),
  };
}

// ===================
// HTML
// ===================

function generateLicenseHTML(props: LicenseMailProps): string {
  const config = STATUS_CONFIGS[props.status];
  const isActive = props.status === 'activated' || props.status === 'renewed';
  const isExpiring = props.status === 'expiring';
  const isExpired = props.status === 'expired';

  // Colores para fecha "Válida hasta"
  const validUntilColor = isExpired
    ? '#b91c1c'
    : isExpiring
    ? '#b45309'
    : '#059669';

  // Bloque detalles de licencia
  const detailsRows = [
    detailRow('Número de socio', props.memberNumber),
    props.licenseNumber
      ? detailRow(
          'Número de licencia',
          props.licenseNumber,
          "'Courier New', monospace",
        )
      : '',
    detailRow('Tipo de licencia', formatLicenseType(props.licenseType)),
    props.validFrom
      ? detailRow('Válida desde', formatDate(props.validFrom))
      : '',
    detailRow('Válida hasta', formatDate(props.validUntil), undefined, validUntilColor, true),
  ].join('');

  const actionsBox = buildConditionalInfoBox(props.status);

  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Notificación licencia FEDME</title>
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
          <!-- Card principal -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
            <tr>
              <td style="background-color:#ffffff;border-radius:10px;border:1px solid #e5e5e5;overflow:hidden;">
                
                <!-- HEADER -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" style="padding:24px 24px 12px 24px;">
                      <p style="margin:0;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;">Licencia FEDME</p>
                      <h1 style="margin:4px 0 0 0;font-size:22px;line-height:1.3;font-weight:800;letter-spacing:0.08em;color:#f97316;">
                        PROYECTO CUMBRE
                      </h1>
                    </td>
                  </tr>
                </table>

                <!-- STATUS BADGE -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" style="padding:8px 24px 0 24px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:520px;background-color:${config.bgSoft};border-radius:8px;border:1px solid ${config.borderSoft};">
                        <tr>
                          <td align="center" style="padding:16px 16px 14px 16px;">
                            <div style="font-size:20px;line-height:1;margin-bottom:6px;">${config.icon}</div>
                            <p style="margin:0 0 2px 0;font-size:16px;font-weight:600;color:${config.accentColor};">
                              ${config.title}
                            </p>
                            <p style="margin:0;font-size:13px;color:#4b5563;">
                              ${config.subtitle}
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- GREETING + INTRO -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding:24px 24px 8px 24px;">
                      <p style="margin:0 0 6px 0;font-size:15px;font-weight:600;color:#111827;">
                        Hola ${props.firstName},
                      </p>
                      <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#4b5563;">
                        ${getStatusMessage(props.status)}
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- LICENSE DETAILS BOX -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding:0 24px 20px 24px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:8px;border:1px solid #e5e7eb;">
                        <tr>
                          <td style="padding:16px 16px 8px 16px;">
                            <p style="margin:0 0 10px 0;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;">
                              Detalles de tu licencia
                            </p>
                          </td>
                        </tr>
                        ${detailsRows}
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- EXTRA INFO / ACCIONES -->
                ${actionsBox}

                <!-- FOOTER -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #e5e7eb;">
                  <tr>
                    <td align="center" style="padding:18px 24px 18px 24px;">
                      <p style="margin:0 0 4px 0;font-size:12px;color:#9ca3af;">
                        ${getFooterMessage(props.status)}
                      </p>
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

// Una fila de detalle dentro de la tarjeta de licencia
function detailRow(
  label: string,
  value: string,
  fontFamily?: string,
  valueColor?: string,
  isLast?: boolean,
): string {
  return `
<tr>
  <td style="padding:10px 16px ${isLast ? '14px' : '10px'} 16px;border-bottom:${isLast ? '0' : '1px solid #e5e7eb'};">
    <p style="margin:0 0 2px 0;font-size:12px;color:#6b7280;">${label}</p>
    <p style="margin:0;font-size:14px;font-weight:600;color:${valueColor || '#111827'};${
      fontFamily ? `font-family:${fontFamily};` : ''
    }">
      ${value}
    </p>
  </td>
</tr>
`;
}

// Caja de info/acción según estado
function buildConditionalInfoBox(status: LicenseStatus): string {
  if (status === 'activated' || status === 'renewed') {
    return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding:0 24px 24px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ecfdf3;border-radius:8px;border:1px solid #bbf7d0;">
        <tr>
          <td style="padding:14px 16px;">
            <p style="margin:0 0 4px 0;font-size:13px;font-weight:600;color:#166534;">
              📱 Accede en la app FEDME
            </p>
            <p style="margin:0;font-size:13px;line-height:1.6;color:#166534;">
              Descarga la app oficial de FEDME para tener tu licencia siempre disponible en tu móvil.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;
  }

  if (status === 'expiring') {
    return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding:0 24px 24px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fffbeb;border-radius:8px;border:1px solid:#fed7aa;">
        <tr>
          <td style="padding:14px 16px;">
            <p style="margin:0 0 4px 0;font-size:13px;font-weight:600;color:#92400e;">
              ⚠️ Acción recomendada
            </p>
            <p style="margin:0;font-size:13px;line-height:1.6;color:#92400e;">
              Tu licencia expira pronto. Contacta con nosotros para renovarla y seguir disfrutando de todas las actividades del club.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;
  }

  // expired
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding:0 24px 24px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fef2f2;border-radius:8px;border:1px solid:#fecaca;">
        <tr>
          <td style="padding:14px 16px;">
            <p style="margin:0 0 4px 0;font-size:13px;font-weight:600;color:#991b1b;">
              ❌ Licencia no válida
            </p>
            <p style="margin:0;font-size:13px;line-height:1.6;color:#991b1b;">
              Tu licencia FEDME ya no está activa. Contacta con nosotros para renovarla.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;
}

// ===================
// TEXT
// ===================

function generateLicenseText(props: LicenseMailProps): string {
  return `
${getStatusMessage(props.status).toUpperCase()}

Hola ${props.firstName},

${getStatusMessage(props.status)}

DETALLES DE TU LICENCIA:
Número de socio: ${props.memberNumber}
${props.licenseNumber ? `Número de licencia: ${props.licenseNumber}\n` : ''}Tipo: ${formatLicenseType(
    props.licenseType,
  )}
${props.validFrom ? `Válida desde: ${formatDate(props.validFrom)}\n` : ''}Válida hasta: ${formatDate(
    props.validUntil,
  )}

${
  props.status === 'activated' || props.status === 'renewed'
    ? '📱 ACCEDE EN LA APP FEDME:\nDescarga la app oficial de FEDME para tener tu licencia siempre disponible en tu móvil.\n'
    : ''
}${
    props.status === 'expiring'
      ? '⚠️ ACCIÓN RECOMENDADA:\nTu licencia expira pronto. Contacta con nosotros para renovarla.\n'
      : ''
  }${
    props.status === 'expired'
      ? '❌ LICENCIA NO VÁLIDA:\nTu licencia FEDME ya no está activa. Contacta con nosotros para renovarla.\n'
      : ''
  }
${getFooterMessage(props.status)}

Equipo Proyecto Cumbre
info@proyecto-cumbre.es
  `.trim();
}

// ===================
// HELPERS
// ===================

function getStatusMessage(status: LicenseStatus): string {
  const messages: Record<LicenseStatus, string> = {
    activated: 'Tu licencia FEDME ya está activa y lista para usar.',
    renewed: 'Tu licencia FEDME ha sido renovada correctamente y ya está activa.',
    expiring:
      'Tu licencia FEDME expirará pronto. Te recomendamos renovarla cuanto antes para seguir disfrutando de todas las actividades.',
    expired:
      'Tu licencia FEDME ha expirado. Ya no está activa y necesitas renovarla para participar en actividades federadas.',
  };
  return messages[status];
}

function getFooterMessage(status: LicenseStatus): string {
  const messages: Record<LicenseStatus, string> = {
    activated: 'Nos vemos en la montaña',
    renewed: 'Nos vemos en la montaña',
    expiring: '¿Necesitas ayuda? Contáctanos',
    expired: '¿Necesitas ayuda? Contáctanos',
  };
  return messages[status];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
