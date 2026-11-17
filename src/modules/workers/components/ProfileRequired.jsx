import { useNavigate } from 'react-router-dom';
import Button from '../../core/design-system/Button';
import EmptyState from './ui/EmptyState';
import ui from './ui/ui.module.css';
import PageHeading from './PageHeading';
import styles from './worker.module.css';

function ProfileRequired() {
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
          <Button type="button" onClick={() => navigate('/worker/create')}>Crear perfil</Button>
        </div>
      </div>
    </div>
  );
}

export default ProfileRequired;
