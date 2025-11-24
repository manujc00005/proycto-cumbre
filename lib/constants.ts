// ============================================================
// CONSTANTES PARA PROYECTO CUMBRE - LICENCIAS FEDME 2025
// ============================================================

// Cuota anual de socio del club
export const MEMBERSHIP_FEE = 50;

// Categorías por edad
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
  
  // Ajustar edad si no ha cumplido años este año
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  
  if (age <= 14) return AGE_CATEGORIES.INFANTIL;
  if (age <= 18) return AGE_CATEGORIES.JUVENIL;
  return AGE_CATEGORIES.MAYOR;
}

// Obtener edad actual desde fecha de nacimiento
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

// Obtener nombre legible de la categoría
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

// Ámbitos geográficos
export type TerritoryScope = 'regional' | 'national' | 'european' | 'none';

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
    id: 'national',
    name: 'Nacional',
    shortName: 'España',
    description: 'Para quienes viajan por toda España y países cercanos',
    coverage: 'España, Andorra, Pirineos Franceses, Portugal y Marruecos',
    icon: '🇪🇸'
  },
  {
    id: 'european',
    name: 'Europeo',
    shortName: 'Europa',
    description: 'Para montañeros que viajan por Europa',
    coverage: 'Toda Europa y Marruecos',
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

// Tipos de licencia simplificados
export interface LicenseType {
  id: string;
  name: string;
  shortName: string;
  territory: TerritoryScope;
  includesExtras: boolean; // BTT, Espeleología, Esquí Nórdico
  prices: {
    infantil: number;
    juvenil: number;
    mayor: number;
  };
  coverage: string;
  popular?: boolean;
  familyLicense?: boolean; // Solo para menores
}

// Función helper para obtener precio según categoría
export function getLicensePrice(license: LicenseType, category: AgeCategory): number {
  return license.prices[category];
}

// LICENCIAS SIMPLIFICADAS - Sin modalidades de inclusión social
export const LICENSE_TYPES: LicenseType[] = [
  // ============================================================
  // ÁMBITO REGIONAL (Andalucía, Ceuta y Melilla)
  // ============================================================
  {
    id: 'a',
    name: 'A - Autonómica',
    shortName: 'A',
    territory: 'regional',
    includesExtras: false,
    prices: {
      infantil: 10.50,
      juvenil: 10.50,
      mayor: 44.00
    },
    coverage: 'Excursiones, Senderismo, Escalada, Vías Ferratas, Alpinismo, Esquí de Montaña, Descenso de Barrancos, Acampadas Alpinísticas, Raquetas de Nieve, Marcha Nórdica, Travesías y Carreras por Montaña',
    popular: false
  },
  {
    id: 'a-plus',
    name: 'A+ - Autonómica Plus',
    shortName: 'A+',
    territory: 'regional',
    includesExtras: true,
    prices: {
      infantil: 25.00,
      juvenil: 25.00,
      mayor: 57.00
    },
    coverage: 'Todo lo de A + BTT, Espeleología y Esquí Nórdico (no competitivos)',
    popular: true
  },
  {
    id: 'a-familiar',
    name: 'A Familiar',
    shortName: 'A Fam',
    territory: 'regional',
    includesExtras: false,
    prices: {
      infantil: 8.50,
      juvenil: 8.50,
      mayor: 0 // No disponible para mayores
    },
    coverage: 'Modalidad familiar para menores (cobertura básica de montaña)',
    popular: false,
    familyLicense: true
  },

  // ============================================================
  // ÁMBITO NACIONAL (España, Andorra, Pirineos, Portugal, Marruecos)
  // ============================================================
  {
    id: 'b',
    name: 'B - Nacional',
    shortName: 'B',
    territory: 'national',
    includesExtras: false,
    prices: {
      infantil: 27.00,
      juvenil: 27.00,
      mayor: 64.00
    },
    coverage: 'Excursiones, Senderismo, Escalada, Vías Ferratas, Alpinismo, Esquí de Montaña, Descenso de Barrancos, Acampadas Alpinísticas, Raquetas de Nieve, Marcha Nórdica, Travesías y Carreras por Montaña',
    popular: false
  },
  {
    id: 'b-plus',
    name: 'B+ - Nacional Plus',
    shortName: 'B+',
    territory: 'national',
    includesExtras: true,
    prices: {
      infantil: 41.00,
      juvenil: 41.00,
      mayor: 81.00
    },
    coverage: 'Todo lo de B + BTT, Espeleología y Esquí Nórdico (no competitivos)',
    popular: true
  },
  {
    id: 'b-familiar',
    name: 'B Familiar',
    shortName: 'B Fam',
    territory: 'national',
    includesExtras: false,
    prices: {
      infantil: 21.00,
      juvenil: 21.00,
      mayor: 0
    },
    coverage: 'Modalidad familiar para menores',
    popular: false,
    familyLicense: true
  },

  // ============================================================
  // ÁMBITO EUROPEO
  // ============================================================
  {
    id: 'c',
    name: 'C - Europea',
    shortName: 'C',
    territory: 'european',
    includesExtras: true, // Siempre incluye extras
    prices: {
      infantil: 85.00,
      juvenil: 85.00,
      mayor: 125.00
    },
    coverage: 'Cobertura completa en Europa incluyendo BTT, Espeleología y Esquí Nórdico',
    popular: false
  },

  // ============================================================
  // SIN LICENCIA
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
  }
];

// Función para filtrar licencias por territorio y preferencias
export function filterLicenses(
  territory: TerritoryScope,
  wantsExtras: boolean,
  ageCategory: AgeCategory
): LicenseType[] {
  return LICENSE_TYPES.filter(license => {
    // Filtrar por territorio
    if (license.territory !== territory) return false;
    
    // Filtrar licencias familiares si es mayor
    if (license.familyLicense && ageCategory === 'mayor') return false;
    
    // Si no quiere extras, solo mostrar sin extras o la europea (que siempre los tiene)
    if (!wantsExtras && license.includesExtras && territory !== 'european') return false;
    
    // Si quiere extras, solo mostrar con extras
    if (wantsExtras && !license.includesExtras && territory !== 'none') return false;
    
    return true;
  });
}

// Función para obtener licencia recomendada
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

// Obtener el territorio por ID de licencia
export function getTerritoryByLicenseId(licenseId: string): LicenseTerritory | null {
  const license = LICENSE_TYPES.find(l => l.id === licenseId);
  if (!license) return null;
  
  return TERRITORIES.find(t => t.id === license.territory) || null;
}
