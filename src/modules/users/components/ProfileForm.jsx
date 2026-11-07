import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import Button from '../../core/design-system/Button';
import ErrorMessage from '../../core/components/ErrorMessage';
import styles from './Form.module.css';

// Mismos límites que valida el back (UserUpdateDTO y PhoneDTO)
const MAX_NOMBRE = 100;
const PATRON_TELEFONO = /^\+?[0-9]{7,15}$/;

function ProfileForm() {
  const { perfil, cargando, error, actualizar } = useProfile();

  if (cargando) {
    return <p>Cargando...</p>;
  }
  if (error) {
    return <ErrorMessage error={error} />;
  }

  return <Formulario perfil={perfil} onGuardar={actualizar} />;
}

function Formulario({ perfil, onGuardar }) {
  const [name, setName] = useState(perfil.name ?? '');
  const [phone, setPhone] = useState('');
  const [tocado, setTocado] = useState({ name: false, phone: false });
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();

  const errorNombre = name.trim() === '' ? 'El nombre es obligatorio' : null;
  const errorTelefono = phone && !PATRON_TELEFONO.test(phone)
    ? 'El número debe tener entre 7 y 15 dígitos'
    : null;

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setTocado({ name: true, phone: true });
    if (errorNombre || errorTelefono) {
      return;
    }
    setError(null);
    setGuardando(true);
    try {
      const phones = phone ? [{ number: phone, principal: true }] : undefined;
      await onGuardar({ name: name.trim(), phones });
      navigate('/users/me');
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section className={`card ${styles.page}`}>
      <span className="eyebrow">Mi perfil</span>
      <h1>Editar perfil</h1>
      <p className={styles.note}>
        <span className={styles.required}>*</span> Campos obligatorios
      </p>

      <form onSubmit={manejarEnvio} className={styles.form} noValidate>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Nombre<span className={styles.required}>*</span>
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTocado({ ...tocado, name: true })}
            maxLength={MAX_NOMBRE}
            required
          />
          <p className={styles.counter}>{name.length}/{MAX_NOMBRE}</p>
          {tocado.name && errorNombre && <p className={styles.fieldError}>{errorNombre}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="phone" className={styles.label}>Nuevo teléfono principal</label>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            placeholder="Ej: 3001234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={() => setTocado({ ...tocado, phone: true })}
            maxLength={16}
          />
          <p className={styles.note}>
            Opcional. Entre 7 y 15 dígitos. Si lo llenas, reemplaza tus teléfonos actuales.
          </p>
          {tocado.phone && errorTelefono && <p className={styles.fieldError}>{errorTelefono}</p>}
        </div>

        <ErrorMessage error={error} />
        <div className={styles.actions}>
          <Button type="submit" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/users/me')}>
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  );
}

export default ProfileForm;
