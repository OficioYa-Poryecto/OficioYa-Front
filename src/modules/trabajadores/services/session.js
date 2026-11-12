import { ACCESS_TOKEN, USE_MOCKS } from '../config';

// Cuenta de ejemplo para el modo con datos de ejemplo.
const CUENTA_EJEMPLO = {
  token: '',
  userId: '6f1c2b0e-9a4d-4c1e-8f3a-2d5b7e9c1a40',
  initials: 'AS',
  name: 'Andrea Salazar',
  hasRealName: true,
  email: 'andrea.salazar@gmail.com',
  phone: '3001234567',
};

function leerToken(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload));
  } catch {
    return {};
  }
}

// Único punto que conoce de dónde sale la sesión. Cuando Identity entregue useAuth(),
// solo cambia esta función.
// email y phone son de Identity: Worker no los guarda ni los expone en WorkerResponse.
export function getSession() {
  if (USE_MOCKS) return CUENTA_EJEMPLO;

  const { sub, email } = leerToken(ACCESS_TOKEN);
  // El nombre lo entrega el dominio User (getUsersByIds); mientras tanto se muestra genérico.
  return {
    token: ACCESS_TOKEN,
    userId: sub ?? null, // UUID de Identity
    initials: 'T',
    name: 'Trabajador',
    hasRealName: false, // pasa a true cuando User entregue el nombre
    email: email ?? null,
    phone: null,
  };
}
