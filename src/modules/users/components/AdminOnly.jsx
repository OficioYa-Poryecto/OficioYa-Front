import Skeleton from './Skeleton';
import { useProfile } from '../hooks/useProfile';

// Muestra las pantallas de admin solo si el usuario logueado es ADMIN (RF-06, RF-07, RF-08, RNF-2).
// El rol se toma de GET /users/me; cuando exista useAuth() de Identity, se cambia esta fuente.
function AdminOnly({ children }) {
  const { perfil, cargando, error } = useProfile();

  if (cargando || error) {
    return (
      <section className="card">
        <Skeleton lines={5} error={error} />
      </section>
    );
  }

  if (!perfil.roles.includes('ADMIN')) {
    return (
      <section className="card">
        <span className="eyebrow">Administración</span>
        <h1>Acceso restringido</h1>
        <p>Esta sección es solo para administradores.</p>
      </section>
    );
  }

  return children;
}

export default AdminOnly;
