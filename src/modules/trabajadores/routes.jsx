import CoberturaPage from './components/CoberturaPage';
import CrearPerfilPage from './components/CrearPerfilPage';
import DisponibilidadPage from './components/DisponibilidadPage';
import GaleriaPage from './components/GaleriaPage';
import MisOficiosPage from './components/MisOficiosPage';
import PanelPage from './components/PanelPage';
import TrabajadorInicio from './components/TrabajadorInicio';
import TrabajadorLayout from './components/TrabajadorLayout';
import { obtenerCuenta } from './services/trabajadoresService';

const { initials, firstName } = obtenerCuenta();
const account = { initials, name: firstName };

const conLayout = (pagina) => <TrabajadorLayout>{pagina}</TrabajadorLayout>;

export const routes = [
  { path: '/trabajador', element: <TrabajadorInicio />, account },
  { path: '/trabajador/crear', element: conLayout(<CrearPerfilPage />), account },
  { path: '/trabajador/panel', element: conLayout(<PanelPage />), account },
  { path: '/trabajador/oficios', element: conLayout(<MisOficiosPage />), account },
  { path: '/trabajador/cobertura', element: conLayout(<CoberturaPage />), account },
  { path: '/trabajador/disponibilidad', element: conLayout(<DisponibilidadPage />), account },
  { path: '/trabajador/galeria', element: conLayout(<GaleriaPage />), account },
];

export const navLinks = [{ label: 'Trabajador', to: '/trabajador' }];
