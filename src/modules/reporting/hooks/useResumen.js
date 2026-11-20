import { useEffect, useState } from 'react';
import * as reportingService from '../services/reportingService';

export function useResumen(token) {
  const [rango, setRango] = useState({ desde: '', hasta: '' });
  const [intento, setIntento] = useState(0);
  const [respuesta, setRespuesta] = useState(null);
  const clave = `${rango.desde}-${rango.hasta}-${intento}`;
  const cargando = respuesta?.clave !== clave;

  useEffect(() => {
    let vigente = true;
    reportingService
      .obtenerResumen(rango, token)
      .then((reporte) => vigente && setRespuesta({ clave, reporte }))
      .catch((error) => vigente && setRespuesta({ clave, error: error.message }));
    return () => {
      vigente = false;
    };
  }, [clave, rango, token]);

  return {
    cargando,
    error: cargando ? null : respuesta.error,
    // Mientras carga un periodo nuevo se sigue mostrando el anterior.
    reporte: respuesta?.reporte ?? null,
    cambiarRango: setRango,
    reintentar: () => setIntento((actual) => actual + 1),
  };
}
