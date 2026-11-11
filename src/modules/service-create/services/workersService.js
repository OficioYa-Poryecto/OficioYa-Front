// El backend aún no expone un endpoint de búsqueda de trabajadores por zona.
// Mientras tanto devuelve datos de prueba (isMock = true muestra un aviso en pantalla).
// Los ids son las identidades de trabajador del seed de Postman del servicio.
// Para probar estados: barrio "error" simula un fallo y "sin trabajadores" una zona vacía.
// Al integrar el endpoint real, se reemplaza `search` y se elimina isMock.
const MOCK_WORKERS = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Carlos Ramírez',
    trade: 'Plomero certificado',
    rating: 4.9,
    services: 128,
    distanceKm: 1.2,
    availability: 'Disponible ahora',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Miguel Torres',
    trade: 'Técnico hidráulico',
    rating: 4.8,
    services: 94,
    distanceKm: 2.1,
    availability: 'Disponible 10:00',
  },
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const workersService = {
  isMock: true,

  search: async ({ neighborhood }) => {
    await wait(700);
    const key = neighborhood.trim().toLowerCase();
    if (key === 'error') {
      throw new Error('No pudimos consultar los trabajadores. Intenta de nuevo.');
    }
    if (key === 'sin trabajadores') {
      return [];
    }
    return MOCK_WORKERS;
  },
};