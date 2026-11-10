import { NavLink } from 'react-router-dom';
import Icon from '../../core/design-system/Icon';
import ui from '../../core/design-system/ui.module.css';
import { useMyWorker } from '../hooks/useMyWorker';
import { getSession } from '../services/session';
import styles from './TrabajadorLayout.module.css';

const SECCIONES = [
  { to: '/trabajador/crear', label: 'Crear perfil' },
  { to: '/trabajador/panel', label: 'Mi panel' },
  { to: '/trabajador/oficios', label: 'Mis oficios' },
  { to: '/trabajador/cobertura', label: 'Cobertura' },
  { to: '/trabajador/disponibilidad', label: 'Disponibilidad' },
  { to: '/trabajador/galeria', label: 'Galería' },
];

function TrabajadorLayout({ children }) {
  const { data: perfil } = useMyWorker();
  const cuenta = getSession();
  const activo = perfil?.status === 'ACTIVE';

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.heading}>
          <span className={`${ui.avatar} ${ui.avatarSmall}`}>{cuenta.initials}</span>
          <div>
            <strong>{cuenta.name}</strong>
            <small>Cuenta de trabajador</small>
          </div>
        </div>
        <nav aria-label="Secciones del trabajador" className={styles.nav}>
          {SECCIONES.map((seccion) => (
            <NavLink
              className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
              key={seccion.to}
              to={seccion.to}
            >
              {({ isActive }) => (
                <>
                  <span>{seccion.label}</span>
                  {isActive && <Icon name="arrow" size={16} />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        {perfil && (
          <div className={`${styles.state} ${activo ? styles.stateActive : ''}`}>
            <span /> Perfil {activo ? 'activo' : 'pausado'}
          </div>
        )}
      </aside>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

export default TrabajadorLayout;
