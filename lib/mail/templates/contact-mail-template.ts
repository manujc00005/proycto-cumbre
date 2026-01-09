// ========================================
// CONTACT FORM EMAIL TEMPLATE
// Always-black dark theme enforced
// Admin notification for contact form submissions
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
              <p style="color: #52525b !important; font-size: 12px; margin: 0; letter-spacing: 0.5px;">FORMULARIO DE CONTACTO</p>
            </td>
          </tr>

          <!-- STATUS BADGE -->
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center; background-color: #0a0a0a !important;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #18181b !important; border: 1px solid #27272a; border-radius: 12px; padding: 24px 32px; text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 12px;">📧</div>
                    <h2 style="color: #fafafa !important; font-size: 18px; font-weight: 700; margin: 0 0 4px 0; letter-spacing: -0.5px;">Nuevo mensaje de contacto</h2>
                    <p style="color: #a1a1aa !important; font-size: 14px; margin: 0;">Recibido desde la web</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="padding: 0 40px 48px 40px; background-color: #0a0a0a !important;">

              <!-- SENDER INFO -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border: 1px solid #27272a; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <tr>
                  <td>
                    <h3 style="color: #e4e4e7 !important; font-size: 14px; font-weight: 600; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 0.5px;">Información del remitente</h3>

                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #27272a;">
                      <tr>
                        <td style="color: #71717a !important; font-size: 13px;">Nombre</td>
                        <td style="color: #fafafa !important; font-size: 14px; font-weight: 600; text-align: right;">${props.name}</td>
                      </tr>
                    </table>

                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #27272a;">
                      <tr>
                        <td style="color: #71717a !important; font-size: 13px;">Email</td>
                        <td style="color: #fafafa !important; font-size: 14px; font-weight: 600; text-align: right;">
                          <a href="mailto:${props.email}" style="color: #f97316 !important; text-decoration: none;">${props.email}</a>
                        </td>
                      </tr>
                    </table>

                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="color: #71717a !important; font-size: 13px;">Asunto</td>
                        <td style="color: #fafafa !important; font-size: 14px; font-weight: 600; text-align: right;">${props.subject}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- MESSAGE -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border-left: 4px solid #f97316; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
                <tr>
                  <td>
                    <h3 style="color: #e4e4e7 !important; font-size: 14px; font-weight: 600; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.5px;">Mensaje</h3>
                    <p style="color: #fafafa !important; font-size: 14px; line-height: 1.8; margin: 0; white-space: pre-wrap;">${escapeHtml(props.message)}</p>
                  </td>
                </tr>
              </table>

              <!-- INSTRUCTIONS -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #18181b !important; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 32px;">
                <tr>
                  <td>
                    <p style="color: #a1a1aa !important; font-size: 13px; line-height: 1.7; margin: 0;">
                      💡 <strong style="color: #e4e4e7 !important;">Tip:</strong> Responde directamente a este email para contactar con ${props.name}.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- FOOTER -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding-top: 32px; border-top: 1px solid #27272a;">
                <tr>
                  <td style="text-align: center;">
                    <p style="color: #71717a !important; font-size: 13px; margin: 0 0 8px 0;">Mensaje recibido desde proyecto-cumbre.es</p>
                    <p style="color: #f97316 !important; font-size: 14px; font-weight: 700; margin: 0 0 24px 0; letter-spacing: 0.5px;">PROYECTO CUMBRE</p>
                    <p style="color: #52525b !important; font-size: 11px; margin: 0;">Email automático</p>
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

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
