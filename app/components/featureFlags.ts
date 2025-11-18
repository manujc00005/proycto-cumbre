/**
 * Feature Flags Configuration
 * 
 * Sistema centralizado de feature flags para controlar funcionalidades en producción.
 * Permite activar/desactivar features sin hacer deploy.
 */

export interface FeatureFlags {
  // Cart System
  enableCart: boolean;
  enableCheckout: boolean;
  
  // Future features
  enableWishlist: boolean;
  enableReviews: boolean;
  enableDiscountCodes: boolean;
}

/**
 * Feature flags por defecto
 * Cambiar estos valores para activar/desactivar features
 */
const defaultFlags: FeatureFlags = {
  // Cart
  enableCart: false,           // ← Cambiar a false para desactivar el carrito
  enableCheckout: false,        // ← Desactivar checkout si Stripe falla
  
  // Future features
  enableWishlist: false,
  enableReviews: false,
  enableDiscountCodes: false,
};

/**
 * Obtener feature flags desde variables de entorno (opcional)
 * Permite override de flags via .env sin tocar código
 */
const getEnvFlags = (): Partial<FeatureFlags> => {
  if (typeof window !== 'undefined') {
    // Client-side: no tiene acceso a process.env en producción
    return {};
  }

  return {
    enableCart: process.env.NEXT_PUBLIC_ENABLE_CART === 'true' 
      ? true 
      : process.env.NEXT_PUBLIC_ENABLE_CART === 'false' 
        ? false 
        : undefined,
    
    enableCheckout: process.env.NEXT_PUBLIC_ENABLE_CHECKOUT === 'true'
      ? true
      : process.env.NEXT_PUBLIC_ENABLE_CHECKOUT === 'false'
        ? false
        : undefined,
  };
};

/**
 * Merge flags: env variables override default values
 */
export const featureFlags: FeatureFlags = {
  ...defaultFlags,
  ...getEnvFlags(),
};

/**
 * Hook para usar feature flags en componentes
 */
export const useFeatureFlag = (flag: keyof FeatureFlags): boolean => {
  return featureFlags[flag];
};

/**
 * Utility para checks condicionales
 */
export const isFeatureEnabled = (flag: keyof FeatureFlags): boolean => {
  return featureFlags[flag];
};
