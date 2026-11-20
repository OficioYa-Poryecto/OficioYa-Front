import SoloAdmin from './components/SoloAdmin';
import AdminReportesPage from './components/AdminReportesPage';

export const routes = [
  {
    path: '/admin/reportes',
    element: (
      <SoloAdmin roles={['ADMIN']}>
        <AdminReportesPage />
      </SoloAdmin>
    ),
  },
];

export const navLinks = [{ label: 'Reportes', to: '/admin/reportes', roles: ['ADMIN'] }];
