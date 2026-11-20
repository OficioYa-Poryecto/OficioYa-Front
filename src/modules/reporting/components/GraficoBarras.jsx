import styles from './GraficoBarras.module.css';

const ALTO_BARRAS = 200;
const MAXIMO_ETIQUETAS = 10;

function etiquetaCorta(etiqueta) {
  const fecha = new Date(`${etiqueta}T00:00:00`);
  if (Number.isNaN(fecha.getTime())) {
    return etiqueta;
  }
  return fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

function GraficoBarras({ puntos }) {
  const maximo = Math.max(1, ...puntos.map((punto) => punto.valor));
  const cadaCuantas = Math.ceil(puntos.length / MAXIMO_ETIQUETAS);

  return (
    <div className={styles.grafico} role="img" aria-label="Servicios cumplidos por día">
      {puntos.map((punto, indice) => {
        const conEtiqueta = indice % cadaCuantas === 0;
        const texto = etiquetaCorta(punto.etiqueta);
        return (
          <div key={punto.etiqueta} className={styles.columna} title={`${texto}: ${punto.valor}`}>
            <small>{conEtiqueta ? punto.valor : ''}</small>
            <div className={styles.barra} style={{ height: (ALTO_BARRAS * punto.valor) / maximo }} />
            <small>{conEtiqueta ? texto : ''}</small>
          </div>
        );
      })}
    </div>
  );
}

export default GraficoBarras;
