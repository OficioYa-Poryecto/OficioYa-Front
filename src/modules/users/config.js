// Token de acceso (JWT) con el formato de Identity.
// Se genera con scripts/generar-token.js, que lo guarda en .env.local
export const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN ?? '';

// Mismas reglas que valida el back (PhoneDTO y UserService): celular de 10 dígitos que empieza por 3
export const MAX_TELEFONOS = 3;

export function validarTelefono(numero) {
  if (numero.trim() === '') {
    return 'Escribe el número';
  }
  if (!/^[0-9]*$/.test(numero)) {
    return 'Solo se permiten números';
  }
  if (!/^3[0-9]{9}$/.test(numero)) {
    return 'Ingrese un teléfono válido';
  }
  return null;
}

// Botón y mensaje para cada rol que el usuario todavía no tiene
export const ROLES_AGREGABLES = {
  TRABAJADOR: {
    boton: 'Agregar rol de trabajador',
    agregado: 'Rol de trabajador agregado.',
    detalle: 'Inicia sesión de nuevo para completar tu perfil de trabajador.',
  },
  CONTRATANTE: {
    boton: 'Agregar rol de contratante',
    agregado: 'Rol de contratante agregado.',
    detalle: 'Ya puedes solicitar servicios con esta misma cuenta.',
  },
};

// Nombre legible de cada rol (perfil, edición y listado del admin)
export const NOMBRES_ROL = {
  CONTRATANTE: 'Contratante',
  TRABAJADOR: 'Trabajador',
  ADMIN: 'Administrador',
};