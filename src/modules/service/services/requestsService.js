import { request } from '../../core/lib/httpClient';
import { decodeRole } from './jwt';

const BASE = '/requests';

// Cambia a false cuando el backend esté disponible
const USE_MOCK = true;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const day = (offset, hour) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

let mockRequests = [
  { id: '1', state: 'PENDING', description: 'Se rompió una tubería debajo del lavamanos. Gotea mucho.', scheduledDateTime: day(1, 10), neighborhood: 'Chapinero', exactAddress: 'Cra 7 # 45-12' },
  { id: '2', state: 'ACCEPTED', description: 'Instalar un ventilador de techo en la sala.', scheduledDateTime: day(2, 15), neighborhood: 'Usaquén', exactAddress: 'Calle 120 # 6-30' },
  { id: '3', state: 'CONFLICT', description: 'Cambiar cerradura de la puerta principal.', scheduledDateTime: day(3, 9), neighborhood: 'Teusaquillo', exactAddress: 'Cra 24 # 38-10' },
  { id: '4', state: 'COMPLETED', description: 'Pintar el cuarto de los niños.', scheduledDateTime: day(-2, 8), neighborhood: 'Suba', exactAddress: 'Calle 145 # 91-20' },
  { id: '5', state: 'CANCELED', description: 'Revisar instalación eléctrica del baño.', scheduledDateTime: day(-1, 14), neighborhood: 'Kennedy', exactAddress: 'Av. 1 de Mayo # 70-15' },
];

const setState = (id, state) => {
  mockRequests = mockRequests.map((r) => (r.id === id ? { ...r, state } : r));
};

const mockAction = (state) => async (id) => {
  await wait(300);
  setState(id, state);
  return null;
};

export const requestsService = {
  // Solicitudes del usuario autenticado (CONTRATANTE o TRABAJADOR)
  listMine: async (token) => {
    if (USE_MOCK) {
      await wait(500);
      // Para probar el estado de error, devuelve un rol "ERROR" en el token
      if (decodeRole(token) === 'ERROR') {
        throw new Error('No se pudo conectar con el servidor');
      }
      return [...mockRequests];
    }
    return request(BASE, { token });
  },

  // TRABAJADOR
  accept: (id, token) =>
    USE_MOCK ? mockAction('ACCEPTED')(id) : request(`${BASE}/${id}/accept`, { method: 'PATCH', token }),
  reject: (id, token) =>
    USE_MOCK ? mockAction('REJECTED')(id) : request(`${BASE}/${id}/reject`, { method: 'PATCH', token }),
  complete: (id, token) =>
    USE_MOCK ? mockAction('COMPLETED')(id) : request(`${BASE}/${id}/complete`, { method: 'PATCH', token }),

  // CONTRATANTE
  acceptConflict: (id, token) =>
    USE_MOCK
      ? mockAction('ACCEPTED')(id)
      : request(`${BASE}/${id}/accept-conflict`, { method: 'PATCH', token }),

  // CONTRATANTE o TRABAJADOR
  cancel: (id, token) =>
    USE_MOCK ? mockAction('CANCELED')(id) : request(`${BASE}/${id}/cancel`, { method: 'PATCH', token }),

  // CONTRATANTE. El back responde texto plano ("Request deleted"), no JSON,
  // y httpClient intenta leerlo como JSON: ese SyntaxError no es un fallo real.
  remove: async (id, token) => {
    if (USE_MOCK) {
      await wait(300);
      mockRequests = mockRequests.filter((r) => r.id !== id);
      return;
    }
    try {
      await request(`${BASE}/${id}`, { method: 'DELETE', token });
    } catch (error) {
      if (!(error instanceof SyntaxError)) {
        throw error;
      }
    }
  },
};
