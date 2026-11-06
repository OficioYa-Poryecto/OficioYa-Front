import { request } from '../../core/lib/httpClient';

const BASE = '/requests';

// Único punto de acceso a /api/v1/requests (microservicio de solicitudes).
// Cada función recibe el token JWT del usuario actual.
export const requestsService = {
  // Solicitudes del usuario autenticado (CONTRATANTE o TRABAJADOR)
  listMine: (token) => request(BASE, { token }),

  // TRABAJADOR
  accept: (id, token) => request(`${BASE}/${id}/accept`, { method: 'PATCH', token }),
  reject: (id, token) => request(`${BASE}/${id}/reject`, { method: 'PATCH', token }),
  complete: (id, token) => request(`${BASE}/${id}/complete`, { method: 'PATCH', token }),

  // CONTRATANTE
  acceptConflict: (id, token) =>
    request(`${BASE}/${id}/accept-conflict`, { method: 'PATCH', token }),

  // CONTRATANTE o TRABAJADOR
  cancel: (id, token) => request(`${BASE}/${id}/cancel`, { method: 'PATCH', token }),

  // CONTRATANTE. El back responde texto plano ("Request deleted"), no JSON,
  // y httpClient intenta leerlo como JSON: ese SyntaxError no es un fallo real.
  remove: async (id, token) => {
    try {
      await request(`${BASE}/${id}`, { method: 'DELETE', token });
    } catch (error) {
      if (!(error instanceof SyntaxError)) {
        throw error;
      }
    }
  },
};