import styles from './MaintenancePage.module.css';

export default function MaintenancePage() {
  const roles = JSON.parse(localStorage.getItem('oy_roles') ?? '[]');
  const isAdmin = roles.includes('ADMINISTRATOR');

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Ícono de herramienta */}
        <div className={styles.iconWrap}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>

        <span className="eyebrow">Próximamente</span>
        <h1 className={styles.title}>Estamos construyendo algo genial</h1>
        <p className={styles.desc}>
          Esta sección está en desarrollo. Pronto encontrarás aquí tu panel principal
          con todas las funcionalidades de OficioYa.
        </p>

        <div className={styles.features}>
          {[
            { icon: '🔍', text: 'Buscar y contratar profesionales' },
            { icon: '📋', text: 'Gestionar tus solicitudes de servicio' },
            { icon: '⭐', text: 'Ver valoraciones y reseñas' },
            { icon: '💬', text: 'Mensajería directa con trabajadores' },
          ].map(({ icon, text }) => (
            <div key={text} className={styles.featureItem}>
              <span className={styles.featureIcon}>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        {isAdmin && (
          <div className={styles.adminBadge}>
            🛡️ Sesión de administrador activa
          </div>
        )}

        <button
          className={styles.logoutBtn}
          onClick={() => {
            localStorage.removeItem('oy_token');
            localStorage.removeItem('oy_userId');
            localStorage.removeItem('oy_roles');
            window.location.href = '/auth';
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

