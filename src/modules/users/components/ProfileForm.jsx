import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { usePhones } from '../hooks/usePhones';
import { deleteImage, getProfilePhoto, uploadImage } from '../../core/lib/imageService';
import { clearSession, getSession } from '../../core/lib/session';
import { ROLES_AGREGABLES, ROLES_QUITABLES } from '../config';
import AlertIcon from '../../workers/components/ui/Icon';
import Button from '../../core/design-system/Button';
import ErrorMessage from '../../core/components/ErrorMessage';
import Skeleton from './Skeleton';
import PhoneList from './PhoneList';
import { useLocalidades } from '../hooks/useLocalidades';
import ProfileHeader from './ProfileHeader';
import styles from './Form.module.css';
import vista from './ProfileView.module.css';
import reg from '../../auth/pages/RegisterPage.module.css';
import Icon from './Icon';
import { formatBirthDate } from '../utils/formatBirthDate';

// Mismo límite que valida el back (UserUpdateDTO)
const MAX_NOMBRE = 100;
const FORM_ID = 'perfil-form';
const CAMPO_OBLIGATORIO = 'Este campo es obligatorio.';

let siguienteClave = 0;

function copiarTelefonos(lista) {
  return [...lista]
      .sort((a, b) => Number(b.principal) - Number(a.principal))
      .map(({ number, principal }) => ({ clave: siguienteClave++, number, principal }));
}

function ProfileForm() {
  const { perfil, cargando, error, actualizar, agregarRol, quitarRol } = useProfile();
  const telefonos = usePhones();
  const navigate = useNavigate();

  const cargandoTodo = cargando || telefonos.cargando;
  const errorCarga = error ?? telefonos.error;

  return (
      <section className={vista.page}>
        <div className={vista.top}>
          <div>
            <span className={reg.eyebrow}>Mi cuenta</span>
            <h1 className={reg.heroTitle}>
              Editar <span className={reg.brandHighlight}>perfil</span>
            </h1>
            <p className={reg.heroSub}>Mantén tus datos al día para que puedan encontrarte y contactarte.</p>
          </div>
        </div>

        {cargandoTodo || errorCarga ? (
            <div className={reg.card}>
              <Skeleton lines={3} error={errorCarga} />
            </div>
        ) : (
            <Contenido
                perfil={perfil}
                telefonos={telefonos}
                onGuardar={actualizar}
                onAgregarRol={agregarRol}
                onQuitarRol={quitarRol}
                onSalir={() => navigate('/users/me')}
            />
        )}
      </section>
  );
}

function Contenido({ perfil, telefonos, onGuardar, onAgregarRol, onQuitarRol, onSalir }) {
  const navigate = useNavigate();
  const [name, setName] = useState(perfil.name ?? '');
  const [nombreVisible, setNombreVisible] = useState(perfil.name ?? '');
  const [phones, setPhones] = useState(() => copiarTelefonos(telefonos.telefonos));
  const [localityId, setLocalityId] = useState(perfil.locality?.id ?? '');
  const localidades = useLocalidades();
  const [enviado, setEnviado] = useState(false);
  const [tocado, setTocado] = useState(false);
  const [error, setError] = useState(null);
  const [errorCuenta, setErrorCuenta] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [eliminandoFoto, setEliminandoFoto] = useState(false);
  const [fotoEliminada, setFotoEliminada] = useState(false);
  const [rolGuardando, setRolGuardando] = useState(null);
  const [rolAgregado, setRolAgregado] = useState(null);
  const [rolPorQuitar, setRolPorQuitar] = useState(null);
  const [rolQuitando, setRolQuitando] = useState(null);
  const [rolQuitado, setRolQuitado] = useState(null);
  const fileInputRef = useRef(null);

  const roles = perfil.roles ?? [];
  const esAdmin = roles.includes('ADMIN');
  // Sobre mi cuenta: con un solo rol se ofrece agregar el otro (RF-02); con ambos, dejar cualquiera (RF-13).
  // Después de agregar o quitar uno no se muestran más opciones hasta volver a iniciar sesión
  const cambioHecho = rolAgregado !== null || rolQuitado !== null;
  const rolesFaltantes = esAdmin || cambioHecho
      ? []
      : Object.keys(ROLES_AGREGABLES).filter((r) => !roles.includes(r));
  const rolesQuitables = !esAdmin && !cambioHecho && Object.keys(ROLES_QUITABLES).every((r) => roles.includes(r))
      ? Object.keys(ROLES_QUITABLES)
      : [];
  const ocupadoRol = rolGuardando !== null || rolQuitando !== null;
  const errorNombre = name.trim() === '' ? 'El nombre es obligatorio' : null;
  const erroresTelefono = phones.map((phone, idx) => {
    if (!enviado) return null;
    const numero = phone.number.trim();
    if (!numero) return CAMPO_OBLIGATORIO;
    if (!/^3\d{9}$/.test(numero)) return 'Debe tener 10 dígitos y empezar por 3.';
    if (phones.slice(0, idx).some((otro) => otro.number.trim() === numero)) {
      return 'Este número ya lo agregaste.';
    }
    return null;
  });

  function cambiarTelefonos(lista) {
    setPhones(lista);
    setGuardado(false);
  }

  // El que el usuario marcó como principal reemplaza el número del principal guardado;
  // los demás quedan como adicionales (primero se borran los que sobran para no chocar con números repetidos)
  async function guardarTelefonos() {
    const guardados = telefonos.telefonos;
    const principalGuardado = guardados.find((phone) => phone.principal);
    const adicionalesGuardados = guardados.filter((phone) => !phone.principal);
    const nuevoPrincipal = phones.find((phone) => phone.principal).number.trim();
    const nuevosAdicionales = phones.filter((phone) => !phone.principal).map((phone) => phone.number.trim());

    let ultima = null;
    const conservados = [];
    for (const phone of adicionalesGuardados) {
      if (nuevosAdicionales.includes(phone.number) && !conservados.includes(phone.number)) {
        conservados.push(phone.number);
      } else {
        ultima = await telefonos.eliminar(phone.id);
      }
    }
    if (principalGuardado && principalGuardado.number !== nuevoPrincipal) {
      ultima = await telefonos.cambiar(principalGuardado.id, nuevoPrincipal);
    }
    for (const numero of nuevosAdicionales) {
      if (!conservados.includes(numero)) {
        ultima = await telefonos.agregar(numero);
      }
    }
    if (ultima) {
      setPhones(copiarTelefonos(ultima));
    }
  }

  useEffect(() => {
    if (!perfil?.id) return;
    const session = getSession();
    getProfilePhoto(perfil.id, session?.token).then((photo) => {
      if (photo) {
        setCurrentPhoto(photo);
      }
    });
  }, [perfil?.id]);

  async function handleEliminarFoto() {
    setError(null);
    setGuardado(false);

    // Caso 1: Había seleccionado una imagen local pero no la había guardado
    if (photoFile) {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoFile(null);
      setPhotoPreview(null);
      if (!currentPhoto?.id) {
        return;
      }
    }

    // Caso 2: Tiene una foto activa en el backend
    if (currentPhoto?.id) {
      setEliminandoFoto(true);
      try {
        const session = getSession();
        await deleteImage(currentPhoto.id, session?.token);
        setCurrentPhoto(null);
        if (photoPreview) {
          URL.revokeObjectURL(photoPreview);
          setPhotoPreview(null);
        }
        setPhotoFile(null);
        window.dispatchEvent(new Event('oy-profile-updated'));
        setFotoEliminada(true);
        setTimeout(() => setFotoEliminada(false), 4000);
      } catch (err) {
        setError(err.message || 'Error al eliminar la foto de perfil.');
      } finally {
        setEliminandoFoto(false);
      }
    }
  }

  function handleSelectPhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen supera el tamaño máximo de 5 MB.');
      return;
    }
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setError(null);
    setGuardado(false);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    e.target.value = '';
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setTocado(true);
    setEnviado(true);
    const hayErrorTelefono = phones.some((phone, idx) => {
      const numero = phone.number.trim();
      return !/^3\d{9}$/.test(numero) || phones.slice(0, idx).some((otro) => otro.number.trim() === numero);
    });
    if (errorNombre || hayErrorTelefono) {
      setTimeout(() => {
        document.querySelector('[aria-invalid="true"]')?.focus();
      }, 0);
      return;
    }
    setError(null);
    setGuardado(false);
    setGuardando(true);
    try {
      await onGuardar({ name: name.trim(), localityId: localityId ? Number(localityId) : undefined });
      setNombreVisible(name.trim());
      await guardarTelefonos();
      if (photoFile && perfil?.id) {
        const session = getSession();
        const uploaded = await uploadImage({
          file: photoFile,
          tipo: 'PROFILE',
          rootId: perfil.id,
          token: session?.token,
        });
        if (uploaded) {
          setCurrentPhoto(uploaded);
        }
        setPhotoFile(null);
      }
      // El Navbar muestra el nombre y foto guardados
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
    setErrorCuenta(null);
    setRolGuardando(rol);
    try {
      await onAgregarRol(rol);
      setRolAgregado(rol);
    } catch (e) {
      setErrorCuenta(e.message);
    } finally {
      setRolGuardando(null);
    }
  }

  // RF-13. El token todavía trae el rol quitado: se cierra la sesión para que el próximo login traiga los roles nuevos
  async function confirmarQuitarRol() {
    const rol = rolPorQuitar;
    setRolPorQuitar(null);
    setErrorCuenta(null);
    setRolAgregado(null);
    setRolQuitando(rol);
    try {
      await onQuitarRol(rol);
      localStorage.removeItem('oy_userName');
      clearSession();
      setRolQuitado(rol);
    } catch (e) {
      setErrorCuenta(e.message);
    } finally {
      setRolQuitando(null);
    }
  }

  return (
      <>
        <div className={`${reg.card} ${styles.form}`}>
          <div className={vista.top}>
            <ProfileHeader
                nombre={nombreVisible || perfil.name}
                roles={roles}
                activo={perfil.accountStatus === 'ACTIVE'}
                esPropio
                userId={perfil.id}
                avatarUrl={photoPreview}
            />
            <div className={reg.photoActions}>
              <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleSelectPhoto}
                  style={{ display: 'none' }}
              />
              <button
                  type="button"
                  className={reg.btnPhotoUpload}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={eliminandoFoto}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {photoFile || currentPhoto ? 'Cambiar foto' : 'Subir foto'}
              </button>
              {(currentPhoto || photoFile) && (
                <button
                    type="button"
                    className={reg.btnPhotoRemove}
                    onClick={handleEliminarFoto}
                    disabled={eliminandoFoto}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  {eliminandoFoto ? 'Eliminando...' : 'Eliminar foto'}
                </button>
              )}
            </div>
          </div>

          {fotoEliminada && (
            <div className={vista.success}>
              <span className={vista.successIcon}>✓</span>
              <p>
                <strong>Foto eliminada.</strong> Se restableció el avatar predeterminado de tu perfil.
              </p>
            </div>
          )}

          {/* Datos sensibles: solo texto, no se pueden modificar */}
          <div className={styles.encabezado}>
            <h2 className={reg.sectionTitle}>Datos sensibles</h2>
            <p className={styles.note}>
              <Icon name="lock" size={12} /> Por seguridad, los datos sensibles no se pueden modificar.
            </p>
          </div>
          <dl className={styles.datosSensibles}>
            <div className={styles.dato}>
              <dt>Correo electrónico</dt>
              <dd>{perfil.email}</dd>
            </div>
            <div className={styles.dato}>
              <dt>Fecha de nacimiento</dt>
              <dd>{perfil.birthDate ? formatBirthDate(perfil.birthDate) : 'No registrada'}</dd>
            </div>
          </dl>

          <div className={styles.encabezado}>
            <h2 className={reg.sectionTitle}>Datos personales</h2>
            <p className={styles.note}>
              <span className={reg.required}>*</span> Campos obligatorios
            </p>
          </div>

          <form id={FORM_ID} onSubmit={manejarEnvio} className={styles.form} noValidate>
            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label htmlFor="name" className={reg.label}>
                  <span>
                    Nombre completo <span className={reg.required}>*</span>
                  </span>
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
                  onBlur={() => {
                    setTocado(true);
                    if (name.trim()) {
                      setNombreVisible(name.trim());
                    }
                  }}
                  maxLength={MAX_NOMBRE}
                  className={tocado && errorNombre ? reg.inputInvalid : undefined}
                  aria-invalid={Boolean(tocado && errorNombre)}
                  required
              />
              {tocado && errorNombre && <p className={styles.fieldError}>{errorNombre}</p>}
            </div>

            {/* RF-14. Una localidad; no se puede dejar vacía una vez elegida (no aplica para administradores) */}
            {!esAdmin && (
                <div className={styles.field}>
                  <label htmlFor="localityId" className={reg.label}>Zona de cobertura</label>
                  <select
                      id="localityId"
                      className={reg.select}
                      value={localityId}
                      onChange={(e) => {
                        setLocalityId(e.target.value);
                        setGuardado(false);
                      }}
                  >
                    <option value="" disabled={Boolean(perfil.locality)}>Selecciona una localidad</option>
                    {localidades.map((localidad) => (
                        <option key={localidad.id} value={localidad.id}>{localidad.name}</option>
                    ))}
                  </select>
                </div>
            )}
          </form>

          <PhoneList phones={phones} errores={erroresTelefono} onChange={cambiarTelefonos} />

          {guardado && (
              <div className={vista.success}>
                <span className={vista.successIcon}>✓</span>
                <p>
                  <strong>Cambios guardados.</strong> Tu perfil ya está actualizado.
                </p>
              </div>
          )}
          <ErrorMessage error={error} />

          <div className={`${reg.actionsFooter} ${styles.footerCompacto}`}>
            <button type="button" className={reg.linkBack} onClick={onSalir}>
              {guardado ? 'Volver al perfil' : 'Cancelar'}
            </button>
            <button type="submit" form={FORM_ID} className={reg.btnSubmit} disabled={guardando || rolQuitado !== null}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>

        {/* Sobre mi cuenta: siempre visible (excepto administradores) */}
        {!esAdmin && (
            <section className={styles.cuenta}>
              <div>
                <h2 className={reg.heroTitle}>
                  Sobre mi <span className={styles.resaltadoPeligro}>cuenta</span>
                </h2>
                <p className={reg.heroSub}>
                  Elige si usas OficioYa para trabajar, para contratar o para ambas. Tu información no se borra y puedes cambiarlo después.
                </p>
              </div>
              <div className={`${reg.card} ${styles.cuentaLista}`}>
                {rolesFaltantes.map((rol) => (
                    <div key={rol} className={styles.cuentaFila}>
                      <div>
                        <strong className={styles.cuentaOpcion}>{ROLES_AGREGABLES[rol].boton}</strong>
                        <p>{ROLES_AGREGABLES[rol].descripcion}</p>
                      </div>
                      <Button
                          type="button"
                          variant="danger"
                          onClick={() => activarRol(rol)}
                          disabled={ocupadoRol}
                      >
                        {rolGuardando === rol ? 'Guardando...' : 'Continuar'}
                      </Button>
                    </div>
                ))}
                {rolesQuitables.map((rol) => (
                    <div key={rol} className={styles.cuentaFila}>
                      <div>
                        <strong className={styles.cuentaOpcion}>{ROLES_QUITABLES[rol].boton}</strong>
                        <p>{ROLES_QUITABLES[rol].descripcion} <strong>{ROLES_QUITABLES[rol].aviso}</strong></p>
                      </div>
                      <Button
                          type="button"
                          variant="danger"
                          onClick={() => setRolPorQuitar(rol)}
                          disabled={ocupadoRol}
                      >
                        {rolQuitando === rol ? 'Procesando...' : 'Continuar'}
                      </Button>
                    </div>
                ))}
                {errorCuenta && (
                    <div className={styles.cuentaError}>
                      <ErrorMessage error={errorCuenta} />
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
                {rolQuitado && (
                    <div className={vista.success}>
                      <span className={vista.successIcon}>✓</span>
                      <p>
                        <strong>{ROLES_QUITABLES[rolQuitado].quitado}</strong> Inicia sesión de nuevo para aplicar el cambio.
                      </p>
                      <Button type="button" onClick={() => navigate('/auth', { replace: true })}>Iniciar sesión</Button>
                    </div>
                )}
              </div>
            </section>
        )}

        {rolPorQuitar && (
            <div className={styles.modalFondo} role="presentation">
              <div aria-label={ROLES_QUITABLES[rolPorQuitar].titulo} aria-modal="true" className={styles.modal} role="dialog">
                <span className={styles.modalIcono}><AlertIcon name="warning" size={36} /></span>
                <h2>{ROLES_QUITABLES[rolPorQuitar].titulo}</h2>
                <p>{ROLES_QUITABLES[rolPorQuitar].texto}</p>
                <div className={styles.modalAcciones}>
                  <Button type="button" onClick={() => setRolPorQuitar(null)} variant="outline">Cancelar</Button>
                  <Button type="button" onClick={confirmarQuitarRol} variant="danger">Confirmar</Button>
                </div>
              </div>
            </div>
        )}
      </>
  );
}

export default ProfileForm;