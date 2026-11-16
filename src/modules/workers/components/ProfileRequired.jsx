import { useNavigate } from 'react-router-dom';
import Boton from '../../core/design-system/Boton';
import EmptyState from '../../core/design-system/EmptyState';
import ui from '../../core/design-system/ui.module.css';
import PageHeading from './PageHeading';
import styles from './trabajador.module.css';

function PerfilRequerido() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeading
        eyebrow="Perfil requerido"
        title="Primero crea tu perfil"
        description="Necesitas un perfil de trabajador para usar esta sección."
      />
      <div className={ui.infoCard}>
        <EmptyState
          title="Aún no tienes perfil"
          text="Crea tu perfil para configurar tus oficios y disponibilidad."
        />
        <div className={styles.center}>
          <Boton onClick={() => navigate('/worker/create')}>Crear perfil</Boton>
        </div>
      </div>
    </div>
  );
}

export default PerfilRequerido;
