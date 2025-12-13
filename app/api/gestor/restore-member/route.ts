// ========================================
// 2. API: Restaurar Usuario
// app/api/gestor/restore-member/route.ts
// ========================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { memberId } = await request.json();

    if (!memberId) {
      return NextResponse.json(
        { error: 'memberId es requerido' },
        { status: 400 }
      );
    }

    // Restaurar: quitar marca de eliminado
    const member = await prisma.member.update({
      where: { id: memberId },
      data: {
        deleted_at: null
        // NOTA: Los datos anonimizados NO se pueden recuperar automáticamente
        // El admin deberá pedirle al usuario que vuelva a registrarse
      }
    });

    logger.log('♻️ Usuario restaurado:', {
      id: member.id,
      member_number: member.member_number
    });

    return NextResponse.json({
      success: true,
      message: 'Usuario restaurado correctamente',
      warning: 'Los datos anonimizados deben ser actualizados manualmente',
      member: {
        id: member.id,
        email: member.email
      }
    });

  } catch (error: any) {
    logger.error('❌ Error al restaurar:', error);
    return NextResponse.json(
      { error: 'Error al restaurar usuario', details: error.message },
      { status: 500 }
    );
  }
}