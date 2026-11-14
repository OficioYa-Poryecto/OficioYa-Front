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

// Teléfonos completos (sin enmascarar) del dueño, para editarlos
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
