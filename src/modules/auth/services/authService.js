import { request } from '../../core/lib/httpClient';

/** POST /api/v1/auth/login → { token, expiresInSeconds, userId, roles } */
export function login({ email, password }) {
  return request('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

/** POST /api/v1/auth/register → UserDto */
export function register({ name, email, password, roles, phones }) {
  return request('/auth/register', {
    method: 'POST',
    body: { name, email, password, roles, phones },
  });
}

/** PUT /api/v1/auth/change → void */
export function changePassword({ currentPassword, newPassword }) {
  return request('/auth/change', {
    method: 'PUT',
    body: { currentPassword, newPassword },
  });
}

/** POST /api/v1/auth/forgot → void */
export function forgotPassword({ email }) {
  return request('/auth/forgot', {
    method: 'POST',
    body: { email },
  });
}

/** POST /api/v1/auth/reset → void */
export function resetPassword({ email, code, newPassword }) {
  return request('/auth/reset', {
    method: 'POST',
    body: { email, code, newPassword },
  });
}

/**
 * Consulta GET /api/v1/workers/me para saber si el usuario con rol TRABAJADOR
 * ya completó su perfil de trabajador.
 * - Devuelve false únicamente cuando el servicio responde 404 (perfil aún no creado).
 * - Si existe (200) o si el microservicio de Workers no está disponible en local, devuelve true
 *   para no bloquear la entrada a /home.
 */
export async function hasWorkerProfile() {
  try {
    await request('/workers/me');
    return true;
  } catch (err) {
    if (err.status === 404) {
      return false;
    }
    return true;
  }
}
