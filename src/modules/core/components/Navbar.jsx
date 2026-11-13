import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.jpg';
import { clearSession, getSession } from '../lib/session';
import { navLinks } from '../lib/moduleRegistry';
import styles from './Navbar.module.css';

function getInitials(name) {
  if (!name || typeof name !== 'string') return 'OY';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'OY';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function getFirstName(name) {
  if (!name || typeof name !== 'string') return 'Usuario';
  const first = name.trim().split(/\s+/)[0];
  return first || 'Usuario';
}

function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isAuthPage = pathname.startsWith('/auth');
  const session = getSession();
  const userRoles = (session?.roles ?? []).map((r) => String(r).toUpperCase());
  const isAdmin = userRoles.includes('ADMIN');

  const [userName, setUserName] = useState(
    () => localStorage.getItem('oy_userName') || (isAdmin ? 'Laura Pérez' : 'Ana Castro')
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function syncProfileName() {
      const stored = localStorage.getItem('oy_userName');
      if (stored) setUserName(stored);
    }
    window.addEventListener('oy-profile-updated', syncProfileName);
    window.addEventListener('storage', syncProfileName);
    return () => {
      window.removeEventListener('oy-profile-updated', syncProfileName);
      window.removeEventListener('storage', syncProfileName);
    };
  }, []);

  useEffect(() => {
    function handleOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const visibleLinks = navLinks.filter((link) => {
    // Ocultar 'Registrarse' en el menú superior cuando ya hay sesión activa
    if (session && link.to === '/register') return false;
    if (!link.roles || link.roles.length === 0) return true;
    return link.roles.some((r) => userRoles.includes(String(r).toUpperCase()));
  });

  function handleLogout() {
    setMenuOpen(false);
    localStorage.removeItem('oy_userName');
    clearSession();
    navigate('/auth', { replace: true });
  }

  return (
    <header className={styles.navbar}>
      <Link to={session ? '/home' : '/'} aria-label="OficioYa" className={styles.brandLink}>
        <img src={logo} alt="OficioYa" className={styles.logo} />
      </Link>

      {/* En la página de autenticación no se muestran links de navegación */}
      {!isAuthPage && (
        <div className={styles.rightArea}>
          <nav className={styles.links}>
            {visibleLinks.map((link) => (
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

          {session && (
            <>
              <span className={styles.divider} aria-hidden="true" />
              <div className={styles.accountWrap} ref={menuRef}>
                <button
                  type="button"
                  className={styles.accountBtn}
                  onClick={() => setMenuOpen((prev) => !prev)}
                  aria-expanded={menuOpen}
                >
                  <span className={styles.avatar}>{getInitials(userName)}</span>
                  <span className={styles.accountText}>
                    <span className={styles.accountName}>{getFirstName(userName)}</span>
                    <span className={styles.accountSub}>
                      Mi cuenta
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </span>
                </button>

                {menuOpen && (
                  <div className={styles.dropdown}>
                    <Link
                      to="/users/me"
                      className={styles.dropdownItem}
                      onClick={() => setMenuOpen(false)}
                    >
                      Ver mi perfil
                    </Link>
                    <Link
                      to="/users/me/edit"
                      className={styles.dropdownItem}
                      onClick={() => setMenuOpen(false)}
                    >
                      Editar perfil
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin/users"
                        className={styles.dropdownItem}
                        onClick={() => setMenuOpen(false)}
                      >
                        Gestión de usuarios
                      </Link>
                    )}
                    <button
                      type="button"
                      className={`${styles.dropdownItem} ${styles.logoutItem}`}
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
