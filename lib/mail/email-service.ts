// ========================================
// EMAIL SERVICE - ARQUITECTURA GENÉRICA
// ✅ Sistema de templates modular
// ✅ Separation of concerns
// ✅ Type-safe
// ✅ Extensible para cualquier evento/pedido
// lib/email-service.ts
// ========================================

import { Resend } from 'resend';
import { logger } from '@/lib/logger';
import EmailTemplates from './email-templates';
import { BaseEventEmailData, ContactFormData, EmailOptions, LicenseActivatedData, MembershipEmailData, OrderEmailData } from './types';

const resend = new Resend(process.env.RESEND_API_KEY);

// ========================================
// EMAIL SERVICE (MAIN CLASS)
// ========================================

export class EmailService {
  private static from = process.env.EMAIL_FROM || 'info@proyecto-cumbre.es';
  private static adminEmail = process.env.EMAIL_ADMIN || 'info@proyecto-cumbre.es';
  private static isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Enviar email genérico (bajo nivel)
   */
  static async send(options: EmailOptions) {
    const recipients = Array.isArray(options.to) ? options.to : [options.to];
    const fromAddress = options.from || this.from;

    const finalRecipients = this.isDevelopment 
      ? [process.env.DEV_TEST_EMAIL || 'mjc00005@gmail.com']
      : recipients;

    try {
      logger.log('📧 [Email] Enviando:', {
        from: fromAddress,
        to: finalRecipients,
        originalTo: this.isDevelopment ? recipients : undefined,
        subject: options.subject,
        env: process.env.NODE_ENV,
      });

      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: finalRecipients,
        subject: this.isDevelopment ? `[DEV] ${options.subject}` : options.subject,
        html: options.html,
        text: options.text,
      });

      if (error) {
        logger.error('❌ [Email] Error de Resend:', error);
        throw new Error(error.message);
      }

      logger.apiSuccess('Email enviado', { id: data?.id, to: finalRecipients });
      return { success: true, id: data?.id };
    } catch (error: any) {
      logger.apiError('Error crítico enviando email', error);
      throw error;
    }
  }

  // ========================================
  // MEMBERSHIP EMAILS
  // ========================================

  static async sendWelcomeWithPaymentStatus(data: MembershipEmailData) {
    const isSuccess = data.paymentStatus === 'success';
    const html = isSuccess 
      ? EmailTemplates.membershipSuccess(data)
      : EmailTemplates.membershipSuccess(data); // TODO: Crear template de fallo

    return this.send({
      to: data.email,
      subject: isSuccess 
        ? '¡Bienvenido a Proyecto Cumbre! 🏔️' 
        : '⚠️ Problema con tu pago - Proyecto Cumbre',
      html,
    });
  }

  static async sendLicenseActivated(data: LicenseActivatedData) {
    return this.send({
      to: data.email,
      subject: '✅ Tu licencia FEDME está activa',
      html: EmailTemplates.licenseActivated(data),
    });
  }

  // ========================================
  // EVENT EMAILS (GENÉRICO + ESPECÍFICOS)
  // ========================================

  /**
   * Email genérico para cualquier evento
   */
  static async sendEventConfirmation(
    data: BaseEventEmailData,
    config?: {
      whatsappLink?: string;
      features?: string[];
      customMessage?: string;
    }
  ) {
    return this.send({
      to: data.email,
      subject: `✅ Plaza confirmada - ${data.eventName}`,
      html: EmailTemplates.eventConfirmation(data, config),
    });
  }

  /**
   * Email especializado para MISA
   */
  static async sendMisaConfirmation(data: {
    email: string;
    name: string;
    phone: string;
    shirtSize: string;
    amount: number;
  }) {
    const whatsappLink = process.env.MISA_WHATSAPP_GROUP || 'https://chat.whatsapp.com/tu-grupo';
    
    return this.send({
      to: data.email,
      subject: '✅ Plaza confirmada - MISA 23 Enero 2026',
      html: EmailTemplates.misaConfirmation(
        {
          ...data,
          eventName: 'MISA',
          eventDate: new Date('2026-01-23'),
        },
        whatsappLink
      ),
    });
  }

  // ========================================
  // ORDER/SHOP EMAILS
  // ========================================

  static async sendOrderConfirmation(data: OrderEmailData) {
    return this.send({
      to: data.email,
      subject: `✅ Pedido confirmado #${data.orderNumber}`,
      html: EmailTemplates.orderConfirmation(data),
    });
  }

  static async sendOrderShipped(data: {
    email: string;
    name: string;
    orderNumber: string;
    trackingNumber: string;
    trackingUrl: string;
    carrier: string;
  }) {
    return this.send({
      to: data.email,
      subject: `📦 Tu pedido #${data.orderNumber} está en camino`,
      html: EmailTemplates.orderShipped(data),
    });
  }

  // ========================================
  // CONTACT FORM
  // ========================================

  static async sendContactForm(data: ContactFormData) {
    return this.send({
      to: this.adminEmail,
      subject: `[Contacto Web] ${data.subject}`,
      html: EmailTemplates.contactForm(data),
    });
  }
}
