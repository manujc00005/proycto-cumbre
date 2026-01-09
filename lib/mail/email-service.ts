// ========================================
// EMAIL SERVICE - REFACTORED WITH MODULAR TEMPLATES
// Uses new template-based architecture
// lib/mail/email-service.ts
// ========================================

import { Resend } from 'resend';
import { logger } from '@/lib/logger';
import { buildOrderMail, OrderMailProps } from './templates/order-mail-template';
import { buildEventMail, EventMailProps } from './templates/event-mail-template';
import { buildMembershipMail, MembershipMailProps } from './templates/membership-mail-template';
import { buildLicenseMail, LicenseMailProps } from './templates/license-mail-template';
import { buildContactMail } from './templates/contact-mail-template';
import { getEventEmailConfig } from './event-email-configs';
import {
  BaseEventEmailData,
  ContactFormData,
  EmailOptions,
  LicenseActivatedData,
  MembershipEmailData,
  OrderEmailData,
} from './types';

const resend = new Resend(process.env.RESEND_API_KEY);

export default class EmailService {
  private static from = process.env.EMAIL_FROM || 'info@proyecto-cumbre.es';
  private static adminEmail = process.env.EMAIL_ADMIN || 'info@proyecto-cumbre.es';
  private static isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Send generic email (low-level)
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
  // MEMBERSHIP EMAILS - NEW TEMPLATE SYSTEM
  // ========================================

  static async sendWelcomeWithPaymentStatus(data: MembershipEmailData) {
    const mailProps: MembershipMailProps = {
      paymentStatus: data.paymentStatus,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      memberNumber: data.memberNumber,
      licenseType: data.licenseType,
      amount: data.amount,
      currency: data.currency,
    };

    const { subject, html, text } = buildMembershipMail(mailProps);

    return this.send({
      to: data.email,
      subject,
      html,
      text,
    });
  }

  static async sendLicenseActivated(data: LicenseActivatedData) {
    const mailProps: LicenseMailProps = {
      status: 'activated',
      email: data.email,
      firstName: data.firstName,
      memberNumber: data.memberNumber,
      licenseType: data.licenseType,
      validUntil: data.validUntil,
    };

    const { subject, html, text } = buildLicenseMail(mailProps);

    return this.send({
      to: data.email,
      subject,
      html,
      text,
    });
  }

  // ========================================
  // EVENT EMAILS - NEW TEMPLATE SYSTEM
  // ========================================

  static async sendEventConfirmation(
    eventSlug: string,
    data: BaseEventEmailData
  ) {
    const config = getEventEmailConfig(eventSlug, {
      shirtSize: data.shirtSize,
      eventDate: data.eventDate,
      eventName: data.eventName,
    });

    const mailProps: EventMailProps = {
      email: data.email,
      name: data.name,
      phone: data.phone,
      dni: data.dni,
      shirtSize: data.shirtSize,
      amount: data.amount,
      eventName: config.eventName,
      eventDate: config.eventDate,
      eventLocation: config.eventLocation,
      heroColor: config.heroColor,
      whatsappLink: config.whatsappLink,
      whatsappMessage: config.whatsappMessage,
      eventDetails: config.eventDetails,
      customDetails: config.customDetails,
      features: config.features,
      importantNote: config.importantNote,
      ctaButtons: config.ctaButtons,
    };

    const { subject, html, text } = buildEventMail(mailProps);

    return this.send({
      to: data.email,
      subject,
      html,
      text,
    });
  }

  // ========================================
  // ORDER/SHOP EMAILS - NEW TEMPLATE SYSTEM
  // ========================================

  /**
   * Send order confirmation email
   * Status: PAID
   */
  static async sendOrderConfirmation(data: OrderEmailData) {
    const mailProps: OrderMailProps = {
      status: 'PAID',
      email: data.email,
      name: data.name,
      orderNumber: data.orderNumber,
      items: data.items,
      subtotal: data.subtotal,
      shipping: data.shipping,
      total: data.total,
      shippingAddress: data.shippingAddress,
    };

    const { subject, html, text } = buildOrderMail(mailProps);

    return this.send({
      to: data.email,
      subject,
      html,
      text,
    });
  }

  /**
   * Send order processing email
   * Status: PROCESSING
   */
  static async sendOrderProcessing(data: {
    email: string;
    name: string;
    orderNumber: string;
    items: Array<{
      name: string;
      quantity: number;
      price?: number;
    }>;
  }) {
    const mailProps: OrderMailProps = {
      status: 'PROCESSING',
      email: data.email,
      name: data.name,
      orderNumber: data.orderNumber,
      items: data.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price || 0,
      })),
      total: 0,
    };

    const { subject, html, text } = buildOrderMail(mailProps);

    return this.send({
      to: data.email,
      subject,
      html,
      text,
    });
  }

  /**
   * Send order shipped email
   * Status: SHIPPED
   */
  static async sendOrderShipped(data: {
    email: string;
    name: string;
    orderNumber: string;
    trackingNumber: string;
    trackingUrl: string;
    carrier: string;
  }) {
    const mailProps: OrderMailProps = {
      status: 'SHIPPED',
      email: data.email,
      name: data.name,
      orderNumber: data.orderNumber,
      items: [],
      total: 0,
      trackingNumber: data.trackingNumber,
      trackingUrl: data.trackingUrl,
      carrier: data.carrier,
    };

    const { subject, html, text } = buildOrderMail(mailProps);

    return this.send({
      to: data.email,
      subject,
      html,
      text,
    });
  }

  /**
   * Send order delivered email
   * Status: DELIVERED
   */
  static async sendOrderDelivered(data: {
    email: string;
    name: string;
    orderNumber: string;
  }) {
    const mailProps: OrderMailProps = {
      status: 'DELIVERED',
      email: data.email,
      name: data.name,
      orderNumber: data.orderNumber,
      items: [],
      total: 0,
    };

    const { subject, html, text } = buildOrderMail(mailProps);

    return this.send({
      to: data.email,
      subject,
      html,
      text,
    });
  }

  /**
   * Send order cancelled email
   * Status: CANCELLED
   */
  static async sendOrderCancelled(data: {
    email: string;
    name: string;
    orderNumber: string;
    reason?: string;
    refundInfo?: string;
  }) {
    const mailProps: OrderMailProps = {
      status: 'CANCELLED',
      email: data.email,
      name: data.name,
      orderNumber: data.orderNumber,
      items: [],
      total: 0,
      reason: data.reason,
      refundInfo: data.refundInfo,
    };

    const { subject, html, text } = buildOrderMail(mailProps);

    return this.send({
      to: data.email,
      subject,
      html,
      text,
    });
  }

  // ========================================
  // CONTACT FORM - NEW TEMPLATE SYSTEM
  // ========================================

  static async sendContactForm(data: ContactFormData) {
    const { subject, html, text } = buildContactMail(data);

    return this.send({
      to: this.adminEmail,
      subject,
      html,
      text,
    });
  }
}

export { EmailService };
