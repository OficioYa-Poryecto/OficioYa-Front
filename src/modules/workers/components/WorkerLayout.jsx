import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../core/design-system/Button';
import { clearSession, getSession } from '../../core/lib/session';
import StatusMessage from './ui/StatusMessage';
import styles from './WorkerLayout.module.css';
import Icon from './ui/Icon';
import worker from './worker.module.css';

const TABS = [
  { to: '/worker/dashboard', label: 'Resumen', icon: 'clipboard' },
  { to: '/worker/profile', label: 'Mi perfil', icon: 'user' },
  { to: '/worker/coverage', label: 'Cobertura', icon: 'map' },
  { to: '/worker/availability', label: 'Disponibilidad', icon: 'clock' },
  { to: '/worker/gallery', label: 'Galería', icon: 'image' },
];

function WorkerLayout({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(() => getSession());

  useEffect(() => {
    const handleUpdate = () => setSession(getSession());
    window.addEventListener('oy-profile-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('oy-profile-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const roles = (session?.roles ?? []).map((role) => String(role).toUpperCase());
  const isWorker = roles.includes('TRABAJADOR');

  const loginAgain = () => {
    localStorage.removeItem('oy_userName');
    clearSession();
    navigate('/auth', { replace: true });
  };

  return (
    <div className={`${styles.content} ${worker.tokens}`}>
      {!isWorker && (
        <div className={styles.notice}>
          <StatusMessage variant="warning">
            Tu sesión no incluye el rol Trabajador. Vuelve a iniciar sesión para activarlo.
          </StatusMessage>
          <Button type="button" variant="secondary" onClick={loginAgain}>Volver a iniciar sesión</Button>
        </div>
      )}
      {pathname !== '/worker/create' && (
        <nav aria-label="Secciones del trabajador" className={styles.tabs}>
          {TABS.map((tab) => (
            <NavLink
              className={({ isActive }) => (isActive ? styles.tabActive : styles.tab)}
              key={tab.to}
              to={tab.to}
            >
              <Icon name={tab.icon} size={16} />
              {tab.label}
            </NavLink>
          ))}
        </nav>
      )}
      {children}
    </div>
  );
}

export default WorkerLayout;