import { Navigate } from 'react-router-dom';
import { useMiPerfil } from '../hooks/useMiPerfil';

function TrabajadorInicio() {
  const { perfil } = useMiPerfil();
  return <Navigate to={perfil ? '/trabajador/panel' : '/trabajador/crear'} replace />;
}

export default TrabajadorInicio;
