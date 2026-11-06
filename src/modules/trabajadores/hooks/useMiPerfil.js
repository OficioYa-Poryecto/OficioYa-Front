import { useSyncExternalStore } from 'react';
import { obtenerCuenta } from '../services/trabajadoresService';

// Perfil en memoria compartido entre las pantallas del trabajador, con la misma forma
// que WorkerResponse. Se pierde al recargar y se reemplaza al conectar el microservicio Worker.
let perfil = null;
const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function guardarPerfil(siguiente) {
  perfil = siguiente;
  listeners.forEach((listener) => listener());
}

function crearPerfil({ trade, approxRate, rateUnit, zoneIds, availableNow }) {
  guardarPerfil({
    id: 99,
    userId: obtenerCuenta().userId,
    status: 'ACTIVE',
    availableNow,
    zoneIds,
    primaryTrade: { id: Date.now(), approxRate, rateUnit, trade },
    secondaryTrades: [],
    slots: [],
    photos: [],
  });
}

export function useMiPerfil() {
  return {
    perfil: useSyncExternalStore(subscribe, () => perfil),
    cuenta: obtenerCuenta(),
    crearPerfil,
    guardarPerfil,
  };
}
