import ErrorMessage from '../../core/components/ErrorMessage';
import { leerSesion } from '../sesion';

// El login ya lo exige ProtectedRoute (App.jsx); aquí solo se revisa el rol.
function RequiereRol({ roles, children }) {
  const { roles: rolesUsuario } = leerSesion();
  if (roles && !roles.some((rol) => rolesUsuario.includes(rol))) {
    return <ErrorMessage error="No tienes permiso para ver esta página." />;
  }
  return children;
}

export default RequiereRol;
