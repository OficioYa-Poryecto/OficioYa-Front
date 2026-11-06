import { Navigate } from 'react-router-dom';

// La home por defecto redirige a /auth
export default function HomePage() {
  return <Navigate to="/auth" replace />;
}
