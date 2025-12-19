// ========================================
// HOOK: useFormDraft
// Guarda datos del formulario en localStorage
// components/EventFunnelModal/hooks/useFormDraft.ts
// ========================================

import { useEffect, useRef } from "react";

export function useFormDraft(
  eventId: string,
  formData: Record<string, any>,
  enabled: boolean = true,
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const storageKey = `event-funnel-draft-${eventId}`;

  // Guardar en localStorage con debounce
  useEffect(() => {
    if (!enabled || Object.keys(formData).length === 0) return;

    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Guardar después de 2 segundos de inactividad
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            data: formData,
            timestamp: new Date().toISOString(),
          }),
        );
        console.log("📝 Borrador guardado automáticamente");
      } catch (error) {
        console.error("Error al guardar borrador:", error);
      }
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData, enabled, storageKey]);

  // Cargar borrador guardado
  const loadDraft = (): Record<string, any> | null => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { data, timestamp } = JSON.parse(saved);

        // Solo cargar si tiene menos de 24 horas
        const savedDate = new Date(timestamp);
        const now = new Date();
        const hoursDiff =
          (now.getTime() - savedDate.getTime()) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
          console.log("📂 Borrador cargado desde localStorage");
          return data;
        } else {
          // Borrador muy antiguo, eliminar
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.error("Error al cargar borrador:", error);
    }
    return null;
  };

  // Limpiar borrador
  const clearDraft = () => {
    try {
      localStorage.removeItem(storageKey);
      console.log("🗑️ Borrador eliminado");
    } catch (error) {
      console.error("Error al eliminar borrador:", error);
    }
  };

  return {
    loadDraft,
    clearDraft,
  };
}
