import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../../../assets/logo.jpg';
import { navLinks } from '../lib/moduleRegistry';
import styles from './Navbar.module.css';

function Navbar() {
  const { pathname } = useLocation();
  const isAuthPage = pathname.startsWith('/auth');

  return (
    <header className={styles.navbar}>
      <Link to="/" aria-label="OficioYa">
        <img src={logo} alt="OficioYa" className={styles.logo} />
      </Link>

      {/* En la página de autenticación no se muestran links de navegación */}
      {!isAuthPage && (
        <nav className={styles.links}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
