// lib/stripe-ips.ts
/**
 * Lista oficial de IPs de webhooks de Stripe
 * Fuente: https://stripe.com/docs/ips
 * Última verificación: 2024-12-10
 * 
 * ⚠️ IMPORTANTE: Verificar mensualmente en https://stripe.com/docs/ips
 * 
 * Historial de cambios:
 * - 2024-12-10: Verificación inicial
 */

export const STRIPE_WEBHOOK_IPS = [
  // US East
  '3.18.12.63',
  '3.130.192.231',
  '13.235.14.237',
  '13.235.122.149',
  '18.211.135.69',
  '35.154.171.200',
  '52.15.183.38',
  '54.187.174.169',
  '54.187.205.235',
  '54.187.216.72',
  
  // EU
  '3.67.184.0/24',
  '3.68.46.0/24',
  '3.121.240.0/24',
  '18.157.0.0/24',
  '18.195.64.0/24',
  
  // APAC
  '13.239.19.0/24',
  '54.252.79.0/24',
];

// Fecha de última verificación (para recordatorios)
export const LAST_VERIFIED = '2024-12-10';

/**
 * Verifica si una IP pertenece a Stripe
 */
export function isStripeIP(ip: string): boolean {
  // Normalizar IP (remover puerto si existe, manejar IPv6)
  const cleanIP = ip.split(':')[0];
  
  // Si es IPv6 localhost (::1), no es Stripe
  if (cleanIP === '::1' || cleanIP === '127.0.0.1') {
    return false;
  }
  
  return STRIPE_WEBHOOK_IPS.some(range => {
    // IP exacta
    if (!range.includes('/')) {
      return cleanIP === range;
    }
    
    // CIDR range (ej: 3.67.184.0/24)
    const [subnet, bits] = range.split('/');
    const prefix = subnet.split('.').slice(0, Math.floor(parseInt(bits) / 8)).join('.');
    return cleanIP.startsWith(prefix);
  });
}

/**
 * Verifica si hace falta actualizar la lista de IPs
 * (más de 30 días desde última verificación)
 */
export function needsUpdate(): boolean {
  const lastVerified = new Date(LAST_VERIFIED);
  const daysSince = Math.floor(
    (Date.now() - lastVerified.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return daysSince > 30;
}