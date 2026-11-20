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

/** ADMIN: reportes de reseñas, opcionalmente por estado (PENDIENTE, EN_REVISION, RESUELTO). */
export function listarReportes(estado, token) {
  const consulta = estado ? `?estado=${encodeURIComponent(estado)}` : '';
  return request(`${BASE}/reportes${consulta}`, { token });
}

/** Una reseña por su código, para que el ADMIN vea qué se reportó. */
export function obtenerResena(codigo, token) {
  return request(`${BASE}/resenas/${codigo}`, { token });
}

/** ADMIN: resuelve un reporte retirando (RESENA_RETIRADA) o manteniendo (RESENA_MANTENIDA) la reseña. */
export function resolverReporte(reporteId, resultado, token) {
  return request(`${BASE}/reportes/${reporteId}/resolucion`, {
    method: 'POST',
    body: { resultado },
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
