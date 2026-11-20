import { Link } from 'react-router-dom';
import Avatar from '../../reputation/components/Avatar';
import Estrellas from '../../reputation/components/Estrellas';
import { decimal } from '../../reputation/formatos';
import styles from './TarjetaTrabajador.module.css';

// Worker todavía no entrega el nombre (vive en Users); mientras tanto se muestra un texto genérico.
const NOMBRE_PENDIENTE = 'Profesional';

function TarjetaTrabajador({ trabajador }) {
  const nombre = trabajador.nombreCompleto?.trim() || NOMBRE_PENDIENTE;
  const calificacion = trabajador.calificacionPromedio ?? 0;
  const detalles = [
    trabajador.zona,
    trabajador.tarifaAproximada == null
      ? 'Tarifa por acordar'
      : `$${Number(trabajador.tarifaAproximada).toLocaleString('es-CO')}`,
    `${trabajador.trabajosCompletados ?? 0} trabajos completados`,
  ].filter(Boolean);

  return (
    <article className={`card ${styles.tarjeta}`}>
      <div className={styles.persona}>
        <Avatar nombre={trabajador.nombreCompleto} foto={trabajador.fotoPerfilUrl} />
        <div>
          <h3>{nombre}</h3>
          <p>{trabajador.oficio}</p>
        </div>
      </div>

      <div className={styles.calificacion}>
        <strong>{decimal(calificacion)}</strong>
        <Estrellas valor={calificacion} />
        <span className={styles.resenas}>{trabajador.totalResenas ?? 0} reseñas</span>
      </div>

      <div className={styles.pie}>
        <div>
          <p className={trabajador.disponibleAhora ? styles.disponible : styles.noDisponible}>
            {trabajador.disponibleAhora ? 'Disponible ahora' : 'No disponible ahora'}
          </p>
          <p>{detalles.join(' · ')}</p>
        </div>
        <Link
          to={`/trabajadores/${trabajador.trabajadorId}`}
          state={{ nombre, oficio: trabajador.oficio }}
          className={styles.perfil}
        >
          Ver perfil
        </Link>
      </div>
    </article>
  );
}

export default TarjetaTrabajador;
