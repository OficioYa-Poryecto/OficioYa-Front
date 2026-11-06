import { Link, useParams } from 'react-router-dom';
import ErrorMessage from '../../core/components/ErrorMessage';
import { useAdminUser } from '../hooks/useAdminUsers';
import { useProfile } from '../hooks/useProfile';
import StatusSelector from './StatusSelector';
import styles from './UserDetail.module.css';

function UserDetail() {
  const { id } = useParams();
  const { user, loading, error, actionError, updateStatus } = useAdminUser(id);
  const { perfil: me } = useProfile(); // usuario logueado (GET /users/me)

  if (loading) {
    return <p>Cargando usuario...</p>;
  }
  if (error) {
    return <ErrorMessage error={error} />;
  }

  const isActive = user.accountStatus === 'ACTIVE';
  const isSelf = me?.id === user.id;

  return (
    <section className="card">
      <Link to="/admin/users" className={styles.back}>← Volver a usuarios</Link>
      <span className="eyebrow">Detalle de usuario</span>
      <h1>{user.name}</h1>

      <dl className={styles.data}>
        <dt>Correo</dt>
        <dd>{user.email}</dd>
        <dt>Teléfonos</dt>
        <dd>
          {user.phones.map((phone) => phone.number + (phone.principal ? ' (principal)' : '')).join(', ')}
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
