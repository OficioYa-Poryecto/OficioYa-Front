// Ruta de login que entrega Identity.
export const LOGIN_PATH = '/acceso';

// Única salida cuando la API responde 401 (sin sesión o token vencido).
export function redirectToLogin() {
  if (window.location.pathname !== LOGIN_PATH) {
    window.location.assign(LOGIN_PATH);
  }
}
