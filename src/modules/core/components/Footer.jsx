import { Link } from 'react-router-dom';
import logo from '../../../assets/logo.jpg';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Link to="/" aria-label="OficioYa" className={styles.brand}>
        {/* Cápsula blanca para que el logo con fondo blanco quede bien sobre el footer oscuro */}
        <div className={styles.logoWrap}>
          <img src={logo} alt="OficioYa" className={styles.logo} />
        </div>
      </Link>
      <p className={styles.tagline}>Hecho para el trabajo de todos los días.</p>
      <span className={styles.copy}>© 2026 OficioYa</span>
    </footer>
  );
}
