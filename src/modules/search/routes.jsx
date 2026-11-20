import BusquedaPage from './components/BusquedaPage';

export const routes = [
  {
    path: '/buscar',
    element: <BusquedaPage />,
  },
];

export const navLinks = [{ label: 'Buscar', to: '/buscar' }];
