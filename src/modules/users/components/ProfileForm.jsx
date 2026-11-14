import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { usePhones } from '../hooks/usePhones';
import { ROLES_AGREGABLES } from '../config';
import Button from '../../core/design-system/Button';
import ErrorMessage from '../../core/components/ErrorMessage';
import Skeleton from './Skeleton';
import PhoneList from './PhoneList';
import ProfileHeader from './ProfileHeader';
import styles from './Form.module.css';
import vista from './ProfileView.module.css';

// Mismo límite que valida el back (UserUpdateDTO)
const MAX_NOMBRE = 100;
const FORM_ID = 'perfil-form';

function ProfileForm() {
  const { perfil, cargando, error, actualizar, agregarRol } = useProfile();
  const telefonos = usePhones();
  const navigate = useNavigate();

  const cargandoTodo = cargando || telefonos.cargando;
  const errorCarga = error ?? telefonos.error;

  return (
      <section className={vista.page}>
        <div className={vista.top}>
          <div>
            <span className="eyebrow">Mi cuenta</span>
            <h1 className={vista.name}>
              Editar <span className={vista.accent}>perfil</span>
            </h1>
            <p className={styles.note}>Mantén tus datos al día para que puedan encontrarte y contactarte.</p>
          </div>
        </div>

        {cargandoTodo || errorCarga ? (
            <div className="card">
              <Skeleton lines={3} error={errorCarga} />
            </div>
        ) : (
            <Contenido
                perfil={perfil}
                telefonos={telefonos}
                onGuardar={actualizar}
                onAgregarRol={agregarRol}
                onSalir={() => navigate('/users/me')}
            />
        )}
      </section>
  );
}

function Contenido({ perfil, telefonos, onGuardar, onAgregarRol, onSalir }) {
  const [name, setName] = useState(perfil.name ?? '');
  const [tocado, setTocado] = useState(false);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [rolGuardando, setRolGuardando] = useState(null);
  const [rolAgregado, setRolAgregado] = useState(null);

  const roles = perfil.roles ?? [];
  const rolesFaltantes = roles.includes('ADMIN')
      ? []
      : Object.keys(ROLES_AGREGABLES).filter((r) => !roles.includes(r));
  const errorNombre = name.trim() === '' ? 'El nombre es obligatorio' : null;

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setTocado(true);
    if (errorNombre) {
      return;
    }
    setError(null);
    setGuardado(false);
    setGuardando(true);
    try {
      await onGuardar({ name: name.trim() });
      // El Navbar muestra el nombre guardado en localStorage
      localStorage.setItem('oy_userName', name.trim());
      window.dispatchEvent(new Event('oy-profile-updated'));
      setGuardado(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  async function activarRol(rol) {
    setError(null);
    setRolGuardando(rol);
    try {
      await onAgregarRol(rol);
      setRolAgregado(rol);
    } catch (e) {
      setError(e.message);
    } finally {
      setRolGuardando(null);
    }
  }

  return (
      <>
        {rolesFaltantes.length > 0 && (
            <div className={vista.actions}>
              {rolesFaltantes.map((rol) => (
                  <Button
                      key={rol}
                      type="button"
                      variant="secondary"
                      onClick={() => activarRol(rol)}
                      disabled={rolGuardando !== null}
                  >
                    {rolGuardando === rol ? 'Guardando...' : `+ ${ROLES_AGREGABLES[rol].boton}`}
                  </Button>
              ))}
            </div>
        )}
        {rolAgregado && (
            <div className={vista.success}>
              <span className={vista.successIcon}>✓</span>
              <p>
                <strong>{ROLES_AGREGABLES[rolAgregado].agregado}</strong> {ROLES_AGREGABLES[rolAgregado].detalle}
              </p>
            </div>
        )}

        <div className={`card ${styles.form}`}>
          <ProfileHeader nombre={perfil.name} roles={roles} activo={perfil.accountStatus === 'ACTIVE'} esPropio />

          <h2>Datos personales</h2>
          <p className={styles.note}>
            <span className={styles.required}>*</span> Campos obligatorios
          </p>

          <form id={FORM_ID} onSubmit={manejarEnvio} className={styles.form} noValidate>
            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label htmlFor="name" className={styles.label}>
                  Nombre completo<span className={styles.required}>*</span>
                </label>
                <span className={styles.counter}>{name.length}/{MAX_NOMBRE}</span>
              </div>
              <input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setGuardado(false);
                  }}
                  onBlur={() => setTocado(true)}
                  maxLength={MAX_NOMBRE}
                  required
              />
              {tocado && errorNombre && <p className={styles.fieldError}>{errorNombre}</p>}
            </div>

            {/* El correo no se edita (lo administra Identity); el back lo devuelve enmascarado */}
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>Correo electrónico</label>
              <input id="email" value={perfil.email ?? ''} disabled />
              <p className={styles.note}>🔒 Por seguridad, el correo no se puede editar.</p>
            </div>
          </form>

          {/* Los teléfonos se guardan al momento, cada uno por separado */}
          <PhoneList
              phones={telefonos.telefonos}
              onAgregar={telefonos.agregar}
              onCambiar={telefonos.cambiar}
              onEliminar={telefonos.eliminar}
          />

          {guardado && (
              <div className={vista.success}>
                <span className={vista.successIcon}>✓</span>
                <p>
                  <strong>Cambios guardados.</strong> Tu perfil ya está actualizado.
                </p>
              </div>
          )}
          <ErrorMessage error={error} />

          <div className={`${styles.footer} ${styles.between}`}>
            <Button type="button" variant="secondary" onClick={onSalir}>
              {guardado ? 'Volver al perfil' : 'Cancelar'}
            </Button>
            <Button type="submit" form={FORM_ID} disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </div>
      </>
  );
}

export default ProfileForm;