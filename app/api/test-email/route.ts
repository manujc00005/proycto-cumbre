import { EmailService } from '@/lib/email-service';
import { NextResponse } from 'next/server';

export async function GET() {
  // try {
  //   await EmailService.sendWelcomeEmail({
  //     email: 'mjc00005@gmail.com', // Cambia por tu email
  //     firstName: 'Test',
  //     lastName: 'Usuario',
  //     memberNumber: 'TEST-001',
  //     licenseType: 'A NAC',
  //   });

  //   return NextResponse.json({ 
  //     success: true,
  //     message: 'Email enviado correctamente' 
  //   });
  // } catch (error: any) {
  //   return NextResponse.json({ 
  //     success: false,
  //     error: error.message 
  //   }, { status: 500 });
  // }
}
