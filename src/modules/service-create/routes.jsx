import CreateRequestPage from './components/CreateRequestPage';

export const routes = [
  { path: '/nueva-solicitud', element: <CreateRequestPage /> },
  { path: '/nueva-solicitud/:workerId', element: <CreateRequestPage /> },
];
export const navLinks = [{ label: 'Nueva solicitud', to: '/nueva-solicitud' }];