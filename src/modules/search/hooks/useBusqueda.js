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
  const [oficiosCargados, setOficiosCargados] = useState(false);
  const [zonas, setZonas] = useState([]);
  const [errorOficios, setErrorOficios] = useState(null);
  const [oficioElegido, setOficioElegido] = useState(null);
  const [texto, setTexto] = useState(null);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [intento, setIntento] = useState(0);
  const [respuesta, setRespuesta] = useState(null);

  // Sin elegir nada se muestra el primer oficio, como en el mockup.
  const oficioId = oficioElegido ?? oficios[0]?.id ?? null;
  const clave = JSON.stringify({ oficioId, texto, filtros, intento });
  // Sin oficios en el catálogo no hay nada que buscar: no se queda "cargando" para siempre.
  const sinCatalogo = oficiosCargados && oficioId === null && texto === null;
  const cargando = !sinCatalogo && respuesta?.clave !== clave;

  useEffect(() => {
    searchService
      .listarOficios(token)
      .then((lista) => setOficios(Array.isArray(lista) ? lista : []))
      .catch((error) => setErrorOficios(error.message))
      .finally(() => setOficiosCargados(true));
    // Si las zonas no cargan, la búsqueda sigue funcionando; solo queda "Todas las zonas".
    searchService
      .listarZonas(token)
      .then((lista) => setZonas(Array.isArray(lista) ? lista : []))
      .catch(() => setZonas([]));
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
    zonas,
    oficioId,
    texto,
    filtros,
    cargando: cargando && !errorOficios,
    sinCatalogo,
    resultado: cargando || sinCatalogo ? null : respuesta?.resultado,
    error: errorOficios ?? (cargando || sinCatalogo ? null : respuesta?.error),
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
