// app/api/gestor/soft-delete/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { memberId, reason } = await request.json();

    if (!memberId) {
      return NextResponse.json(
        { error: 'memberId es requerido' },
        { status: 400 }
      );
    }

    // Obtener el miembro actual para acceder a sus notas
    const currentMember = await prisma.member.findUnique({
      where: { id: memberId },
      select: { 
        admin_notes: true,
        member_number: true,
        first_name: true,
        last_name: true
      }
    });

    if (!currentMember) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Soft delete: marcar como eliminado y anonimizar datos sensibles
    const member = await prisma.member.update({
      where: { id: memberId },
      data: {
        deleted_at: new Date(),
        // Anonimizar datos sensibles
        email: `deleted-${Date.now()}@anonymous.local`,
        phone: "000000000",
        address: "DELETED",
        dni: null,
        // Preservar notas anteriores + añadir razón de eliminación
        admin_notes: reason 
          ? `DELETED: ${reason}. Previous notes: ${currentMember.admin_notes || 'none'}`
          : `DELETED. Previous notes: ${currentMember.admin_notes || 'none'}`
      }
    });

    logger.log('🗑️ Usuario soft deleted:', {
      id: member.id,
      member_number: currentMember.member_number,
      name: `${currentMember.first_name} ${currentMember.last_name}`,
      reason: reason || 'No especificado',
      deleted_at: member.deleted_at
    });

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado correctamente',
      member: {
        id: member.id,
        member_number: currentMember.member_number,
        deleted_at: member.deleted_at
      }
    });

  } catch (error: any) {
    logger.error('❌ Error en soft delete:', error);
    
    // Error específico si el usuario no existe
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al eliminar usuario', details: error.message },
      { status: 500 }
    );
  }
}