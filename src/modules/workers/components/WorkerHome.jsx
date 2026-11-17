import { Navigate } from 'react-router-dom';
import { useMyWorker } from '../hooks/useMyWorker';
import ProfileStatus from './ProfileStatus';

// Con perfil va al panel; sin perfil (GET /workers/me -> 404) va a crear el perfil.
function WorkerHome() {
  const { data: profile, loading, error } = useMyWorker();
  if (loading || error) return <ProfileStatus error={error} loading={loading} />;
  return <Navigate to={profile ? '/worker/dashboard' : '/worker/create'} replace />;
}

export default WorkerHome;
