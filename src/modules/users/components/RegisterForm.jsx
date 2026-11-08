import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../core/design-system/Button';
import ErrorMessage from '../../core/components/ErrorMessage';
import { MAX_TELEFONOS, validarTelefono } from '../config';
import { registrarCuenta } from '../services/profileService';
import styles from './Form.module.css';

// Mismos límites que valida el back (UserRequestDTO)
const MAX_NOMBRE = 100;
const MAX_CORREO = 150;
const MIN_CONTRASENA = 12;

// Requisitos de la contraseña (la valida y guarda Identity; aquí solo se revisa antes de enviar)
const REGLAS_CONTRASENA = [
  { texto: `Mínimo ${MIN_CONTRASENA} caracteres`, cumple: (c) => c.length >= MIN_CONTRASENA },
  { texto: 'Una letra mayúscula', cumple: (c) => /\p{Lu}/u.test(c) },
  { texto: 'Una letra minúscula', cumple: (c) => /\p{Ll}/u.test(c) },
  { texto: 'Un número', cumple: (c) => /[0-9]/.test(c) },
  { texto: 'Un carácter especial', cumple: (c) => /[^\p{L}0-9\s]/u.test(c) },
];

function validar({ nombre, correo, contrasena, telefonos }) {
  const errores = {};
  if (nombre.trim() === '') {
    errores.nombre = 'El nombre es obligatorio';
  }
  if (correo.trim() === '') {
    errores.correo = 'El correo es obligatorio';
  } else if (!/^\S+@\S+\.\S+$/.test(correo.trim())) {
    errores.correo = 'El correo no tiene un formato válido';
  }
  if (!REGLAS_CONTRASENA.every((regla) => regla.cumple(contrasena))) {
    errores.contrasena = 'La contraseña no cumple los requisitos';
  }
  telefonos.forEach((numero, i) => {
    const error = validarTelefono(numero) ?? (telefonos.indexOf(numero) < i ? 'Número repetido' : null);
    if (error) {
      errores[`telefono${i}`] = error;
    }
  });
  return errores;
}

// RF-01: todos quedan como CONTRATANTE y deciden si también quieren ser TRABAJADOR
function RegisterForm() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [escribiendoContrasena, setEscribiendoContrasena] = useState(false);
  const [verContrasena, setVerContrasena] = useState(false);
  const [telefonos, setTelefonos] = useState(['']); // el primero es el principal
  const [trabajador, setTrabajador] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [registrado, setRegistrado] = useState(false);
  const navigate = useNavigate();

  const errores = validar({ nombre, correo, contrasena, telefonos });
  const reglasPendientes = REGLAS_CONTRASENA.filter((regla) => !regla.cumple(contrasena));
  const mostrar = (campo) => enviado && errores[campo] && <p className={styles.fieldError}>{errores[campo]}</p>;

  // Solo se agrega otro teléfono cuando los que ya están escritos son válidos
  const telefonosCompletos = telefonos.every((_, i) => !errores[`telefono${i}`]);

  const cambiarTelefono = (i, valor) => setTelefonos(telefonos.map((t, j) => (j === i ? valor : t)));

  // Igual que en la edición del perfil: el error del teléfono aparece mientras se escribe
  function campoTelefono(i) {
    const errorTelefono = (enviado || telefonos[i] !== '') && errores[`telefono${i}`];
    return (
      <div key={i} className={styles.field}>
        <div className={styles.actions}>
          <input
            id={`telefono${i}`}
            aria-label={i === 0 ? 'Número principal' : 'Número adicional'}
            type="tel"
            inputMode="numeric"
            placeholder="Número de teléfono"
            value={telefonos[i]}
            onChange={(e) => cambiarTelefono(i, e.target.value)}
            maxLength={10}
          />
          {i > 0 && (
            <Button type="button" variant="secondary" onClick={() => setTelefonos(telefonos.filter((_, j) => j !== i))}>
              Eliminar
            </Button>
          )}
        </div>
        {errorTelefono && <p className={styles.fieldError}>{errorTelefono}</p>}
      </div>
    );
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setEnviado(true);
    if (Object.keys(errores).length > 0) {
      return;
    }
    setError(null);
    setGuardando(true);
    try {
      await registrarCuenta({
        name: nombre.trim(),
        email: correo.trim(),
        password: contrasena,
        phones: telefonos.map((number, i) => ({ number, principal: i === 0 })),
        roles: trabajador ? ['CONTRATANTE', 'TRABAJADOR'] : ['CONTRATANTE'],
      });
      setRegistrado(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  if (registrado) {
    return (
      <section className={`card ${styles.page}`}>
        <div className={styles.success}>
          <span className={styles.successIcon} aria-hidden="true">✓</span>
          <span className="eyebrow">Registro exitoso</span>
          <h1>¡Tu cuenta quedó creada!</h1>
          <p className={styles.note}>
            Ya haces parte de OficioYa como {trabajador ? 'contratante y trabajador' : 'contratante'}.
          </p>
          <Button type="button" onClick={() => navigate('/auth')}>Iniciar sesión</Button>
        </div>
      </section>
    );
  }

  return (
    <section className={`card ${styles.page}`}>
      <div className={styles.header}>
        <div>
          <span className="eyebrow">Registro</span>
          <h1>Crear cuenta</h1>
        </div>
      </div>

      <form onSubmit={manejarEnvio} className={styles.form} noValidate>
        <p className={styles.note}>
          <span className={styles.required}>*</span> Campos obligatorios
        </p>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label htmlFor="nombre" className={styles.label}>
              Nombre<span className={styles.required}>*</span>
            </label>
            <span className={styles.counter}>{nombre.length}/{MAX_NOMBRE}</span>
          </div>
          <input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={MAX_NOMBRE} />
          {mostrar('nombre')}
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label htmlFor="correo" className={styles.label}>
              Correo<span className={styles.required}>*</span>
            </label>
            <span className={styles.counter}>{correo.length}/{MAX_CORREO}</span>
          </div>
          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            maxLength={MAX_CORREO}
          />
          {(enviado || correo !== '') && errores.correo && <p className={styles.fieldError}>{errores.correo}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="contrasena" className={styles.label}>
            Contraseña<span className={styles.required}>*</span>
          </label>
          <div className={styles.actions}>
            <input
              id="contrasena"
              type={verContrasena ? 'text' : 'password'}
              autoComplete="new-password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              onFocus={() => setEscribiendoContrasena(true)}
              onBlur={() => setEscribiendoContrasena(false)}
            />
            <Button type="button" variant="secondary" onClick={() => setVerContrasena(!verContrasena)}>
              {verContrasena ? 'Ocultar' : 'Mostrar'}
            </Button>
          </div>
          {escribiendoContrasena && contrasena !== '' && reglasPendientes.length > 0 && (
            <ul className={styles.note}>
              {reglasPendientes.map((regla) => <li key={regla.texto}>{regla.texto}</li>)}
            </ul>
          )}
          {mostrar('contrasena')}
        </div>

        <div className={styles.field}>
          <label htmlFor="telefono0" className={styles.label}>
            Número principal<span className={styles.required}>*</span>
          </label>
          {campoTelefono(0)}
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Números adicionales</span>
          {telefonos.length === 1 && <p className={styles.note}>Sin números adicionales</p>}
          {telefonos.slice(1).map((_, k) => campoTelefono(k + 1))}
          {telefonos.length < MAX_TELEFONOS ? (
            <div className={styles.actions}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setTelefonos([...telefonos, ''])}
                disabled={!telefonosCompletos}
              >
                + Agregar teléfono
              </Button>
            </div>
          ) : (
            <p className={styles.note}>Máximo {MAX_TELEFONOS} teléfonos</p>
          )}
        </div>

        {/* Opción de ser trabajador */}
        <label className={`${styles.check} ${trabajador ? styles.checkActivo : ''}`}>
          <input type="checkbox" checked={trabajador} onChange={(e) => setTrabajador(e.target.checked)} />
          <span>
            <strong>Quiero ser trabajador</strong>
            <span className={styles.note}>Activa tu perfil de trabajador para recibir solicitudes de servicio.</span>
          </span>
        </label>

        <ErrorMessage error={error} />
        <div className={styles.footer}>
          <Button type="submit" disabled={guardando}>{guardando ? 'Creando cuenta...' : 'Crear cuenta'}</Button>
        </div>
      </form>
    </section>
  );
}

export default RegisterForm;
