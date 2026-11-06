import MaintenancePage from './pages/MaintenancePage';

export const routes = [
  { path: '/home', element: <MaintenancePage /> },
];

// Sin navLinks: el home no aparece en el menú hasta que esté listo
export const navLinks = [];

