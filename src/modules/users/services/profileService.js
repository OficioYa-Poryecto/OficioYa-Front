import { request } from '../../core/lib/httpClient';
import { saveSession } from '../../core/lib/session';

export function obtenerMiPerfil(token) {
  return request('/users/me', { token });
}

export function actualizarMiPerfil(datos, token) {
  return request('/users/me', { method: 'PATCH', body: datos, token });
}

export async function agregarRol(rol, token) {
  const data = await request(`/users/me/roles/${rol}`, { method: 'POST', token });
  if (data?.token) {
    saveSession({
      token: data.token,
      userId: data.id,
      roles: data.roles,
    });
    window.dispatchEvent(new Event('oy-profile-updated'));
  } else {
    try {
      const refreshed = await request('/auth/refresh', { method: 'POST', token });
      if (refreshed?.token) {
        saveSession({
          token: refreshed.token,
          userId: refreshed.userId,
          roles: refreshed.roles,
        });
        window.dispatchEvent(new Event('oy-profile-updated'));
      }
    } catch {
      // Si el endpoint no responde se conserva la sesion previa
    }
  }
  return data;
}

export async function quitarRol(rol, token) {
  const data = await request(`/users/me/roles/${rol}`, { method: 'DELETE', token });
  if (data?.token) {
    saveSession({
      token: data.token,
      userId: data.id,
      roles: data.roles,
    });
    window.dispatchEvent(new Event('oy-profile-updated'));
  } else {
    try {
      const refreshed = await request('/auth/refresh', { method: 'POST', token });
      if (refreshed?.token) {
        saveSession({
          token: refreshed.token,
          userId: refreshed.userId,
          roles: refreshed.roles,
        });
        window.dispatchEvent(new Event('oy-profile-updated'));
      }
    } catch {
      // Si el endpoint no responde se conserva la sesion previa
    }
  }
  return data;
}

export function obtenerMisTelefonos(token) {
  return request('/users/me/phones', { token });
}

export function agregarTelefono(numero, token) {
  return request('/users/me/phones', { method: 'POST', body: { number: numero }, token });
}

export function cambiarTelefono(id, numero, token) {
  return request(`/users/me/phones/${id}`, { method: 'PATCH', body: { number: numero }, token });
}

export function eliminarTelefono(id, token) {
  return request(`/users/me/phones/${id}`, { method: 'DELETE', token });
}

export function obtenerPerfilPublico(id, token) {
  return request(`/users/${id}`, { token });
}

export function listarLocalidades() {
  return request('/localities');
}