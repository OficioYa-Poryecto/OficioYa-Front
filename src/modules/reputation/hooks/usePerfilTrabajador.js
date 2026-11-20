import { useEffect, useState } from 'react';
import * as reputationService from '../services/reputationService';

export function usePerfilTrabajador(trabajadorId, token) {
  const [intento, setIntento] = useState(0);
  const [respuesta, setRespuesta] = useState(null);
  const clave = `${trabajadorId}-${intento}`;
  const cargando = respuesta?.clave !== clave;

  useEffect(() => {
    let vigente = true;
    Promise.all([
      reputationService.obtenerReputacion(trabajadorId, token),
      reputationService.listarResenas(trabajadorId, token),
    ])
      .then(([reputacion, resenas]) => vigente && setRespuesta({ clave, reputacion, resenas }))
      .catch((error) => vigente && setRespuesta({ clave, error: error.message }));
    return () => {
      vigente = false;
    };
  }, [clave, trabajadorId, token]);

  return {
    cargando,
    error: cargando ? null : respuesta.error,
    reputacion: cargando ? null : respuesta.reputacion,
    resenas: cargando ? [] : respuesta.resenas,
    reintentar: () => setIntento((actual) => actual + 1),
  };
}
