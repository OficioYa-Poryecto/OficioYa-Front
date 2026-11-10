import { Navigate } from 'react-router-dom';
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

// Secciones del trabajador: van en el desplegable de "Mi cuenta" del Navbar.
// Los oficios se manejan dentro de "Mi perfil".
const SECCIONES = [
  { to: '/trabajador/panel', label: 'Mi panel' },
  { to: '/trabajador/perfil', label: 'Mi perfil' },
  { to: '/trabajador/cobertura', label: 'Cobertura' },
  { to: '/trabajador/disponibilidad', label: 'Disponibilidad' },
  { to: '/trabajador/galeria', label: 'Galería' },
];
const SIN_PERFIL = [{ to: '/trabajador/crear', label: 'Crear perfil' }];

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
  ruta('/trabajador', <TrabajadorInicio />),
  ruta('/trabajador/crear', conLayout(<CrearPerfilPage />)),
  ruta('/trabajador/panel', conLayout(<PanelPage />)),
  ruta('/trabajador/perfil', conLayout(<MiPerfilPage />)),
  // Los oficios ahora viven dentro de "Mi perfil"; se conserva la ruta vieja por si hay enlaces.
  ruta('/trabajador/oficios', <Navigate replace to="/trabajador/perfil" />),
  ruta('/trabajador/cobertura', conLayout(<CoberturaPage />)),
  ruta('/trabajador/disponibilidad', conLayout(<DisponibilidadPage />)),
  ruta('/trabajador/galeria', conLayout(<GaleriaPage />)),
  // Perfil público (lo ve un contratante): sin layout del trabajador ni datos de contacto.
  { path: '/trabajadores/:id', element: <PerfilPublicoPage /> },
];

export const navLinks = [{ label: 'Trabajador', to: '/trabajador' }];
