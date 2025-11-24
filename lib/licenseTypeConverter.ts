// lib/licenseTypeConverter.ts

/**
 * Convierte tipos de licencia entre formato del frontend (guiones)
 * y formato de la base de datos (guiones bajos)
 */

export type FrontendLicenseType = 'none' | 'a1' | 'a1-plus' | 'b1' | 'b1-plus';
export type DatabaseLicenseType = 'none' | 'a1' | 'a1_plus' | 'b1' | 'b1_plus';

/**
 * Convierte de formato frontend (a1-plus) a formato BD (a1_plus)
 */
export function toDBLicenseType(frontendType: string): DatabaseLicenseType {
  const mapping: Record<FrontendLicenseType, DatabaseLicenseType> = {
    'none': 'none',
    'a1': 'a1',
    'a1-plus': 'a1_plus',
    'b1': 'b1',
    'b1-plus': 'b1_plus',
  };

  return mapping[frontendType as FrontendLicenseType] || 'none';
}

/**
 * Convierte de formato BD (a1_plus) a formato frontend (a1-plus)
 */
export function toFrontendLicenseType(dbType: string): FrontendLicenseType {
  const mapping: Record<DatabaseLicenseType, FrontendLicenseType> = {
    'none': 'none',
    'a1': 'a1',
    'a1_plus': 'a1-plus',
    'b1': 'b1',
    'b1_plus': 'b1-plus',
  };

  return mapping[dbType as DatabaseLicenseType] || 'none';
}

/**
 * Obtiene el nombre legible de una licencia
 */
export function getLicenseName(licenseType: string): string {
  const names: Record<string, string> = {
    'none': 'Sin Licencia FEDME',
    'a1': 'A1 - Media Temporada',
    'a1-plus': 'A1+ - Media Temporada Plus',
    'a1_plus': 'A1+ - Media Temporada Plus',
    'b1': 'B1 - Cobertura Ampliada',
    'b1-plus': 'B1+ - Cobertura Ampliada Plus',
    'b1_plus': 'B1+ - Cobertura Ampliada Plus',
  };

  return names[licenseType] || licenseType;
}

/**
 * Valida que un tipo de licencia sea válido
 */
export function isValidLicenseType(licenseType: string): boolean {
  const validTypes = [
    'none', 'a1', 'a1-plus', 'a1_plus', 'b1', 'b1-plus', 'b1_plus'
  ];
  return validTypes.includes(licenseType);
}

/**
 * Convierte todos los tipos de licencia en un objeto de forma a BD
 */
export function convertFormDataToDB(formData: any): any {
  return {
    ...formData,
    license_type: toDBLicenseType(formData.licenseType),
  };
}

// Ejemplo de uso en tu API:
/*
import { toDBLicenseType } from '@/lib/licenseTypeConverter';

// En /api/members/route.ts
const memberData = {
  ...formData,
  license_type: toDBLicenseType(formData.licenseType),
};

await prisma.member.create({
  data: memberData,
});
*/
