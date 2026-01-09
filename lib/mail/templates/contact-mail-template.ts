// ========================================
// CONTACT FORM EMAIL TEMPLATE - NEUTRAL
// Notificación interna de formulario de contacto
// lib/mail/templates/contact-mail-template.ts
// ========================================

export interface ContactMailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function buildContactMail(props: ContactMailProps): {
  subject: string;
  html: string;
  text: string;
} {
  return {
    subject: `[Contacto Web] ${props.subject}`,
    html: generateContactHTML(props),
    text: generateContactText(props),
  };
}

function generateContactHTML(props: ContactMailProps): string {
  const safeName = escapeForHtml(props.name);
  const safeSubject = escapeForHtml(props.subject);
  const safeEmail = escapeForHtml(props.email);
  const safeMessage = escapeForHtml(props.message).replace(/\n/g, '<br />');

  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Nuevo mensaje de contacto</title>
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
      a {
        text-decoration: none;
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:#e5e5e5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#e5e5e5;padding:24px 8px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
            <tr>
              <td style="background-color:#ffffff;border-radius:10px;border:1px solid #e5e7eb;overflow:hidden;">

                <!-- HEADER -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" style="padding:20px 20px 8px 20px;">
                      <p style="margin:0 0 4px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#9ca3af;">
                        Formulario de contacto
                      </p>
                      <h1 style="margin:0;font-size:20px;line-height:1.35;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;color:#111827;">
                        Nuevo mensaje recibido
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding:6px 20px 16px 20px;">
                      <span style="display:inline-block;padding:5px 12px;border-radius:999px;border:1px solid #bfdbfe;background-color:#eff6ff;font-size:11px;font-weight:600;color:#1d4ed8;">
                        📧 Desde proyecto-cumbre.es
                      </span>
                    </td>
                  </tr>
                </table>

                <!-- INTRO -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding:0 20px 16px 20px;">
                      <p style="margin:0;font-size:14px;line-height:1.6;color:#4b5563;">
                        Has recibido un nuevo mensaje desde el formulario de contacto de la web.
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- SENDER INFO BOX -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding:0 20px 16px 20px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:8px;border:1px solid #e5e7eb;">
                        <tr>
                          <td style="padding:14px 16px 8px 16px;">
                            <p style="margin:0 0 8px 0;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;">
                              Información del remitente
                            </p>
                          </td>
                        </tr>

                        ${detailRow('Nombre', safeName)}
                        ${detailRow(
                          'Email',
                          `<a href="mailto:${safeEmail}" style="color:#f97316;text-decoration:none;">${safeEmail}</a>`,
                        )}
                        ${detailRow('Asunto', safeSubject, true)}
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- MESSAGE BOX -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding:0 20px 16px 20px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
                        <tr>
                          <td style="padding:14px 16px 10px 16px;border-left:3px solid #f97316;">
                            <p style="margin:0 0 8px 0;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;">
                              Mensaje
                            </p>
                            <p style="margin:0;font-size:14px;line-height:1.7;color:#111827;white-space:normal;">
                              ${safeMessage}
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- TIP BOX -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding:0 20px 20px 20px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ecfeff;border-radius:8px;border:1px solid #bae6fd;">
                        <tr>
                          <td style="padding:12px 14px;">
                            <p style="margin:0 0 4px 0;font-size:13px;font-weight:600;color:#0369a1;">
                              💡 Tip
                            </p>
                            <p style="margin:0;font-size:13px;line-height:1.6;color:#0f172a;">
                              Responde directamente a este email para contactar con ${safeName}.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- FOOTER -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #e5e7eb;">
                  <tr>
                    <td align="center" style="padding:14px 20px;">
                      <p style="margin:0 0 4px 0;font-size:11px;color:#9ca3af;">
                        Mensaje recibido desde proyecto-cumbre.es
                      </p>
                      <p style="margin:0;font-size:11px;color:#9ca3af;">
                        PROYECTO CUMBRE · Email automático
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

function detailRow(
  label: string,
  valueHtml: string,
  isLast?: boolean,
): string {
  return `
<tr>
  <td style="padding:8px 16px ${isLast ? '14px' : '8px'} 16px;border-bottom:${
    isLast ? '0' : '1px solid #e5e7eb'
  };">
    <p style="margin:0 0 2px 0;font-size:12px;color:#6b7280;">
      ${escapeForHtml(label)}
    </p>
    <p style="margin:0;font-size:14px;color:#111827;">
      ${valueHtml}
    </p>
  </td>
</tr>
`;
}

// ===================
// TEXT VERSION
// ===================

function generateContactText(props: ContactMailProps): string {
  return `
NUEVO MENSAJE DE CONTACTO

INFORMACIÓN DEL REMITENTE:
Nombre: ${props.name}
Email: ${props.email}
Asunto: ${props.subject}

MENSAJE:
${props.message}

---
Responde directamente a este email para contactar con ${props.name}.

Proyecto Cumbre
proyecto-cumbre.es
  `.trim();
}

// ===================
// HELPERS
// ===================

function escapeForHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
