# 🔄 GUÍA COMPLETA: RESET DE BASE DE DATOS

## 📋 Proyecto Cumbre - Sistema de Membresía

Esta guía te permite **resetear completamente** tu base de datos desde cero, dejándola lista para usar con Málaga como sede por defecto.

---

## 🎯 ¿Cuándo Usar Esta Guía?

Usa esta guía cuando:

- ✅ Necesites empezar desde cero
- ✅ Hayas borrado todas las tablas manualmente
- ✅ Tengas problemas con enums o tipos de datos
- ✅ Quieras una base de datos limpia y optimizada
- ✅ Estés migrando de una estructura antigua

---

## 📦 Archivo Necesario

**RESET_COMPLETO_FINAL.sql** - Script SQL que crea todo desde cero

Este archivo incluye:

- 5 Enums (tipos de datos personalizados)
- 3 Tablas principales (headquarters, members, payments)
- Índices optimizados
- Funciones útiles
- Vistas para consultas
- Sede de Málaga por defecto

---

## 🚀 MÉTODO 1: Reset en Neon (Recomendado)

### Paso 1: Acceder a Neon SQL Editor

1. Ve a: **https://console.neon.tech**
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto: **Proyecto Cumbre**
4. En el menú lateral, click en **"SQL Editor"**

### Paso 2: Ejecutar el Script

1. Abre el archivo: **RESET_COMPLETO_FINAL.sql**
2. Selecciona **TODO** el contenido (Ctrl+A)
3. Copia (Ctrl+C)
4. Pega en el SQL Editor de Neon (Ctrl+V)
5. Click en **"Run"** (o presiona Ctrl+Enter)
6. Espera a que termine (debería tardar 2-5 segundos)

### Paso 3: Verificar la Creación

El script incluye queries de verificación al final. Deberías ver:

**Tablas creadas:**

```
headquarters
members
payments
```

**Enums creados:**

```
FedmeStatus: pending, processing, active, rejected, expired, none
LicenseType: none, a1, a1_plus, b1, b1_plus
MembershipStatus: pending, active, expired, failed, cancelled
PaymentStatus: pending, completed, failed, refunded
Sex: M, F, O
```

**Vistas creadas:**

```
active_members
expiring_soon
members_list
pending_members
```

**Sede creada:**

```
Proyecto Cumbre Málaga (MAL) - Málaga
```

### Paso 4: Sincronizar Prisma

Después de ejecutar el SQL, sincroniza Prisma con la nueva estructura:

```bash
# 1. Asegurar que tienes el schema correcto
cp schema_final.prisma prisma/schema.prisma

# 2. Regenerar el cliente de Prisma
npx prisma generate

# 3. Verificar en Prisma Studio
npx prisma studio
```

### Paso 5: Probar

```bash
# Iniciar servidor
npm run dev

# Ir al formulario
# http://localhost:3000/membership

# Rellenar y enviar

# Verificar en Prisma Studio
npx prisma studio
```

---

## 🔧 MÉTODO 2: Reset con Prisma

Si prefieres usar Prisma en lugar de ejecutar SQL manualmente:

### Opción A: Reset Completo (Borra todo)

```bash
# 1. Copiar schema correcto
cp schema_final.prisma prisma/schema.prisma

# 2. Borrar migraciones anteriores
rm -rf prisma/migrations

# 3. Reset completo (BORRA TODO y recrea)
npx prisma migrate reset --force

# 4. Crear migración inicial
npx prisma migrate dev --name init

# 5. Generar cliente
npx prisma generate

# 6. Verificar
npx prisma studio
```

### Opción B: Push Directo (Más rápido)

```bash
# 1. Copiar schema correcto
cp schema_final.prisma prisma/schema.prisma

# 2. Push a la BD (sin crear migraciones)
npx prisma db push --force-reset

# 3. Generar cliente
npx prisma generate

# 4. Verificar
npx prisma studio
```

**⚠️ IMPORTANTE:** Con Prisma, necesitarás agregar la sede de Málaga manualmente:

```sql
-- Ejecuta esto en Neon después del reset de Prisma:
INSERT INTO headquarters (
  name, code, city, phone, email, membership_prices, status
) VALUES (
  'Proyecto Cumbre Málaga',
  'MAL',
  'Málaga',
  '692185193',
  'info@proyectocumbre.com',
  '{"basic": 50, "premium": 80, "family": 120}'::jsonb,
  'active'
);
```

---

## ✅ Verificación Completa

Después del reset, ejecuta estas queries en Neon para verificar:

### 1. Ver todas las tablas

```sql
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**Resultado esperado:**

- headquarters
- members
- payments

### 2. Ver todos los enums

```sql
SELECT
  t.typname as enum_name,
  e.enumlabel as valor
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typtype = 'e'
ORDER BY t.typname, e.enumsortorder;
```

**Resultado esperado:** 23 filas (5 enums con sus valores)

### 3. Ver la sede de Málaga

```sql
SELECT id, name, code, city, status
FROM headquarters;
```

**Resultado esperado:**

```
Proyecto Cumbre Málaga | MAL | Málaga | active
```

### 4. Contar registros

```sql
SELECT
  (SELECT COUNT(*) FROM headquarters) as sedes,
  (SELECT COUNT(*) FROM members) as socios,
  (SELECT COUNT(*) FROM payments) as pagos;
```

**Resultado esperado:**

```
sedes: 1
socios: 0
pagos: 0
```

### 5. Probar inserción de socio

```sql
-- Obtener el ID de la sede de Málaga
SELECT id FROM headquarters WHERE code = 'MAL';

-- Insertar un socio de prueba (usa el ID obtenido arriba)
INSERT INTO members (
  headquarters_id,
  email,
  first_name,
  last_name,
  birth_date,
  dni,
  sex,
  phone,
  province,
  address,
  license_type
) VALUES (
  (SELECT id FROM headquarters WHERE code = 'MAL'),
  'test@proyectocumbre.com',
  'Test',
  'Usuario',
  '1990-01-01',
  '12345678Z',
  'M',
  '692185193',
  'Málaga',
  'Calle Test 123',
  'none'
);

-- Verificar
SELECT * FROM members WHERE email = 'test@proyectocumbre.com';
```

Si se inserta correctamente → ✅ Todo funciona

---

## 📊 Estructura de la Base de Datos

### Tablas Principales

#### 1. **headquarters** (Sedes)

```
├── id (UUID)
├── name (Proyecto Cumbre Málaga)
├── code (MAL)
├── city (Málaga)
├── phone (692185193)
├── email (info@proyectocumbre.com)
├── membership_prices (JSONB)
└── status (active)
```

#### 2. **members** (Socios) - TABLA PRINCIPAL

```
├── id (UUID)
├── headquarters_id (FK → headquarters)
├── member_number (MAL-2025-001)
├── Datos Personales (email, first_name, last_name, birth_date, dni, sex)
├── Contacto (phone, emergency_phone, emergency_contact_name)
├── Dirección (province, city, address, postal_code)
├── Tallas (shirt_size, hoodie_size, pants_size)
├── Licencia FEDME (license_type, fedme_license_number, fedme_status)
├── Estado (membership_status, membership_start_date, membership_end_date)
└── Metadata (admin_notes, created_at, updated_at)
```

#### 3. **payments** (Pagos)

```
├── id (UUID)
├── member_id (FK → members)
├── Stripe (stripe_session_id, stripe_payment_id)
├── Montos (amount, currency)
├── Estado (status)
└── Timestamps (created_at, updated_at)
```

### Enums (Tipos Personalizados)

#### Sex

- `M` - Masculino
- `F` - Femenino
- `O` - Otro

#### LicenseType

- `none` - Sin licencia
- `a1` - A1 - Media Temporada
- `a1_plus` - A1+ - Media Temporada Plus
- `b1` - B1 - Cobertura Ampliada
- `b1_plus` - B1+ - Cobertura Ampliada Plus

#### FedmeStatus

- `pending` - Pendiente de tramitar
- `processing` - En proceso con FEDME
- `active` - Licencia activa
- `rejected` - Rechazada
- `expired` - Expirada
- `none` - Sin licencia

#### MembershipStatus

- `pending` - Esperando pago
- `active` - Activa
- `expired` - Expirada
- `failed` - Pago fallido
- `cancelled` - Cancelada

#### PaymentStatus

- `pending` - Pendiente
- `completed` - Completado
- `failed` - Fallido
- `refunded` - Reembolsado

### Vistas

#### members_list

Lista completa de todos los socios con información detallada.

#### active_members

Solo socios con membresía activa y no expirada.

#### pending_members

Socios que están esperando completar el pago.

#### expiring_soon

Membresías que expiran en los próximos 30 días.

### Funciones

#### generate_member_number(headquarters_id)

Genera un número único de socio: `MAL-2025-001`

```sql
-- Ejemplo de uso:
SELECT generate_member_number(
  (SELECT id FROM headquarters WHERE code = 'MAL')
);

-- Resultado: MAL-2025-001
```

#### activate_membership(member_id, duration_days)

Activa una membresía después del pago.

```sql
-- Ejemplo de uso:
SELECT * FROM activate_membership(
  '123e4567-e89b-12d3-a456-426614174000',  -- member_id
  365  -- duración en días (1 año)
);
```

#### update_updated_at_column()

Trigger que actualiza automáticamente el campo `updated_at`.

---

## 🔧 Solución a Problemas Comunes

### Problema 1: "type Sex does not exist"

**Causa:** Los enums no se crearon correctamente.

**Solución:**

```sql
-- Ejecuta manualmente en Neon:
CREATE TYPE "Sex" AS ENUM ('M', 'F', 'O');
CREATE TYPE "LicenseType" AS ENUM ('none', 'a1', 'a1_plus', 'b1', 'b1_plus');
CREATE TYPE "FedmeStatus" AS ENUM ('pending', 'processing', 'active', 'rejected', 'expired', 'none');
CREATE TYPE "MembershipStatus" AS ENUM ('pending', 'active', 'expired', 'failed', 'cancelled');
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'completed', 'failed', 'refunded');
```

### Problema 2: "relation members does not exist"

**Causa:** La tabla no se creó.

**Solución:** Ejecuta de nuevo **RESET_COMPLETO_FINAL.sql** completo.

### Problema 3: "duplicate key value violates unique constraint"

**Causa:** Ya existe una sede con código 'MAL'.

**Solución:**

```sql
-- Ver sedes existentes
SELECT * FROM headquarters;

-- Si ya existe, no necesitas crear otra
-- Si quieres recrearla:
DELETE FROM headquarters WHERE code = 'MAL';
-- Luego ejecuta el INSERT de nuevo
```

### Problema 4: Prisma no sincroniza los enums

**Causa:** El schema de Prisma no está actualizado.

**Solución:**

```bash
# 1. Asegurar schema correcto
cp schema_final.prisma prisma/schema.prisma

# 2. Forzar pull desde BD
npx prisma db pull --force

# 3. Regenerar cliente
npx prisma generate

# 4. Verificar
npx prisma studio
```

### Problema 5: "cannot execute CREATE TABLE in a read-only transaction"

**Causa:** Estás usando una réplica de solo lectura en Neon.

**Solución:**

1. Ve a Neon Console
2. Asegúrate de estar en la **branch principal** (main)
3. No uses réplicas de lectura para ejecutar el script

---

## 📝 Checklist Post-Reset

Después del reset, verifica:

### En Neon SQL Editor:

- [ ] ✅ 3 tablas creadas (headquarters, members, payments)
- [ ] ✅ 5 enums creados (Sex, LicenseType, etc.)
- [ ] ✅ 4 vistas creadas (members_list, active_members, etc.)
- [ ] ✅ 1 sede creada (Málaga, código MAL)
- [ ] ✅ Puedes insertar un socio de prueba

### En Prisma:

- [ ] ✅ `npx prisma studio` abre sin errores
- [ ] ✅ Ves 3 tablas en Prisma Studio
- [ ] ✅ `npx prisma generate` funciona sin errores

### En la Aplicación:

- [ ] ✅ `npm run dev` inicia sin errores
- [ ] ✅ Puedes acceder a `/membership`
- [ ] ✅ Puedes rellenar y enviar el formulario
- [ ] ✅ El socio aparece en Prisma Studio con `membership_status: pending`

---

## 🎯 Flujo de Uso Normal

Después del reset, el flujo normal es:

```
1. Usuario rellena formulario
   ↓
2. POST /api/members
   • Crea socio con membership_status: 'pending'
   • Genera member_number: MAL-2025-001
   ↓
3. Usuario paga en Stripe
   ↓
4. Webhook /api/webhooks/stripe
   • Actualiza membership_status: 'active'
   • Establece membership_start_date y membership_end_date
   ↓
5. Socio activo ✅
```

---

## 📞 Comandos Útiles

### Ver estructura de una tabla

```sql
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'members'
ORDER BY ordinal_position;
```

### Ver todas las foreign keys

```sql
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

### Ver todos los índices

```sql
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

### Backup de datos (antes de reset)

```sql
-- Exportar socios a CSV (si tienes datos que quieres guardar)
COPY members TO '/tmp/members_backup.csv' DELIMITER ',' CSV HEADER;

-- Después del reset, importar de nuevo
COPY members FROM '/tmp/members_backup.csv' DELIMITER ',' CSV HEADER;
```

---

## 🆘 Soporte

Si después de seguir esta guía sigues teniendo problemas:

1. **Verifica que el script se ejecutó completo**
   - Revisa los logs en Neon SQL Editor
   - Busca mensajes de error en rojo

2. **Verifica tu conexión a BD**

   ```bash
   # En tu .env debe estar:
   DATABASE_URL="postgresql://..."
   ```

3. **Nuclear Reset (último recurso)**

   ```bash
   # Localmente
   rm -rf node_modules prisma/migrations .next
   npm install

   # En Neon
   # Ejecuta RESET_COMPLETO_FINAL.sql de nuevo

   # Sincronizar
   npx prisma generate
   npx prisma studio
   ```

---

## 📚 Archivos Relacionados

- **RESET_COMPLETO_FINAL.sql** - Script SQL completo
- **schema_final.prisma** - Schema de Prisma con enums
- **api_members_final.ts** - API con conversión de tipos
- **licenseTypeConverter.ts** - Utilidad de conversión

---

## 🏔️ Proyecto Cumbre

Base de datos optimizada y lista para:

- ✅ Registro de socios
- ✅ Gestión de membresías
- ✅ Integración con Stripe
- ✅ Licencias FEDME
- ✅ Sistema de pagos

**Sede por defecto:** Málaga (MAL)  
**Teléfono:** 692185193  
**Email:** info@proyectocumbre.com

---

_Última actualización: 2025-11-20_
