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
    boton: 'Quiero ser trabajador',
    agregado: 'Rol de trabajador agregado.',
    detalle: 'Inicia sesión de nuevo para completar tu perfil de trabajador.',
  },
  CONTRATANTE: {
    boton: 'Agregar rol de contratante',
    agregado: 'Rol de contratante agregado.',
    detalle: 'Ya puedes solicitar servicios con esta misma cuenta.',
  },
};

// Botón y confirmación para quitar un rol cuando la cuenta tiene ambos
export const ROLES_QUITABLES = {
  TRABAJADOR: {
    boton: 'Dejar de ser trabajador',
    descripcion: 'Tu perfil de trabajador se pausa y deja de aparecer en búsquedas. No puedes tener solicitudes activas como trabajador.',
    titulo: '¿Dejar de ser trabajador?',
    texto: 'Tu perfil de trabajador quedará pausado y no aparecerá en las búsquedas. No se borran tus datos y puedes volver a activarlo cuando quieras.',
    quitado: 'Ya no eres trabajador.',
  },
  CONTRATANTE: {
    boton: 'Dejar de ser contratante',
    descripcion: 'Ya no podrás solicitar servicios con esta cuenta. No puedes tener solicitudes activas como contratante.',
    titulo: '¿Dejar de ser contratante?',
    texto: 'Ya no podrás solicitar servicios con esta cuenta hasta que vuelvas a agregar el rol.',
    quitado: 'Ya no eres contratante.',
  },
};

// Nombre legible de cada rol (perfil, edición y listado del admin)
export const NOMBRES_ROL = {
  CONTRATANTE: 'Contratante',
  TRABAJADOR: 'Trabajador',
  ADMIN: 'Administrador',
};