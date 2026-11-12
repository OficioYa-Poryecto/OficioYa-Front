import { request } from '../../core/lib/httpClient';

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

// Cambia a false cuando el backend de Worker esté disponible
const USE_MOCK = true;

export const workersService = {
  isMock: USE_MOCK,

  // Búsqueda de trabajadores por zona/fecha/hora
  search: async ({ neighborhood, date, time }) => {
    if (USE_MOCK) {
      await wait(700);
      const key = neighborhood.trim().toLowerCase();
      if (key === 'error') {
        throw new Error('No pudimos consultar los trabajadores. Intenta de nuevo.');
      }
      if (key === 'sin trabajadores') {
        return [];
      }
      return MOCK_WORKERS;
    }

    // Integración real (Worker backend)
    const params = new URLSearchParams({ neighborhood, date, time });
    return request(`/workers/search?${params.toString()}`);
  },

  // Disponibilidad de un trabajador para una fecha/hora específica
  getAvailability: async (workerId, { date, time, token }) => {
    if (USE_MOCK) {
      await wait(300);
      return { workerId, available: true, nextSlot: time };
    }
    const params = new URLSearchParams({ date, time });
    return request(`/workers/${workerId}/availability?${params.toString()}`, { token });
  },
};