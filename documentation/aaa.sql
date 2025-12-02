-- ============================================
-- PROYECTO CUMBRE - RESET COMPLETO 2026
-- Base de Datos desde Cero
-- ============================================
-- Versión: 2.0 - FEDME 2026
-- Fecha: 2026-01-01
-- Licencias: A, A+, A NAC, A NAC+, B, B+, C
-- Sede por defecto: Málaga
-- ============================================

-- ============================================
-- PASO 1: LIMPIAR TODO (Reset Total)
-- ============================================

-- Eliminar tablas en orden inverso de dependencias
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS headquarters CASCADE;

-- Eliminar vistas
DROP VIEW IF EXISTS members_by_age_group CASCADE;
DROP VIEW IF EXISTS headquarters_summary CASCADE;
DROP VIEW IF EXISTS expiring_soon CASCADE;
DROP VIEW IF EXISTS pending_members CASCADE;
DROP VIEW IF EXISTS active_members CASCADE;
DROP VIEW IF EXISTS members_list CASCADE;

-- Eliminar funciones
DROP FUNCTION IF EXISTS activate_membership(UUID, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS generate_member_number(UUID) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Eliminar enums
DROP TYPE IF EXISTS "PaymentStatus" CASCADE;
DROP TYPE IF EXISTS "MembershipStatus" CASCADE;
DROP TYPE IF EXISTS "FedmeStatus" CASCADE;
DROP TYPE IF EXISTS "LicenseType" CASCADE;
DROP TYPE IF EXISTS "Sex" CASCADE;

-- Eliminar tabla de migraciones de Prisma
DROP TABLE IF EXISTS "_prisma_migrations" CASCADE;

-- ============================================
-- PASO 2: EXTENSIONES
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PASO 3: CREAR ENUMS - FEDME 2026
-- ============================================

-- Sexo
CREATE TYPE "Sex" AS ENUM (
  'M',  -- Masculino
  'F',  -- Femenino
  'O'   -- Otro
);

-- Tipos de Licencia FEDME 2026
CREATE TYPE "LicenseType" AS ENUM (
  'none',       -- Sin licencia
  'a',          -- A - Autonómica
  'a_plus',     -- A+ - Autonómica Plus
  'a_nac',      -- A NAC - Autonómica Nacional (NUEVO 2026)
  'a_nac_plus', -- A NAC+ - Autonómica Nacional Plus (NUEVO 2026)
  'b',          -- B - Nacional
  'b_plus',     -- B+ - Nacional Plus
  'c'           -- C - Europea
);

-- Estado de Licencia FEDME
CREATE TYPE "FedmeStatus" AS ENUM (
  'none',        -- Usuario eligió "Sin Licencia"
  'pending',     -- Pendiente de tramitar
  'processing',  -- En proceso con FEDME
  'active',      -- Licencia activa
  'rejected',    -- Rechazada por FEDME
  'expired'      -- Expirada
);

-- Estado de Membresía
CREATE TYPE "MembershipStatus" AS ENUM (
  'pending',    -- Esperando pago
  'active',     -- Pago completado, activa
  'expired',    -- Expiró después de 1 año
  'failed',     -- Pago rechazado
  'cancelled'   -- Cancelada por admin
);

-- Estado de Pagos
CREATE TYPE "PaymentStatus" AS ENUM (
  'pending',    -- Pendiente
  'completed',  -- Completado
  'failed',     -- Fallido
  'refunded'    -- Reembolsado
);

-- ============================================
-- PASO 4: CREAR TABLAS
-- ============================================

-- TABLA: headquarters (Sedes)
CREATE TABLE headquarters (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Información básica
  name                VARCHAR(255) NOT NULL,
  code                VARCHAR(20) UNIQUE NOT NULL,
  city                VARCHAR(100) NOT NULL,
  
  -- Contacto
  phone               VARCHAR(20),
  email               VARCHAR(255),
  
  -- Precios de membresía (JSONB)
  membership_prices   JSONB NOT NULL,
  
  -- Estado
  status              VARCHAR(20) DEFAULT 'active',
  
  -- Timestamps
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW()
);

-- TABLA: members (Socios) - TABLA PRINCIPAL
CREATE TABLE members (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Sede
  headquarters_id         UUID REFERENCES headquarters(id),
  member_number           VARCHAR(50) UNIQUE,
  
  -- Datos personales
  email                   VARCHAR(255) UNIQUE NOT NULL,
  first_name              VARCHAR(100) NOT NULL,
  last_name               VARCHAR(100) NOT NULL,
  birth_date              DATE NOT NULL,
  dni                     VARCHAR(20) UNIQUE NOT NULL,
  sex                     "Sex" NOT NULL,
  
  -- Contacto
  phone                   VARCHAR(20) NOT NULL,
  emergency_phone         VARCHAR(20),
  emergency_contact_name  VARCHAR(255),
  
  -- Dirección
  province                VARCHAR(100) NOT NULL,
  city                    VARCHAR(100),
  address                 TEXT NOT NULL,
  postal_code             VARCHAR(10),
  
  -- Tallas
  shirt_size              VARCHAR(10),
  hoodie_size             VARCHAR(10),
  pants_size              VARCHAR(10),
  
  -- Licencia FEDME
  license_type            "LicenseType" NOT NULL,
  fedme_license_number    VARCHAR(50) UNIQUE,
  fedme_status            "FedmeStatus" DEFAULT 'pending',
  
  -- Estado de membresía
  membership_status       "MembershipStatus" DEFAULT 'pending',
  membership_start_date   TIMESTAMP,
  membership_end_date     TIMESTAMP,
  
  -- Notas administrativas
  admin_notes             TEXT,
  
  -- Timestamps
  created_at              TIMESTAMP DEFAULT NOW(),
  updated_at              TIMESTAMP DEFAULT NOW()
);

-- TABLA: payments (Pagos)
CREATE TABLE payments (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relación con socio
  member_id           UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  
  -- Stripe
  stripe_session_id   VARCHAR(255) UNIQUE NOT NULL,
  stripe_payment_id   VARCHAR(255),
  
  -- Montos
  amount              INTEGER NOT NULL,  -- En centavos
  currency            VARCHAR(3) DEFAULT 'eur',
  
  -- Estado
  status              "PaymentStatus" DEFAULT 'pending',
  
  -- Metadata
  description         TEXT,
  
  -- Timestamps
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- PASO 5: CREAR ÍNDICES
-- ============================================

-- Índices de headquarters
CREATE INDEX idx_headquarters_code ON headquarters(code);
CREATE INDEX idx_headquarters_status ON headquarters(status);

-- Índices de members
CREATE INDEX idx_members_headquarters ON members(headquarters_id);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_dni ON members(dni);
CREATE INDEX idx_members_status ON members(membership_status);
CREATE INDEX idx_members_member_number ON members(member_number);
CREATE INDEX idx_members_created_at ON members(created_at DESC);

-- Índices de payments
CREATE INDEX idx_payments_member ON payments(member_id);
CREATE INDEX idx_payments_stripe_session ON payments(stripe_session_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

-- ============================================
-- PASO 6: FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_headquarters_updated_at 
  BEFORE UPDATE ON headquarters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_members_updated_at 
  BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at 
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para generar número de socio único
CREATE OR REPLACE FUNCTION generate_member_number(p_headquarters_id UUID)
RETURNS TEXT AS $$
DECLARE
    v_hq_code VARCHAR(20);
    v_year VARCHAR(4);
    v_count INTEGER;
    v_member_number TEXT;
BEGIN
    -- Obtener código de sede
    SELECT code INTO v_hq_code
    FROM headquarters
    WHERE id = p_headquarters_id;
    
    IF v_hq_code IS NULL THEN
        RAISE EXCEPTION 'Sede no encontrada';
    END IF;
    
    -- Año actual
    v_year := TO_CHAR(NOW(), 'YYYY');
    
    -- Contar miembros de esta sede este año
    SELECT COUNT(*) + 1 INTO v_count
    FROM members
    WHERE headquarters_id = p_headquarters_id
      AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
    
    -- Formato: MAL-2026-001
    v_member_number := v_hq_code || '-' || v_year || '-' || LPAD(v_count::TEXT, 3, '0');
    
    RETURN v_member_number;
END;
$$ LANGUAGE plpgsql;

-- Función para activar membresía después del pago
CREATE OR REPLACE FUNCTION activate_membership(
  p_member_id UUID,
  p_duration_days INTEGER DEFAULT 365
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  member_number VARCHAR,
  end_date TIMESTAMP
) AS $$
DECLARE
  v_end_date TIMESTAMP;
  v_member_number VARCHAR(50);
  v_exists BOOLEAN;
BEGIN
  -- Verificar que existe
  SELECT EXISTS(SELECT 1 FROM members WHERE id = p_member_id),
         m.member_number
  INTO v_exists, v_member_number
  FROM members m
  WHERE m.id = p_member_id;
  
  IF NOT v_exists THEN
    RETURN QUERY SELECT false, 'Miembro no encontrado'::TEXT, NULL::VARCHAR, NULL::TIMESTAMP;
    RETURN;
  END IF;
  
  -- Calcular fecha de expiración
  v_end_date := NOW() + (p_duration_days || ' days')::INTERVAL;
  
  -- Actualizar membresía
  UPDATE members 
  SET 
    membership_status = 'active',
    membership_start_date = NOW(),
    membership_end_date = v_end_date,
    updated_at = NOW()
  WHERE id = p_member_id;
  
  RETURN QUERY SELECT true, 'Membresía activada exitosamente'::TEXT, v_member_number, v_end_date;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PASO 7: VISTAS
-- ============================================

-- Vista: members_list (Lista completa)
CREATE OR REPLACE VIEW members_list AS
SELECT 
  m.id,
  m.member_number,
  m.created_at,
  h.name as headquarters_name,
  h.code as headquarters_code,
  h.city as headquarters_city,
  m.first_name,
  m.last_name,
  m.email,
  m.phone,
  m.dni,
  m.birth_date,
  EXTRACT(YEAR FROM AGE(m.birth_date)) as age,
  m.city,
  m.province,
  m.license_type,
  m.membership_status,
  m.membership_start_date,
  m.membership_end_date,
  CASE 
    WHEN m.membership_status = 'cancelled' THEN 'Cancelado'
    WHEN m.membership_status = 'pending' THEN 'Pendiente de pago'
    WHEN m.membership_end_date IS NULL THEN 'Sin activar'
    WHEN m.membership_end_date > NOW() THEN 'Activo'
    WHEN m.membership_end_date <= NOW() THEN 'Expirado'
    ELSE 'Pendiente'
  END as status_label,
  CASE 
    WHEN m.membership_end_date IS NOT NULL THEN
      EXTRACT(DAY FROM (m.membership_end_date - NOW()))::INTEGER
    ELSE NULL
  END as days_remaining,
  m.fedme_license_number,
  m.fedme_status
FROM members m
LEFT JOIN headquarters h ON m.headquarters_id = h.id
ORDER BY m.created_at DESC;

-- Vista: active_members (Solo activos)
CREATE OR REPLACE VIEW active_members AS
SELECT 
  m.member_number,
  h.code as sede,
  m.first_name || ' ' || m.last_name as nombre_completo,
  m.email,
  m.phone,
  m.license_type as tipo_licencia,
  m.membership_start_date as fecha_inicio,
  m.membership_end_date as fecha_expiracion,
  EXTRACT(DAY FROM (m.membership_end_date - NOW()))::INTEGER as dias_restantes,
  m.fedme_license_number as licencia_fedme
FROM members m
LEFT JOIN headquarters h ON m.headquarters_id = h.id
WHERE m.membership_status = 'active'
  AND m.membership_end_date > NOW()
ORDER BY m.membership_end_date ASC;

-- Vista: pending_members (Pendientes de pago)
CREATE OR REPLACE VIEW pending_members AS
SELECT 
  m.id,
  m.member_number,
  h.code as sede,
  m.first_name || ' ' || m.last_name as nombre_completo,
  m.email,
  m.phone,
  m.license_type,
  m.created_at as fecha_registro,
  EXTRACT(DAY FROM (NOW() - m.created_at))::INTEGER as dias_pendiente,
  m.admin_notes
FROM members m
LEFT JOIN headquarters h ON m.headquarters_id = h.id
WHERE m.membership_status = 'pending'
ORDER BY m.created_at ASC;

-- Vista: expiring_soon (Expiran pronto)
CREATE OR REPLACE VIEW expiring_soon AS
SELECT 
  m.member_number,
  h.code as sede,
  m.first_name || ' ' || m.last_name as nombre_completo,
  m.email,
  m.phone,
  m.membership_end_date as fecha_expiracion,
  EXTRACT(DAY FROM (m.membership_end_date - NOW()))::INTEGER as dias_restantes
FROM members m
LEFT JOIN headquarters h ON m.headquarters_id = h.id
WHERE m.membership_status = 'active'
  AND m.membership_end_date BETWEEN NOW() AND NOW() + INTERVAL '30 days'
ORDER BY m.membership_end_date ASC;

-- Vista: licencias por tipo (nueva para 2026)
CREATE OR REPLACE VIEW licenses_by_type AS
SELECT 
  m.license_type,
  COUNT(*) as total,
  COUNT(CASE WHEN m.membership_status = 'active' THEN 1 END) as activos,
  COUNT(CASE WHEN m.fedme_status = 'active' THEN 1 END) as fedme_activos,
  CASE m.license_type
    WHEN 'none' THEN 'Sin Licencia'
    WHEN 'a' THEN 'A - Autonómica'
    WHEN 'a_plus' THEN 'A+ - Autonómica Plus'
    WHEN 'a_nac' THEN 'A NAC - Autonómica Nacional'
    WHEN 'a_nac_plus' THEN 'A NAC+ - Autonómica Nacional Plus'
    WHEN 'b' THEN 'B - Nacional'
    WHEN 'b_plus' THEN 'B+ - Nacional Plus'
    WHEN 'c' THEN 'C - Europea'
  END as tipo_nombre
FROM members m
GROUP BY m.license_type
ORDER BY total DESC;

-- ============================================
-- PASO 8: DATOS INICIALES (SEED)
-- ============================================

-- Insertar sede por defecto: MÁLAGA
INSERT INTO headquarters (
  name, 
  code, 
  city, 
  phone, 
  email, 
  membership_prices, 
  status
)
VALUES (
  'Proyecto Cumbre Málaga',
  'MAL',
  'Málaga',
  '692185193',
  'info@proyectocumbre.com',
  '{
    "basic": 50,
    "premium": 80,
    "family": 120
  }'::jsonb,
  'active'
)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- PASO 9: VERIFICACIÓN
-- ============================================

-- Ver todas las tablas creadas
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Ver todos los enums creados con sus valores
SELECT 
  t.typname as enum_name,
  string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) as valores
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typtype = 'e'
GROUP BY t.typname
ORDER BY t.typname;

-- Ver las vistas creadas
SELECT 
  table_name
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;

-- Ver la sede creada
SELECT 
  id,
  name,
  code,
  city,
  phone,
  email,
  status
FROM headquarters;

-- Verificar que el enum LicenseType tiene los valores correctos
SELECT 
  enumlabel as license_type
FROM pg_enum
WHERE enumtypid = 'LicenseType'::regtype
ORDER BY enumsortorder;

-- ============================================
-- FIN DEL RESET
-- ============================================

/*
Resumen de lo creado:
✅ 5 Enums (Sex, LicenseType, MembershipStatus, FedmeStatus, PaymentStatus)
✅ 3 Tablas (headquarters, members, payments)
✅ Índices optimizados para búsquedas rápidas
✅ 3 Funciones (update_updated_at, generate_member_number, activate_membership)
✅ 3 Triggers automáticos
✅ 5 Vistas (members_list, active_members, pending_members, expiring_soon, licenses_by_type)
✅ 1 Sede por defecto (Málaga)

📋 LICENCIAS FEDME 2026:
   - none: Sin licencia
   - a: A - Autonómica
   - a_plus: A+ - Autonómica Plus
   - a_nac: A NAC - Autonómica Nacional (NUEVO)
   - a_nac_plus: A NAC+ - Autonómica Nacional Plus (NUEVO)
   - b: B - Nacional
   - b_plus: B+ - Nacional Plus
   - c: C - Europea

Tu base de datos está lista para usar con las licencias 2026! 🏔️
*/