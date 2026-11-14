import { getToken } from './session';

const IMAGES_BASE = '/api/v1/images';

/**
 * Sube una imagen al microservicio de imágenes (POST /api/v1/images).
 * No fuerza Content-Type para que el navegador adjunte el boundary multipart/form-data.
 */
export async function uploadImage({ file, rootId, tipo = 'PROFILE', token }) {
  const jwt = token || getToken();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('rootId', String(rootId));
  formData.append('tipo', tipo);

  const headers = {};
  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`;
  }

  const response = await fetch(IMAGES_BASE, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    const error = new Error(
      errBody.message || errBody.error || `Error al subir la imagen (${response.status})`
    );
    error.status = response.status;
    throw error;
  }

  return response.json();
}

/**
 * Consulta las imágenes activas de una entidad (GET /api/v1/images/by-root/{rootId}?tipo=...).
 */
export async function getImagesByRoot(rootId, { tipo = 'PROFILE', token } = {}) {
  if (!rootId) return [];
  const jwt = token || getToken();
  const headers = {};
  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`;
  }

  const query = tipo ? `?tipo=${encodeURIComponent(tipo)}` : '';
  const response = await fetch(`${IMAGES_BASE}/by-root/${rootId}${query}`, {
    headers,
  });

  if (!response.ok) {
    return [];
  }

  const list = await response.json().catch(() => []);
  return Array.isArray(list) ? list : [];
}

/**
 * Obtiene la URL de la foto de perfil activa del usuario, o null si no tiene.
 */
export async function getProfilePhotoUrl(userId, token) {
  try {
    const list = await getImagesByRoot(userId, { tipo: 'PROFILE', token });
    if (list.length > 0 && list[0].url) {
      return list[0].url;
    }
    return null;
  } catch {
    return null;
  }
}

