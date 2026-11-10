// Datos de ejemplo en memoria con la MISMA forma que las respuestas del back de Worker
// (WorkerResponse, TradeResponse, ...). Solo se usan con VITE_USE_MOCKS=true.
// Se pierden al recargar la página.

const categorias = {
  tecnicos: { id: 1, name: 'Técnicos', detail: 'Oficios técnicos para el hogar y los negocios' },
  profesores: { id: 2, name: 'Profesores', detail: 'Clases y acompañamiento educativo' },
  mascotas: { id: 3, name: 'Cuidadores de mascotas', detail: 'Cuidado y bienestar de animales de compañía' },
  hogar: { id: 4, name: 'Hogar', detail: 'Mantenimiento y mejora de espacios' },
};

const oficios = [
  { id: 1, name: 'Plomería', description: 'Instalaciones y reparaciones', active: true, category: categorias.tecnicos },
  { id: 2, name: 'Electricidad', description: 'Instalaciones y mantenimiento eléctrico', active: true, category: categorias.tecnicos },
  { id: 3, name: 'Carpintería', description: 'Muebles, puertas y reparaciones en madera', active: true, category: categorias.hogar },
  { id: 4, name: 'Pintura', description: 'Pintura interior y exterior', active: true, category: categorias.hogar },
  { id: 5, name: 'Clases de matemáticas', description: 'Clases particulares y refuerzos', active: true, category: categorias.profesores },
  { id: 6, name: 'Cuidado de mascotas', description: 'Visitas y cuidado en casa', active: true, category: categorias.mascotas },
  { id: 7, name: 'Reparación de electrodomésticos', description: 'Diagnóstico y reparación', active: false, category: categorias.tecnicos },
];

// Las zonas son del dominio User; aquí solo para poder usar las pantallas.
const zonas = [
  { id: 1, name: 'Chapinero' },
  { id: 2, name: 'Teusaquillo' },
  { id: 3, name: 'La Soledad' },
  { id: 4, name: 'Galerías' },
  { id: 5, name: 'La Candelaria' },
  { id: 6, name: 'Modelia' },
  { id: 7, name: 'Cedritos' },
  { id: 8, name: 'Quinta Paredes' },
  { id: 9, name: 'San Luis' },
  { id: 10, name: 'Normandía' },
];

// Usados solo por las maquetas antiguas (Gallery y ScheduleEditor).
export const FOTOS_EJEMPLO = [
  { src: 'https://images.unsplash.com/photo-1676210134188-4c05dd172f89?auto=format&fit=crop&w=900&q=85', alt: 'Instalación de tubería en una pared' },
  { src: 'https://images.unsplash.com/photo-1676210133055-eab6ef033ce3?auto=format&fit=crop&w=900&q=85', alt: 'Reparación de tubería bajo un lavaplatos' },
  { src: 'https://images.unsplash.com/photo-1676210134190-3f2c0d5cf58d?auto=format&fit=crop&w=900&q=85', alt: 'Mantenimiento de calentador de agua' },
  { src: 'https://images.unsplash.com/photo-1454988501794-2992f706932e?auto=format&fit=crop&w=900&q=85', alt: 'Herramientas de trabajo organizadas' },
];

export const HORARIO_EJEMPLO = [
  ['Lun', '8:00 a. m. – 5:00 p. m.'],
  ['Mar', '8:00 a. m. – 5:00 p. m.'],
  ['Mié', '8:00 a. m. – 5:00 p. m.'],
  ['Jue', '8:00 a. m. – 5:00 p. m.'],
  ['Vie', '8:00 a. m. – 3:00 p. m.'],
  ['Sáb', '9:00 a. m. – 1:00 p. m.'],
  ['Dom', 'No disponible'],
];

let perfil = null;
let siguienteId = 100;

// Simula la red: respuesta asíncrona y copia de los datos, como haría el back.
function responder(valor) {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(valor)), 150));
}

function fallar(status, message) {
  const error = new Error(message);
  error.status = status;
  return Promise.reject(error);
}

function buscarOficio(tradeId) {
  return oficios.find((oficio) => oficio.id === Number(tradeId));
}

function todosLosOficios() {
  return [perfil.primaryTrade, ...perfil.secondaryTrades];
}

function nuevoOficioDelTrabajador({ tradeId, approxRate, rateUnit }) {
  return { id: siguienteId++, approxRate, rateUnit, trade: buscarOficio(tradeId) };
}

// ---- Perfil ----

export function getMyWorker() {
  return responder(perfil);
}

export function getWorker(id) {
  return perfil && perfil.id === Number(id) ? responder(perfil) : fallar(404, 'Trabajador no encontrado');
}

export function createWorker({ availableNow, zoneIds, primaryTrade }) {
  if (perfil) return fallar(409, 'Ya tienes un perfil de trabajador');
  perfil = {
    id: siguienteId++,
    userId: 99,
    status: 'ACTIVE',
    availableNow,
    zoneIds: [...zoneIds],
    primaryTrade: nuevoOficioDelTrabajador(primaryTrade),
    secondaryTrades: [],
    slots: [],
    photos: [],
  };
  return responder(perfil);
}

export function updateAvailableNow(workerId, availableNow) {
  perfil.availableNow = availableNow;
  return responder(perfil);
}

export function updateStatus(workerId, status) {
  perfil.status = status;
  if (status === 'PAUSED') perfil.availableNow = false;
  return responder(perfil);
}

// ---- Zonas ----

export function addZone(workerId, zoneId) {
  if (!perfil.zoneIds.includes(zoneId)) perfil.zoneIds.push(zoneId);
  return responder(null);
}

export function removeZone(workerId, zoneId) {
  perfil.zoneIds = perfil.zoneIds.filter((id) => id !== zoneId);
  return responder(null);
}

// ---- Oficios del trabajador ----

export function addTrade(workerId, datos) {
  if (todosLosOficios().some((item) => item.trade.id === Number(datos.tradeId))) {
    return fallar(409, 'Ya ofreces este oficio');
  }
  const nuevo = nuevoOficioDelTrabajador(datos);
  perfil.secondaryTrades.push(nuevo);
  return responder(nuevo);
}

export function updateTrade(workerId, workerTradeId, { approxRate, rateUnit }) {
  const item = todosLosOficios().find((oficio) => oficio.id === workerTradeId);
  Object.assign(item, { approxRate, rateUnit });
  return responder(item);
}

export function removeTrade(workerId, workerTradeId) {
  perfil.secondaryTrades = perfil.secondaryTrades.filter((item) => item.id !== workerTradeId);
  return responder(null);
}

export function setPrimaryTrade(workerId, workerTradeId) {
  const nuevoPrincipal = perfil.secondaryTrades.find((item) => item.id === workerTradeId);
  perfil.secondaryTrades = [perfil.primaryTrade, ...perfil.secondaryTrades.filter((item) => item.id !== workerTradeId)];
  perfil.primaryTrade = nuevoPrincipal;
  return responder(nuevoPrincipal);
}

// ---- Franjas de disponibilidad ----

export function createSlot(workerId, franja) {
  const nueva = { ...franja, id: siguienteId++ };
  perfil.slots.push(nueva);
  return responder(nueva);
}

export function updateSlot(workerId, slotId, franja) {
  perfil.slots = perfil.slots.map((slot) => (slot.id === slotId ? { ...franja, id: slotId } : slot));
  return responder({ ...franja, id: slotId });
}

export function deleteSlot(workerId, slotId) {
  perfil.slots = perfil.slots.filter((slot) => slot.id !== slotId);
  return responder(null);
}

// ---- Fotos ----

export function addPhoto(workerId, { url, description }) {
  const foto = { id: siguienteId++, url, description, uploadedAt: new Date().toISOString() };
  perfil.photos.push(foto);
  return responder(foto);
}

export function deletePhoto(workerId, photoId) {
  perfil.photos = perfil.photos.filter((photo) => photo.id !== photoId);
  return responder(null);
}

// ---- Catálogos ----

export function listTrades() {
  return responder(oficios.filter((oficio) => oficio.active));
}

export function listZones() {
  return responder(zonas);
}
