import { PaymentStatus } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";


export function mapStripeToPaymentStatus(session: any): PaymentStatus {
  // Stripe Checkout Session:
  // - session.payment_status: 'paid' | 'unpaid' | 'no_payment_required'
  // - session.status: 'open' | 'complete' | 'expired'
  const paymentStatus = session?.payment_status;
  const status = session?.status;

  if (paymentStatus === "paid" || status === "complete") return PaymentStatus.completed;
  if (status === "expired") return PaymentStatus.failed;

  // si está open/unpaid aún, seguimos pending
  return PaymentStatus.pending;
}

export function getMetadataObject(metadata: unknown): JsonObject | null {
  if (metadata && typeof metadata === "object" && !Array.isArray(metadata)) return metadata as JsonObject;
  return null;
}