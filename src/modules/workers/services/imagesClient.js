// Cliente compartido del microservicio de imagenes (repo OficioYa-Poryecto/oficioYa-images).
// Lo puede usar cualquier dominio: Users (foto de perfil), Worker (galeria y evidencias),
// Solicitudes, Resenas y Reportes. Cada dominio pasa su propio token de sesion.
//

// Origen del orquestador (VITE_API_URL); acepta el valor con o sin "/api/v1" al final.
const API_ORIGIN = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/+$/, '').replace(/\/api\/v1$/, '');
const IMAGES_BASE = API_ORIGIN ? `${API_ORIGIN}/api/v1/images` : '/api/v1/images';

// Mismos tipos y limites que ImageType en el back (imagenes activas por rootId).
export const IMAGE_TYPES = {
  PROFILE: { max: 1, uso: 'Foto de perfil (rootId = id del usuario); la nueva reemplaza a la anterior' },
  WORK: { max: 50, uso: 'Galeria de trabajos (rootId = id del trabajador)' },
  SERVICE_EVIDENCE: { max: 5, uso: 'Fotos al completar un servicio (rootId = id del servicio)' },
  REQUEST: { max: 5, uso: 'Fotos de una solicitud (rootId = id de la solicitud)' },
  REVIEW: { max: 5, uso: 'Fotos de una resena (rootId = id de la resena)' },
  REPORT: { max: 5, uso: 'Evidencias de un reporte (rootId = id del reporte)' },
};

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

/** Validacion previa en el navegador (el back vuelve a validar por el contenido real). Devuelve '' si es valida. */
export function validateImageFile(file) {
  if (!file) return 'Selecciona una imagen';
  if (!IMAGE_FORMATS.includes(file.type)) return 'Solo se aceptan imagenes JPG, PNG o WebP';
  if (file.size > MAX_IMAGE_BYTES) return 'La imagen no puede pesar mas de 5 MB';
  return '';
}

async function send(path, { method = 'GET', body, token } = {}) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  let response;
  try {
    // Con FormData el navegador pone el Content-Type multipart con su boundary
    response = await fetch(IMAGES_BASE + path, { method, headers, body });
  } catch {
    throw new Error('No se pudo conectar con el servicio de imagenes');
  }
  if (!response.ok) {
    const apiError = await response.json().catch(() => ({}));
    const error = new Error(apiError.message ?? apiError.error ?? `Error ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? null : response.json();
}

function buildFormData(campos) {
  const data = new FormData();
  Object.entries(campos).forEach(([clave, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) value.forEach((item) => data.append(clave, item));
    else data.append(clave, value);
  });
  return data;
}

/** Sube una imagen. Devuelve los metadatos: { id, rootId, tipo, nombre, url, subidoPor, ... } */
export function uploadImage(file, { tipo, rootId, referenciaExterna, token }) {
  return send('', { method: 'POST', token, body: buildFormData({ file, rootId, tipo, referenciaExterna }) });
}

/** Sube varias imagenes de una vez (respeta el limite del tipo; PROFILE solo admite una). */
export function uploadImages(files, { tipo, rootId, referenciaExterna, token }) {
  return send('/batch', { method: 'POST', token, body: buildFormData({ files, rootId, tipo, referenciaExterna }) });
}

/** Lista las imagenes activas de una entidad, opcionalmente filtradas por tipo. */
export function listImages(rootId, { tipo, token } = {}) {
  const query = tipo ? `?tipo=${encodeURIComponent(tipo)}` : '';
  return send(`/by-root/${rootId}${query}`, { token });
}

/** Borrado logico; solo quien subio la imagen o un ADMIN. */
export function deleteImage(id, { token } = {}) {
  return send(`/${id}`, { method: 'DELETE', token });
}

/** URL absoluta de la imagen (Worker exige http/https). Falla si falta VITE_API_URL. */
export function imageUrl(id) {
  if (!API_ORIGIN) throw new Error('Falta configurar VITE_API_URL: no se puede guardar la foto.');
  return `${API_ORIGIN}${IMAGES_BASE}/${id}`;
}

/** Id de la imagen si la URL es de este servicio; null si es una URL externa. */
export function imageIdFromUrl(url) {
  const match = typeof url === 'string' ? url.match(/\/api\/v1\/images\/([0-9a-f-]{36})(?:[/?#]|$)/i) : null;
  return match ? match[1] : null;
}
