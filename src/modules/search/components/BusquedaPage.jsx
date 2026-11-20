import { useState } from 'react';
import Button from '../../core/design-system/Button';
import ErrorMessage from '../../core/components/ErrorMessage';
import { getToken } from '../../core/lib/session';
import { useBusqueda } from '../hooks/useBusqueda';
import { ORDENES } from '../config';
import { FiltrosCelular, FiltrosLaterales } from './PanelFiltros';
import TarjetaTrabajador from './TarjetaTrabajador';
import styles from './BusquedaPage.module.css';

const LARGO_MINIMO = 3;
const LARGO_MAXIMO = 500;

function BusquedaPage() {
  const token = getToken() ?? '';
  const busqueda = useBusqueda(token);
  const [borrador, setBorrador] = useState('');
  const [aviso, setAviso] = useState(null);

  function enviar(evento) {
    evento.preventDefault();
    const descripcion = borrador.trim();
    if (descripcion.length < LARGO_MINIMO) {
      setAviso(`Describe el servicio con al menos ${LARGO_MINIMO} caracteres.`);
      return;
    }
    setAviso(null);
    busqueda.buscarTexto(descripcion);
  }

  function elegirOficio(id) {
    setBorrador('');
    setAviso(null);
    busqueda.elegirOficio(id);
  }

  const propsFiltros = {
    filtros: busqueda.filtros,
    oficioId: busqueda.texto === null ? busqueda.oficioId : '',
    oficios: busqueda.oficios,
    zonas: busqueda.zonas,
    alCambiarFiltro: busqueda.cambiarFiltro,
    alElegirOficio: elegirOficio,
    alLimpiar: busqueda.limpiarFiltros,
  };

  return (
    <section className={styles.pagina}>
      <div>
        <span className="eyebrow">Encuentra profesionales</span>
        <h1 className={styles.titulo}>Tu casa, en buenas manos.</h1>
      </div>

      <form className={styles.buscador} onSubmit={enviar}>
        <input
          id="texto-busqueda"
          aria-label="Describe lo que necesitas"
          maxLength={LARGO_MAXIMO}
          onChange={(evento) => setBorrador(evento.target.value)}
          placeholder="¿Qué servicio necesita hoy?"
          value={borrador}
        />
        <Button type="submit">Buscar</Button>
      </form>
      <ErrorMessage error={aviso} />

      <div className={styles.contenido}>
        <FiltrosLaterales {...propsFiltros} />
        <Resultados busqueda={busqueda} propsFiltros={propsFiltros} />
      </div>
    </section>
  );
}

function Resultados({ busqueda, propsFiltros }) {
  const { cargando, resultado } = busqueda;
  const total = cargando || !resultado ? undefined : resultado.total;

  return (
    <div className={styles.resultados}>
      <div className={styles.herramientas}>
        <FiltrosCelular {...propsFiltros} total={total} />
        <label className={styles.orden} htmlFor="orden-calificacion">
          <span>Ordenar por</span>
          <select
            id="orden-calificacion"
            onChange={(evento) => busqueda.cambiarFiltro('orden', evento.target.value)}
            value={busqueda.filtros.orden}
          >
            {ORDENES.map((orden) => (
              <option key={orden.valor} value={orden.valor}>
                {orden.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>
      <ListaResultados busqueda={busqueda} />
    </div>
  );
}

function ListaResultados({ busqueda }) {
  const { cargando, error, oficioId, oficios, reintentar, resultado, sinCatalogo, texto } = busqueda;

  if (error) {
    return (
      <div className={styles.estado}>
        <ErrorMessage error={error} />
        <Button variant="secondary" onClick={reintentar}>
          Reintentar
        </Button>
      </div>
    );
  }
  if (cargando) {
    return <p className={styles.estado}>Buscando profesionales…</p>;
  }
  if (sinCatalogo || !resultado) {
    return <p className={styles.estado}>Aún no hay oficios disponibles para buscar.</p>;
  }
  if (resultado.estado === 'REQUIERE_MAS_DETALLE' || resultado.estado === 'ERROR') {
    return <p className={styles.estado}>{resultado.mensaje}</p>;
  }

  const oficio = oficios.find((item) => item.id === oficioId)?.nombre;
  const titulo = texto === null
    ? `Profesionales de ${oficio}`
    : `Sugerencias de ${resultado.oficioIdentificado}`;

  return (
    <>
      <div className={styles.resumen}>
        <h2>{titulo}</h2>
        <span>{resultado.total} {resultado.total === 1 ? 'resultado' : 'resultados'}</span>
      </div>
      {(resultado.resultados ?? []).length === 0 ? (
        <p className={styles.estado}>No hay trabajadores con estos filtros.</p>
      ) : (
        <div className={styles.lista}>
          {resultado.resultados.map((trabajador) => (
            <TarjetaTrabajador key={trabajador.trabajadorId} trabajador={trabajador} />
          ))}
        </div>
      )}
    </>
  );
}

export default BusquedaPage;
