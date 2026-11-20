import { useEffect, useState } from 'react';
import { DIAS, FRANJAS, ORDENES } from '../config';
import styles from './PanelFiltros.module.css';

// En PC todas las secciones van en una columna lateral (el orden va sobre los resultados).
// En el celular se abre un panel con las secciones a la izquierda y su contenido a la derecha.
const SECCIONES = [
  { id: 'disponibilidad', titulo: 'Disponibilidad' },
  { id: 'categoria', titulo: 'Categoría' },
  { id: 'zona', titulo: 'Zona' },
  { id: 'precio', titulo: 'Precio' },
  { id: 'dia', titulo: 'Día' },
  { id: 'franja', titulo: 'Franja horaria' },
  { id: 'orden', titulo: 'Ordenar por', soloCelular: true },
];

function contarFiltrosActivos(filtros) {
  return ['barrioIds', 'precioMinimo', 'precioMaximo', 'diaSemana', 'franjaHoraria']
    .filter((nombre) => filtros[nombre] !== '')
    .length + (filtros.soloDisponibleAhora ? 1 : 0);
}

function Opciones({ opciones, valor, alElegir }) {
  return (
    <ul className={styles.opciones}>
      {opciones.map((opcion) => {
        const activa = String(opcion.valor) === String(valor);
        return (
          <li key={opcion.valor}>
            <button
              type="button"
              aria-pressed={activa}
              className={activa ? `${styles.opcion} ${styles.opcionActiva}` : styles.opcion}
              onClick={() => alElegir(opcion.valor)}
            >
              {opcion.nombre}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function CampoPrecio({ id, etiqueta, ejemplo, valor, alCambiar }) {
  return (
    <label htmlFor={id} className={styles.campoPrecio}>
      <span>{etiqueta}</span>
      <span className={styles.conSigno}>
        <span aria-hidden="true">$</span>
        <input
          id={id}
          inputMode="numeric"
          min="0"
          onChange={(evento) => alCambiar(evento.target.value)}
          placeholder={ejemplo}
          type="number"
          value={valor}
        />
      </span>
    </label>
  );
}

/** Agrupa las zonas por localidad, en orden alfabético, para la lista desplegable. */
function zonasPorLocalidad(zonas) {
  const grupos = new Map();
  [...zonas]
    .sort((a, b) => `${a.locality} ${a.name}`.localeCompare(`${b.locality} ${b.name}`, 'es'))
    .forEach((zona) => {
      const localidad = zona.locality || 'Otras';
      grupos.set(localidad, [...(grupos.get(localidad) ?? []), zona]);
    });
  return [...grupos.entries()];
}

function SelectorZona({ zonas, valor, alElegir }) {
  return (
    <select
      aria-label="Zona"
      className={styles.selector}
      value={valor}
      onChange={(evento) => alElegir(evento.target.value)}
    >
      <option value="">Todas las zonas</option>
      {zonasPorLocalidad(zonas).map(([localidad, lista]) => (
        <optgroup key={localidad} label={localidad}>
          {lista.map((zona) => (
            <option key={zona.id} value={String(zona.id)}>
              {zona.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

function Contenido({ seccion, filtros, oficioId, oficios, zonas = [], alCambiarFiltro, alElegirOficio }) {
  switch (seccion) {
    case 'disponibilidad':
      return (
        <label className={styles.interruptor}>
          <span>Disponible ahora</span>
          <input
            type="checkbox"
            role="switch"
            checked={filtros.soloDisponibleAhora}
            onChange={(evento) => alCambiarFiltro('soloDisponibleAhora', evento.target.checked)}
          />
        </label>
      );
    case 'categoria':
      return (
        <Opciones
          opciones={oficios.map((oficio) => ({ valor: oficio.id, nombre: oficio.nombre }))}
          valor={oficioId ?? ''}
          alElegir={(id) => alElegirOficio(id)}
        />
      );
    case 'zona':
      return (
        <SelectorZona
          zonas={zonas}
          valor={filtros.barrioIds}
          alElegir={(valor) => alCambiarFiltro('barrioIds', valor)}
        />
      );
    case 'precio':
      return (
        <div className={styles.precios}>
          <CampoPrecio
            id="filtro-precio-minimo"
            etiqueta="Precio desde"
            ejemplo="Mínimo"
            valor={filtros.precioMinimo}
            alCambiar={(valor) => alCambiarFiltro('precioMinimo', valor)}
          />
          <CampoPrecio
            id="filtro-precio-maximo"
            etiqueta="Precio hasta"
            ejemplo="Máximo"
            valor={filtros.precioMaximo}
            alCambiar={(valor) => alCambiarFiltro('precioMaximo', valor)}
          />
        </div>
      );
    case 'dia':
      return (
        <Opciones
          opciones={[{ valor: '', nombre: 'Cualquier día' }, ...DIAS]}
          valor={filtros.diaSemana}
          alElegir={(valor) => alCambiarFiltro('diaSemana', valor)}
        />
      );
    case 'franja':
      return (
        <Opciones
          opciones={[{ valor: '', nombre: 'Cualquier hora' }, ...FRANJAS]}
          valor={filtros.franjaHoraria}
          alElegir={(valor) => alCambiarFiltro('franjaHoraria', valor)}
        />
      );
    case 'orden':
      return (
        <Opciones
          opciones={ORDENES}
          valor={filtros.orden}
          alElegir={(valor) => alCambiarFiltro('orden', valor)}
        />
      );
    default:
      return null;
  }
}

/** Columna lateral de filtros para PC. */
export function FiltrosLaterales(props) {
  return (
    <aside className={styles.lateral} aria-label="Filtros">
      {SECCIONES.filter((seccion) => !seccion.soloCelular).map((seccion) => (
        <section key={seccion.id} className={styles.seccion}>
          <h3>{seccion.titulo}</h3>
          <Contenido seccion={seccion.id} {...props} />
        </section>
      ))}
      {contarFiltrosActivos(props.filtros) > 0 && (
        <button type="button" className={styles.limpiar} onClick={props.alLimpiar}>
          Limpiar filtros
        </button>
      )}
    </aside>
  );
}

/** Botón y panel desplegable de filtros para el celular. */
export function FiltrosCelular({ total, ...props }) {
  const [abierto, setAbierto] = useState(false);
  const [seccion, setSeccion] = useState(SECCIONES[0].id);
  const activos = contarFiltrosActivos(props.filtros);

  useEffect(() => {
    if (!abierto) {
      return undefined;
    }
    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const cerrarConEscape = (evento) => evento.key === 'Escape' && setAbierto(false);
    window.addEventListener('keydown', cerrarConEscape);
    return () => {
      document.body.style.overflow = anterior;
      window.removeEventListener('keydown', cerrarConEscape);
    };
  }, [abierto]);

  return (
    <div className={styles.celular}>
      <button type="button" className={styles.abrir} onClick={() => setAbierto(true)}>
        Filtros{activos > 0 ? ` (${activos})` : ''}
      </button>

      {abierto && (
        <div className={styles.fondo} role="dialog" aria-modal="true" aria-label="Filtros">
          <div className={styles.panel}>
            <div className={styles.cabecera}>
              <strong>Filtros</strong>
              <button type="button" className={styles.cerrar} aria-label="Cerrar filtros" onClick={() => setAbierto(false)}>
                ×
              </button>
            </div>

            <div className={styles.cuerpo}>
              <nav className={styles.menu}>
                {SECCIONES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-current={item.id === seccion}
                    className={item.id === seccion ? `${styles.item} ${styles.itemActivo}` : styles.item}
                    onClick={() => setSeccion(item.id)}
                  >
                    {item.titulo}
                  </button>
                ))}
              </nav>
              <div className={styles.contenido}>
                <h3>{SECCIONES.find((item) => item.id === seccion).titulo}</h3>
                <Contenido seccion={seccion} {...props} />
              </div>
            </div>

            <div className={styles.pie}>
              <button type="button" className={styles.limpiar} onClick={props.alLimpiar}>
                Limpiar filtros
              </button>
              <button type="button" className={styles.verResultados} onClick={() => setAbierto(false)}>
                Ver resultados{total === undefined ? '' : ` (${total})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
