import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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

    console.log('📝 Procesando licencia para:', memberId);

    // Extraer el año del member_number (MAL-2025-0001 -> 2025)
    const year = memberNumber ? parseInt(memberNumber.split('-')[1]) : new Date().getFullYear();
    
    // Calcular fechas
    const membershipStartDate = new Date();
    const membershipEndDate = new Date(year, 11, 31); // 31 de diciembre del año

    console.log('📅 Inicio:', membershipStartDate);
    console.log('📅 Fin:', membershipEndDate);

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

    console.log('✅ Licencia procesada exitosamente');

    return NextResponse.json({
      success: true,
      message: 'Licencia marcada como procesada',
      member: updatedMember,
    });

  } catch (error: any) {
    console.error('❌ Error procesando licencia:', error);
    return NextResponse.json(
      { error: 'Error al procesar licencia', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}