// Cliente compartido del microservicio de imagenes (repo OficioYa-Poryecto/oficioYa-images).
// Lo puede usar cualquier dominio: Users (foto de perfil), Worker (galeria y evidencias),
// Solicitudes, Resenas y Reportes. Cada dominio pasa su propio token de sesion.
//

const IMAGES_BASE = '/api/v1/images';

// Origen del orquestador (VITE_API_URL); acepta el valor con o sin "/api/v1" al final.
const API_ORIGIN = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/+$/, '').replace(/\/api\/v1$/, '');

// Mismos tipos y limites que ImageType en el back (imagenes activas por rootId).
export const TIPOS_IMAGEN = {
  PROFILE: { max: 1, uso: 'Foto de perfil (rootId = id del usuario); la nueva reemplaza a la anterior' },
  WORK: { max: 50, uso: 'Galeria de trabajos (rootId = id del trabajador)' },
  SERVICE_EVIDENCE: { max: 5, uso: 'Fotos al completar un servicio (rootId = id del servicio)' },
  REQUEST: { max: 5, uso: 'Fotos de una solicitud (rootId = id de la solicitud)' },
  REVIEW: { max: 5, uso: 'Fotos de una resena (rootId = id de la resena)' },
  REPORT: { max: 5, uso: 'Evidencias de un reporte (rootId = id del reporte)' },
};

export const MAX_BYTES_IMAGEN = 5 * 1024 * 1024;
export const FORMATOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp'];

/** Validacion previa en el navegador (el back vuelve a validar por el contenido real). Devuelve '' si es valida. */
export function validarArchivoImagen(file) {
  if (!file) return 'Selecciona una imagen';
  if (!FORMATOS_IMAGEN.includes(file.type)) return 'Solo se aceptan imagenes JPG, PNG o WebP';
  if (file.size > MAX_BYTES_IMAGEN) return 'La imagen no puede pesar mas de 5 MB';
  return '';
}

async function enviar(path, { method = 'GET', body, token } = {}) {
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

function formulario(campos) {
  const data = new FormData();
  Object.entries(campos).forEach(([clave, valor]) => {
    if (valor === undefined || valor === null || valor === '') return;
    if (Array.isArray(valor)) valor.forEach((item) => data.append(clave, item));
    else data.append(clave, valor);
  });
  return data;
}

/** Sube una imagen. Devuelve los metadatos: { id, rootId, tipo, nombre, url, subidoPor, ... } */
export function subirImagen(file, { tipo, rootId, referenciaExterna, token }) {
  return enviar('', { method: 'POST', token, body: formulario({ file, rootId, tipo, referenciaExterna }) });
}

/** Sube varias imagenes de una vez (respeta el limite del tipo; PROFILE solo admite una). */
export function subirImagenes(files, { tipo, rootId, referenciaExterna, token }) {
  return enviar('/batch', { method: 'POST', token, body: formulario({ files, rootId, tipo, referenciaExterna }) });
}

/** Lista las imagenes activas de una entidad, opcionalmente filtradas por tipo. */
export function listarImagenes(rootId, { tipo, token } = {}) {
  const query = tipo ? `?tipo=${encodeURIComponent(tipo)}` : '';
  return enviar(`/by-root/${rootId}${query}`, { token });
}

/** Borrado logico; solo quien subio la imagen o un ADMIN. */
export function borrarImagen(id, { token } = {}) {
  return enviar(`/${id}`, { method: 'DELETE', token });
}

/** URL absoluta de la imagen (Worker exige http/https). Falla si falta VITE_API_URL. */
export function urlImagen(id) {
  if (!API_ORIGIN) throw new Error('Falta configurar VITE_API_URL: no se puede guardar la foto.');
  return `${API_ORIGIN}${IMAGES_BASE}/${id}`;
}

/** Id de la imagen si la URL es de este servicio; null si es una URL externa. */
export function idDeUrlImagen(url) {
  const match = typeof url === 'string' ? url.match(/\/api\/v1\/images\/([0-9a-f-]{36})(?:[/?#]|$)/i) : null;
  return match ? match[1] : null;
}
