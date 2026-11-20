import { request } from '../../core/lib/httpClient';

const BASE = '/reporting/reportes/GENERAL';

function periodo({ desde, hasta }) {
  return new URLSearchParams({ ...(desde ? { desde } : {}), ...(hasta ? { hasta } : {}) });
}

export function obtenerResumen(rango, token) {
  return request(`${BASE}?${periodo(rango)}`, { token });
}

export function exportarCsv(rango, token) {
  const consulta = periodo(rango);
  consulta.set('formato', 'CSV');
  return request(`${BASE}/exportacion?${consulta}`, { token, responseType: 'blob' });
}
