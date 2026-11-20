import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../../assets/Logo.png';
import { getProfilePhotoUrl } from '../lib/imageService';
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
  const [session, setSession] = useState(() => getSession());
  const userRoles = (session?.roles ?? []).map((r) => String(r).toUpperCase());
  const isAdmin = userRoles.includes('ADMIN');

  const [userName, setUserName] = useState(
    () => localStorage.getItem('oy_userName') || ''
  );
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function syncProfileName() {
      const stored = localStorage.getItem('oy_userName');
      if (stored) setUserName(stored);
      const currentSession = getSession();
      setSession(currentSession);
      if (currentSession?.userId) {
        getProfilePhotoUrl(currentSession.userId, currentSession.token).then((url) => {
          setAvatarUrl(url);
        });
      }
    }
    syncProfileName();
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

  const MENU_ORDER = [
    '/home',
    '/buscar',
    '/nueva-solicitud',
    '/solicitudes',
    '/mis-servicios',
    '/worker',
  ];

  const visibleLinks = navLinks
    .filter((link) => {
      // Quitar 'Mi perfil' del menu para evitar redundancia
      if (link.to === '/users/me') return false;
      // Ocultar 'Registrarse' en el menú superior cuando ya hay sesión activa
      if (session && link.to === '/register') return false;
      if (!link.roles || link.roles.length === 0) return true;
      return link.roles.some((r) => userRoles.includes(String(r).toUpperCase()));
    })
    .sort((a, b) => {
      const idxA = MENU_ORDER.indexOf(a.to);
      const idxB = MENU_ORDER.indexOf(b.to);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });

  function handleLogout() {
    setMenuOpen(false);
    localStorage.removeItem('oy_userName');
    clearSession();
    navigate('/auth', { replace: true });
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setDrawerOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className={styles.navbar}>
      <div className={styles.leftArea}>
        {!isAuthPage && (
          <button
            type="button"
            className={styles.hamburgerBtn}
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menú de navegación"
            aria-expanded={drawerOpen}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <Link to={session ? '/home' : '/'} aria-label="OficioYa" className={styles.brandLink}>
          <img src={logo} alt="OficioYa" className={styles.logo} />
        </Link>
      </div>

      {/* Acceso a cuenta / perfil a la derecha */}
      {!isAuthPage && (
        <div className={styles.rightArea}>
          {session && (
            <div className={styles.accountWrap} ref={menuRef}>
              <button
                type="button"
                className={styles.accountBtn}
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
              >
                <span className={styles.avatar}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className={styles.avatarImg} />
                  ) : (
                    getInitials(userName)
                  )}
                </span>
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
          )}
        </div>
      )}

      {/* Drawer lateral en pantallas pequeñas */}
      {!isAuthPage && drawerOpen && (
        <div
          className={styles.drawerBackdrop}
          onClick={() => setDrawerOpen(false)}
          role="presentation"
        >
          <aside
            className={styles.drawer}
            onClick={(e) => e.stopPropagation()}
            aria-label="Menú principal de navegación"
          >
            <div className={styles.drawerHeader}>
              <img src={logo} alt="OficioYa" className={styles.drawerLogo} />
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setDrawerOpen(false)}
                aria-label="Cerrar menú"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav className={styles.drawerLinks}>
              {visibleLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.drawerLink} ${styles.drawerActive}`
                      : styles.drawerLink
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {session && (
              <div className={styles.drawerFooter}>
                <div className={styles.drawerUser}>
                  <span className={styles.avatar}>
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="" className={styles.avatarImg} />
                    ) : (
                      getInitials(userName)
                    )}
                  </span>
                  <div>
                    <div className={styles.accountName}>{userName || 'Usuario'}</div>
                    <div className={styles.accountSub}>Sesión iniciada</div>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </header>
  );
}

export default Navbar;
