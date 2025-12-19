// ========================================
// EMAIL SERVICE - CON REGISTRO DE EVENTOS
// ✅ Un solo método para todos los eventos
// ✅ Configuración automática por slug
// lib/email/email-service.ts
// ========================================

import { Resend } from "resend";
import { logger } from "@/lib/logger";
import EmailTemplates from "./email-templates";
import { buildEventEmail } from "./event-email-template";
import { getEventEmailConfig } from "./event-email-configs";
import {
  BaseEventEmailData,
  ContactFormData,
  EmailOptions,
  LicenseActivatedData,
  MembershipEmailData,
  OrderEmailData,
} from "./types";

const resend = new Resend(process.env.RESEND_API_KEY);

export default class EmailService {
  private static from = process.env.EMAIL_FROM || "info@proyecto-cumbre.es";
  private static adminEmail =
    process.env.EMAIL_ADMIN || "info@proyecto-cumbre.es";
  private static isDevelopment = process.env.NODE_ENV === "development";

  /**
   * Enviar email genérico (bajo nivel)
   */
  static async send(options: EmailOptions) {
    const recipients = Array.isArray(options.to) ? options.to : [options.to];
    const fromAddress = options.from || this.from;

    const finalRecipients = this.isDevelopment
      ? [process.env.DEV_TEST_EMAIL || "mjc00005@gmail.com"]
      : recipients;

    try {
      logger.log("📧 [Email] Enviando:", {
        from: fromAddress,
        to: finalRecipients,
        originalTo: this.isDevelopment ? recipients : undefined,
        subject: options.subject,
        env: process.env.NODE_ENV,
      });

      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: finalRecipients,
        subject: this.isDevelopment
          ? `[DEV] ${options.subject}`
          : options.subject,
        html: options.html,
        text: options.text,
      });

      if (error) {
        logger.error("❌ [Email] Error de Resend:", error);
        throw new Error(error.message);
      }

      logger.apiSuccess("Email enviado", { id: data?.id, to: finalRecipients });
      return { success: true, id: data?.id };
    } catch (error: any) {
      logger.apiError("Error crítico enviando email", error);
      throw error;
    }
  }

  // ========================================
  // MEMBERSHIP EMAILS
  // ========================================

  static async sendWelcomeWithPaymentStatus(data: MembershipEmailData) {
    const isSuccess = data.paymentStatus === "success";
    const html = isSuccess
      ? EmailTemplates.membershipSuccess(data)
      : EmailTemplates.membershipFailed(data);

    return this.send({
      to: data.email,
      subject: isSuccess
        ? "¡Bienvenido a Proyecto Cumbre! 🏔️"
        : "⚠️ Problema con tu pago - Proyecto Cumbre",
      html,
    });
  }

  static async sendLicenseActivated(data: LicenseActivatedData) {
    return this.send({
      to: data.email,
      subject: "✅ Tu licencia FEDME está activa",
      html: EmailTemplates.licenseActivated(data),
    });
  }

  // ========================================
  // EVENT EMAILS - MÉTODO ÚNICO
  // ========================================

  /**
   * Enviar email de confirmación de evento
   * ✅ Automáticamente usa la config correcta según el slug
   *
   * @param eventSlug - Slug del evento ('misa', 'trail-nocturno', etc.)
   * @param data - Datos del participante
   */
  static async sendEventConfirmation(
    eventSlug: string,
    data: BaseEventEmailData,
  ) {
    // ✅ Obtener config automáticamente por slug
    const config = getEventEmailConfig(eventSlug, {
      shirtSize: data.shirtSize,
      eventDate: data.eventDate,
      eventName: data.eventName,
    });

    // ✅ Generar HTML
    const html = buildEventEmail(data, config);

    // ✅ Enviar
    return this.send({
      to: data.email,
      subject: `✅ Plaza confirmada - ${config.eventName}`,
      html,
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

export { EmailService };
