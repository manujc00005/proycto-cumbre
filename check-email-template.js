#!/usr/bin/env node
// ========================================
// DIAGNOSTIC SCRIPT - Email Template Version Check
// Verifica qué versión del template se está usando
// scripts/check-email-template.js
// ========================================

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO DE TEMPLATES DE EMAIL\n');
console.log('=====================================\n');

// Paths
const templatesDir = path.join(process.cwd(), 'lib', 'mail', 'templates');
const membershipTemplatePath = path.join(templatesDir, 'membership-mail-template.ts');

// Check if file exists
if (!fs.existsSync(membershipTemplatePath)) {
  console.error('❌ No se encontró membership-mail-template.ts');
  console.error(`   Ruta esperada: ${membershipTemplatePath}`);
  process.exit(1);
}

// Read file
const content = fs.readFileSync(membershipTemplatePath, 'utf8');

// Detection patterns
const patterns = {
  oldVersion: {
    badge: /background.*linear-gradient|Pago Completado|background-color.*00ff00/i,
    structure: /<div.*style.*background.*gradient/i,
  },
  newComponentsVersion: {
    imports: /from.*email-components/,
    components: /emailBase|statusBadge|contentBox/,
  },
  gmailOptimized: {
    mediaQueries: /@media.*prefers-color-scheme.*dark/,
    classes: /class="dark-bg"|class="dark-container"/,
    gmailOverride: /u \+ \.body/,
  }
};

// Detect version
let version = 'unknown';
let issues = [];
let recommendations = [];

console.log('📋 ANÁLISIS DEL TEMPLATE\n');

// Check old version
if (patterns.oldVersion.badge.test(content) || patterns.oldVersion.structure.test(content)) {
  version = '❌ VERSIÓN ANTIGUA';
  issues.push('Usando template antiguo con caja verde grande');
  issues.push('No optimizado para dark mode');
  recommendations.push('Reemplazar con nuevo template modular');
} else if (patterns.newComponentsVersion.imports.test(content) && patterns.newComponentsVersion.components.test(content)) {
  version = '✅ VERSIÓN MODULAR (Componentes)';
  
  // Check Gmail optimization
  if (patterns.gmailOptimized.mediaQueries.test(content) && 
      patterns.gmailOptimized.classes.test(content)) {
    version = '✅ VERSIÓN MODULAR + GMAIL OPTIMIZED';
    console.log('✅ Template actualizado y optimizado para Gmail iOS\n');
  } else {
    issues.push('No optimizado específicamente para Gmail iOS');
    recommendations.push('Considerar usar membership-mail-template-gmail-fix.ts');
  }
} else {
  version = '⚠️ VERSIÓN DESCONOCIDA';
  issues.push('No se pudo determinar la versión exacta');
}

console.log(`Versión detectada: ${version}\n`);

// Check specific features
console.log('🔧 CARACTERÍSTICAS DETECTADAS:\n');

const features = {
  'Dark theme meta tags': /<meta.*color-scheme.*dark/i.test(content),
  'Gmail classes (dark-bg, etc)': /class="dark-/i.test(content),
  'Media queries dark mode': /@media.*prefers-color-scheme.*dark/i.test(content),
  'Bgcolor attributes': /bgcolor="#000000"|bgcolor="#0a0a0a"/i.test(content),
  'Inline styles !important': /background-color.*!important/i.test(content),
  'Email components import': /from.*email-components/i.test(content),
  'Status badge component': /statusBadge/i.test(content),
};

Object.entries(features).forEach(([feature, detected]) => {
  const icon = detected ? '✅' : '❌';
  console.log(`${icon} ${feature}`);
});

console.log('\n');

// Issues
if (issues.length > 0) {
  console.log('⚠️  PROBLEMAS DETECTADOS:\n');
  issues.forEach((issue, i) => {
    console.log(`${i + 1}. ${issue}`);
  });
  console.log('\n');
}

// Recommendations
if (recommendations.length > 0) {
  console.log('💡 RECOMENDACIONES:\n');
  recommendations.forEach((rec, i) => {
    console.log(`${i + 1}. ${rec}`);
  });
  console.log('\n');
}

// Dark mode compatibility score
const compatibilityScore = Object.values(features).filter(Boolean).length;
const totalFeatures = Object.keys(features).length;
const percentage = Math.round((compatibilityScore / totalFeatures) * 100);

console.log('📊 COMPATIBILIDAD DARK MODE:\n');
console.log(`   Score: ${compatibilityScore}/${totalFeatures} (${percentage}%)\n`);

if (percentage >= 80) {
  console.log('   ✅ Excelente - Dark mode bien implementado');
} else if (percentage >= 60) {
  console.log('   ⚠️  Bueno - Pero puede mejorar para Gmail iOS');
} else if (percentage >= 40) {
  console.log('   ⚠️  Regular - Necesita optimización');
} else {
  console.log('   ❌ Pobre - Requiere actualización urgente');
}

console.log('\n');

// Check for green box (old design)
if (content.includes('linear-gradient') || /background.*#00ff00|#22c55e/i.test(content)) {
  console.log('🎨 DISEÑO:\n');
  console.log('   ❌ Detectado: Caja verde grande (diseño antiguo)');
  console.log('   💡 Cambiar a: Badge discreto minimalista\n');
}

// Final recommendation
console.log('=====================================\n');

if (version.includes('ANTIGUA')) {
  console.log('🚨 ACCIÓN REQUERIDA:');
  console.log('   1. Backup: cp membership-mail-template.ts membership-mail-template.backup.ts');
  console.log('   2. Implementar: cp membership-mail-template-gmail-fix.ts membership-mail-template.ts');
  console.log('   3. Testear: Enviar email de prueba a Gmail\n');
} else if (version.includes('MODULAR') && !version.includes('GMAIL')) {
  console.log('✅ TEMPLATE ACTUALIZADO');
  console.log('💡 OPCIONAL: Para mejor compatibilidad con Gmail iOS:');
  console.log('   - Revisar GMAIL_IOS_FIX.md');
  console.log('   - Considerar membership-mail-template-gmail-fix.ts\n');
} else if (version.includes('GMAIL OPTIMIZED')) {
  console.log('✅ TODO CORRECTO - Template optimizado\n');
  console.log('📱 Si aún se ve blanco en Gmail iOS:');
  console.log('   1. Verificar Settings → Theme → Dark en Gmail');
  console.log('   2. Limpiar caché (eliminar email antiguo)');
  console.log('   3. Enviar email nuevo');
  console.log('   4. Revisar GMAIL_IOS_FIX.md para más soluciones\n');
}

console.log('📚 Documentación: EMAIL_TEMPLATES_GUIDE.md');
console.log('🔧 Gmail iOS: GMAIL_IOS_FIX.md\n');

process.exit(issues.length > 0 ? 1 : 0);
