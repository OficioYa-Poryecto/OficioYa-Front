import { useState } from 'react';
import { Link, matchPath, NavLink, useLocation } from 'react-router-dom';
import logo from '../../../assets/Logo.png';
import ui from '../design-system/ui.module.css';
import Icon from '../design-system/Icon';
import { moduleRoutes, navLinks } from '../lib/moduleRegistry';
import styles from './Navbar.module.css';

function linkClass({ isActive }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}

function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Provisional: la cuenta sale de la ruta actual hasta que exista la sesión real.
  const account = moduleRoutes.find((route) => matchPath(route.path, pathname))?.account;
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.navbar}>
      <Link to="/" aria-label="OficioYa" onClick={closeMenu}>
        <img src={logo} alt="OficioYa" className={styles.logo} />
      </Link>
      <nav className={`${styles.links} ${menuOpen ? styles.linksOpen : ''}`}>
        <NavLink to="/acceso" className={linkClass} onClick={closeMenu}>
          Inicio
        </NavLink>
        {account && navLinks.map((link) => (
          <NavLink key={link.to} to={link.to} className={linkClass} onClick={closeMenu}>
            {link.label}
          </NavLink>
        ))}
        {account && (
          <div className={styles.userMenu}>
            <span className={`${ui.avatar} ${ui.avatarSmall}`}>{account.initials}</span>
            <span className={styles.userText}>
              <strong>{account.name}</strong>
              <small>Mi cuenta</small>
            </span>
            <span className={styles.chevron}>⌄</span>
          </div>
        )}
      </nav>
      <button
        type="button"
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={menuOpen}
        className={styles.mobileMenu}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Icon name={menuOpen ? 'close' : 'menu'} />
      </button>
    </header>
  );
}

export default Navbar;
