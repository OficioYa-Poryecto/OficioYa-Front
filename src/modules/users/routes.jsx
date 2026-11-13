import ProfileView from './components/ProfileView';
import ProfileForm from './components/ProfileForm';
import UserTable from './components/UserTable';
import UserDetail from './components/UserDetail';
import RegisterForm from './components/RegisterForm';
import AdminOnly from './components/AdminOnly';

export const routes = [
  { path: '/register', element: <RegisterForm /> },
  { path: '/users/me', element: <ProfileView key="me" /> },
  { path: '/users/me/edit', element: <ProfileForm /> },
  { path: '/users/:id', element: <ProfileView /> },
  { path: '/admin/users', element: <AdminOnly><UserTable /></AdminOnly> },
  { path: '/admin/users/:id', element: <AdminOnly><UserDetail /></AdminOnly> },
];

export const navLinks = [
  { label: 'Registrarse', to: '/register' },
  { label: 'Mi perfil', to: '/users/me' },
  { label: 'Usuarios', to: '/admin/users', roles: ['ADMIN'] },
];
