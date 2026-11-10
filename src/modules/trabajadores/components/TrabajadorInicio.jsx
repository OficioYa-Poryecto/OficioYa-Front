import { Navigate } from 'react-router-dom';
import { useMyWorker } from '../hooks/useMyWorker';
import EstadoPerfil from './EstadoPerfil';

// Con perfil va al panel; sin perfil (GET /workers/me -> 404) va a crear el perfil.
function TrabajadorInicio() {
  const { data: perfil, loading, error } = useMyWorker();
  if (loading || error) return <EstadoPerfil error={error} loading={loading} />;
  return <Navigate to={perfil ? '/trabajador/panel' : '/trabajador/crear'} replace />;
}

export default TrabajadorInicio;
