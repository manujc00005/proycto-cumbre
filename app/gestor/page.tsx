// ========================================
// GESTOR PAGE - Protegido con PIN
// app/gestor/page.tsx
// ========================================

import GestorAuth from "./gestor-auth-component";
import GestorPage from "./gestor-page";


export const metadata = {
  title: 'Panel de Gestión | Proyecto Cumbre',
  description: 'Panel de administración - Acceso restringido',
  robots: 'noindex, nofollow', // No indexar en buscadores
};

export default function ProtectedGestorPage() {
  return (
    <GestorAuth>
      <GestorPage />
    </GestorAuth>
  );
}
