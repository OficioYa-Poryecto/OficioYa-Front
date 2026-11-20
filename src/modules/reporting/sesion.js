import { getSession } from '../core/lib/session';

// Sesión del login real (Identity), guardada por el módulo auth.
// Solo decide qué mostrar: la seguridad real la aplica el back con el token.
export function leerSesion() {
  const sesion = getSession();
  const roles = (sesion?.roles ?? []).map((rol) => String(rol).toUpperCase().replace('ROLE_', ''));
  return { token: sesion?.token ?? '', roles };
}
