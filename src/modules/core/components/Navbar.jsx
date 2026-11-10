import { useEffect, useRef, useState } from 'react';
import { Link, matchPath, NavLink, useLocation } from 'react-router-dom';
import logo from '../../../assets/Logo.png';
import ui from '../design-system/ui.module.css';
import Icon from '../design-system/Icon';
import { moduleRoutes, navLinks } from '../lib/moduleRegistry';
import styles from './Navbar.module.css';

function linkClass({ isActive }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}

function menuLinkClass({ isActive }) {
  return isActive ? `${styles.menuLink} ${styles.menuLinkActive}` : styles.menuLink;
}

// account = { initials, name, subtitle?, status?: { label, active }, menu?: [{ to, label }] }
// Si la cuenta trae menu, "Mi cuenta" abre un desplegable con esas secciones.
function UserMenu({ account, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const hasMenu = account.menu?.length > 0;

  // Se cierra al elegir una sección, al hacer clic fuera o con Escape.
  useEffect(() => {
    if (!open) return undefined;
    const onClick = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const contenido = (
    <>
      <span className={`${ui.avatar} ${ui.avatarSmall}`}>{account.initials}</span>
      <span className={styles.userText}>
        <strong>{account.name}</strong>
        <small>{account.subtitle ?? 'Mi cuenta'}</small>
      </span>
      <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>⌄</span>
    </>
  );

  if (!hasMenu) return <div className={styles.userMenu}>{contenido}</div>;

  return (
    <div className={styles.userMenu} ref={ref}>
      <button
        aria-controls="menu-cuenta"
        aria-expanded={open}
        aria-haspopup="true"
        className={styles.userButton}
        onClick={() => setOpen(!open)}
        type="button"
      >
        {contenido}
      </button>
      {open && (
        <div className={styles.dropdown} id="menu-cuenta">
          <nav aria-label="Secciones de mi cuenta" className={styles.menuList}>
            {account.menu.map((item) => (
              <NavLink
                className={menuLinkClass}
                key={item.to}
                onClick={() => { setOpen(false); onNavigate(); }}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          {account.status && (
            <div className={`${styles.menuStatus} ${account.status.active ? styles.menuStatusActive : ''}`}>
              <span /> {account.status.label}
            </div>
          )}
        </div>
      )}
    </div>
  );
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
        {account && <UserMenu account={account} onNavigate={closeMenu} />}
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
