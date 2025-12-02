// /api/members/route.ts - VERSIÓN FINAL CORREGIDA

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, LicenseType, FedmeStatus, Sex, MembershipStatus } from '@prisma/client';
import { logger } from '@/lib/logger';

const prisma = new PrismaClient();

// ✅ NO HAY MAPPING - Los IDs ya coinciden entre frontend y BD
const VALID_LICENSE_TYPES: LicenseType[] = ['none', 'a', 'a_plus', 'a_nac', 'a_nac_plus', 'b', 'b_plus', 'c'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { overwrite, ...formData } = body;

    logger.apiStart('POST', '/api/members', {
      email: formData.email,
      dni: formData.dni,
      licenseType: formData.licenseType
    })

    // Validaciones
    const errors: Record<string, string> = {};

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    if (!formData.dni || !/^[0-9]{8}[A-Z]$|^[XYZ][0-9]{7}[A-Z]$/i.test(formData.dni)) {
      errors.dni = 'Formato de DNI/NIE inválido';
    }

    if (!formData.phone || !/^[0-9]{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'El teléfono debe tener 9 dígitos';
    }

    if (!['M', 'F', 'O'].includes(formData.sex)) {
      errors.sex = 'Sexo inválido';
    }

    // ✅ Validar licenseType
    if (!formData.licenseType) {
      errors.licenseType = 'Debes seleccionar una modalidad de licencia';
    } else if (!VALID_LICENSE_TYPES.includes(formData.licenseType as LicenseType)) {
      errors.licenseType = 'Tipo de licencia inválido';
      logger.error(`❌ Licencia inválida recibida: "${formData.licenseType}"`);
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Errores de validación', errors },
        { status: 400 }
      );
    }

    // Buscar socio existente
    const existingMember = await prisma.member.findFirst({
      where: {
        OR: [
          { email: formData.email },
          { dni: formData.dni }
        ]
      }
    });

    if (existingMember && !overwrite) {
      return NextResponse.json(
        { 
          error: 'Ya existe un socio registrado con estos datos',
          errors: {
            email: existingMember.email === formData.email ? 'Este email ya está registrado' : '',
            dni: existingMember.dni === formData.dni ? 'Este DNI ya está registrado' : ''
          },
          existingMemberId: existingMember.id
        },
        { status: 409 }
      );
    }

    // Obtener sede
    const headquarters = await prisma.headquarters.findUnique({
      where: { code: 'MAL' }
    });

    if (!headquarters) {
      return NextResponse.json(
        { error: 'No se encontró la sede de Málaga (MAL)' },
        { status: 400 }
      );
    }

    // Generar número de socio
    const memberNumber = await generateMemberNumber(headquarters.code);

    // ✅ Tipar correctamente con enums de Prisma
    const licenseType = formData.licenseType as LicenseType;
    const fedmeStatus: FedmeStatus = licenseType === 'none' ? 'none' : 'pending';
    const membershipStatus: MembershipStatus = 'pending';

    logger.log('✅ Tipo de licencia:', licenseType);

    // Preparar datos
    const memberData = {
      headquarters_id: headquarters.id,
      member_number: memberNumber,
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      birth_date: new Date(formData.birthDate),
      dni: formData.dni.toUpperCase(),
      sex: formData.sex as Sex,
      phone: formData.phone,
      emergency_phone: formData.emergencyPhone || null,
      emergency_contact_name: formData.emergencyContactName || null,
      province: formData.province,
      city: formData.city || null,
      address: formData.address,
      postal_code: formData.postalCode || null,
      shirt_size: formData.shirtSize || null,
      hoodie_size: formData.hoodieSize || null,
      pants_size: formData.pantsSize || null,
      license_type: licenseType,
      fedme_status: fedmeStatus,
      membership_status: membershipStatus,
      membership_start_date: null,
      membership_end_date: null,
    };

    logger.log('📦 Guardando:', {
      license_type: memberData.license_type,
      fedme_status: memberData.fedme_status,
    });

    let member;

    if (existingMember && overwrite) {
      member = await prisma.member.update({
        where: { id: existingMember.id },
        data: { ...memberData, updated_at: new Date() }
      });
      logger.log('✅ Socio actualizado');
    } else {
      member = await prisma.member.create({
        data: memberData
      });
      logger.apiSuccess('Socio creado', {
        id: member.id,
        license_type: member.license_type,
        fedme_status: member.fedme_status
      });
    }

    logger.log('✅ Guardado en BD:', {
      id: member.id,
      license_type: member.license_type,
      fedme_status: member.fedme_status,
    });

    return NextResponse.json({
      success: true,
      message: existingMember ? 'Socio actualizado' : 'Socio creado',
      member: {
        id: member.id,
        member_number: member.member_number,
        email: member.email,
        first_name: member.first_name,
        last_name: member.last_name,
        license_type: member.license_type,
        membership_status: member.membership_status,
        fedme_status: member.fedme_status,
      },
    }, { status: existingMember ? 200 : 201 });

  } catch (error: any) {
    logger.error('❌ Error:', error);
    
    if (error.code === 'P2007') {
      return NextResponse.json(
        { error: 'Tipo de dato inválido', details: error.message },
        { status: 400 }
      );
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un registro con estos datos', details: error.meta },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function generateMemberNumber(headquartersCode: string): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `${headquartersCode}-${currentYear}`;
  
  const lastMember = await prisma.member.findFirst({
    where: {
      member_number: {
        startsWith: prefix
      }
    },
    orderBy: {
      member_number: 'desc'
    }
  });

  let nextNumber = 1;
  
  if (lastMember && lastMember.member_number) {
    const parts = lastMember.member_number.split('-');
    const lastSequence = parseInt(parts[2], 10);
    nextNumber = lastSequence + 1;
  }

  const sequenceFormatted = nextNumber.toString().padStart(4, '0');
  return `${prefix}-${sequenceFormatted}`;
}

export async function GET(request: NextRequest) {
  try {
    const members = await prisma.member.findMany({
      orderBy: { created_at: 'desc' },
      take: 100,
      include: {
        headquarters: true
      }
    });

    return NextResponse.json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error: any) {
    logger.error('❌ Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener miembros', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}