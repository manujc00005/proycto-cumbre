// ============================================================
// CONSTANTES PARA PROYECTO CUMBRE - LICENCIAS FEDME 2026
// ÚNICA FUENTE DE VERDAD - NO MODIFICAR SIN ACTUALIZAR PRISMA
// ============================================================

// Cuota anual de socio del club (independiente de FEDME)
export const MEMBERSHIP_FEE = 50;

// ============================================================
// CATEGORÍAS POR EDAD (FEDME 2026)
// ============================================================

export const AGE_CATEGORIES = {
  INFANTIL: 'infantil', // 0-14 años
  JUVENIL: 'juvenil',   // 15-18 años
  MAYOR: 'mayor'        // 19+ años
} as const;

export type AgeCategory = typeof AGE_CATEGORIES[keyof typeof AGE_CATEGORIES];

// Función para calcular categoría según fecha de nacimiento
export function calculateAgeCategory(birthDate: string): AgeCategory {
  const today = new Date();
  const birth = new Date(birthDate);
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();
  
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  
  if (age <= 14) return AGE_CATEGORIES.INFANTIL;
  if (age <= 18) return AGE_CATEGORIES.JUVENIL;
  return AGE_CATEGORIES.MAYOR;
}

export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();
  
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  
  return age;
}

export function getCategoryLabel(category: AgeCategory): string {
  switch (category) {
    case AGE_CATEGORIES.INFANTIL:
      return 'Infantil (0-14 años)';
    case AGE_CATEGORIES.JUVENIL:
      return 'Juvenil (15-18 años)';
    case AGE_CATEGORIES.MAYOR:
      return 'Mayor (19+ años)';
    default:
      return '';
  }
}

// ============================================================
// ÁMBITOS TERRITORIALES (FEDME 2026)
// ============================================================

export type TerritoryScope = 'regional' | 'regional_national' | 'national' | 'european' | 'none';

export interface LicenseTerritory {
  id: TerritoryScope;
  name: string;
  shortName: string;
  description: string;
  coverage: string;
  icon: string;
}

export const TERRITORIES: LicenseTerritory[] = [
  {
    id: 'regional',
    name: 'Autonómico',
    shortName: 'Andalucía',
    description: 'Para montañeros que practican principalmente en Andalucía, Ceuta y Melilla',
    coverage: 'Andalucía, Ceuta y Melilla',
    icon: '🏔️'
  },
  {
    id: 'regional_national',
    name: 'Autonómico + Nacional',
    shortName: 'Andalucía + España',
    description: 'Licencia autonómica con cobertura ampliada a toda España',
    coverage: 'Andalucía con extensión nacional (España completa)',
    icon: '🏔️🇪🇸'
  },
  {
    id: 'national',
    name: 'Nacional',
    shortName: 'España',
    description: 'Para quienes viajan por toda España y países cercanos',
    coverage: 'España, Andorra, Pirineo Francés, Portugal y Marruecos',
    icon: '🇪🇸'
  },
  {
    id: 'european',
    name: 'Europeo',
    shortName: 'Europa',
    description: 'Para montañeros que viajan por Europa',
    coverage: 'Europa y Marruecos',
    icon: '🌍'
  },
  {
    id: 'none',
    name: 'Sin Licencia',
    shortName: 'Sin Seguro',
    description: 'Solo membresía del club (sin cobertura de seguro federativo)',
    coverage: 'Sin cobertura FEDME',
    icon: '⚠️'
  }
];

// ============================================================
// LICENCIAS FEDME 2026 - OFICIAL
// ============================================================

export interface LicenseType {
  id: string;              // ID para BD (debe coincidir con enum de Prisma)
  name: string;            // Nombre completo
  shortName: string;       // Nombre corto
  territory: TerritoryScope;
  includesExtras: boolean; // BTT, Espeleología, Esquí Nórdico
  prices: {
    infantil: number;      // Precio para infantiles (clubes)
    juvenil: number;       // Precio para juveniles (clubes)
    mayor: number;         // Precio para mayores (clubes)
  };
  coverage: string;        // Descripción de cobertura
  popular?: boolean;       // Marcar como recomendada
}

// 🎯 LICENCIAS OFICIALES FEDME 2026
// Basadas en las tablas oficiales actualizadas
export const LICENSE_TYPES: LicenseType[] = [
  // ============================================================
  // SIN LICENCIA (Usuario no quiere FEDME)
  // ============================================================
  {
    id: 'none',
    name: 'Sin Licencia FEDME',
    shortName: 'Sin Licencia',
    territory: 'none',
    includesExtras: false,
    prices: {
      infantil: 0,
      juvenil: 0,
      mayor: 0
    },
    coverage: 'Solo membresía del club (sin seguro federativo)',
    popular: false
  },

  // ============================================================
  // ÁMBITO A - REGIONAL (Andalucía, Ceuta y Melilla)
  // ============================================================
  {
    id: 'a',
    name: 'A • Autonómica',
    shortName: 'A',
    territory: 'regional',
    includesExtras: false,
    prices: {
      infantil: 11.00,
      juvenil: 11.00,
      mayor: 45.00
    },
    coverage: 'Excursiones, Senderismo, Escalada, Vías Ferratas, Alpinismo, Esquí de Montaña, Descenso de Barrancos, Acampadas Alpinísticas, Raquetas de Nieve, Marcha Nórdica, Travesías y Carreras por Montaña',
    popular: false
  },
  {
    id: 'a_plus',
    name: 'A+ • Autonómica Plus',
    shortName: 'A+',
    territory: 'regional',
    includesExtras: true,
    prices: {
      infantil: 26.00,
      juvenil: 26.00,
      mayor: 58.00
    },
    coverage: 'Todo lo de A + BTT, Espeleología y Esquí Nórdico (no competitivos)',
    popular: true  // ⭐ Recomendada para regional
  },

  // ============================================================
  // ÁMBITO A NAC - AUTONÓMICO NACIONAL (NOVEDAD 2026)
  // Licencia autonómica con cobertura extendida a toda España
  // ============================================================
  {
    id: 'a_nac',
    name: 'A NAC • Autonómica Nacional',
    shortName: 'A NAC',
    territory: 'regional_national',
    includesExtras: false,
    prices: {
      infantil: 22.00,
      juvenil: 22.00,
      mayor: 52.00
    },
    coverage: 'Cobertura autonómica ampliada a toda España: Excursiones, Senderismo, Escalada, Vías Ferratas, Alpinismo, Esquí de Montaña, Descenso de Barrancos, Acampadas Alpinísticas, Raquetas de Nieve, Marcha Nórdica, Travesías y Carreras por Montaña',
    popular: false
  },
  {
    id: 'a_nac_plus',
    name: 'A NAC+ • Autonómica Nacional Plus',
    shortName: 'A NAC+',
    territory: 'regional_national',
    includesExtras: true,
    prices: {
      infantil: 36.00,
      juvenil: 36.00,
      mayor: 69.00
    },
    coverage: 'Todo lo de A NAC + BTT, Espeleología y Esquí Nórdico (no competitivos) con cobertura en toda España',
    popular: true  // ⭐ Recomendada para quienes quieren cobertura nacional desde autonómica
  },

  // ============================================================
  // ÁMBITO B - NACIONAL (España, Andorra, Pirineo, Portugal, Marruecos)
  // ============================================================
  {
    id: 'b',
    name: 'B - Nacional',
    shortName: 'B',
    territory: 'national',
    includesExtras: false,
    prices: {
      infantil: 29.00,
      juvenil: 29.00,
      mayor: 66.00
    },
    coverage: 'Excursiones, Senderismo, Escalada, Vías Ferratas, Alpinismo, Esquí de Montaña, Descenso de Barrancos, Acampadas Alpinísticas, Raquetas de Nieve, Marcha Nórdica, Travesías y Carreras por Montaña',
    popular: false
  },
  {
    id: 'b_plus',
    name: 'B+ • Nacional Plus',
    shortName: 'B+',
    territory: 'national',
    includesExtras: true,
    prices: {
      infantil: 43.00,
      juvenil: 43.00,
      mayor: 83.00
    },
    coverage: 'Todo lo de B + BTT, Espeleología y Esquí Nórdico (no competitivos)',
    popular: true  // ⭐ Recomendada para nacional
  },

  // ============================================================
  // ÁMBITO C - EUROPEO (Europa y Marruecos)
  // ============================================================
  {
    id: 'c',
    name: 'C • Europea',
    shortName: 'C',
    territory: 'european',
    includesExtras: true,  // Siempre incluye extras según FEDME
    prices: {
      infantil: 87.00,
      juvenil: 87.00,
      mayor: 127.00
    },
    coverage: 'Cobertura completa en Europa incluyendo BTT, Espeleología y Esquí Nórdico (no competitivos)',
    popular: false
  },
];

// ============================================================
// FUNCIONES HELPER
// ============================================================

// Obtener precio según categoría
export function getLicensePrice(license: LicenseType, category: AgeCategory): number {
  return license.prices[category];
}

// Filtrar licencias por territorio y preferencias
export function filterLicenses(
  territory: TerritoryScope,
  wantsExtras: boolean,
  ageCategory: AgeCategory
): LicenseType[] {
  return LICENSE_TYPES.filter(license => {
    // Filtrar por territorio
    if (license.territory !== territory) return false;
    
    // Si no quiere extras, solo mostrar sin extras
    if (!wantsExtras && license.includesExtras && territory !== 'european') return false;
    
    // Si quiere extras, solo mostrar con extras
    if (wantsExtras && !license.includesExtras && territory !== 'none') return false;
    
    return true;
  });
}

// Obtener licencia recomendada
export function getRecommendedLicense(
  territory: TerritoryScope,
  wantsExtras: boolean,
  ageCategory: AgeCategory
): LicenseType | null {
  const filtered = filterLicenses(territory, wantsExtras, ageCategory);
  
  // Priorizar licencias populares
  const popular = filtered.find(l => l.popular);
  if (popular) return popular;
  
  // Si no hay popular, devolver la primera
  return filtered[0] || null;
}

// Obtener territorio por ID de licencia
export function getTerritoryByLicenseId(licenseId: string): LicenseTerritory | null {
  const license = LICENSE_TYPES.find(l => l.id === licenseId);
  if (!license) return null;
  
  return TERRITORIES.find(t => t.id === license.territory) || null;
}

// Validar que un ID de licencia es válido
export function isValidLicenseId(licenseId: string): boolean {
  return LICENSE_TYPES.some(l => l.id === licenseId);
}

// Obtener licencia por ID
export function getLicenseById(licenseId: string): LicenseType | null {
  return LICENSE_TYPES.find(l => l.id === licenseId) || null;
}

export function formatLicenseType(licenseType: string): string {
  const licenseMap: Record<string, string> = {
    'none': 'Sin Licencia',
    'a': 'A (Autonómica)',
    'a_plus': 'A+ (Autonómica Plus)',
    'a_nac': 'A NAC (Autonómica Nacional)',
    'a_nac_plus': 'A NAC+ (Autonómica Nacional Plus)',
    'b': 'B (Nacional)',
    'b_plus': 'B+ (Nacional Plus)',
    'c': 'C (Europea)',
  };

  return licenseMap[licenseType] || licenseType.toUpperCase();
}

export function formatShortLicenseType(licenseType: string): string {
  const licenseMap: Record<string, string> = {
    'none': 'Sin Licencia',
    'a': 'A',
    'a_plus': 'A+',
    'a_nac': 'A NAC',
    'a_nac_plus': 'A NAC+',
    'b': 'B',
    'b_plus': 'B+',
    'c': 'C',
  };

  return licenseMap[licenseType] || licenseType.toUpperCase();
}