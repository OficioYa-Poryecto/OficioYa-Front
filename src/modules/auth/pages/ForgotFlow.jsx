import { useState } from 'react';
import { forgotPassword, resetPassword } from '../services/authService';
import styles from './AuthPage.module.css';

export default function ForgotFlow({ onBack }) {
  const [step, setStep] = useState('email'); // 'email' | 'reset' | 'done'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword({ email });
      setStep('reset');
    } catch (err) {
      if (err.status === 429) setError('Demasiados intentos. Espera unos minutos.');
      else setError(err.message ?? 'Error al enviar el código.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword({ email, code, newPassword });
      setStep('done');
    } catch (err) {
      setError(err.message ?? 'Código inválido o contraseña débil.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'done') {
    return (
      <div className={styles.form}>
        <div className={styles.iconWrap} style={{ color: 'var(--color-success)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className={styles.cardTitle}>¡Contraseña restablecida!</h2>
        <p className={styles.cardDesc}>Ya puedes iniciar sesión con tu nueva contraseña.</p>
        <button className={styles.btnPrimary} onClick={onBack}>Volver al inicio de sesión</button>
      </div>
    );
  }

  if (step === 'reset') {
    return (
      <form onSubmit={handleReset} className={styles.form} noValidate>
        <span className="eyebrow">Restablecer contraseña</span>
        <h2 className={styles.cardTitle}>Ingresa el código</h2>
        <p className={styles.cardDesc}>Revisa tu correo <strong>{email}</strong> e ingresa el código de verificación.</p>

        <label>
          Código OTP
          <input type="text" placeholder="123456" value={code} onChange={(e) => setCode(e.target.value)} required maxLength={8} />
        </label>

        <label>
          Nueva contraseña
          <div className={styles.passWrap}>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button type="button" className={styles.eyeBtn} onClick={() => setShowPass((v) => !v)} aria-label="Mostrar contraseña">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </label>

        {error && <div className={styles.errorBox} role="alert">{error}</div>}
        <button type="submit" className={styles.btnPrimary} disabled={loading}>{loading ? 'Verificando…' : 'Restablecer contraseña'}</button>
        <button type="button" className={styles.linkBtn} onClick={() => setStep('email')}>← Volver</button>
      </form>
    );
  }

  // step === 'email'
  return (
    <form onSubmit={handleForgot} className={styles.form} noValidate>
      <span className="eyebrow">Olvidé mi contraseña</span>
      <h2 className={styles.cardTitle}>Recuperar acceso</h2>
      <p className={styles.cardDesc}>Ingresa tu correo y te enviaremos un código para restablecer tu contraseña.</p>

      <label>
        Correo electrónico
        <input type="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
      </label>

      {error && <div className={styles.errorBox} role="alert">{error}</div>}
      <button type="submit" className={styles.btnPrimary} disabled={loading}>{loading ? 'Enviando…' : 'Enviar código'}</button>
      <button type="button" className={styles.linkBtn} onClick={onBack}>← Volver al inicio de sesión</button>
    </form>
  );
}

