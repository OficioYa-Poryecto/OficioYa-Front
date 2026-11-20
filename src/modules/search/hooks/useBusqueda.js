import { useEffect, useState } from 'react';
import * as searchService from '../services/searchService';

const FILTROS_INICIALES = {
  barrioIds: '',
  precioMinimo: '',
  precioMaximo: '',
  diaSemana: '',
  franjaHoraria: '',
  soloDisponibleAhora: false,
  orden: 'MAYOR_A_MENOR',
};

export function useBusqueda(token) {
  const [oficios, setOficios] = useState([]);
  const [errorOficios, setErrorOficios] = useState(null);
  const [oficioElegido, setOficioElegido] = useState(null);
  const [texto, setTexto] = useState(null);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [intento, setIntento] = useState(0);
  const [respuesta, setRespuesta] = useState(null);

  // Sin elegir nada se muestra el primer oficio, como en el mockup.
  const oficioId = oficioElegido ?? oficios[0]?.id ?? null;
  const clave = JSON.stringify({ oficioId, texto, filtros, intento });
  const cargando = respuesta?.clave !== clave;

  useEffect(() => {
    searchService
      .listarOficios(token)
      .then(setOficios)
      .catch((error) => setErrorOficios(error.message));
  }, [token]);

  useEffect(() => {
    if (oficioId === null && texto === null) {
      return undefined;
    }
    let vigente = true;
    const peticion = texto !== null
      ? searchService.buscarPorTexto(texto, filtros, token)
      : searchService.buscarPorOficio(oficioId, filtros, token);
    peticion
      .then((resultado) => vigente && setRespuesta({ clave, resultado }))
      .catch((error) => vigente && setRespuesta({ clave, error: error.message }));
    return () => {
      vigente = false;
    };
  }, [clave, oficioId, texto, filtros, token]);

  return {
    oficios,
    oficioId,
    texto,
    filtros,
    cargando: cargando && !errorOficios,
    resultado: cargando ? null : respuesta.resultado,
    error: errorOficios ?? (cargando ? null : respuesta.error),
    elegirOficio(id) {
      setTexto(null);
      setOficioElegido(id);
    },
    buscarTexto: setTexto,
    cambiarFiltro(nombre, valor) {
      setFiltros((actuales) => ({ ...actuales, [nombre]: valor }));
    },
    limpiarFiltros() {
      setFiltros((actuales) => ({ ...FILTROS_INICIALES, orden: actuales.orden }));
    },
    reintentar() {
      setIntento((actual) => actual + 1);
    },
  };
}
