import HomePage from './pages/HomePage';
import MaintenancePage from './pages/MaintenancePage';

export const routes = [
  { path: '/home', element: <HomePage /> },
  { path: '/maintenance', element: <MaintenancePage /> },
];

export const navLinks = [
  { label: 'Inicio', to: '/home' },
];
