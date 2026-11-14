import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../core/design-system/Button';
import ErrorMessage from '../../core/components/ErrorMessage';
import { useAdminUser } from '../hooks/useAdminUsers';
import { useProfile } from '../hooks/useProfile';
import StatusSelector from './StatusSelector';
import Skeleton from './Skeleton';
import ProfileHeader from './ProfileHeader';
import ContactCard from './ContactCard';
import styles from './UserDetail.module.css';
import vista from './ProfileView.module.css';

function UserDetail() {
  const { id } = useParams();
  const { user, loading, error, actionError, updateStatus } = useAdminUser(id);
  const { perfil: me } = useProfile(); // usuario logueado (GET /users/me)
  const navigate = useNavigate();

  const volver = (
      <Button type="button" variant="secondary" onClick={() => navigate('/admin/users')}>
        Volver al listado
      </Button>
  );

  if (loading || error) {
    return (
        <section className={vista.page}>
          <div className={vista.top}>
            <span className="eyebrow">Detalle de usuario</span>
            {volver}
          </div>
          <div className="card">
            <Skeleton lines={6} error={error} />
          </div>
        </section>
    );
  }

  const isActive = user.accountStatus === 'ACTIVE';
  const isSelf = me?.id === user.id;

  return (
      <section className={vista.page}>
        <div className={vista.top}>
          <ProfileHeader nombre={user.name} roles={user.roles} activo={isActive} etiqueta="Detalle de usuario" />
          <div className={vista.actions}>
            <span className={styles.internal}>🛡 Acceso interno</span>
            {volver}
          </div>
        </div>

        <div className={vista.layout}>
          <aside>
            <ContactCard
                email={user.email}
                phones={user.phones ?? []}
                nota="Datos completos visibles solo para administración."
            />
          </aside>

          <div className={`card ${styles.statusCard}`}>
            <div className={styles.statusHeader}>
              <div>
                <span className="eyebrow">Moderación</span>
                <h2>Estado de la cuenta</h2>
              </div>
              <span className={isActive ? styles.pillActive : styles.pillInactive}>
              {isActive ? 'Activa' : 'Inactiva'}
            </span>
            </div>

            <dl className={styles.data}>
              <dt>Creada</dt>
              <dd>{new Date(user.createdAt).toLocaleString()}</dd>
              <dt>Última actualización</dt>
              <dd>{new Date(user.updatedAt).toLocaleString()}</dd>
            </dl>

            {me && (isSelf ? (
                <p>No puedes cambiar el estado de tu propia cuenta.</p>
            ) : (
                <StatusSelector isActive={isActive} onSubmit={updateStatus} />
            ))}
            <ErrorMessage error={actionError} />
          </div>
        </div>
      </section>
  );
}

export default UserDetail;