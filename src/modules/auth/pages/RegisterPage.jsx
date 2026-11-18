import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { uploadImage } from '../../core/lib/imageService';
import { login, register } from '../services/authService';
import { PASSWORD_RULES, validatePassword } from '../utils/passwordPolicy';
import styles from './RegisterPage.module.css';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

// Validación de teléfono colombiano: exactamente 10 dígitos, solo números, empieza por 3
export const PHONE_REGEX = /^3\d{9}$/;

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || '').trim());
}

// Fecha máxima permitida para ser mayor de 18 años (hoy menos 18 años en formato AAAA-MM-DD)
function getMaxAdultBirthDate() {
  const today = new Date();
  const year = today.getFullYear() - 18;
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isAdultBirthDate(dateStr) {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  return dateStr <= getMaxAdultBirthDate();
}

const ROLE_OPTIONS = [
  {
    id: 'CONTRATANTE',
    title: 'Quiero contratar',
    desc: 'Busco personas de confianza para resolver trabajos.',
    roles: ['CONTRATANTE'],
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    id: 'TRABAJADOR',
    title: 'Quiero ofrecer mi oficio',
    desc: 'Quiero mostrar mi trabajo y recibir solicitudes.',
    roles: ['TRABAJADOR'],
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    id: 'AMBOS',
    title: 'Quiero hacer ambas cosas',
    desc: 'Contratar servicios y ofrecer mi oficio con una cuenta.',
    roles: ['CONTRATANTE', 'TRABAJADOR'],
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();

  // Rol seleccionado ('CONTRATANTE' | 'TRABAJADOR' | 'AMBOS')
  const [selectedRoleId, setSelectedRoleId] = useState('CONTRATANTE');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthDateTouched, setBirthDateTouched] = useState(false);
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  // Se activa al dar clic en "Crear mi cuenta" para resaltar lo que falta
  const [submitted, setSubmitted] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  // Teléfonos: 1 a 3 filas, por defecto 1 marcada como principal
  const [phones, setPhones] = useState([
    { number: '', principal: true },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const fileInputRef = useRef(null);

  // El correo se valida al salir del campo; si ya se mostró el error, se revalida mientras corrige
  const emailInvalid = emailTouched && email.trim() !== '' && !validateEmail(email);

  // Errores por campo: se muestran tras intentar enviar y se actualizan mientras el usuario corrige
  const REQUIRED_MSG = 'Este campo es obligatorio.';
  const maxBirthDate = getMaxAdultBirthDate();
  const nameError = submitted && !name.trim() ? REQUIRED_MSG : null;
  const birthDateError =
    submitted && !birthDate
      ? REQUIRED_MSG
      : (submitted || birthDateTouched) && birthDate && !isAdultBirthDate(birthDate)
        ? 'Debes ser mayor de edad para registrarte.'
        : null;
  const emailError =
    submitted && !email.trim()
      ? REQUIRED_MSG
      : emailInvalid
        ? 'Este correo no es válido. Revisa que tenga el formato nombre@correo.com'
        : null;
  const passwordError = !submitted
    ? null
    : !password
      ? REQUIRED_MSG
      : !validatePassword(password)
        ? 'Tu contraseña aún no cumple todos los requisitos.'
        : null;
  const phoneErrors = phones.map((p, idx) => {
    if (!submitted) return null;
    const num = p.number.trim();
    if (!num) return REQUIRED_MSG;
    if (!PHONE_REGEX.test(num)) return 'Debe tener 10 dígitos y empezar por 3.';
    // Repetido: se marca a partir de la segunda vez que aparece
    if (phones.slice(0, idx).some((prev) => prev.number.trim() === num)) {
      return 'Este número ya lo agregaste.';
    }
    return null;
  });
  const missingRules = PASSWORD_RULES.filter((rule) => !rule.validate(password));

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_MIME.has(file.type)) {
      setError('Formato de imagen no válido. Usa JPG, PNG o WebP.');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError('La imagen supera el tamaño máximo permitido de 5 MB.');
      e.target.value = '';
      return;
    }
    setError('');
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // Quita la foto elegida y vuelve al avatar con iniciales
  const handleRemovePhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoFile(null);
    setPhotoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
    if (!birthDate) {
      return 'La fecha de nacimiento es obligatoria.';
    }
    if (!isAdultBirthDate(birthDate)) {
      return 'Debes ser mayor de edad para registrarte.';
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
    setEmailTouched(true);
    setBirthDateTouched(true);
    setSubmitted(true);
    const validationError = validateForm();
    if (validationError) {
      // Sin mensaje abajo: los campos con problema ya se resaltan en rojo
      setError('');
      // Llevar al usuario al primer campo obligatorio que falta o es inválido
      // (setTimeout espera a que React pinte los campos marcados)
      setTimeout(() => {
        document.querySelector('form [aria-invalid="true"]')?.focus();
      }, 0);
      return;
    }

    setError('');
    setLoading(true);

    const chosenRole =
      ROLE_OPTIONS.find((r) => r.id === selectedRoleId) || ROLE_OPTIONS[0];

    const payload = {
      name: name.trim(),
      email: email.trim(),
      password,
      birthDate,
      phones: phones.map((p) => ({
        number: p.number.trim(),
        principal: Boolean(p.principal),
      })),
      roles: chosenRole.roles,
    };

    try {
      const createdUser = await register(payload);
      if (photoFile) {
        try {
          const authData = await login({
            email: payload.email,
            password: payload.password,
          });
          const targetUserId = createdUser?.id || authData?.userId;
          if (authData?.token && targetUserId) {
            await uploadImage({
              file: photoFile,
              rootId: targetUserId,
              tipo: 'PROFILE',
              token: authData.token,
            });
          }
        } catch {
          // Si falla la subida opcional de foto, no bloqueamos la cuenta recién creada
        }
      }
      // Éxito: redirigir a /auth?registered=1
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
            Elige cómo<br />
            usar <span className={styles.brandHighlight}>OficioYa</span>
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
              <h2 className={styles.cardTitle}>¿Cómo quieres usar tu cuenta?</h2>
              <p className={styles.cardSubtitle}>
                No te preocupes, puedes cambiarlo más adelante desde tu cuenta.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Selector de Rol (3 tarjetas) */}
            <div className={styles.roleGrid} role="radiogroup" aria-label="¿Cómo quieres usar tu cuenta?">
              {ROLE_OPTIONS.map((opt) => {
                const isActive = selectedRoleId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`${styles.roleCard} ${isActive ? styles.roleCardActive : ''}`}
                    onClick={() => setSelectedRoleId(opt.id)}
                    role="radio"
                    aria-checked={isActive}
                  >
                    <div className={styles.roleCardTop}>
                      <div className={styles.roleIconWrap}>{opt.icon}</div>
                      <div
                        className={`${styles.radioIndicator} ${isActive ? styles.radioIndicatorActive : ''}`}
                      >
                        {isActive && <div className={styles.radioDot} />}
                      </div>
                    </div>
                    <div className={styles.roleCardTitle}>{opt.title}</div>
                    <div className={styles.roleCardDesc}>{opt.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Sección: Información de la cuenta (correo izquierda, contraseña derecha) */}
            <div className={styles.sectionHeader}>
              <div className={styles.stepBadge}>2</div>
              <h3 className={styles.sectionTitle}>Información de la cuenta</h3>
            </div>
            <div className={styles.gridTwo}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="email">
                  <span>
                    Correo electrónico <span className={styles.required}>*</span>
                  </span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  autoComplete="email"
                  className={emailError ? styles.inputInvalid : undefined}
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={emailError ? 'email-error' : undefined}
                  required
                />
                {emailError && (
                  <span id="email-error" className={styles.fieldError} role="alert">
                    {emailError}
                  </span>
                )}
              </div>

              <div className={`${styles.formGroup} ${styles.passwordGroup}`}>
                <label className={styles.label} htmlFor="password">
                  <span>
                    Crea una contraseña <span className={styles.required}>*</span>
                  </span>
                </label>
                <div
                  className={styles.passWrap}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      setPasswordFocused(false);
                    }
                  }}
                >
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className={passwordError ? styles.inputInvalid : undefined}
                    aria-invalid={Boolean(passwordError)}
                    aria-describedby={passwordError ? 'password-error' : undefined}
                    required
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onMouseDown={(e) => e.preventDefault()}
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

                {passwordError && (
                  <span id="password-error" className={styles.fieldError}>
                    {passwordError}
                  </span>
                )}

                {/* Requisitos pendientes: globo a un lado, solo lo que falta y solo mientras se escribe */}
                {passwordFocused && missingRules.length > 0 && (
                  <div className={styles.passHint} role="status" aria-live="polite">
                    <div className={styles.passHintTitle}>Te falta:</div>
                    <ul className={styles.passHintList}>
                      {missingRules.map((rule) => (
                        <li key={rule.id}>{rule.label}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Sección: Tus datos (nombre, fecha de nacimiento, teléfonos y foto) */}
            <div className={`${styles.sectionHeader} ${styles.sectionHeaderDivided}`}>
              <div className={styles.stepBadge}>3</div>
              <h3 className={styles.sectionTitle}>Tus datos</h3>
            </div>
            <div className={styles.gridTwo}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="name">
                  <span>
                    Nombre completo <span className={styles.required}>*</span>
                  </span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className={nameError ? styles.inputInvalid : undefined}
                  aria-invalid={Boolean(nameError)}
                  aria-describedby={nameError ? 'name-error' : undefined}
                  required
                />
                {nameError && (
                  <span id="name-error" className={styles.fieldError}>
                    {nameError}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="birthDate">
                  <span>
                    Fecha de nacimiento <span className={styles.required}>*</span>
                  </span>
                </label>
                <input
                  id="birthDate"
                  type="date"
                  max={maxBirthDate}
                  value={birthDate}
                  onChange={(e) => {
                    setBirthDate(e.target.value);
                    setBirthDateTouched(true);
                  }}
                  onBlur={() => setBirthDateTouched(true)}
                  autoComplete="bday"
                  className={birthDateError ? styles.inputInvalid : undefined}
                  aria-invalid={Boolean(birthDateError)}
                  aria-describedby={birthDateError ? 'birthdate-error' : undefined}
                  required
                />
                {birthDateError && (
                  <span id="birthdate-error" className={styles.fieldError} role="alert">
                    {birthDateError}
                  </span>
                )}
              </div>
            </div>

            {/* Teléfonos dinámicos */}
            <div className={styles.phoneSection}>
              <div className={styles.phoneHeader}>
                <span className={styles.label}>
                  <span>
                    Teléfonos de contacto <span className={styles.required}>*</span>
                  </span>
                </span>
                <div className={styles.phoneMeta}>
                  <span>Puedes agregar hasta 3 teléfonos.</span>
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
                <div key={idx} className={styles.phoneItem}>
                <div className={styles.phoneRow}>
                  <div className={styles.phoneInputWrap}>
                    <input
                      type="tel"
                      placeholder="Número de teléfono"
                      value={phone.number}
                      onChange={(e) => handlePhoneChange(idx, e.target.value)}
                      maxLength={10}
                      aria-label={`Número de teléfono ${idx + 1}`}
                      className={phoneErrors[idx] ? styles.inputInvalid : undefined}
                      aria-invalid={Boolean(phoneErrors[idx])}
                      aria-describedby={phoneErrors[idx] ? `phone-error-${idx}` : undefined}
                      required
                    />
                  </div>

                  {/* Con un solo teléfono, ese es el principal: el selector solo aparece desde 2 */}
                  {phones.length > 1 && (
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
                  )}

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
                {phoneErrors[idx] && (
                  <span id={`phone-error-${idx}`} className={`${styles.fieldError} ${styles.phoneError}`}>
                    {phoneErrors[idx]}
                  </span>
                )}
                </div>
              ))}
            </div>

            {/* Foto de perfil (opcional, conectada a image-service) */}
            <span className={`${styles.label} ${styles.photoLabel}`}>Foto de perfil</span>
            <div className={styles.photoBox}>
              <div className={styles.avatarMock}>
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Vista previa de perfil"
                    className={styles.avatarPreviewImg}
                  />
                ) : (
                  initials
                )}
              </div>
              <div className={styles.photoInfo}>
                <div className={styles.photoTitle}>Agrega una foto clara y reciente</div>
                <div className={styles.photoDesc}>
                  {photoFile
                    ? `Archivo seleccionado: ${photoFile.name}`
                    : 'Es opcional. Si no subes una, te asignamos un avatar con tus iniciales. JPG, PNG o WebP, máximo 5 MB.'}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
                <div className={styles.photoActions}>
                  <button
                    type="button"
                    className={styles.btnPhotoUpload}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    {photoFile ? 'Cambiar foto' : 'Subir foto'}
                  </button>
                  {photoFile && (
                    <button
                      type="button"
                      className={styles.btnPhotoRemove}
                      onClick={handleRemovePhoto}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                      </svg>
                      Borrar foto
                    </button>
                  )}
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