// lib/email/email-service.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export class EmailService {
  private static from = process.env.EMAIL_FROM || 'noreply@proyecto-cumbre.com';
  private static adminEmail = process.env.EMAIL_ADMIN || 'admin@proyecto-cumbre.com';

  /**
   * Enviar email genérico
   */
  static async send(options: EmailOptions) {
    try {
      const { data, error } = await resend.emails.send({
        from: options.from || this.from,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      if (error) {
        console.error('❌ Error enviando email:', error);
        throw new Error(error.message);
      }

      console.log('✅ Email enviado:', data?.id);
      return { success: true, id: data?.id };
    } catch (error: any) {
      console.error('❌ Error en EmailService:', error);
      throw error;
    }
  }

  /**
   * Email de bienvenida al nuevo socio
   */
  static async sendWelcomeEmail(memberData: {
    email: string;
    firstName: string;
    lastName: string;
    memberNumber: string;
    licenseType: string;
  }) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Bienvenido a Proyecto Cumbre! 🏔️</h1>
            </div>
            <div class="content">
              <h2>Hola ${memberData.firstName},</h2>
              <p>¡Gracias por unirte a nuestro club de montaña! Estamos encantados de tenerte como socio.</p>
              
              <h3>Detalles de tu membresía:</h3>
              <ul>
                <li><strong>Número de Socio:</strong> ${memberData.memberNumber}</li>
                <li><strong>Nombre:</strong> ${memberData.firstName} ${memberData.lastName}</li>
                <li><strong>Licencia FEDME:</strong> ${memberData.licenseType.toUpperCase()}</li>
              </ul>

              <p>Tu licencia está siendo procesada. Recibirás un email cuando esté activa.</p>

              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_URL}" class="button">Acceder al Portal</a>
              </div>

              <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
              
              <p>¡Nos vemos en la montaña!</p>
              <p><strong>Equipo Proyecto Cumbre</strong></p>
            </div>
            <div class="footer">
              <p>Este es un email automático, por favor no respondas.</p>
              <p>© ${new Date().getFullYear()} Proyecto Cumbre - Club de Montaña</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.send({
      to: memberData.email,
      subject: '¡Bienvenido a Proyecto Cumbre! 🏔️',
      html,
      text: `Hola ${memberData.firstName}, bienvenido a Proyecto Cumbre. Tu número de socio es ${memberData.memberNumber}.`,
    });
  }

  /**
   * Email de confirmación de pago
   */
  static async sendPaymentConfirmation(data: {
    email: string;
    firstName: string;
    memberNumber: string;
    amount: number;
    currency: string;
    description: string;
  }) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .amount { font-size: 36px; font-weight: bold; color: #10b981; text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Pago Confirmado</h1>
            </div>
            <div class="content">
              <h2>Hola ${data.firstName},</h2>
              <p>Hemos recibido tu pago correctamente.</p>
              
              <div class="amount">${(data.amount / 100).toFixed(2)} ${data.currency.toUpperCase()}</div>

              <h3>Detalles del pago:</h3>
              <ul>
                <li><strong>Número de Socio:</strong> ${data.memberNumber}</li>
                <li><strong>Concepto:</strong> ${data.description}</li>
                <li><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</li>
              </ul>

              <p>Gracias por tu pago. Tu membresía está ahora activa.</p>
              
              <p><strong>Equipo Proyecto Cumbre</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Proyecto Cumbre - Club de Montaña</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.send({
      to: data.email,
      subject: '✅ Pago confirmado - Proyecto Cumbre',
      html,
    });
  }

  /**
   * Email a administradores - Nueva licencia pendiente
   */
  static async notifyAdminNewLicense(memberData: {
    firstName: string;
    lastName: string;
    memberNumber: string;
    licenseType: string;
    email: string;
    phone: string;
  }) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
            .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
            h2 { color: #f97316; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>🔔 Nueva Licencia Pendiente de Procesar</h2>
            
            <div class="alert">
              <strong>Acción requerida:</strong> Hay una nueva licencia FEDME pendiente de tramitación.
            </div>

            <h3>Datos del Socio:</h3>
            <ul>
              <li><strong>Nombre:</strong> ${memberData.firstName} ${memberData.lastName}</li>
              <li><strong>N° Socio:</strong> ${memberData.memberNumber}</li>
              <li><strong>Email:</strong> ${memberData.email}</li>
              <li><strong>Teléfono:</strong> ${memberData.phone}</li>
              <li><strong>Licencia:</strong> ${memberData.licenseType.toUpperCase()}</li>
            </ul>

            <p><a href="${process.env.NEXT_PUBLIC_URL}/gestor" style="background: #f97316; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">Ir al Gestor</a></p>
          </div>
        </body>
      </html>
    `;

    return this.send({
      to: this.adminEmail,
      subject: `🔔 Nueva licencia pendiente - ${memberData.memberNumber}`,
      html,
    });
  }

  /**
   * Email de licencia activada
   */
  static async sendLicenseActivated(data: {
    email: string;
    firstName: string;
    memberNumber: string;
    licenseType: string;
    validUntil: Date;
  }) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .success-badge { background: #d1fae5; color: #065f46; padding: 10px 20px; border-radius: 20px; display: inline-block; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Tu Licencia FEDME está Activa</h1>
            </div>
            <div class="content">
              <h2>Hola ${data.firstName},</h2>
              <p>¡Buenas noticias! Tu licencia FEDME ya ha sido procesada y está activa.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <div class="success-badge">LICENCIA ${data.licenseType.toUpperCase()} ACTIVA</div>
              </div>

              <h3>Detalles:</h3>
              <ul>
                <li><strong>Número de Socio:</strong> ${data.memberNumber}</li>
                <li><strong>Tipo de Licencia:</strong> ${data.licenseType.toUpperCase()}</li>
                <li><strong>Válida hasta:</strong> ${data.validUntil.toLocaleDateString('es-ES')}</li>
              </ul>

              <p>Ya puedes disfrutar de todas las coberturas y beneficios de tu licencia FEDME.</p>
              
              <p>¡Nos vemos en la montaña!</p>
              <p><strong>Equipo Proyecto Cumbre</strong></p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.send({
      to: data.email,
      subject: '✅ Tu licencia FEDME está activa',
      html,
    });
  }
}