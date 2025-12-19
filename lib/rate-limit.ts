// lib/rate-limit.ts
import { kv } from "@vercel/kv";

/**
 * Implementa rate limiting usando sliding window en Redis (Vercel KV)
 */
export async function checkRateLimit(
  key: string,
  limit = 100,
  windowSeconds = 60,
): Promise<{
  success: boolean;
  remaining: number;
  reset: number;
}> {
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;
  const windowKey = `ratelimit:${key}`;

  try {
    // Usar sorted set para sliding window algorithm
    const pipeline = kv.pipeline();

    // 1. Eliminar requests antiguos fuera de la ventana
    pipeline.zremrangebyscore(windowKey, 0, windowStart);

    // 2. Añadir request actual con timestamp como score
    pipeline.zadd(windowKey, {
      score: now,
      member: `${now}-${Math.random()}`,
    });

    // 3. Contar total de requests en la ventana
    pipeline.zcard(windowKey);

    // 4. Establecer expiración de la key (limpieza automática)
    pipeline.expire(windowKey, windowSeconds * 2);

    // Ejecutar pipeline
    const results = await pipeline.exec();
    const count = (results[2] as number) || 0;

    const remaining = Math.max(0, limit - count);
    const reset = now + windowSeconds * 1000;

    return {
      success: count <= limit,
      remaining,
      reset,
    };
  } catch (error) {
    console.error("❌ Rate limit check failed:", error);
    // Fail open: en caso de error con Redis, permitir la request
    return {
      success: true,
      remaining: limit,
      reset: now + windowSeconds * 1000,
    };
  }
}

/**
 * Rate limiters predefinidos para diferentes endpoints
 */
export const rateLimits = {
  /**
   * Webhook de Stripe: 100 requests/minuto por IP
   */
  stripeWebhook: (ip: string) => checkRateLimit(`stripe:${ip}`, 100, 60),

  /**
   * Endpoints sensibles (members, contact): 5 requests/minuto por IP
   */
  sensitiveApi: (ip: string) => checkRateLimit(`sensitive:${ip}`, 5, 60),

  /**
   * API pública general: 20 requests/minuto por IP
   */
  publicApi: (ip: string) => checkRateLimit(`public:${ip}`, 20, 60),

  /**
   * Checkout de Stripe: 3 requests/minuto por IP (evitar spam de checkouts)
   */
  checkout: (ip: string) => checkRateLimit(`checkout:${ip}`, 3, 60),
};

/**
 * Extrae la IP real del cliente considerando proxies de Vercel
 */
export function getClientIP(request: Request): string {
  // Vercel proporciona x-forwarded-for con la IP real
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // Puede venir como "ip1, ip2, ip3" - tomar la primera
    return forwarded.split(",")[0].trim();
  }

  // Fallback a x-real-ip
  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // Último fallback (nunca debería pasar en Vercel)
  return "127.0.0.1";
}
