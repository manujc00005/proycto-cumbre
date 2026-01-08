// ========================================
// API GESTOR UPDATE ORDER STATUS - CON EMAILS AUTOMÁTICOS
// app/api/gestor/update-order-status/route.ts (ACTUALIZACIÓN)
// ========================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { OrderStatus } from '@prisma/client';
import EmailService from '@/lib/mail/email-service';


export async function POST(request: NextRequest) {
  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'orderId y status son requeridos' },
        { status: 400 }
      );
    }

    // Validar que el status es válido
    const validStatuses: OrderStatus[] = [
      'pending',
      'paid',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
    ];

    if (!validStatuses.includes(status as OrderStatus)) {
      return NextResponse.json(
        { error: 'Estado inválido' },
        { status: 400 }
      );
    }

    logger.log(`📦 [GESTOR] Actualizando estado de pedido ${orderId} a ${status}`);

    // Obtener el pedido actual antes de actualizar
    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          select: {
            product_name: true,
            quantity: true,
          },
        },
      },
    });

    if (!currentOrder) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    const updateData: any = {
      status: status as OrderStatus,
      updated_at: new Date(),
    };

    // Si se marca como enviado, añadir fecha de envío
    if (status === 'shipped' && !currentOrder.shipped_at) {
      updateData.shipped_at = new Date();
    }

    // Si se marca como entregado, añadir fecha de entrega
    if (status === 'delivered' && !currentOrder.delivered_at) {
      updateData.delivered_at = new Date();
    }

    // Actualizar el pedido
    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      select: {
        id: true,
        order_number: true,
        status: true,
        customer_name: true,
        customer_email: true,
        tracking_number: true,
        shipped_at: true,
        delivered_at: true,
      },
    });

    logger.log(`✅ [GESTOR] Pedido ${order.order_number} actualizado a ${status}`);

    // ========================================
    // 📧 ENVIAR EMAIL SEGÚN EL NUEVO ESTADO
    // ========================================

    try {
      switch (status) {
        case 'processing':
          // Email: "Estamos preparando tu pedido"
          await EmailService.sendOrderProcessing({
            email: order.customer_email,
            name: order.customer_name,
            orderNumber: order.order_number,
            items: currentOrder.items.map(item => ({
              name: item.product_name,
              quantity: item.quantity,
            })),
          });
          logger.log(`📧 [GESTOR] Email "processing" enviado para pedido ${order.order_number}`);
          break;

        case 'shipped':
          // Email: "Tu pedido está en camino"
          if (order.tracking_number) {
            await EmailService.sendOrderShipped({
              email: order.customer_email,
              name: order.customer_name,
              orderNumber: order.order_number,
              trackingNumber: order.tracking_number,
              trackingUrl: `https://localizador.correos.es/envios.aspx?tracking=${order.tracking_number}`,
              carrier: 'Correos',
            });
            logger.log(`📧 [GESTOR] Email "shipped" enviado para pedido ${order.order_number}`);
          } else {
            logger.warn(`⚠️ [GESTOR] No se envió email "shipped" para pedido ${order.order_number}: falta tracking_number`);
          }
          break;

        case 'delivered':
          // Email: "Tu pedido ha sido entregado"
          await EmailService.sendOrderDelivered({
            email: order.customer_email,
            name: order.customer_name,
            orderNumber: order.order_number,
          });
          logger.log(`📧 [GESTOR] Email "delivered" enviado para pedido ${order.order_number}`);
          break;

        case 'cancelled':
          // Email: "Tu pedido ha sido cancelado"
          await EmailService.sendOrderCancelled({
            email: order.customer_email,
            name: order.customer_name,
            orderNumber: order.order_number,
            reason: 'El pedido ha sido cancelado por el administrador.',
            refundInfo: 'Si realizaste el pago, se procesará el reembolso automáticamente en los próximos 5-10 días laborables.',
          });
          logger.log(`📧 [GESTOR] Email "cancelled" enviado para pedido ${order.order_number}`);
          break;

        // No enviamos emails para estos estados:
        // - pending: estado inicial
        // - paid: email ya enviado en checkout
        // - refunded: se puede añadir si se necesita
      }
    } catch (emailError: any) {
      // Log del error pero no fallar la actualización del pedido
      logger.error(`❌ [GESTOR] Error enviando email para pedido ${order.order_number}:`, emailError);
      // Continuar sin lanzar error
    }

    return NextResponse.json({
      success: true,
      order,
      emailSent: true, // Indica que se intentó enviar el email
    });
  } catch (error: any) {
    logger.error('❌ [GESTOR] Error actualizando estado de pedido:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error al actualizar estado del pedido',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
