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

const normalizeEmail = (v: string) => v.trim().toLowerCase();

const testEmails = (process.env.TEST_USER_EMAILS ?? '')
  .split(',')
  .map(normalizeEmail)
  .filter(Boolean);

export const isTestUserEmail = (email?: string | null) =>
  !!email && testEmails.includes(normalizeEmail(email));

export function toStripeMetadata(input: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(input)) {
    if (v === undefined || v === null) continue;
    out[k] = typeof v === "string" ? v : JSON.stringify(v);
  }
  return out;
}