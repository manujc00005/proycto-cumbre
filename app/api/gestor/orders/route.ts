// ========================================
// API GESTOR ORDERS - Obtener todos los pedidos
// app/api/gestor/orders/route.ts
// ========================================

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    logger.log('📦 [GESTOR] Obteniendo pedidos...');

    const orders = await prisma.order.findMany({
      orderBy: {
        created_at: 'desc',
      },
      include: {
        items: {
          select: {
            id: true,
            product_name: true,
            product_slug: true,
            variant_data: true,
            quantity: true,
            unit_price: true,
            total_price: true,
          },
        },
        member: {
          select: {
            id: true,
            member_number: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    logger.log(`✅ [GESTOR] ${orders.length} pedidos obtenidos`);

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error: any) {
    logger.error('❌ [GESTOR] Error obteniendo pedidos:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener pedidos',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
