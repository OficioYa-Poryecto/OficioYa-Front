import AdminPerfilPage from './components/AdminPerfilPage';
import ContratanteEditarPage from './components/ContratanteEditarPage';
import ContratantePerfilPage from './components/ContratantePerfilPage';
import LoginPage from './components/LoginPage';
import RegistroPage from './components/RegistroPage';
import { obtenerAdministrador, obtenerContratante } from './services/authService';

const toAccount = ({ initials, firstName }) => ({ initials, name: firstName });
const contratante = toAccount(obtenerContratante());
const administrador = toAccount(obtenerAdministrador());

export const routes = [
  { path: '/acceso', element: <LoginPage /> },
  { path: '/registro', element: <RegistroPage /> },
  { path: '/contratante/perfil', element: <ContratantePerfilPage />, account: contratante },
  { path: '/contratante/editar', element: <ContratanteEditarPage />, account: contratante },
  { path: '/administrador', element: <AdminPerfilPage />, account: administrador },
];

export const navLinks = [
  { label: 'Contratante', to: '/contratante/perfil' },
  { label: 'Administrador', to: '/administrador' },
];
