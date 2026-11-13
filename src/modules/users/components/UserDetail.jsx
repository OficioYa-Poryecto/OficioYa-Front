import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../core/design-system/Button';
import ErrorMessage from '../../core/components/ErrorMessage';
import { useAdminUser } from '../hooks/useAdminUsers';
import { useProfile } from '../hooks/useProfile';
import StatusSelector from './StatusSelector';
import Skeleton from './Skeleton';
import styles from './UserDetail.module.css';
import form from './Form.module.css';

function UserDetail() {
  const { id } = useParams();
  const { user, loading, error, actionError, updateStatus } = useAdminUser(id);
  const { perfil: me } = useProfile(); // usuario logueado (GET /users/me)
  const navigate = useNavigate();

  const header = (title) => (
    <div className={form.header}>
      <div>
        <span className="eyebrow">Detalle de usuario</span>
        {title && <h1>{title}</h1>}
      </div>
      <Button type="button" variant="secondary" onClick={() => navigate('/admin/users')}>Volver</Button>
    </div>
  );

  if (loading || error) {
    return (
      <section className={`card ${form.page}`}>
        {header(null)}
        <Skeleton lines={6} error={error} />
      </section>
    );
  }

  const isActive = user.accountStatus === 'ACTIVE';
  const isSelf = me?.id === user.id;

  return (
    <section className={`card ${form.page}`}>
      {header(user.name)}

      <dl className={styles.data}>
        <dt>Correo</dt>
        <dd>{user.email}</dd>
        <dt>Teléfonos</dt>
        <dd>
          {[...user.phones].sort((a, b) => Number(b.principal) - Number(a.principal))
            .map((p) => `${p.number} (${p.principal ? 'principal' : 'adicional'})`).join(', ')}
        </dd>
        <dt>Roles</dt>
        <dd>{user.roles.join(', ')}</dd>
        <dt>Estado</dt>
        <dd className={isActive ? styles.active : styles.inactive}>{isActive ? 'Activo' : 'Inactivo'}</dd>
        <dt>Creado</dt>
        <dd>{new Date(user.createdAt).toLocaleString()}</dd>
        <dt>Actualizado</dt>
        <dd>{new Date(user.updatedAt).toLocaleString()}</dd>
      </dl>

      {me && (isSelf ? (
        <p>No puedes cambiar el estado de tu propia cuenta.</p>
      ) : (
        <StatusSelector isActive={isActive} onSubmit={updateStatus} />
      ))}
      <ErrorMessage error={actionError} />
    </section>
  );
}

export default UserDetail;
