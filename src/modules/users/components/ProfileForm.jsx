import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { usePhones } from '../hooks/usePhones';
import Button from '../../core/design-system/Button';
import ErrorMessage from '../../core/components/ErrorMessage';
import Skeleton from './Skeleton';
import PhoneList from './PhoneList';
import styles from './Form.module.css';

// Mismo límite que valida el back (UserUpdateDTO)
const MAX_NOMBRE = 100;
const FORM_ID = 'perfil-form';

function ProfileForm() {
  const { perfil, cargando, error, actualizar } = useProfile();
  const telefonos = usePhones();
  const navigate = useNavigate();
  const cancelar = () => navigate('/users/me');

  const cargandoTodo = cargando || telefonos.cargando;
  const errorCarga = error ?? telefonos.error;

  return (
    <section className={`card ${styles.page}`}>
      <div className={styles.header}>
        <div>
          <span className="eyebrow">Mi perfil</span>
          <h1>Editar perfil</h1>
        </div>
        <Button type="button" variant="secondary" onClick={cancelar}>Cancelar</Button>
      </div>

      {cargandoTodo || errorCarga ? (
        <Skeleton lines={3} error={errorCarga} />
      ) : (
        <Contenido perfil={perfil} telefonos={telefonos} onGuardar={actualizar} onGuardado={cancelar} />
      )}
    </section>
  );
}

function Contenido({ perfil, telefonos, onGuardar, onGuardado }) {
  const [name, setName] = useState(perfil.name ?? '');
  const [tocado, setTocado] = useState(false);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const errorNombre = name.trim() === '' ? 'El nombre es obligatorio' : null;

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setTocado(true);
    if (errorNombre) {
      return;
    }
    setError(null);
    setGuardando(true);
    try {
      await onGuardar({ name: name.trim() });
      onGuardado();
    } catch (e) {
      setError(e.message);
      setGuardando(false);
    }
  }

  return (
    <div className={styles.form}>
      <p className={styles.note}>
        <span className={styles.required}>*</span> Campos obligatorios
      </p>

      <form id={FORM_ID} onSubmit={manejarEnvio} className={styles.form} noValidate>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Nombre<span className={styles.required}>*</span>
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTocado(true)}
            maxLength={MAX_NOMBRE}
            required
          />
          <p className={styles.counter}>{name.length}/{MAX_NOMBRE}</p>
          {tocado && errorNombre && <p className={styles.fieldError}>{errorNombre}</p>}
        </div>
      </form>

      <PhoneList
        phones={telefonos.telefonos}
        onAgregar={telefonos.agregar}
        onCambiar={telefonos.cambiar}
        onEliminar={telefonos.eliminar}
      />

      <ErrorMessage error={error} />
      {/* Guardar va al final y envía el formulario del nombre por su id (los teléfonos se guardan al momento) */}
      <div className={styles.footer}>
        <Button type="submit" form={FORM_ID} disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </div>
  );
}

export default ProfileForm;
