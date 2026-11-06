import { useState } from 'react';
import { obtenerAdministrador, obtenerContratante } from '../services/authService';
import { AuthContext } from './AuthContext';

// Provisional: guarda en memoria lo que el mockup comparte entre pantallas.
// La sesión real (login, token y perfil) se agrega al conectar el microservicio.
export function AuthProvider({ children }) {
  const [hasWorkerRole, setHasWorkerRole] = useState(false);

  const value = {
    contratante: obtenerContratante(),
    administrador: obtenerAdministrador(),
    hasWorkerRole,
    addWorkerRole: () => setHasWorkerRole(true),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
