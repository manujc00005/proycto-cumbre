// ========================================
// API GESTOR ADD TRACKING
// app/api/gestor/add-tracking/route.ts
// ========================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import EmailService from '@/lib/mail/email-service';

export async function POST(request: NextRequest) {
  try {
    const { orderId, trackingNumber } = await request.json();

    if (!orderId || !trackingNumber) {
      return NextResponse.json(
        { error: 'orderId y trackingNumber son requeridos' },
        { status: 400 }
      );
    }

    logger.log(`📦 [GESTOR] Añadiendo tracking ${trackingNumber} al pedido ${orderId}`);

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        tracking_number: trackingNumber,
        status: 'shipped', // Cambiar automáticamente a enviado
        shipped_at: new Date(),
        updated_at: new Date(),
      },
      select: {
        id: true,
        order_number: true,
        customer_name: true,
        customer_email: true,
        tracking_number: true,
        status: true,
      },
    });

    logger.log(`✅ [GESTOR] Tracking añadido al pedido ${order.order_number}`);

    // 📧 TODO: Enviar email al cliente con número de seguimiento
    // Puedes crear un template orderShipped() en EmailService
    /*
    try {
      await EmailService.sendOrderShipped({
        email: order.customer_email,
        name: order.customer_name,
        orderNumber: order.order_number,
        trackingNumber: order.tracking_number!,
        trackingUrl: `https://tracking-url.com/${order.tracking_number}`, // URL de tu transportista
        carrier: 'Correos', // O el que uses
      });
      
      logger.log('✅ [GESTOR] Email de envío enviado');
    } catch (emailError: any) {
      logger.error('[GESTOR] Error enviando email (no crítico):', emailError.message);
    }
    */

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    logger.error('❌ [GESTOR] Error añadiendo tracking:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error al añadir número de seguimiento',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
