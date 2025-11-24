// /api/members/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 🆕 Convertir tipos de licencia de frontend a BD
function toDBLicenseType(frontendType: string): string {
  const mapping: Record<string, string> = {
    'none': 'none',
    'a1': 'a1',
    'a1plus': 'a1_plus',    // 👈 Convierte a1plus → a1_plus
    'b1': 'b1',
    'b1plus': 'b1_plus',    // 👈 Convierte b1plus → b1_plus
  };
  return mapping[frontendType] || 'none';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { overwrite, ...formData } = body;

    console.log('📥 Datos recibidos:', { email: formData.email, dni: formData.dni });

    // Validaciones básicas del servidor
    const errors: Record<string, string> = {};

    // Validar email
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    // Validar DNI
    if (!formData.dni || !/^[0-9]{8}[A-Z]$|^[XYZ][0-9]{7}[A-Z]$/i.test(formData.dni)) {
      errors.dni = 'Formato de DNI/NIE inválido';
    }

    // Validar teléfono
    if (!formData.phone || !/^[0-9]{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'El teléfono debe tener 9 dígitos';
    }

    // Validar sexo
    if (!['M', 'F', 'O'].includes(formData.sex)) {
      errors.sex = 'Sexo inválido';
    }

    // Si hay errores de validación, devolverlos
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Errores de validación', errors },
        { status: 400 }
      );
    }

    // 🔍 Buscar si ya existe un socio con ese email o DNI
    const existingMember = await prisma.member.findFirst({
      where: {
        OR: [
          { email: formData.email },
          { dni: formData.dni }
        ]
      }
    });

    if (existingMember && !overwrite) {
      // Si existe y NO queremos sobrescribir, devolver error
      return NextResponse.json(
        { 
          error: 'Ya existe un socio registrado con estos datos',
          errors: {
            email: existingMember.email === formData.email ? 'Este email ya está registrado' : '',
            dni: existingMember.dni === formData.dni ? 'Este DNI ya está registrado' : ''
          },
          existingMemberId: existingMember.id
        },
        { status: 409 } // 409 Conflict
      );
    }

    // 🆕 Obtener la sede de Málaga (MAL)
    const headquarters = await prisma.headquarters.findUnique({
      where: { code: 'MAL' }
    });

    if (!headquarters) {
      return NextResponse.json(
        { error: 'No se encontró la sede de Málaga (MAL). Por favor, créala primero.' },
        { status: 400 }
      );
    }

    // 🆕 Generar número de socio automáticamente
    const memberNumber = await generateMemberNumber(headquarters.code);
    console.log('🔢 Número de socio generado:', memberNumber);

    // 🔄 Convertir tipo de licencia de frontend a BD
    const licenseType = toDBLicenseType(formData.licenseType);
    console.log('📋 License Type convertido:', formData.licenseType, '→', licenseType); // 👈 DEBUG

    // 📋 Preparar datos para la BD
    const memberData = {
      // 🆕 Asignar sede y número de socio
      headquarters_id: headquarters.id,
      member_number: memberNumber,
      
      // Datos personales
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      birth_date: new Date(formData.birthDate),
      dni: formData.dni.toUpperCase(),
      sex: formData.sex, // Enum: M, F, O
      
      // Contacto
      phone: formData.phone,
      emergency_phone: formData.emergencyPhone || null,
      emergency_contact_name: formData.emergencyContactName || null,
      
      // Dirección
      province: formData.province,
      city: formData.city || null,
      address: formData.address,
      postal_code: formData.postalCode || null,
      
      // Tallas
      shirt_size: formData.shirtSize || null,
      hoodie_size: formData.hoodieSize || null,
      pants_size: formData.pantsSize || null,
      
      // Licencia FEDME
      license_type: licenseType, // 👈 Enum: none, a1, a1_plus, b1, b1_plus
      fedme_status: licenseType === 'none' ? 'none' : 'pending', // Enum
      
      // Estado de membresía
      membership_status: 'pending', // 🔴 PENDING hasta pagar (Enum)
      membership_start_date: null,
      membership_end_date: null,
    };

    let member;

    if (existingMember && overwrite) {
      // ✅ SOBRESCRIBIR: Actualizar el registro existente
      console.log('🔄 Actualizando socio existente:', existingMember.id);
      
      member = await prisma.member.update({
        where: { id: existingMember.id },
        data: {
          ...memberData,
          updated_at: new Date(),
        }
      });
      
      console.log('✅ Socio actualizado exitosamente');
    } else {
      // ✅ CREAR: Nuevo registro
      console.log('➕ Creando nuevo socio');
      
      member = await prisma.member.create({
        data: memberData
      });
      
      console.log('✅ Nuevo socio creado exitosamente:', member.id);
    }

    // Respuesta exitosa
    return NextResponse.json({
      success: true,
      message: existingMember ? 'Socio actualizado exitosamente' : 'Socio creado exitosamente',
      member: {
        id: member.id,
        member_number: member.member_number,
        email: member.email,
        first_name: member.first_name,
        last_name: member.last_name,
        membership_status: member.membership_status,
        fedme_status: member.fedme_status,
      },
    }, { status: existingMember ? 200 : 201 });

  } catch (error: any) {
    console.error('❌ Error en /api/members:', error);
    
    // Si es un error de Prisma por enum inválido
    if (error.code === 'P2007') {
      return NextResponse.json(
        { error: 'Tipo de dato inválido en los campos', details: error.message },
        { status: 400 }
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

// 🆕 Generar número de socio automáticamente
async function generateMemberNumber(headquartersCode: string): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `${headquartersCode}-${currentYear}`;
  
  // Buscar el último número de socio del año actual para esta sede
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
    // Extraer el número secuencial del último socio (MAL-2025-0001 -> 0001)
    const parts = lastMember.member_number.split('-');
    const lastSequence = parseInt(parts[2], 10);
    nextNumber = lastSequence + 1;
  }

  // Formatear con ceros a la izquierda (0001, 0002, etc.)
  const sequenceFormatted = nextNumber.toString().padStart(4, '0');
  
  return `${prefix}-${sequenceFormatted}`;
}

// GET: Obtener todos los miembros (opcional)
export async function GET(request: NextRequest) {
  try {
    const members = await prisma.member.findMany({
      orderBy: { created_at: 'desc' },
      take: 100, // Limitar a 100 para no sobrecargar
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
    console.error('❌ Error obteniendo miembros:', error);
    return NextResponse.json(
      { error: 'Error al obtener miembros', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}