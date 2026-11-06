import { request } from '../../core/lib/httpClient';

export function obtenerMiPerfil(token) {
  return request('/users/me', { token });
}

export function actualizarMiPerfil(datos, token) {
  return request('/users/me', { method: 'PATCH', body: datos, token });
}

export function agregarRol(rol, token) {
  return request(`/users/me/roles/${rol}`, { method: 'POST', token });
}

export function obtenerPerfilPublico(id, token) {
  return request(`/users/${id}`, { token });
}
