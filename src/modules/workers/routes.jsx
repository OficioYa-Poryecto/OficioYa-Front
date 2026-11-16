import AvailabilityPage from './components/AvailabilityPage';
import CoveragePage from './components/CoveragePage';
import CreateProfilePage from './components/CreateProfilePage';
import DashboardPage from './components/DashboardPage';
import GalleryPage from './components/GalleryPage';
import MyProfilePage from './components/MyProfilePage';
import PublicProfilePage from './components/PublicProfilePage';
import WorkerHome from './components/WorkerHome';
import WorkerLayout from './components/WorkerLayout';

const withLayout = (page) => <WorkerLayout>{page}</WorkerLayout>;

export const routes = [
  { path: '/worker', element: <WorkerHome /> },
  { path: '/worker/create', element: withLayout(<CreateProfilePage />) },
  { path: '/worker/dashboard', element: withLayout(<DashboardPage />) },
  { path: '/worker/profile', element: withLayout(<MyProfilePage />) },
  { path: '/worker/coverage', element: withLayout(<CoveragePage />) },
  { path: '/worker/availability', element: withLayout(<AvailabilityPage />) },
  { path: '/worker/gallery', element: withLayout(<GalleryPage />) },
  // Perfil público (lo ve un contratante): sin layout del trabajador ni contacto.
  { path: '/workers/:id', element: <PublicProfilePage /> },
];

export const navLinks = [{ label: 'Trabajador', to: '/worker', roles: ['TRABAJADOR'] }];