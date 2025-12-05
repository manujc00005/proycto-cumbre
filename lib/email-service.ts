// lib/email/email-service.ts
import { Resend } from 'resend';
import { logger } from '@/lib/logger';
import { formatLicenseType, formatShortLicenseType } from './constants';

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

    // 🔥 En desarrollo, enviar SIEMPRE a tu email
    const finalRecipients = isDevelopment 
      ? [process.env.DEV_TEST_EMAIL || 'mjc00005@gmail.com']
      : recipients;

    try {
      logger.log('📧 [Email] Intentando enviar:', {
        from: fromAddress,
        to: finalRecipients,
        originalTo: isDevelopment ? recipients : undefined, // Log del destinatario real
        subject: options.subject,
        env: process.env.NODE_ENV,
      });

      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: finalRecipients,
        subject: isDevelopment ? `[DEV] ${options.subject}` : options.subject,
        html: options.html,
        text: options.text,
      });

      if (error) {
        logger.error('❌ [Email] Error de Resend:', {
          error: error.message,
          name: error.name,
          to: finalRecipients,
          subject: options.subject,
        });
        throw new Error(error.message);
      }

      logger.apiSuccess('Email enviado', {
        id: data?.id,
        to: finalRecipients,
        originalTo: isDevelopment ? recipients : undefined,
        subject: options.subject,
      });

      return { success: true, id: data?.id };
    } catch (error: any) {
      logger.apiError('Error crítico enviando email', {
        message: error.message,
        to: finalRecipients,
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
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              color: #f97316;
              font-size: 32px;
              font-weight: 700;
              margin: 0;
              letter-spacing: -0.5px;
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
            .status-box.success {
              background-color: #022c22;
              border: 1px solid #065f46;
              border-radius: 12px;
              padding: 25px;
              text-align: center;
              margin: 30px 0;
            }
            .status-box.success .status-icon {
              font-size: 48px;
              margin-bottom: 10px;
            }
            .status-box.success .status-title {
              font-size: 20px;
              font-weight: 700;
              color: #10b981;
              margin-bottom: 8px;
            }
            .status-box.success .status-subtitle {
              color: #6ee7b7;
              font-size: 14px;
            }
            .status-box.success .amount {
              font-size: 36px;
              font-weight: 700;
              color: #10b981;
              margin-top: 15px;
            }
            .info-box {
              background-color: #27272a;
              border: 1px solid #3f3f46;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .info-box h3 {
              color: #fafafa;
              font-size: 16px;
              margin-bottom: 15px;
              font-weight: 600;
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
            .badge {
              display: inline-block;
              background-color: #422006;
              color: #fb923c;
              padding: 6px 14px;
              border-radius: 6px;
              font-size: 13px;
              font-weight: 600;
              border: 1px solid #7c2d12;
            }
            .alert-box {
              background-color: #422006;
              border: 1px solid #7c2d12;
              border-left: 4px solid #f97316;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .alert-box p {
              color: #fcd34d;
              margin: 8px 0;
              font-size: 14px;
            }
            .alert-box strong {
              color: #fbbf24;
            }
            .error-box {
              background-color: #450a0a;
              border: 1px solid #7f1d1d;
              border-left: 4px solid #ef4444;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .error-box p {
              color: #fca5a5;
              margin: 8px 0;
              font-size: 14px;
            }
            .error-box strong {
              color: #ef4444;
              display: block;
              margin-bottom: 8px;
              font-size: 16px;
            }
            .error-box .error-icon {
              font-size: 32px;
              margin-bottom: 10px;
              display: block;
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
              <h1>PROYECTO CUMBRE</h1>
            </div>
            
            <div class="content">
              <h2>Hola ${memberData.firstName},</h2>
              
              ${isSuccess ? `
                <p>¡Gracias por unirte a nuestro club de montaña! Estamos encantados de tenerte como socio y de acompañarte en esta nueva aventura.</p>
                
                <div class="status-box success">
                  <div class="status-icon">✅</div>
                  <div class="status-title">Pago Completado</div>
                  <div class="status-subtitle">Tu membresía está activa</div>
                  ${memberData.amount ? `<div class="amount">${(memberData.amount / 100).toFixed(2)}€</div>` : ''}
                </div>

                <div class="info-box">
                  <h3>Detalles de tu membresía</h3>
                  <ul>
                    <li><strong>Número de Socio:</strong> ${memberData.memberNumber}</li>
                    <li><strong>Nombre:</strong> ${memberData.firstName} ${memberData.lastName}</li>
                    <li><strong>Estado:</strong> <span style="color: #10b981; font-weight: 600;">ACTIVO</span></li>
                    ${hasLicense ? `<li><strong>Licencia FEDME:</strong> <span class="badge">${memberData.licenseType.toUpperCase()}</span></li>` : '<li><strong>Licencia FEDME:</strong> Sin licencia</li>'}
                  </ul>
                </div>

                ${hasLicense ? `
                  <div class="alert-box">
                    <p><strong>📋 Sobre tu licencia federativa</strong></p>
                    <p>Tu licencia FEDME está siendo procesada. Te enviaremos un email de confirmación cuando esté activa y disponible para descargar (normalmente 48-72 horas).</p>
                  </div>
                ` : ''}

                <p>Ya puedes participar en todas nuestras actividades. ¡Nos vemos en la montaña!</p>
              ` : `
                <p>Hemos recibido tu solicitud de membresía, pero hay un problema con el procesamiento del pago.</p>
                
                <div class="error-box">
                  <span class="error-icon">⚠️</span>
                  <strong>No se pudo completar el pago</strong>
                  <p>• El pago fue rechazado o cancelado por tu banco</p>
                  <p>• Tu membresía no ha sido activada</p>
                  <p>• No se te ha realizado ningún cargo</p>
                </div>

                <div class="info-box">
                  <h3>¿Qué puedes hacer?</h3>
                  <ul>
                    <li><strong>Reintentar el pago</strong> desde nuestra web usando otra tarjeta</li>
                    <li><strong>Contactarnos</strong> si crees que hay un error: info@proyecto-cumbre.es</li>
                    <li><strong>Verificar con tu banco</strong> que la tarjeta permite pagos online internacionales</li>
                  </ul>
                </div>

                <p style="margin-top: 30px; color: #fafafa;">Estamos aquí para ayudarte:</p>
                <p style="color: #f97316; font-weight: 600;">📧 info@proyecto-cumbre.es</p>
              `}
              
              <p style="margin-top: 30px; color: #f97316; font-weight: 600;">Equipo Proyecto Cumbre</p>
            </div>
            
            <div class="footer">
              <p>Este es un email automático, por favor no respondas a este mensaje.</p>
              <p>© ${new Date().getFullYear()} Proyecto Cumbre - Club de Montaña</p>
            </div>
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

   const formattedLicense = formatLicenseType(data.licenseType);
   const shortFormattedLicense = formatShortLicenseType(data.licenseType);

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
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              color: #f97316;
              font-size: 32px;
              font-weight: 700;
              margin: 0;
              letter-spacing: -0.5px;
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
            .success-icon {
              font-size: 32px;
              margin-bottom: 12px;
              color: #10b981;
            }
            .success-badge {
              display: inline-block;
              background-color: #064e3b;
              color: #6ee7b7;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 700;
              font-size: 18px;
              border: 1px solid #065f46;
            }
            .info-box {
              background-color: #27272a;
              border: 1px solid #3f3f46;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .info-box h3 {
              color: #fafafa;
              font-size: 16px;
              margin-bottom: 15px;
              font-weight: 600;
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
            .alert-box {
              background-color: #422006;
              border: 1px solid #7c2d12;
              border-left: 4px solid #f97316;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .alert-box p {
              color: #fcd34d;
              margin: 8px 0;
              font-size: 14px;
            }
            .alert-box strong {
              color: #fbbf24;
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
              <h1>PROYECTO CUMBRE</h1>
            </div>
            <div class="content">
              <h2>Hola ${data.firstName},</h2>
              <p>Tenemos excelentes noticias. Tu licencia FEDME ya ha sido procesada y está completamente activa.</p>
              
              <div class="badge-box">
                <div class="success-badge">LICENCIA: ${shortFormattedLicense} ACTIVA ✓</div>
              </div>

              <div class="info-box">
                <h3>Detalles de tu licencia</h3>
                <ul>
                  <li><strong>Número de Socio:</strong> ${data.memberNumber}</li>
                  <li><strong>Tipo de Licencia:</strong>  ${formattedLicense}</li>
                  <li><strong>Válida hasta:</strong> ${data.validUntil.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</li>
                </ul>
              </div>

              <div class="alert-box">
                <p><strong>📱 Accede a tu licencia en la app oficial FEDME</strong></p>
                <p>Tu licencia ya está disponible en la aplicación oficial de la FEDME. Descárgala en tu móvil para tener acceso digital a tu licencia en todo momento.</p>
                <p style="margin-top: 10px;"><strong>iOS:</strong> App Store → "FEDME Licencias"</p>
                <p><strong>Android:</strong> Google Play → "FEDME Licencias"</p>
              </div>

              <p>Con tu licencia activa ya puedes disfrutar de todas las coberturas y beneficios en todas nuestras actividades de montaña.</p>
              
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

    /**
   * Email de contacto desde formulario web
   */
  static async sendContactForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    logger.log('📧 [Email] Preparando email de contacto:', {
      from: data.email,
      subject: data.subject,
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
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              color: #f97316;
              font-size: 32px;
              font-weight: 700;
              margin: 0;
              letter-spacing: -0.5px;
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
            .info-box {
              background-color: #27272a;
              border: 1px solid #3f3f46;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .info-box h3 {
              color: #fafafa;
              font-size: 14px;
              margin-bottom: 15px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .info-box p {
              color: #a1a1aa;
              margin: 8px 0;
              font-size: 15px;
            }
            .info-box strong {
              color: #fafafa;
              font-weight: 600;
            }
            .message-box {
              background-color: #09090b;
              border-left: 4px solid #f97316;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .message-box p {
              color: #e4e4e7;
              white-space: pre-wrap;
              line-height: 1.8;
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
              <h1>PROYECTO CUMBRE</h1>
            </div>
            
            <div class="content">
              <h2>Nuevo mensaje de contacto</h2>
              
              <div class="info-box">
                <h3>Información del remitente</h3>
                <p><strong>Nombre:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Asunto:</strong> ${data.subject}</p>
              </div>

              <div class="message-box">
                <p>${data.message}</p>
              </div>

              <p style="margin-top: 30px; color: #a1a1aa; font-size: 14px;">
                Responde directamente a este email para contactar con ${data.name}.
              </p>
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
        to: this.adminEmail, // Envía a tu email de admin
        subject: `[Contacto Web] ${data.subject}`,
        html,
        from: this.from,
      });

      logger.apiSuccess('Email de contacto enviado');
      return result;
    } catch (error) {
      logger.apiError('Fallo enviando email de contacto', error);
      throw error;
    }
  }
}