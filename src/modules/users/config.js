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
    descripcion: 'Ofrece tus servicios y aparece en las búsquedas de quienes necesitan un oficio.',
    agregado: 'Ya eres trabajador.',
    detalle: 'Inicia sesión de nuevo para completar tu perfil de trabajador.',
  },
  CONTRATANTE: {
    boton: 'Quiero ser contratante',
    descripcion: 'Solicita servicios a trabajadores con esta misma cuenta.',
    agregado: 'Ya eres contratante.',
    detalle: 'Ya puedes solicitar servicios con esta misma cuenta.',
  },
};

// Botón y confirmación para quitar un rol cuando la cuenta tiene ambos
export const ROLES_QUITABLES = {
  TRABAJADOR: {
    boton: 'Quiero dejar de ser trabajador',
    descripcion: 'Tu perfil de trabajador se pausa y deja de aparecer en búsquedas.',
    aviso: 'No puedes tener solicitudes activas como trabajador.',
    titulo: '¿Dejar de ser trabajador?',
    texto: 'Tu perfil se pausará y no aparecerá en búsquedas. Puedes reactivarlo cuando quieras.',
    quitado: 'Ya no eres trabajador.',
  },
  CONTRATANTE: {
    boton: 'Quiero dejar de ser contratante',
    descripcion: 'Ya no podrás solicitar servicios con esta cuenta.',
    aviso: 'No puedes tener solicitudes activas como contratante.',
    titulo: '¿Dejar de ser contratante?',
    texto: 'No podrás solicitar servicios hasta que vuelvas a ser contratante.',
    quitado: 'Ya no eres contratante.',
  },
};

// Nombre legible de cada rol (perfil, edición y listado del admin)
export const NOMBRES_ROL = {
  CONTRATANTE: 'Contratante',
  TRABAJADOR: 'Trabajador',
  ADMIN: 'Administrador',
};