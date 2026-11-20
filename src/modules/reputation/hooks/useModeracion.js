import { useEffect, useState } from 'react';
import * as reputationService from '../services/reputationService';

// Reportes del estado elegido, cada uno con la reseña reportada. Si una reseña no se puede leer, el reporte
// se muestra igual (sin el texto de la reseña) para que el ADMIN pueda resolverlo.
async function cargarReportes(estado, token) {
  const reportes = await reputationService.listarReportes(estado, token);
  const lista = Array.isArray(reportes) ? reportes : [];
  return Promise.all(
    lista.map(async (reporte) => {
      try {
        const resena = await reputationService.obtenerResena(reporte.codigoResena, token);
        return { ...reporte, resena };
      } catch {
        return { ...reporte, resena: null };
      }
    }),
  );
}

export function useModeracion(estado, token) {
  const [intento, setIntento] = useState(0);
  const [respuesta, setRespuesta] = useState(null);
  const clave = `${estado}-${intento}`;
  const cargando = respuesta?.clave !== clave;

  useEffect(() => {
    let vigente = true;
    cargarReportes(estado, token)
      .then((reportes) => vigente && setRespuesta({ clave, reportes }))
      .catch((error) => vigente && setRespuesta({ clave, error: error.message }));
    return () => {
      vigente = false;
    };
  }, [clave, estado, token]);

  return {
    cargando,
    error: cargando ? null : respuesta.error,
    reportes: cargando ? [] : (respuesta.reportes ?? []),
    recargar: () => setIntento((actual) => actual + 1),
  };
}
