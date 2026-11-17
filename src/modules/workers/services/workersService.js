// Acceso a datos del dominio Worker. Las pantallas importan SOLO de aquí.
// Rutas relativas a /api/v1 (las agrega httpClient).
import { request } from '../../core/lib/httpClient';
import { getToken } from '../../core/lib/session';
import { deleteImage, imageIdFromUrl, uploadImage, imageUrl } from './imagesClient';

// httpClient ya agrega el token y redirige a /auth si vence la sesión.
const call = (path, options) => request(path, options);

const json = (method, body) => ({ method, body });

const realApi = {
  // Ids de Worker (trabajador, oficio, franja, foto) = UUID en texto; las zonas siguen siendo números.
  // ---- Perfil ----
  // null = el usuario todavía no tiene perfil de trabajador (404).
  async getMyWorker() {
    try {
      return await call('/workers/me');
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
  },
  getWorker: (id) => call(`/workers/${id}`),
  // datos = { availableNow, zoneIds, primaryTrade: { tradeId, approxRate, rateUnit } }
  // El userId no viaja: el back lo toma del token.
  createWorker: (values) => call('/workers', json('POST', values)),
  updateAvailableNow: (workerId, availableNow) =>
    call(`/workers/${workerId}/availability-now`, json('PUT', { availableNow })),
  updateStatus: (workerId, status) => call(`/workers/${workerId}/status`, json('PUT', { status })),

  // ---- Zonas ----
  addZone: (workerId, zoneId) => call(`/workers/${workerId}/zones/${zoneId}`, { method: 'PUT' }),
  removeZone: (workerId, zoneId) => call(`/workers/${workerId}/zones/${zoneId}`, { method: 'DELETE' }),

  // ---- Oficios del trabajador ----
  // datos = { tradeId, approxRate, rateUnit }
  addTrade: (workerId, values) => call(`/workers/${workerId}/trades`, json('POST', values)),
  updateTrade: (workerId, workerTradeId, { approxRate, rateUnit }) =>
    call(`/workers/${workerId}/trades/${workerTradeId}`, json('PUT', { approxRate, rateUnit })),
  removeTrade: (workerId, workerTradeId) =>
    call(`/workers/${workerId}/trades/${workerTradeId}`, { method: 'DELETE' }),
  setPrimaryTrade: (workerId, workerTradeId) =>
    call(`/workers/${workerId}/primary-trade/${workerTradeId}`, { method: 'PUT' }),

  // ---- Franjas de disponibilidad ----
  // franja = { recurrenceType, dayOfWeek, startDate, endDate, startTime, endTime }
  createSlot: (workerId, slot) => call(`/workers/${workerId}/availability-slots`, json('POST', slot)),
  updateSlot: (workerId, slotId, slot) =>
    call(`/workers/${workerId}/availability-slots/${slotId}`, json('PUT', slot)),
  deleteSlot: (workerId, slotId) =>
    call(`/workers/${workerId}/availability-slots/${slotId}`, { method: 'DELETE' }),

  // ---- Fotos ----
  addPhoto: (workerId, { url, description }) => call(`/workers/${workerId}/photos`, json('POST', { url, description })),
  deletePhoto: (workerId, photoId) => call(`/workers/${workerId}/photos/${photoId}`, { method: 'DELETE' }),

  // Galería con el servicio de imágenes: el archivo se sube allá (tipo WORK, rootId = id del trabajador)
  // y Worker solo guarda la URL. Si Worker falla, se borra la imagen para no dejarla huérfana.
  async uploadGalleryPhoto(workerId, file, description) {
    const token = getToken();
    const image = await uploadImage(file, { tipo: 'WORK', rootId: workerId, token });
    try {
      return await realApi.addPhoto(workerId, { url: imageUrl(image.id), description });
    } catch (error) {
      await deleteImage(image.id, { token }).catch(() => {});
      throw error;
    }
  },
  // Quita la foto de Worker y, si la imagen vive en el servicio de imágenes, también allá.
  async deleteGalleryPhoto(workerId, photo) {
    await realApi.deletePhoto(workerId, photo.id);
    const imageId = imageIdFromUrl(photo.url);
    if (imageId) await deleteImage(imageId, { token: getToken() }).catch(() => {});
  },

  // ---- Catálogos ----
  listTrades: () => call('/trades?active=true'),
  
  // Las zonas son del dominio User.
  listZones: () => call('/zones'),
};

export const {
  getMyWorker,
  getWorker,
  createWorker,
  updateAvailableNow,
  updateStatus,
  addZone,
  removeZone,
  addTrade,
  updateTrade,
  removeTrade,
  setPrimaryTrade,
  createSlot,
  updateSlot,
  deleteSlot,
  addPhoto,
  deletePhoto,
  uploadGalleryPhoto,
  deleteGalleryPhoto,
  listTrades,
  listZones,
} = realApi;
