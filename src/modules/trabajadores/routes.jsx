import CoberturaPage from './components/CoberturaPage';
import CrearPerfilPage from './components/CrearPerfilPage';
import DisponibilidadPage from './components/DisponibilidadPage';
import GaleriaPage from './components/GaleriaPage';
import MiPerfilPage from './components/MiPerfilPage';
import PanelPage from './components/PanelPage';
import PerfilPublicoPage from './components/PerfilPublicoPage';
import TrabajadorInicio from './components/TrabajadorInicio';
import TrabajadorLayout from './components/TrabajadorLayout';
import { getMyWorkerState } from './hooks/useMyWorker';
import { getSession } from './services/session';

const conLayout = (pagina) => <TrabajadorLayout>{pagina}</TrabajadorLayout>;

// Rutas en inglés, igual que los recursos del back (/api/v1/workers).
// Secciones del trabajador: van en el desplegable de "Mi cuenta" del Navbar.
// Los oficios se manejan dentro de "Mi perfil".
const SECCIONES = [
  { to: '/worker/dashboard', label: 'Mi panel' },
  { to: '/worker/profile', label: 'Mi perfil' },
  { to: '/worker/coverage', label: 'Cobertura' },
  { to: '/worker/availability', label: 'Disponibilidad' },
  { to: '/worker/gallery', label: 'Galería' },
];
const SIN_PERFIL = [{ to: '/worker/create', label: 'Crear perfil' }];

// El Navbar lee route.account al pintar; con el getter la cuenta y el menú salen de la
// sesión y del perfil en ese momento, no al importar este archivo.
const ruta = (path, element) => ({
  path,
  element,
  get account() {
    const { initials, name } = getSession();
    const { data: perfil, loading } = getMyWorkerState();
    const activo = perfil?.status === 'ACTIVE';
    return {
      initials,
      name,
      subtitle: 'Cuenta de trabajador',
      menu: !loading && !perfil ? SIN_PERFIL : SECCIONES,
      status: perfil ? { label: activo ? 'Perfil activo' : 'Perfil pausado', active: activo } : null,
    };
  },
});

export const routes = [
  ruta('/worker', <TrabajadorInicio />),
  ruta('/worker/create', conLayout(<CrearPerfilPage />)),
  ruta('/worker/dashboard', conLayout(<PanelPage />)),
  ruta('/worker/profile', conLayout(<MiPerfilPage />)),
  ruta('/worker/coverage', conLayout(<CoberturaPage />)),
  ruta('/worker/availability', conLayout(<DisponibilidadPage />)),
  ruta('/worker/gallery', conLayout(<GaleriaPage />)),
  // Perfil público (lo ve un contratante): sin layout del trabajador ni datos de contacto.
  { path: '/workers/:id', element: <PerfilPublicoPage /> },
];

export const navLinks = [{ label: 'Trabajador', to: '/worker' }];
