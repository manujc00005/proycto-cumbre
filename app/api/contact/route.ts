import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { EmailService } from '@/lib/mail/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validación
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    // Enviar email
    await EmailService.sendContactForm({
      name,
      email,
      subject,
      message,
    });

    logger.apiSuccess('Formulario de contacto enviado', { email, subject });

    return NextResponse.json(
      { success: true, message: 'Mensaje enviado correctamente' },
      { status: 200 }
    );
  } catch (error: any) {
    logger.apiError('Error procesando formulario de contacto', error);
    
    return NextResponse.json(
      { error: 'Error al enviar el mensaje. Inténtalo de nuevo.' },
      { status: 500 }
    );
  }
}