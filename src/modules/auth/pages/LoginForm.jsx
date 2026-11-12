import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { login } from '../services/authService';
import { saveSession } from '../../core/lib/session';
import styles from './AuthPage.module.css';

// Validación manual en español (no dependemos del idioma del navegador)
function validar({ email, password }) {
  if (!email.trim()) return 'El correo electrónico es obligatorio.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return 'Ingresa un correo electrónico válido (ej. tu@correo.com).';
  if (!password) return 'La contraseña es obligatoria.';
  return null;
}

export default function LoginForm({ onForgot }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(() => {
    if (searchParams.get('registered') === '1') {
      return 'Cuenta creada. Ya puedes iniciar sesión.';
    }
    if (searchParams.get('expired') === '1') {
      return 'Tu sesión expiró. Inicia sesión de nuevo.';
    }
    return '';
  });
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validar(form);
    if (err) { setError(err); return; }

    setError('');
    setLoading(true);
    try {
      const data = await login(form);
      saveSession({
        token: data.token,
        userId: data.userId,
        roles: data.roles,
        expiresInSeconds: data.expiresInSeconds,
      });
      navigate('/home');
    } catch (err) {
      if (err.status === 423)
        setError('Cuenta bloqueada temporalmente por múltiples intentos fallidos. Intenta más tarde.');
      else if (err.status === 401)
        setError('El correo o la contraseña son incorrectos.');
      else if (err.status === 403)
        setError('Tu cuenta está inactiva. Contacta a soporte.');
      else if (err.status === 503)
        setError('El servicio no está disponible en este momento. Inténtalo de nuevo en unos minutos.');
      else
        setError('No se pudo iniciar sesión. Verifica tu conexión e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <div className={styles.iconWrap}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      <span className="eyebrow">Ya tengo una cuenta</span>
      <h2 className={styles.cardTitle}>Iniciar sesión</h2>
      <p className={styles.cardDesc}>Ingresa tus datos para continuar a tu perfil.</p>

      <label>
        <span>
          Correo electrónico <span className={styles.required}>*</span>
        </span>
        <input
          type="email"
          placeholder="tu@correo.com"
          value={form.email}
          onChange={set('email')}
          autoComplete="email"
        />
      </label>

      <label>
        <span>
          Contraseña <span className={styles.required}>*</span>
        </span>
        <div className={styles.passWrap}>
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="Tu contraseña"
            value={form.password}
            onChange={set('password')}
            autoComplete="current-password"
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowPass((v) => !v)}
            aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPass ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </label>

      {error && (
        <div className={styles.errorBox} role="alert">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      <button type="submit" className={styles.btnPrimary} disabled={loading}>
        {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
      </button>

      <button type="button" className={styles.linkBtn} onClick={onForgot}>
        ¿Olvidaste tu contraseña?
      </button>
    </form>
  );
}
