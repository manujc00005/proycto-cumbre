// ========================================
// API GESTOR AUTH - Validación de PIN
// app/api/gestor/auth/route.ts
// ========================================

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();

    if (!pin) {
      return NextResponse.json(
        { success: false, error: 'PIN requerido' },
        { status: 400 }
      );
    }

    // Obtener PIN correcto de variable de entorno
    const correctPin = process.env.GESTOR_PIN;

    if (!correctPin) {
      logger.error('❌ GESTOR_PIN no está configurado en .env');
      return NextResponse.json(
        { success: false, error: 'Configuración incorrecta del servidor' },
        { status: 500 }
      );
    }

    // Validar PIN
    if (pin === correctPin) {
      logger.log('✅ Acceso al gestor autorizado');
      
      return NextResponse.json({
        success: true,
        message: 'Acceso autorizado',
      });
    } else {
      logger.log('❌ Intento de acceso fallido al gestor');
      
      return NextResponse.json(
        { success: false, error: 'PIN incorrecto' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    logger.error('❌ Error en validación de PIN:', error);
    
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
