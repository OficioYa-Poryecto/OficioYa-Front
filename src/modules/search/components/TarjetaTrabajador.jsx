import { Link } from 'react-router-dom';
import Avatar from '../../reputation/components/Avatar';
import Estrellas from '../../reputation/components/Estrellas';
import { decimal } from '../../reputation/formatos';
import styles from './TarjetaTrabajador.module.css';

function TarjetaTrabajador({ trabajador }) {
  const tarifa = trabajador.tarifaAproximada.toLocaleString('es-CO');

  return (
    <article className={`card ${styles.tarjeta}`}>
      <div className={styles.persona}>
        <Avatar nombre={trabajador.nombreCompleto} foto={trabajador.fotoPerfilUrl} />
        <div>
          <h3>{trabajador.nombreCompleto}</h3>
          <p>{trabajador.oficio}</p>
        </div>
      </div>

      <div className={styles.calificacion}>
        <strong>{decimal(trabajador.calificacionPromedio)}</strong>
        <Estrellas valor={trabajador.calificacionPromedio} />
        <span className={styles.resenas}>{trabajador.totalResenas} reseñas</span>
      </div>

      <div className={styles.pie}>
        <div>
          <p className={trabajador.disponibleAhora ? styles.disponible : styles.noDisponible}>
            {trabajador.disponibleAhora ? 'Disponible ahora' : 'No disponible ahora'}
          </p>
          <p>
            {trabajador.zona} · ${tarifa} · {trabajador.trabajosCompletados} trabajos completados
          </p>
        </div>
        <Link to={`/trabajadores/${trabajador.trabajadorId}`} className={styles.perfil}>
          Ver perfil
        </Link>
      </div>
    </article>
  );
}

export default TarjetaTrabajador;
