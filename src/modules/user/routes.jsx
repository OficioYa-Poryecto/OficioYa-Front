import ProfileView from './components/ProfileView';
import ProfileForm from './components/ProfileForm';

export const routes = [
  { path: '/users/me', element: <ProfileView /> },
  { path: '/users/me/edit', element: <ProfileForm /> },
  { path: '/users/:id', element: <ProfileView /> },
];

export const navLinks = [{ label: 'Mi perfil', to: '/users/me' }];