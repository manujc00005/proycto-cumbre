// lib/env.ts (NUEVO ARCHIVO)
const requiredEnvVars = [
  "DATABASE_URL",
  "DIRECT_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "RESEND_API_KEY",
  "EMAIL_FROM",
] as const;

export function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables: ${missing.join(", ")}\n` +
        `Please check your .env.local file.`,
    );
  }
}

// Llamar en app/layout.tsx o middleware
validateEnv();
