// true = las pantallas usan datos de ejemplo en memoria (services/mockWorkerApi.js).
// false = llaman al back de Worker por httpClient.
// En desarrollo viene de .env.development (true). En el build de producción no se define,
// así que el despliegue usa la API real sin tocar código.
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

// Token de acceso (JWT con el formato de Identity), igual que el módulo users.
// Se reemplaza por la sesión de Identity (useAuth) cuando la entreguen.
export const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN ?? '';
