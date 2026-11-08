import { Link, NavLink } from 'react-router-dom';
import logo from '../../../assets/Logo.png';
import { navLinks } from '../lib/moduleRegistry';
import styles from './Navbar.module.css';

function Navbar() {
  return (
    <header className={styles.navbar}>
      <Link to="/" aria-label="OficioYa">
        <img src={logo} alt="OficioYa" className={styles.logo} />
      </Link>
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
    </header>
  );
}

export default Navbar;