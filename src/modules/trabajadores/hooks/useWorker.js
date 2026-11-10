import { useEffect, useState } from 'react';
import { getWorker } from '../services/trabajadoresService';

// Perfil público de cualquier trabajador por id (WorkerResponse). { data, loading, error, notFound }
export function useWorker(id) {
  const [state, setState] = useState({ id: null, data: null, error: null, notFound: false });

  useEffect(() => {
    let active = true;
    getWorker(id)
      .then((data) => active && setState({ id, data, error: null, notFound: false }))
      .catch((error) => active && setState({ id, data: null, error: error.message, notFound: error.status === 404 }));
    return () => {
      active = false;
    };
  }, [id]);

  // Mientras llega la respuesta del id actual se considera cargando.
  const loading = state.id !== id;
  return loading ? { data: null, loading, error: null, notFound: false } : { ...state, loading };
}
