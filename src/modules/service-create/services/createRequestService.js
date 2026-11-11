import { request } from '../../core/lib/httpClient';

export const createRequestService = {
  create: async (payload, token) => {
    const result = await request('/requests', { method: 'PUT', body: payload, token });
    const sent = typeof result?.sent === 'number' ? result.sent : (result?.workersId?.length ?? 0);
    if (sent < 1) {
      throw new Error(
        'La solicitud no se envió a ningún trabajador. Prueba con otros trabajadores.',
      );
    }
    return { ...result, sent };
  },
};

export function describeSendError(error) {
  switch (error.status) {
    case 401:
    case 403:
      return 'Tu sesión no es válida o expiró. Vuelve a iniciar sesión.';
    case 413:
      return 'Las fotos pesan demasiado para enviarlas. Quita alguna e inténtalo de nuevo.';
    case 502:
    case 503:
    case 504:
      return 'No pudimos conectar con el servidor. Inténtalo de nuevo en un momento.';
    default:
      return error.message || 'No pudimos enviar la solicitud. Inténtalo de nuevo.';
  }
}