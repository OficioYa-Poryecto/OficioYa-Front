import styles from './Estrellas.module.css';

const ESTRELLAS = [1, 2, 3, 4, 5];

// Muestra una calificación. Si recibe alElegir, permite elegirla.
function Estrellas({ valor, tamano = 18, alElegir }) {
  if (alElegir) {
    return (
      <div className={styles.estrellas} role="group" aria-label="Calificación">
        {ESTRELLAS.map((estrella) => (
          <button
            key={estrella}
            type="button"
            aria-label={`${estrella} de 5 estrellas`}
            aria-pressed={valor === estrella}
            className={estrella <= valor ? styles.llena : styles.vacia}
            style={{ fontSize: tamano }}
            onClick={() => alElegir(estrella)}
          >
            ★
          </button>
        ))}
      </div>
    );
  }

  return (
    <span className={styles.estrellas} role="img" aria-label={`${valor} de 5 estrellas`} style={{ fontSize: tamano }}>
      {ESTRELLAS.map((estrella) => (
        <span key={estrella} className={estrella <= Math.round(valor) ? styles.llena : styles.vacia}>
          ★
        </span>
      ))}
    </span>
  );
}

export default Estrellas;
