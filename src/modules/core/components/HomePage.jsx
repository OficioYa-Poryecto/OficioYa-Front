import { Navigate } from 'react-router-dom';
import { getSession } from '../lib/session';

export default function HomePage() {
  const session = getSession();
  return <Navigate to={session ? '/home' : '/auth'} replace />;
}
