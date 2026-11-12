import ProfileView from './components/ProfileView';
import ProfileForm from './components/ProfileForm';
import UserTable from './components/UserTable';
import UserDetail from './components/UserDetail';

export const routes = [
  { path: '/users/me', element: <ProfileView /> },
  { path: '/users/me/edit', element: <ProfileForm /> },
  { path: '/users/:id', element: <ProfileView /> },
  { path: '/admin/users', element: <UserTable /> },
  { path: '/admin/users/:id', element: <UserDetail /> },
];

export const navLinks = [
  { label: 'Mi perfil', to: '/users/me' },
  { label: 'Usuarios', to: '/admin/users', roles: ['ADMIN'] },
];
