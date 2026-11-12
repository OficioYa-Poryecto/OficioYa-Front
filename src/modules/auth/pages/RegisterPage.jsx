import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { PASSWORD_RULES, validatePassword } from '../utils/passwordPolicy';
import styles from './RegisterPage.module.css';

// Validación de teléfono colombiano: exactamente 10 dígitos, solo números, empieza por 3
export const PHONE_REGEX = /^3\d{9}$/;

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || '').trim());
}

export default function RegisterPage() {
  const navigate = useNavigate();

  // Campos principales
  const [role, setRole] = useState('CONTRATANTE'); // 'CONTRATANTE' | 'TRABAJADOR'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Teléfonos: 1 a 3 filas, por defecto 1 marcada como principal
  const [phones, setPhones] = useState([
    { number: '', principal: true },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Manejo de teléfonos dinámicos
  const handlePhoneChange = (index, rawValue) => {
    // Solo dígitos y máximo 10
    const cleanDigits = rawValue.replace(/\D/g, '').slice(0, 10);
    setPhones((prev) =>
      prev.map((item, i) => (i === index ? { ...item, number: cleanDigits } : item))
    );
  };

  const handleSetPrincipal = (index) => {
    setPhones((prev) =>
      prev.map((item, i) => ({ ...item, principal: i === index }))
    );
  };

  const handleAddPhone = () => {
    if (phones.length >= 3) return;
    setPhones((prev) => [...prev, { number: '', principal: false }]);
  };

  const handleRemovePhone = (index) => {
    if (phones.length <= 1) return;
    setPhones((prev) => {
      const removed = prev[index];
      const remaining = prev.filter((_, i) => i !== index);
      // Si se elimina la fila principal, marcar la primera restante como principal
      if (removed.principal && remaining.length > 0) {
        remaining[0] = { ...remaining[0], principal: true };
      }
      return remaining;
    });
  };

  // Validaciones antes de enviar
  const validateForm = () => {
    if (!name.trim()) {
      return 'El nombre completo es obligatorio.';
    }
    if (!email.trim()) {
      return 'El correo electrónico es obligatorio.';
    }
    if (!validateEmail(email)) {
      return 'Ingresa un correo electrónico válido (ej. tu@correo.com).';
    }

    // Validar teléfonos
    if (phones.length < 1 || phones.length > 3) {
      return 'Debes registrar entre 1 y 3 números de teléfono.';
    }
    const numbers = phones.map((p) => p.number.trim());
    for (let i = 0; i < numbers.length; i++) {
      const num = numbers[i];
      if (!num) {
        return `El teléfono #${i + 1} no puede estar vacío.`;
      }
      if (!PHONE_REGEX.test(num)) {
        return `El teléfono #${i + 1} (${num}) no es válido. Debe tener 10 dígitos y empezar por 3 (ej. 3001234567).`;
      }
    }
    const uniqueNumbers = new Set(numbers);
    if (uniqueNumbers.size !== numbers.length) {
      return 'No puedes ingresar números de teléfono repetidos.';
    }
    const principalCount = phones.filter((p) => p.principal).length;
    if (principalCount !== 1) {
      return 'Exactamente un teléfono debe estar marcado como principal.';
    }

    // Validar contraseña
    if (!validatePassword(password)) {
      return 'La contraseña no cumple con todas las reglas de seguridad.';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);

    const payload = {
      name: name.trim(),
      email: email.trim(),
      password,
      phones: phones.map((p) => ({
        number: p.number.trim(),
        principal: Boolean(p.principal),
      })),
      roles: [role],
    };

    try {
      await register(payload);
      // Éxito: el backend responde 201 y no devuelve token -> redirigir a /auth?registered=1
      navigate('/auth?registered=1');
    } catch (err) {
      if (err.status === 409) {
        setError('Ese correo ya está registrado.');
      } else if (err.status === 403) {
        setError('No puedes registrarte con ese rol.');
      } else if (err.status === 400) {
        setError(err.message || 'Datos de registro inválidos.');
      } else if (err.status === 503) {
        setError('El servicio no está disponible en este momento. Inténtalo de nuevo en unos minutos.');
      } else {
        setError(err.message || 'No se pudo conectar con el servidor. Inténtalo más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isContratante = role === 'CONTRATANTE';

  // Iniciales para el avatar mock
  const initials = name.trim()
    ? name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('')
    : 'TU';

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Hero */}
        <div className={styles.hero}>
          <span className={styles.eyebrow}>CREA TU CUENTA</span>
          <h1 className={styles.heroTitle}>
            Regístrate como {isContratante ? 'contratante' : 'trabajador'}
          </h1>
          <p className={styles.heroSub}>
            Completa tus datos en pocos minutos. Sin vueltas, como debe ser.
          </p>
        </div>

        {/* Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.stepBadge}>1</div>
            <div className={styles.cardHeaderInfo}>
              <h2 className={styles.cardTitle}>
                Arma tu perfil de {isContratante ? 'contratante' : 'trabajador'}
              </h2>
              <p className={styles.cardSubtitle}>
                {isContratante
                  ? 'Completa tus datos para solicitar servicios con confianza.'
                  : 'Completa tus datos para ofrecer servicios con confianza.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Selector de Rol */}
            <div className={styles.roleSelector} role="radiogroup" aria-label="Selecciona tu rol">
              <button
                type="button"
                className={`${styles.roleOption} ${isContratante ? styles.roleOptionActive : ''}`}
                onClick={() => setRole('CONTRATANTE')}
                role="radio"
                aria-checked={isContratante}
              >
                <span className={styles.roleLabel}>Contratante</span>
                <span className={styles.roleDesc}>Busco contratar servicios o profesionales</span>
              </button>
              <button
                type="button"
                className={`${styles.roleOption} ${!isContratante ? styles.roleOptionActive : ''}`}
                onClick={() => setRole('TRABAJADOR')}
                role="radio"
                aria-checked={!isContratante}
              >
                <span className={styles.roleLabel}>Trabajador</span>
                <span className={styles.roleDesc}>Ofrezco mis servicios y oficios</span>
              </button>
            </div>

            {/* Sección: Tus datos */}
            <h3 className={styles.sectionTitle}>Tus datos</h3>
            <div className={styles.gridTwo}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="name">
                  Nombre completo <span className={styles.required}>*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Escribe tu nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="email">
                  Correo electrónico <span className={styles.required}>*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Teléfonos dinámicos */}
            <div className={styles.phoneSection}>
              <div className={styles.phoneHeader}>
                <span className={styles.label}>
                  Teléfonos de contacto <span className={styles.required}>*</span>
                </span>
                <div className={styles.phoneMeta}>
                  <span>{phones.length} de 3 teléfonos agregados.</span>
                  {phones.length < 3 && (
                    <button
                      type="button"
                      className={styles.addPhoneBtn}
                      onClick={handleAddPhone}
                    >
                      + Agregar otro teléfono
                    </button>
                  )}
                </div>
              </div>

              {phones.map((phone, idx) => (
                <div key={idx} className={styles.phoneRow}>
                  <div className={styles.phoneInputWrap}>
                    <input
                      type="tel"
                      placeholder={idx === 0 ? 'Teléfono principal (ej. 3001234567)' : `Teléfono ${idx + 1}`}
                      value={phone.number}
                      onChange={(e) => handlePhoneChange(idx, e.target.value)}
                      maxLength={10}
                      aria-label={`Número de teléfono ${idx + 1}`}
                      required
                    />
                  </div>

                  <label className={styles.phonePrincipalLabel} title="Marcar como teléfono principal">
                    <input
                      type="radio"
                      name="principalPhone"
                      checked={phone.principal}
                      onChange={() => handleSetPrincipal(idx)}
                      className={styles.phoneRadio}
                    />
                    <span>Principal</span>
                  </label>

                  {phones.length > 1 && (
                    <button
                      type="button"
                      className={styles.removePhoneBtn}
                      onClick={() => handleRemovePhone(idx)}
                      aria-label={`Eliminar teléfono ${idx + 1}`}
                      title="Eliminar teléfono"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Sección: Seguridad */}
            <h3 className={styles.sectionTitle}>Seguridad</h3>
            <div className={styles.gridTwo}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="password">
                  Crea una contraseña <span className={styles.required}>*</span>
                </label>
                <div className={styles.passWrap}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Escribe una contraseña segura"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Checklist de requisitos de contraseña */}
              <div className={styles.checklistCard}>
                <div className={styles.checklistTitle}>Tu contraseña debe tener:</div>
                <ul className={styles.checklist}>
                  {PASSWORD_RULES.map((rule) => {
                    const valid = rule.validate(password);
                    return (
                      <li
                        key={rule.id}
                        className={`${styles.checkItem} ${valid ? styles.checkItemValid : ''}`}
                      >
                        {valid ? (
                          <span className={styles.checkIconValid}>✓</span>
                        ) : (
                          <span className={styles.checkIconPending} />
                        )}
                        <span>{rule.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Sección: Foto de perfil (opcional, visual) */}
            <h3 className={styles.sectionTitle}>Foto de perfil</h3>
            <div className={styles.photoBox}>
              <div className={styles.avatarMock}>{initials}</div>
              <div className={styles.photoInfo}>
                <div className={styles.photoTitle}>Agrega una foto clara y reciente</div>
                <div className={styles.photoDesc}>
                  Para este perfil es opcional. JPG o PNG, máximo 5 MB.
                </div>
                <div className={styles.photoActions}>
                  <button type="button" className={styles.btnPhotoUpload}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Subir foto
                  </button>
                  <button type="button" className={styles.btnPhotoAvatar}>
                    Usar avatar
                  </button>
                </div>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className={styles.errorBanner} role="alert">
                <span className={styles.errorIcon}>!</span>
                <span>{error}</span>
              </div>
            )}

            {/* Footer actions */}
            <div className={styles.actionsFooter}>
              <Link to="/auth" className={styles.linkBack}>
                Volver
              </Link>
              <button
                type="submit"
                className={styles.btnSubmit}
                disabled={loading}
              >
                {loading ? 'Creando cuenta…' : 'Crear mi cuenta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

