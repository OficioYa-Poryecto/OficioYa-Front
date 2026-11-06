// Lee el rol del payload del JWT solo para decidir qué botones mostrar.
// La seguridad real la aplica el back; esto no valida la firma.
export function decodeRole(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload)).role ?? '';
  } catch {
    return '';
  }
}