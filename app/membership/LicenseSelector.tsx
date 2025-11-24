import { useState, useEffect } from 'react';
import { Check, ChevronRight, Mountain, Shield, Bike, Info, AlertTriangle, Sparkles } from 'lucide-react';
import { 
  TERRITORIES,
  LICENSE_TYPES,
  type TerritoryScope,
  type AgeCategory,
  type LicenseType,
  filterLicenses,
  getRecommendedLicense,
  getLicensePrice,
  getCategoryLabel
} from '@/lib/constants';

interface LicenseConfiguratorProps {
  selectedLicense: string;
  onSelectLicense: (licenseId: string) => void;
  ageCategory: AgeCategory | null;
  hasError?: boolean;
}

type Step = 'territory' | 'extras' | 'result';

export default function LicenseConfigurator({ 
  selectedLicense, 
  onSelectLicense, 
  ageCategory,
  hasError 
}: LicenseConfiguratorProps) {
  const [currentStep, setCurrentStep] = useState<Step>('territory');
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryScope | null>(null);
  const [wantsExtras, setWantsExtras] = useState<boolean | null>(null);
  const [filteredLicenses, setFilteredLicenses] = useState<LicenseType[]>([]);

  // Auto-detectar configuración desde licencia seleccionada
  useEffect(() => {
    if (selectedLicense && ageCategory) {
      const license = LICENSE_TYPES.find(l => l.id === selectedLicense);
      if (license) {
        setSelectedTerritory(license.territory);
        setWantsExtras(license.includesExtras);
        setCurrentStep('result');
      }
    }
  }, [selectedLicense, ageCategory]);

  // Filtrar licencias cuando cambian las preferencias
  useEffect(() => {
    if (selectedTerritory && wantsExtras !== null && ageCategory) {
      const filtered = filterLicenses(selectedTerritory, wantsExtras, ageCategory);
      setFilteredLicenses(filtered);
    }
  }, [selectedTerritory, wantsExtras, ageCategory]);

  const handleTerritorySelect = (territory: TerritoryScope) => {
    setSelectedTerritory(territory);
    
    // Si selecciona "Sin Licencia", saltar directo al resultado
    if (territory === 'none') {
      setWantsExtras(false);
      onSelectLicense('none');
      setCurrentStep('result');
    } else if (territory === 'european') {
      // Europa siempre incluye extras
      setWantsExtras(true);
      setCurrentStep('result');
    } else {
      // Para regional y nacional, preguntar por extras
      setCurrentStep('extras');
    }
  };

  const handleExtrasSelect = (wants: boolean) => {
    setWantsExtras(wants);
    setCurrentStep('result');
    
    // Auto-seleccionar licencia recomendada
    if (selectedTerritory && ageCategory) {
      const recommended = getRecommendedLicense(selectedTerritory, wants, ageCategory);
      if (recommended) {
        onSelectLicense(recommended.id);
      }
    }
  };

  const handleLicenseSelect = (licenseId: string) => {
    onSelectLicense(licenseId);
  };

  const handleReset = () => {
    setCurrentStep('territory');
    setSelectedTerritory(null);
    setWantsExtras(null);
    setFilteredLicenses([]);
  };

  // Banner de advertencia si no ha introducido fecha de nacimiento
  if (!ageCategory) {
    return (
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-300">
          <p className="font-semibold mb-1">Introduce tu fecha de nacimiento primero</p>
          <p className="text-blue-400">Necesitamos conocer tu edad para mostrarte los precios correctos de las licencias.</p>
        </div>
      </div>
    );
  }

  // PASO 1: Selección de Territorio
  if (currentStep === 'territory') {
    return (
      <div className="space-y-6">
        {/* Header del paso */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            1
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">¿Dónde practicas montaña habitualmente?</h3>
            <p className="text-zinc-400 text-sm">Selecciona el ámbito de cobertura que necesitas</p>
          </div>
        </div>

        {/* Opciones de territorio */}
        <div className="grid gap-4">
          {TERRITORIES.map((territory) => {
            const isNone = territory.id === 'none';
            
            return (
              <button
                key={territory.id}
                type="button"
                onClick={() => handleTerritorySelect(territory.id)}
                className={`group relative p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                  isNone
                    ? 'border-yellow-500/50 bg-yellow-500/5 hover:border-yellow-500 hover:bg-yellow-500/10'
                    : 'border-zinc-700 bg-zinc-800/50 hover:border-orange-500 hover:bg-orange-500/5'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    {/* Icon + Name */}
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{territory.icon}</span>
                      <div>
                        <h4 className={`font-bold text-lg ${isNone ? 'text-yellow-300' : 'text-white'}`}>
                          {territory.name}
                        </h4>
                        <p className="text-zinc-400 text-sm">{territory.shortName}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-zinc-400 text-sm">{territory.description}</p>

                    {/* Coverage */}
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Mountain className="w-4 h-4" />
                      <span>{territory.coverage}</span>
                    </div>

                    {/* Warning para sin licencia */}
                    {isNone && (
                      <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-yellow-300">
                          Sin seguro federativo. Necesitarás tu propio seguro para actividades técnicas.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  <ChevronRight className={`w-6 h-6 transition-transform group-hover:translate-x-1 ${
                    isNone ? 'text-yellow-400' : 'text-orange-400'
                  }`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // PASO 2: Actividades Extras (BTT, Espeleología, Esquí Nórdico)
  if (currentStep === 'extras') {
    return (
      <div className="space-y-6">
        {/* Header del paso */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            2
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">¿Practicas estas actividades?</h3>
            <p className="text-zinc-400 text-sm">BTT, Espeleología o Esquí Nórdico (no competitivo)</p>
          </div>
        </div>

        {/* Breadcrumb */}
        <button
          type="button"
          onClick={handleReset}
          className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1"
        >
          ← Cambiar territorio
        </button>

        {/* Info visual de las actividades */}
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
          <div className="flex items-start gap-3 mb-3">
            <Bike className="w-6 h-6 text-orange-400 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold mb-1">Actividades extras incluidas:</p>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• <strong>BTT</strong> - Bicicleta de montaña (no competitivo)</li>
                <li>• <strong>Espeleología</strong> - Exploración de cuevas (no competitivo)</li>
                <li>• <strong>Esquí Nórdico</strong> - Esquí de fondo (no competitivo)</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-zinc-500 italic">
            Solo modalidades NO competitivas. Para competición necesitas licencias específicas.
          </p>
        </div>

        {/* Opciones */}
        <div className="grid gap-4">
          {/* SÍ quiero extras */}
          <button
            type="button"
            onClick={() => handleExtrasSelect(true)}
            className="group p-6 rounded-xl border-2 border-zinc-700 bg-zinc-800/50 hover:border-orange-500 hover:bg-orange-500/5 transition-all text-left"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <Bike className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Sí, las practico</h4>
                    <p className="text-sm text-zinc-400">Licencia Plus con cobertura extra</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 ml-13">
                  Incluye cobertura para BTT, Espeleología y Esquí Nórdico
                </p>
              </div>
              <ChevronRight className="w-6 h-6 text-orange-400 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          {/* NO quiero extras */}
          <button
            type="button"
            onClick={() => handleExtrasSelect(false)}
            className="group p-6 rounded-xl border-2 border-zinc-700 bg-zinc-800/50 hover:border-orange-500 hover:bg-orange-500/5 transition-all text-left"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center">
                    <Mountain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">No, solo montañismo</h4>
                    <p className="text-sm text-zinc-400">Licencia básica (más económica)</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 ml-13">
                  Cobertura completa de montaña sin actividades extras
                </p>
              </div>
              <ChevronRight className="w-6 h-6 text-orange-400 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  // PASO 3: Resultado - Licencias filtradas
  if (currentStep === 'result') {
    const isNone = selectedTerritory === 'none';
    const territory = TERRITORIES.find(t => t.id === selectedTerritory);

    return (
      <div className="space-y-6">
        {/* Header del paso */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
            <Check className="w-5 h-5" strokeWidth={3} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">
              {isNone ? 'Sin Licencia Federativa' : 'Licencias disponibles para ti'}
            </h3>
            <p className="text-zinc-400 text-sm">
              {isNone 
                ? 'Solo membresía del club'
                : `Basado en tus preferencias: ${territory?.name} ${wantsExtras ? '+ Actividades extras' : ''}`
              }
            </p>
          </div>
        </div>

        {/* Breadcrumb */}
        <button
          type="button"
          onClick={handleReset}
          className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1"
        >
          ← Cambiar mis preferencias
        </button>

        {/* Licencias filtradas */}
        <div className="space-y-4">
          {filteredLicenses.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">
              <p>No hay licencias disponibles con estos criterios.</p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 text-orange-400 hover:text-orange-300"
              >
                Volver a empezar
              </button>
            </div>
          ) : (
            filteredLicenses.map((license) => {
              const isSelected = selectedLicense === license.id;
              const price = getLicensePrice(license, ageCategory);
              const isRecommended = license.popular && !isNone;
              const isFamiliar = license.familyLicense;

              return (
                <button
                  key={license.id}
                  type="button"
                  onClick={() => handleLicenseSelect(license.id)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? isNone
                        ? 'border-yellow-500 bg-yellow-500/10 ring-2 ring-yellow-500/20'
                        : 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/20'
                      : hasError
                      ? 'border-red-500/50 bg-red-500/5 hover:border-red-500'
                      : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      {/* Header con badge */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`font-bold text-lg ${
                          isSelected 
                            ? isNone ? 'text-yellow-300' : 'text-orange-400'
                            : 'text-white'
                        }`}>
                          {license.name}
                        </h4>
                        
                        {isRecommended && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 bg-orange-500 text-white rounded-full">
                            <Sparkles className="w-3 h-3" />
                            Recomendada
                          </span>
                        )}
                        
                        {isFamiliar && (
                          <span className="text-xs font-bold px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                            👨‍👩‍👧‍👦 Familiar
                          </span>
                        )}
                        
                        {isNone && (
                          <span className="text-xs font-bold px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30">
                            ⚠️ Sin seguro
                          </span>
                        )}
                      </div>

                      {/* Territorio */}
                      {!isNone && (
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Mountain className="w-4 h-4" />
                          <span>{territory?.coverage}</span>
                        </div>
                      )}

                      {/* Cobertura */}
                      <p className={`text-sm ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {license.coverage}
                      </p>

                      {/* Extras badge */}
                      {license.includesExtras && !isNone && (
                        <div className="flex items-start gap-2 p-2 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                          <Shield className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-orange-300">
                            + BTT, Espeleología y Esquí Nórdico (no competitivos)
                          </p>
                        </div>
                      )}

                      {/* Warning para sin licencia */}
                      {isNone && (
                        <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                          <div className="text-xs text-yellow-300">
                            <p className="font-semibold mb-1">Importante:</p>
                            <p>Sin licencia FEDME no tendrás cobertura de seguro en actividades de montaña. Necesitarás contratar tu propio seguro para actividades técnicas.</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Precio y checkbox */}
                    <div className="flex flex-col items-end gap-3 min-w-[100px]">
                      {/* Precio */}
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          isSelected 
                            ? isNone ? 'text-yellow-400' : 'text-orange-400'
                            : 'text-white'
                        }`}>
                          {price > 0 ? `${price}€` : 'Gratis'}
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                          {getCategoryLabel(ageCategory).split('(')[0].trim()}
                        </div>
                      </div>

                      {/* Checkmark */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? isNone
                            ? 'bg-yellow-500'
                            : 'bg-orange-500'
                          : 'bg-zinc-700'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Info Note */}
        {!isNone && (
          <div className="mt-6 bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 flex gap-3">
            <Info className="w-5 h-5 text-zinc-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-zinc-400">
              <p className="font-semibold text-zinc-300 mb-1">Sobre las licencias FEDME:</p>
              <ul className="space-y-1 text-xs">
                <li>• Seguro de accidentes y responsabilidad civil incluido</li>
                <li>• Válidas para la temporada completa del año</li>
                <li>• Procesamiento en 48-72h laborables</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
