import { request } from '../../core/lib/httpClient';

// RF-01: el front solo llama al registro de Identity (orquestador).
// Identity valida la contraseña, nos pide crear el perfil (POST /users con rol SERVICE) y guarda las credenciales.
export function registrarCuenta(datos) {
  return request('/auth/register', { method: 'POST', body: datos });
}

// RF-01: el correo y la contraseña los guarda Identity, no este microservicio.
// Pendiente: cuando exista la conexión con Identity, aquí se le envían (con el id del usuario creado)
// para que cree las credenciales. Por ahora no hace nada.
export async function registrarCredenciales(/* idUsuario, correo, contrasena */) {
  return null;
}

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
