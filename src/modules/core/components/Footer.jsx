import logo from '../../../assets/Logo.png';
import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.logoChip}>
        <img src={logo} alt="OficioYa" className={styles.logo} />
      </span>
      <p>Hecho para el trabajo de todos los días.</p>
      <span className={styles.copyright}>© 2026 OficioYa</span>
    </footer>
  );
}

export default Footer;
