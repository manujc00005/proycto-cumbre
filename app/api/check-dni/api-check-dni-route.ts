// // app/api/members/check-dni/route.ts
// import { NextRequest, NextResponse } from 'next/server';

// // Importar tu cliente de base de datos
// // import { prisma } from '@/lib/prisma';
// // import { supabase } from '@/lib/supabase';

// export async function POST(request: NextRequest) {
//   try {
//     const { dni } = await request.json();

//     if (!dni || dni.trim().length === 0) {
//       return NextResponse.json(
//         { error: 'DNI es requerido' },
//         { status: 400 }
//       );
//     }

//     // Normalizar DNI
//     const normalizedDni = dni.trim().toUpperCase();

//     // Validar formato básico de DNI español
//     const dniRegex = /^[0-9]{8}[A-Z]$/;
//     const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;
    
//     if (!dniRegex.test(normalizedDni) && !nieRegex.test(normalizedDni)) {
//       return NextResponse.json(
//         { 
//           exists: false,
//           validFormat: false,
//           message: 'Formato de DNI/NIE inválido'
//         },
//         { status: 200 }
//       );
//     }

//     // Verificar si existe en la base de datos
//     // Ejemplo con Prisma:
//     // const existingMember = await prisma.member.findUnique({
//     //   where: { dni: normalizedDni },
//     //   select: {
//     //     id: true,
//     //     firstName: true,
//     //     lastName: true,
//     //     email: true,
//     //   }
//     // });

//     // Ejemplo con Supabase:
//     // const { data: existingMember } = await supabase
//     //   .from('members')
//     //   .select('id, first_name, last_name, email')
//     //   .eq('dni', normalizedDni)
//     //   .maybeSingle();

//     // Simulación - REEMPLAZAR con tu query real
//     const existingMember = null; // await checkDniInDatabase(normalizedDni);

//     if (existingMember) {
//       return NextResponse.json({
//         exists: true,
//         validFormat: true,
//         member: {
//           firstName: existingMember.firstName || existingMember.first_name,
//           lastName: existingMember.lastName || existingMember.last_name,
//           // Ofuscar email para privacidad
//           email: (existingMember.email || '').replace(/(.{2})(.*)(@.*)/, '$1***$3'),
//         }
//       });
//     }

//     return NextResponse.json({
//       exists: false,
//       validFormat: true,
//     });

//   } catch (error) {
//     console.error('Error checking DNI:', error);
//     return NextResponse.json(
//       { error: 'Error al verificar DNI' },
//       { status: 500 }
//     );
//   }
// }
