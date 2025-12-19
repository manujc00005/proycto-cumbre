// lib/logger.ts - Sistema de logging para desarrollo

// const isDevelopment = process.env.NODE_ENV === 'development';
const isDevelopment = true;

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    } else {
      // En producción, solo loguear errores críticos
      console.error("[ERROR]", ...args);
    }
  },

  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug("🐛", ...args);
    }
  },

  // Helpers para APIs
  apiStart: (method: string, path: string, data?: any) => {
    if (isDevelopment) {
      console.log(`\n🚀 ${method} ${path}`);
      if (data) {
        console.log("📥 Datos:", data);
      }
    }
  },

  apiSuccess: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`✅ ${message}`);
      if (data) {
        console.log("📤 Respuesta:", data);
      }
    }
  },

  apiError: (message: string, error?: any) => {
    if (isDevelopment) {
      console.error(`❌ ${message}`);
      if (error) {
        console.error("Error details:", error);
      }
    } else {
      // En producción, solo el mensaje
      console.error(`[API ERROR] ${message}`);
    }
  },

  // Helper para Stripe
  stripe: (event: string, data?: any) => {
    if (isDevelopment) {
      console.log(`💳 Stripe: ${event}`);
      if (data) {
        console.log(data);
      }
    }
  },

  // Helper para database
  db: (operation: string, data?: any) => {
    if (isDevelopment) {
      console.log(`💾 DB: ${operation}`);
      if (data) {
        console.log(data);
      }
    }
  },
};

// También puedes exportar helpers individuales
export const log = logger.log;
export const error = logger.error;
export const warn = logger.warn;
export const info = logger.info;
export const debug = logger.debug;
