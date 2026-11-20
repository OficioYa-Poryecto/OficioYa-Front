import { useEffect, useState } from 'react';
import Button from '../../core/design-system/Button';
import { deleteImage, getProfilePhoto } from '../../core/lib/imageService';
import styles from './Form.module.css';
import detalle from './UserDetail.module.css';

// Mismos límites que valida el back (StatusChangeDTO)
const MIN_REASON = 10;
const MAX_REASON = 500;

const QUITABLES = {
  TRABAJADOR: {
    titulo: 'Quitar trabajador',
    descripcion: 'Su perfil de trabajador se pausa y deja de aparecer en búsquedas. No puede tener solicitudes activas como trabajador.',
  },
  CONTRATANTE: {
    titulo: 'Quitar contratante',
    descripcion: 'Ya no podrá solicitar servicios con esta cuenta. No puede tener solicitudes activas como contratante.',
  },
};

function Opcion({ titulo, descripcion, marcada, boton, disabled, onToggle }) {
  return (
    <div className={`${styles.cuentaFila} ${detalle.fila} ${marcada ? detalle.pendiente : ''}`}>
      <div>
        <strong className={styles.cuentaOpcion}>{titulo}</strong>
        <p>{descripcion}</p>
      </div>
      <Button type="button" variant="secondary" onClick={onToggle} disabled={disabled}>
        {marcada ? 'Deshacer' : boton}
      </Button>
    </div>
  );
}

function StatusSelector({ userId, isActive, roles, onSubmit, onRemoveRole }) {
  const [changeStatus, setChangeStatus] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [roleToRemove, setRoleToRemove] = useState(null);
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [photoError, setPhotoError] = useState(null);

  useEffect(() => {
    getProfilePhoto(userId).then(setPhoto);
  }, [userId]);

  // Solo se puede quitar uno cuando la cuenta es trabajador y contratante a la vez
  const removableRoles = Object.keys(QUITABLES).every((r) => roles.includes(r)) ? Object.keys(QUITABLES) : [];
  const hasChanges = changeStatus || removePhoto || roleToRemove !== null;
  const trimmed = reason.trim();
  let reasonError = null;
  if (trimmed === '') {
    reasonError = 'El motivo es obligatorio';
  } else if (trimmed.length < MIN_REASON) {
    reasonError = `El motivo debe tener al menos ${MIN_REASON} caracteres`;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setTouched(true);
    if (!hasChanges || reasonError) {
      return;
    }
    setSending(true);
    setPhotoError(null);
    let ok = true;
    if (removePhoto) {
      try {
        await deleteImage(photo.id);
        setPhoto(null);
        setRemovePhoto(false);
        window.dispatchEvent(new Event('oy-profile-updated'));
      } catch (e) {
        setPhotoError(e.message || 'No se pudo eliminar la foto de perfil');
        ok = false;
      }
    }
    if (ok && roleToRemove) {
      ok = await onRemoveRole(roleToRemove);
      if (ok) {
        setRoleToRemove(null);
      }
    }
    if (ok && changeStatus) {
      ok = await onSubmit(isActive ? 'deactivate' : 'activate', trimmed);
    }
    setSending(false);
    if (ok) {
      setReason('');
      setTouched(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <p className={detalle.intro}>Selecciona los cambios que quieres hacer en el perfil y escribe el motivo por el cual se realizarán.</p>

      <div className={detalle.opciones}>
        <Opcion
          titulo={isActive ? 'Desactivar cuenta' : 'Activar cuenta'}
          descripcion={isActive
            ? 'La persona no podrá iniciar sesión mientras la cuenta esté inactiva.'
            : 'La persona podrá volver a iniciar sesión y usar OficioYa.'}
          marcada={changeStatus}
          boton={isActive ? 'Desactivar' : 'Activar'}
          disabled={sending}
          onToggle={() => setChangeStatus(!changeStatus)}
        />
        <Opcion
          titulo="Eliminar foto de perfil"
          descripcion={photo ? 'Se reemplaza la foto de perfil por un avatar predeterminado.' : 'La persona no tiene foto de perfil.'}
          marcada={removePhoto}
          boton="Eliminar"
          disabled={!photo || sending}
          onToggle={() => setRemovePhoto(!removePhoto)}
        />
        {removableRoles.map((rol) => (
          <Opcion
            key={rol}
            titulo={QUITABLES[rol].titulo}
            descripcion={QUITABLES[rol].descripcion}
            marcada={roleToRemove === rol}
            boton="Quitar"
            disabled={(roleToRemove !== null && roleToRemove !== rol) || sending}
            onToggle={() => setRoleToRemove(roleToRemove === rol ? null : rol)}
          />
        ))}
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label htmlFor="reason" className={styles.label}>
            Motivo del cambio<span className={styles.required}>*</span>
          </label>
          <span className={styles.counter}>{trimmed.length}/{MAX_REASON} (mínimo {MIN_REASON})</span>
        </div>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          onBlur={() => setTouched(true)}
          minLength={MIN_REASON}
          maxLength={MAX_REASON}
          rows={3}
          disabled={!hasChanges}
          required
        />
        <div className={styles.fieldFooter}>
          <div>
            {hasChanges && touched && reasonError && <p className={styles.fieldError}>{reasonError}</p>}
            {photoError && <p className={styles.fieldError}>{photoError}</p>}
          </div>
          <Button type="submit" disabled={!hasChanges || sending}>
            {sending ? 'Guardando...' : 'Cambiar estado'}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default StatusSelector;