// ========================================
// API: Check Membership
// Verifica si un usuario es miembro activo
// app/api/members/check-membership/route.ts
// ========================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { MembershipStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const dni = searchParams.get('dni');

    // Validar que al menos uno esté presente
    if (!email && !dni) {
      return NextResponse.json(
        { error: 'Se requiere email o DNI' },
        { status: 400 }
      );
    }

    logger.log('🔍 Verificando membresía:', { email, dni });

    // Buscar miembro por email o DNI
    const member = await prisma.member.findFirst({
      where: {
        OR: [
          email ? { email: email.toLowerCase() } : {},
          dni ? { dni: dni.toUpperCase() } : {},
        ].filter(condition => Object.keys(condition).length > 0),
        deleted_at: null, // Solo miembros no eliminados
      },
      select: {
        id: true,
        member_number: true,
        first_name: true,
        last_name: true,
        email: true,
        dni: true,
        membership_status: true,
        membership_start_date: true,
        membership_end_date: true,
      },
    });

    if (!member) {
      logger.log('❌ No se encontró miembro');
      return NextResponse.json({
        isMember: false,
      });
    }

    // Verificar que la membresía esté activa
    const isActive = member.membership_status === MembershipStatus.active;

    logger.log('✅ Miembro encontrado:', {
      memberNumber: member.member_number,
      status: member.membership_status,
      isActive,
    });

    return NextResponse.json({
      isMember: true,
      memberNumber: member.member_number,
      name: `${member.first_name} ${member.last_name}`,
      email: member.email,
      dni: member.dni,
      membershipStatus: member.membership_status,
      isActive,
      membershipStartDate: member.membership_start_date,
      membershipEndDate: member.membership_end_date,
    });

  } catch (error: any) {
    logger.error('❌ Error verificando membresía:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al verificar membresía',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
