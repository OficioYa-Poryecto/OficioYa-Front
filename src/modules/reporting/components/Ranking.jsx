import styles from './Metricas.module.css';

/** Lista ordenada con barras horizontales (zonas, categorías, tarifas). Los puntos ya llegan de mayor a menor. */
function Ranking({ puntos, formato = (valor) => valor.toLocaleString('es-CO'), maximo = 6 }) {
  const visibles = puntos.slice(0, maximo);
  const mayor = Math.max(1, ...visibles.map((punto) => punto.valor));

  return (
    <ol className={styles.ranking}>
      {visibles.map((punto, indice) => (
        <li key={punto.etiqueta}>
          <span className={styles.puesto}>{indice + 1}</span>
          <span className={styles.nombre}>{punto.etiqueta}</span>
          <strong>{formato(punto.valor)}</strong>
          <span className={styles.pista} aria-hidden="true">
            <span style={{ width: `${(punto.valor / mayor) * 100}%` }} />
          </span>
        </li>
      ))}
    </ol>
  );
}

export default Ranking;
