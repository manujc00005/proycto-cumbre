// ========================================
// HOOK: useStepValidation
// Valida datos antes de avanzar
// components/EventFunnelModal/hooks/useStepValidation.ts
// ========================================

import { FormField } from "@/lib/funnels/types";

export function useStepValidation(fields: FormField[]) {
  // Validar un campo individual
  const validateField = (field: FormField, value: any): string | null => {
    // Campo requerido vacío
    if (field.required && (!value || value.toString().trim() === "")) {
      return `${field.label} es obligatorio`;
    }

    // Sin valor, no hay más que validar
    if (!value) return null;

    // Validación personalizada
    if (field.validation) {
      const customError = field.validation(value);
      if (customError) return customError;
    }

    // Validación por tipo
    switch (field.type) {
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) {
          return "Email inválido";
        }
        break;

      case "tel":
        const phone = value.replace(/\s/g, "");
        if (!/^(\+?[1-9]\d{0,2})?\d{9,}$/.test(phone)) {
          return "Teléfono inválido";
        }
        break;

      case "dni":
        const dniRegex = /^[0-9]{8}[A-Za-z]$/;
        const nieRegex = /^[XYZ][0-9]{7}[A-Za-z]$/;
        const upperValue = value.toUpperCase();
        if (!dniRegex.test(upperValue) && !nieRegex.test(upperValue)) {
          return "DNI/NIE inválido (ej: 12345678A)";
        }
        break;

      default:
        break;
    }

    return null;
  };

  // Validar todos los campos
  const validateAll = (
    formData: Record<string, any>,
  ): Record<string, string> => {
    const errors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = formData[field.id];
      const error = validateField(field, value);
      if (error) {
        errors[field.id] = error;
      }
    });

    return errors;
  };

  // Verificar si el formulario es válido
  const isValid = (formData: Record<string, any>): boolean => {
    const errors = validateAll(formData);
    return Object.keys(errors).length === 0;
  };

  return {
    validateField,
    validateAll,
    isValid,
  };
}
