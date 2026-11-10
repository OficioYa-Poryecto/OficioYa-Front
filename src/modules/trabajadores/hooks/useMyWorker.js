import { useSyncExternalStore } from 'react';
import { getMyWorker } from '../services/trabajadoresService';

// Perfil del trabajador en sesión, compartido por todas las pantallas (layout, panel, oficios...).
// Se consulta una sola vez; después de cada cambio la pantalla llama refresh().
let state = { data: null, loading: true, error: null };
let started = false;
const listeners = new Set();

function setState(changes) {
  state = { ...state, ...changes };
  listeners.forEach((listener) => listener());
}

export async function refreshMyWorker() {
  try {
    setState({ data: await getMyWorker(), loading: false, error: null });
  } catch (error) {
    setState({ loading: false, error: error.message });
  }
}

function subscribe(listener) {
  listeners.add(listener);
  if (!started) {
    started = true;
    refreshMyWorker();
  }
  return () => listeners.delete(listener);
}

// Lectura sin suscribirse (la usa el menú de cuenta del Navbar).
export function getMyWorkerState() {
  return state;
}

// data = WorkerResponse, o null si el usuario aún no tiene perfil.
export function useMyWorker() {
  const snapshot = useSyncExternalStore(subscribe, () => state);
  return { ...snapshot, refresh: refreshMyWorker };
}
