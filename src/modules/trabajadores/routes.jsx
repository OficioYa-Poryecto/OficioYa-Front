import TrabajadorDetallePage from './components/TrabajadorDetallePage';
import TrabajadorEditarPage from './components/TrabajadorEditarPage';
import { obtenerTrabajador } from './services/trabajadoresService';

const { initials, firstName } = obtenerTrabajador();
const account = { initials, name: firstName };

export const routes = [
  { path: '/trabajador/perfil', element: <TrabajadorDetallePage />, account },
  { path: '/trabajador/editar', element: <TrabajadorEditarPage />, account },
];

export const navLinks = [{ label: 'Trabajador', to: '/trabajador/perfil' }];
