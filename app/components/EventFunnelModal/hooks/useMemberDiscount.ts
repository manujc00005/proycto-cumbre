// ========================================
// HOOK: useMemberDiscount REFACTORIZADO
// ✅ Usa pricing del EventFunnelConfig
// ✅ Genérico para todos los eventos
// components/EventFunnelModal/hooks/useMemberDiscount.ts
// ========================================

import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { PricingConfig } from '@/lib/funnels/types';

export interface DiscountResult {
  isMember: boolean;
  isChecking: boolean;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  discountPercent: number;
  memberInfo?: {
    memberNumber?: string;
    name: string;
    membershipStatus: string;
  };
}

// ========================================
// HOOK PRINCIPAL - REFACTORIZADO
// ✅ Ahora recibe EventPricing en lugar de eventSlug
// ========================================

export function useMemberDiscount(
  pricing: PricingConfig,
  email?: string,
  dni?: string
): DiscountResult {
  const [isMember, setIsMember] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [memberInfo, setMemberInfo] = useState<DiscountResult['memberInfo']>();

  // Obtener configuración de descuento del pricing
  const discountConfig = pricing.memberDiscount;

  useEffect(() => {
    // Si no hay configuración de descuento, no hacer nada
    if (!discountConfig) {
      setIsMember(false);
      setIsChecking(false);
      return;
    }

    // Si no hay email ni DNI, no podemos verificar
    if (!email && !dni) {
      setIsMember(false);
      setIsChecking(false);
      return;
    }

    // Verificar membresía
    checkMembership();
  }, [email, dni, pricing]);

  const checkMembership = async () => {
    if (!discountConfig) return;

    setIsChecking(true);

    try {
      const params = new URLSearchParams();
      if (email) params.set('email', email);
      if (dni) params.set('dni', dni);

      const response = await fetch(`/api/members/check-membership?${params.toString()}`);
      const data = await response.json();

      if (response.ok && data.isMember) {
        // Verificar si la membresía está activa si es requerido
        const isActive = !discountConfig.requiresActiveMembership || 
                        data.membershipStatus === 'active';

        setIsMember(isActive);
        
        if (isActive) {
          setMemberInfo({
            memberNumber: data.memberNumber,
            name: data.name,
            membershipStatus: data.membershipStatus,
          });

          logger.log('✅ Descuento aplicado:', {
            discount: `${discountConfig.discountPercent}%`,
            member: data.memberNumber,
          });
        }
      } else {
        setIsMember(false);
        setMemberInfo(undefined);
      }
    } catch (error) {
      logger.error('❌ Error verificando membresía:', error);
      setIsMember(false);
      setMemberInfo(undefined);
    } finally {
      setIsChecking(false);
    }
  };

  // Calcular descuento
  const discountPercent = discountConfig && isMember ? discountConfig.discountPercent : 0;
  const discountAmount = Math.round((pricing.amount * discountPercent) / 100);
  const finalAmount = pricing.amount - discountAmount;

  return {
    isMember,
    isChecking,
    originalAmount: pricing.amount,
    discountAmount,
    finalAmount,
    discountPercent,
    memberInfo,
  };
}
