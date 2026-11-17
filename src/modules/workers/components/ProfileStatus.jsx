import EmptyState from './ui/EmptyState';
import StatusMessage from './ui/StatusMessage';
import ProfileRequired from './ProfileRequired';

// Lo que muestra una pantalla del trabajador mientras no hay perfil para pintar:
// cargando, error al consultar o usuario sin perfil.
function ProfileStatus({ loading, error }) {
  if (loading) return <EmptyState title="Cargando…" text="Estamos consultando tu perfil." />;
  if (error) return <StatusMessage variant="error">No pudimos cargar tu perfil: {error}</StatusMessage>;
  return <ProfileRequired />;
}

export default ProfileStatus;
