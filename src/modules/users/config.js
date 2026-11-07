// Token de acceso (JWT) con el formato de Identity.
// Se genera con scripts/generar-token.js, que lo guarda en .env.local
export const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN ?? '';
