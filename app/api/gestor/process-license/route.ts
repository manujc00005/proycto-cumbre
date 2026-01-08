import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { logger } from '@/lib/logger';
import { EmailService } from '@/lib/mail/email-service';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { memberId, memberNumber } = await request.json();

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID es requerido' },
        { status: 400 }
      );
    }

    logger.log('📝 Procesando licencia para:', memberId);

    // 🔥 BUSCAR EL SOCIO Y SU PAGO ANTES DE ACTUALIZAR
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: {
        payments: {
          where: {
            payment_type: 'membership',
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Socio no encontrado' },
        { status: 404 }
      );
    }

    // 🔥 VALIDAR QUE EL PAGO ESTÉ COMPLETADO
    const latestPayment = member.payments[0];
    
    if (!latestPayment) {
      return NextResponse.json(
        { error: 'No se encontró ningún pago asociado a este socio' },
        { status: 400 }
      );
    }

    if (latestPayment.status !== 'completed') {
      return NextResponse.json(
        { 
          error: 'No se puede procesar la licencia',
          details: `El pago está en estado "${latestPayment.status}". Debe estar completado primero.`
        },
        { status: 400 }
      );
    }

    // Extraer el año del member_number
    let year = new Date().getFullYear();
    if (memberNumber) {
      const parts = memberNumber.split('-');
      if (parts.length >= 2) {
        const parsedYear = parseInt(parts[1], 10);
        if (!isNaN(parsedYear)) {
          year = parsedYear;
        }
      }
    }

    const membershipStartDate = new Date();
    const currentYear = membershipStartDate.getFullYear();
    const currentMonth = membershipStartDate.getMonth();
    const endYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const membershipEndDate = new Date(endYear, 11, 31, 23, 59, 59, 999);

    logger.log('📅 Inicio:', membershipStartDate.toISOString());
    logger.log('📅 Fin:', membershipEndDate.toISOString());
    logger.log('💳 Estado del pago:', latestPayment.status);

    // Actualizar el socio
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: {
        fedme_status: 'active',
        membership_status: 'active',
        membership_start_date: membershipStartDate,
        membership_end_date: membershipEndDate,
        updated_at: new Date(),
      }
    });

    logger.log('✅ Licencia procesada exitosamente');

    // Enviar email de licencia activa
    if (updatedMember.license_type && updatedMember.license_type !== 'none') {
      try {
        await EmailService.sendLicenseActivated({
          email: updatedMember.email,
          firstName: updatedMember.first_name,
          memberNumber: updatedMember.member_number || 'N/A',
          licenseType: updatedMember.license_type,
          validUntil: membershipEndDate,
        });
        logger.apiSuccess('Email de licencia activa enviado');
      } catch (emailError: any) {
        logger.error('⚠️ Error enviando email de licencia activa:', emailError);
        await prisma.member.update({
          where: { id: memberId },
          data: {
            admin_notes: `${member.admin_notes || ''}\n[${new Date().toISOString()}] Error enviando email de licencia activa: ${emailError.message}`.trim()
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Licencia marcada como procesada',
      member: updatedMember,
    });

  } catch (error: any) {
    logger.error('❌ Error procesando licencia:', error);
    return NextResponse.json(
      { error: 'Error al procesar licencia', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
