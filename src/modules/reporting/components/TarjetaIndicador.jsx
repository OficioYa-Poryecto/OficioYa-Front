import styles from './TarjetaIndicador.module.css';

const NUMERO = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 1 });

function formatear(valor, unidad) {
  return unidad === 'COP' ? `$${Math.round(valor).toLocaleString('es-CO')}` : NUMERO.format(valor);
}

function Variacion({ variacion }) {
  if (variacion == null) {
    return null;
  }
  return (
    <span className={variacion >= 0 ? styles.sube : styles.baja}>
      {variacion >= 0 ? '+' : ''}
      {NUMERO.format(variacion)} %
    </span>
  );
}

/** Cuentas activas e inactivas en una sola tarjeta (estado actual, sin comparación). */
export function TarjetaCuentas({ activas, inactivas }) {
  const total = activas.valor + inactivas.valor;
  const porcentaje = total > 0 ? (activas.valor / total) * 100 : 0;

  return (
    <article className={`card ${styles.tarjeta}`}>
      <p>Cuentas activas / inactivas</p>
      <div className={styles.valor}>
        <strong>{NUMERO.format(activas.valor)}</strong>
        <span className={styles.secundario}>/ {NUMERO.format(inactivas.valor)}</span>
      </div>
      <span className={styles.proporcion} aria-hidden="true">
        <span style={{ width: `${porcentaje}%` }} />
      </span>
      <small>{NUMERO.format(porcentaje)} % de las cuentas están activas</small>
    </article>
  );
}

function TarjetaIndicador({ indicador }) {
  const { detalle, nombre, tipo, unidad, valor, variacionPorcentual: variacion } = indicador;

  // La categoría más apetecida se lee por su nombre; el número de solicitudes queda como detalle.
  if (tipo === 'CATEGORIA_MAS_APETECIDA') {
    return (
      <article className={`card ${styles.tarjeta}`}>
        <p>{nombre}</p>
        <div className={styles.valor}>
          <strong className={styles.texto}>{valor > 0 ? detalle : 'Sin datos'}</strong>
        </div>
        <small>{valor > 0 ? `${NUMERO.format(valor)} ${unidad} en el periodo` : detalle}</small>
      </article>
    );
  }

  return (
    <article className={`card ${styles.tarjeta}`}>
      <p>{nombre}</p>
      <div className={styles.valor}>
        <strong>{formatear(valor, unidad)}</strong>
        <Variacion variacion={variacion} />
      </div>
      {detalle && <small>{detalle}</small>}
    </article>
  );
}

export default TarjetaIndicador;
