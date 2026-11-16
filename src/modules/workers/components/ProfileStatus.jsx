import EmptyState from '../../core/design-system/EmptyState';
import StatusMessage from '../../core/design-system/StatusMessage';
import PerfilRequerido from './PerfilRequerido';

// Lo que muestra una pantalla del trabajador mientras no hay perfil para pintar:
// cargando, error al consultar o usuario sin perfil.
function EstadoPerfil({ loading, error }) {
  if (loading) return <EmptyState title="Cargando…" text="Estamos consultando tu perfil." />;
  if (error) return <StatusMessage variant="error">No pudimos cargar tu perfil: {error}</StatusMessage>;
  return <PerfilRequerido />;
}

export default EstadoPerfil;
