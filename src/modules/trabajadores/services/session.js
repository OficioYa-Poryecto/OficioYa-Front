import { ACCESS_TOKEN, USE_MOCKS } from '../config';

// Cuenta de ejemplo para el modo con datos de ejemplo.
const CUENTA_EJEMPLO = { token: '', userId: 99, initials: 'AS', name: 'Andrea' };

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
export function getSession() {
  if (USE_MOCKS) return CUENTA_EJEMPLO;

  const { sub } = leerToken(ACCESS_TOKEN);
  // El nombre lo entrega el dominio User (getUsersByIds); mientras tanto se muestra genérico.
  return { token: ACCESS_TOKEN, userId: Number(sub) || null, initials: 'T', name: 'Trabajador' };
}
