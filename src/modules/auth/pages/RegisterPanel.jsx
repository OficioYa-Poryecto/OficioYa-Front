import { Link } from 'react-router-dom';
import styles from './AuthPage.module.css';

const BENEFITS = [
  'Perfil adaptado a tu rol',
  'Datos personales protegidos',
  'Sin pagos ni comisiones',
];

export default function RegisterPanel() {
  return (
    <div className={styles.registerPanel}>
      <div className={styles.iconWrap}>
        {/* Person icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>

      <span className="eyebrow">Soy nuevo en OficioYa</span>
      <h2 className={styles.cardTitle}>Crear una cuenta</h2>
      <p className={styles.cardDesc}>
        Completa tus datos y configura tu perfil. Es gratis y solo toma unos minutos.
      </p>

      <ul className={styles.benefits}>
        {BENEFITS.map((b) => (
          <li key={b} className={styles.benefitItem}>
            <span className={styles.checkIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            {b}
          </li>
        ))}
      </ul>

      <Link to="/auth/register" className={styles.btnOutline}>
        Crear cuenta
      </Link>
    </div>
  );
}

