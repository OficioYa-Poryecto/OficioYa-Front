import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterPanel from './RegisterPanel';
import ForgotFlow from './ForgotFlow';
import styles from './AuthPage.module.css';

export default function AuthPage() {
  const [view, setView] = useState('login'); // 'login' | 'forgot'

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <span className="eyebrow">Bienvenido a OficioYa</span>
        <h1 className={styles.heroTitle}>Tu espacio en OficioYa</h1>
        <p className={styles.heroSub}>
          <a href="#login" onClick={(e) => { e.preventDefault(); setView('login'); }}>
            Inicia sesión
          </a>{' '}
          si ya tienes cuenta o crea una nueva para empezar.
        </p>
      </div>

      {/* Two-panel grid */}
      <div className={styles.grid}>
        {/* Left: login / forgot */}
        <div className={styles.loginCard}>
          {view === 'forgot' ? (
            <ForgotFlow onBack={() => setView('login')} />
          ) : (
            <LoginForm onForgot={() => setView('forgot')} />
          )}
        </div>

        {/* Right: register teaser */}
        <RegisterPanel />
      </div>
    </div>
  );
}

