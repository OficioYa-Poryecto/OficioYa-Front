import { Link } from 'react-router-dom';
import ErrorMessage from '../../core/components/ErrorMessage';
import { useAdminUsers } from '../hooks/useAdminUsers';
import styles from './UserTable.module.css';

function UserTable() {
  const { users, loading, error } = useAdminUsers();

  return (
    <section className="card">
      <span className="eyebrow">Administración</span>
      <h1>Usuarios</h1>

      {loading && <p>Cargando usuarios...</p>}
      <ErrorMessage error={error} />
      {!loading && !error && users.length === 0 && <p>No hay usuarios registrados.</p>}

      {users.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Roles</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.roles.join(', ')}</td>
                <td className={user.accountStatus === 'ACTIVE' ? styles.active : styles.inactive}>
                  {user.accountStatus === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                </td>
                <td>
                  <Link to={`/admin/users/${user.id}`} className={styles.link}>Ver detalle</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default UserTable;
