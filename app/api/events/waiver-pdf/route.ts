import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

export const runtime = 'nodejs';

function bufferFromPdf(doc: PDFKit.PDFDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.end();
  });
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const registrationId = url.searchParams.get('registrationId');

    if (!registrationId) {
      return NextResponse.json({ error: 'registrationId requerido' }, { status: 400 });
    }

    // 1) registration
    const registration = await prisma.eventRegistration.findFirst({
      where: { id: registrationId },
      select: {
        id: true,
        event_id: true,
        member_id: true,
        participant_name: true,
        participant_email: true,
        participant_dni: true,
        event: { select: { name: true, slug: true } },
      },
    });

    if (!registration) {
      return NextResponse.json({ error: 'Registro no encontrado' }, { status: 404 });
    }

    // 2) acceptance
    const acceptance = await prisma.waiverAcceptance.findFirst({
      where: {
        event_id: registration.event_id,
        OR: [
          ...(registration.member_id ? [{ member_id: registration.member_id }] : []),
          { participant_document_id: registration.participant_dni },
        ],
      },
      orderBy: { accepted_at: 'desc' },
      select: {
        waiver_version: true,
        waiver_text: true,
        accepted_at: true,
        waiver_text_hash: true,
      },
    });

    if (!acceptance) {
      return NextResponse.json({ error: 'No hay aceptación de pliego para este participante' }, { status: 404 });
    }

    const waiverText = acceptance.waiver_text ?? '';
    const acceptedAtStr = acceptance.accepted_at.toISOString();

    // ========================================
    // 3) VERIFICAR FUENTES ANTES DE CREAR PDF
    // ========================================
    const fontRegular = path.join(process.cwd(), 'assets', 'fonts', 'DejaVuSans.ttf');
    const fontBold = path.join(process.cwd(), 'assets', 'fonts', 'DejaVuSans-Bold.ttf');

    if (!fs.existsSync(fontRegular) || !fs.existsSync(fontBold)) {
      return NextResponse.json(
        { 
          error: 'Faltan fuentes TTF en /assets/fonts',
          details: 'Descarga DejaVuSans.ttf y DejaVuSans-Bold.ttf y colócalos en /assets/fonts/',
          paths: { fontRegular, fontBold }
        },
        { status: 500 }
      );
    }

    // ========================================
    // 4) CREAR PDF CON FUENTES CUSTOM DESDE EL INICIO
    // ========================================
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 48, left: 48, right: 48, bottom: 48 },
      autoFirstPage: false, // ✅ NO crear página automática aún
    });

    // ✅ REGISTRAR FUENTES ANTES DE AÑADIR CONTENIDO
    doc.registerFont('Regular', fontRegular);
    doc.registerFont('Bold', fontBold);

    // ✅ AHORA SÍ, CREAR PRIMERA PÁGINA
    doc.addPage();

    // ========================================
    // 5) CONTENIDO DEL PDF
    // ========================================
    
    // Header
    doc.font('Bold').fontSize(16).fillColor('#000').text('Pliego de descargo aceptado', { align: 'left' });
    doc.moveDown(0.5);

    doc.font('Regular').fontSize(10).fillColor('#444');
    doc.text(`Evento: ${registration.event.name}`);
    doc.text(`Participante: ${registration.participant_name}`);
    doc.text(`DNI: ${registration.participant_dni}`);
    doc.text(`Versión: ${acceptance.waiver_version}`);
    doc.text(`Aceptado en: ${acceptedAtStr}`);
    doc.text(`Hash (SHA-256): ${acceptance.waiver_text_hash}`);
    doc.moveDown();

    // Título del pliego
    doc.fillColor('#111');
    doc.font('Bold').fontSize(12).text('Texto del pliego', { underline: false });
    doc.moveDown(0.5);

    // Body (multi-page automático)
    doc.font('Regular').fontSize(10).fillColor('#000').text(waiverText, {
      align: 'left',
      lineGap: 2,
    });

    // ========================================
    // 6) GENERAR BUFFER
    // ========================================
    const pdfBuffer: Buffer = await bufferFromPdf(doc);
    const body = new Uint8Array(pdfBuffer);

    // ========================================
    // 7) RESPONDER
    // ========================================
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="waiver-${registration.event.slug}-${registration.participant_dni}.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
    
  } catch (e: any) {
    console.error('❌ Error generando PDF:', e);
    return NextResponse.json(
      { 
        error: 'Error generando PDF', 
        details: e?.message,
        stack: process.env.NODE_ENV === 'development' ? e?.stack : undefined
      }, 
      { status: 500 }
    );
  }
}