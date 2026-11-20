import RequiereRol from './components/RequiereRol';
import MisServiciosPage from './components/MisServiciosPage';
import ModeracionPage from './components/ModeracionPage';
import PerfilTrabajadorPage from './components/PerfilTrabajadorPage';

export const routes = [
  {
    path: '/mis-servicios',
    element: (
      <RequiereRol roles={['CONTRATANTE', 'TRABAJADOR']}>
        <MisServiciosPage />
      </RequiereRol>
    ),
  },
  {
    path: '/trabajadores/:id',
    element: (
      <RequiereRol>
        <PerfilTrabajadorPage />
      </RequiereRol>
    ),
  },
  {
    path: '/admin/moderacion',
    element: (
      <RequiereRol roles={['ADMIN']}>
        <ModeracionPage />
      </RequiereRol>
    ),
  },
];

export const navLinks = [
  { label: 'Mis servicios', to: '/mis-servicios', roles: ['CONTRATANTE', 'TRABAJADOR'] },
  { label: 'Moderación', to: '/admin/moderacion', roles: ['ADMIN'] },
];
