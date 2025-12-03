// lib/email/email-service.ts
import { Resend } from 'resend';
import { logger } from '@/lib/logger';

const resend = new Resend(process.env.RESEND_API_KEY);

// Detectar entorno
const isDevelopment = process.env.NODE_ENV === 'development';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export class EmailService {
  private static from = process.env.EMAIL_FROM || 'info@proyecto-cumbre.es';
  private static adminEmail = process.env.EMAIL_ADMIN || 'info@proyecto-cumbre.es';

  /**
   * Enviar email genérico
   */
  static async send(options: EmailOptions) {
    const recipients = Array.isArray(options.to) ? options.to : [options.to];
    const fromAddress = options.from || this.from;

    try {
      logger.log('📧 [Email] Intentando enviar:', {
        from: fromAddress,
        to: recipients,
        subject: options.subject,
        env: process.env.NODE_ENV,
      });

      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: recipients,
        subject: isDevelopment ? `[DEV] ${options.subject}` : options.subject,
        html: options.html,
        text: options.text,
      });

      if (error) {
        logger.error('❌ [Email] Error de Resend:', {
          error: error.message,
          name: error.name,
          to: recipients,
          subject: options.subject,
        });
        throw new Error(error.message);
      }

      logger.apiSuccess('Email enviado', {
        id: data?.id,
        to: recipients,
        subject: options.subject,
      });

      return { success: true, id: data?.id };
    } catch (error: any) {
      logger.apiError('Error crítico enviando email', {
        message: error.message,
        to: recipients,
        subject: options.subject,
      });
      throw error;
    }
  }

  /**
   * Email unificado de bienvenida + confirmación de pago
   */
  static async sendWelcomeWithPaymentStatus(memberData: {
    email: string;
    firstName: string;
    lastName: string;
    memberNumber: string;
    licenseType: string;
    paymentStatus: 'success' | 'failed';
    amount?: number;
    currency?: string;
  }) {
    logger.log('📧 [Email] Preparando email de bienvenida con estado de pago:', {
      email: memberData.email,
      memberNumber: memberData.memberNumber,
      paymentStatus: memberData.paymentStatus,
    });

    const hasLicense = memberData.licenseType && memberData.licenseType !== 'none';
    const isSuccess = memberData.paymentStatus === 'success';


    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6; 
              color: #e4e4e7;
              background-color: #09090b;
              padding: 20px;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background-color: #18181b;
              border: 1px solid #27272a;
              border-radius: 12px;
              overflow: hidden;
            }
            .header { 
              background: #000000;
              padding: 30px;
              text-align: center;
            }
            .header img {
              max-width: 180px;
              height: auto;
            }
            .content { 
              padding: 40px 30px;
              background-color: #18181b;
            }
            /* ... resto de estilos ... */
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://proyecto-cumbre.es/aaa.png" alt="Proyecto Cumbre" />
            </div>
            <!-- resto del contenido -->
          </div>
        </body>
      </html>
    `;

    try {
      const result = await this.send({
        to: memberData.email,
        subject: isSuccess 
          ? '¡Bienvenido a Proyecto Cumbre! 🏔️' 
          : '⚠️ Problema con tu pago - Proyecto Cumbre',
        html,
        text: isSuccess
          ? `Hola ${memberData.firstName}, bienvenido a Proyecto Cumbre. Tu número de socio es ${memberData.memberNumber} y tu membresía está activa.`
          : `Hola ${memberData.firstName}, tu pago no pudo procesarse. Por favor, contacta con nosotros en info@proyecto-cumbre.es`,
      });

      logger.apiSuccess(isSuccess ? 'Email de bienvenida enviado' : 'Email de pago fallido enviado');
      return result;
    } catch (error) {
      logger.apiError('Fallo enviando email unificado', error);
      throw error;
    }
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
    logger.log('📧 [Email] Preparando licencia activada:', {
      email: data.email,
      memberNumber: data.memberNumber,
      licenseType: data.licenseType,
    });

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6; 
              color: #e4e4e7;
              background-color: #09090b;
              padding: 20px;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background-color: #18181b;
              border: 1px solid #27272a;
              border-radius: 12px;
              overflow: hidden;
            }
            .header { 
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              color: white;
              font-size: 28px;
              font-weight: 700;
              margin: 0;
            }
            .content { 
              padding: 40px 30px;
              background-color: #18181b;
            }
            .content h2 {
              color: #fafafa;
              font-size: 24px;
              margin-bottom: 20px;
              font-weight: 600;
            }
            .content p {
              color: #a1a1aa;
              margin-bottom: 16px;
              font-size: 15px;
            }
            .badge-box {
              background-color: #022c22;
              border: 1px solid #065f46;
              border-radius: 12px;
              padding: 30px;
              text-align: center;
              margin: 30px 0;
            }
            .success-badge {
              display: inline-block;
              background-color: #064e3b;
              color: #6ee7b7;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 700;
              font-size: 16px;
              border: 1px solid #065f46;
            }
            .info-box {
              background-color: #27272a;
              border: 1px solid #3f3f46;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .info-box ul {
              list-style: none;
              margin: 0;
              padding: 0;
            }
            .info-box li {
              color: #a1a1aa;
              padding: 8px 0;
              border-bottom: 1px solid #3f3f46;
              font-size: 15px;
            }
            .info-box li:last-child {
              border-bottom: none;
            }
            .info-box strong {
              color: #fafafa;
              font-weight: 600;
            }
            .footer { 
              text-align: center; 
              padding: 30px;
              background-color: #09090b;
              border-top: 1px solid #27272a;
            }
            .footer p {
              color: #71717a;
              font-size: 13px;
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Tu Licencia FEDME está Activa</h1>
            </div>
            <div class="content">
              <h2>Hola ${data.firstName},</h2>
              <p>¡Buenas noticias! Tu licencia FEDME ya ha sido procesada y está completamente activa.</p>
              
              <div class="badge-box">
                <div class="success-badge">LICENCIA ${data.licenseType.toUpperCase()} ACTIVA</div>
              </div>

              <div class="info-box">
                <ul>
                  <li><strong>Número de Socio:</strong> ${data.memberNumber}</li>
                  <li><strong>Tipo de Licencia:</strong> ${data.licenseType.toUpperCase()}</li>
                  <li><strong>Válida hasta:</strong> ${data.validUntil.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</li>
                </ul>
              </div>

              <p>Ya puedes disfrutar de todas las coberturas y beneficios de tu licencia FEDME en todas nuestras actividades.</p>
              
              <p style="margin-top: 30px; color: #fafafa;">¡Nos vemos en la montaña!</p>
              <p style="color: #f97316; font-weight: 600;">Equipo Proyecto Cumbre</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Proyecto Cumbre - Club de Montaña</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const result = await this.send({
        to: data.email,
        subject: '✅ Tu licencia FEDME está activa',
        html,
      });

      logger.apiSuccess('Email de licencia activada enviado');
      return result;
    } catch (error) {
      logger.apiError('Fallo enviando email de licencia activada', error);
      throw error;
    }
  }
}