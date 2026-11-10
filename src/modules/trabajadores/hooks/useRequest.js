import { useEffect, useState } from 'react';

// Ejecuta una consulta al montar y devuelve { data, loading, error }.
// `load` debe ser una función estable (por ejemplo, importada del servicio).
export function useRequest(load) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let active = true;
    load()
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((error) => active && setState({ data: null, loading: false, error: error.message }));
    return () => {
      active = false;
    };
  }, [load]);

  return state;
}
