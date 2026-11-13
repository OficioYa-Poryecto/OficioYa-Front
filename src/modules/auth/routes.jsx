import AuthPage from './pages/AuthPage';
import RegisterPage from './pages/RegisterPage';

export const routes = [
  { path: '/auth', element: <AuthPage /> },
  { path: '/auth/register', element: <RegisterPage /> },
];

export const navLinks = [];
