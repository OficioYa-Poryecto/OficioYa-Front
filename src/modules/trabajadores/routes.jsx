import CoberturaPage from './components/CoberturaPage';
import CrearPerfilPage from './components/CrearPerfilPage';
import DisponibilidadPage from './components/DisponibilidadPage';
import GaleriaPage from './components/GaleriaPage';
import MisOficiosPage from './components/MisOficiosPage';
import PanelPage from './components/PanelPage';
import TrabajadorInicio from './components/TrabajadorInicio';
import TrabajadorLayout from './components/TrabajadorLayout';
import { getSession } from './services/session';

const conLayout = (pagina) => <TrabajadorLayout>{pagina}</TrabajadorLayout>;

// El Navbar lee route.account al pintar; con el getter la cuenta sale de la sesión
// en ese momento y no al importar este archivo.
const ruta = (path, element) => ({
  path,
  element,
  get account() {
    const { initials, name } = getSession();
    return { initials, name };
  },
});

export const routes = [
  ruta('/trabajador', <TrabajadorInicio />),
  ruta('/trabajador/crear', conLayout(<CrearPerfilPage />)),
  ruta('/trabajador/panel', conLayout(<PanelPage />)),
  ruta('/trabajador/oficios', conLayout(<MisOficiosPage />)),
  ruta('/trabajador/cobertura', conLayout(<CoberturaPage />)),
  ruta('/trabajador/disponibilidad', conLayout(<DisponibilidadPage />)),
  ruta('/trabajador/galeria', conLayout(<GaleriaPage />)),
];

export const navLinks = [{ label: 'Trabajador', to: '/trabajador' }];
