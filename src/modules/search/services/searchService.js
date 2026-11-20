import { request } from '../../core/lib/httpClient';

const BASE = '/search';

// Quita los filtros vacíos para no enviarlos al back.
function criterios(filtros) {
  return Object.fromEntries(
    Object.entries(filtros).filter(([, valor]) => valor !== '' && valor !== false && valor != null),
  );
}

export function listarOficios(token) {
  return request(`${BASE}/oficios`, { token });
}

export function buscarPorOficio(oficioId, filtros, token) {
  const consulta = new URLSearchParams(criterios(filtros));
  return request(`${BASE}/oficios/${oficioId}/trabajadores?${consulta}`, { token });
}

export function buscarPorTexto(texto, filtros, token) {
  const { barrioIds, ...resto } = criterios(filtros);
  const cuerpo = { ...resto, ...(barrioIds ? { barrioIds: [barrioIds] } : {}) };
  return request(`${BASE}/lenguaje-natural`, {
    method: 'POST',
    body: { texto, criterios: cuerpo },
    token,
  });
}
