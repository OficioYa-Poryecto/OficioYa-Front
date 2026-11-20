import { request } from '../../core/lib/httpClient';

const BASE = '/reputation';

export function obtenerReputacion(trabajadorId, token) {
  return request(`${BASE}/trabajadores/${trabajadorId}`, { token });
}

export function listarResenas(trabajadorId, token) {
  return request(`${BASE}/trabajadores/${trabajadorId}/resenas`, { token });
}

export function calificar(solicitudId, puntuacion, comentario, token) {
  return request(`${BASE}/resenas`, {
    method: 'POST',
    body: { solicitudId, puntuacion, ...(comentario ? { comentario } : {}) },
    token,
  });
}

export function reportarResena(codigo, motivo, descripcion, token) {
  return request(`${BASE}/resenas/${codigo}/reportes`, {
    method: 'POST',
    body: { motivo, ...(descripcion ? { descripcion } : {}) },
    token,
  });
}
