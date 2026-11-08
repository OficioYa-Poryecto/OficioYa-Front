import { useState } from 'react';
import Button from '../../core/design-system/Button';
import styles from './Form.module.css';

// Mismos límites que valida el back (StatusChangeDTO)
const MIN_REASON = 10;
const MAX_REASON = 500;

function StatusSelector({ isActive, onSubmit }) {
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);

  const action = isActive ? 'deactivate' : 'activate';
  const label = isActive ? 'Desactivar cuenta' : 'Activar cuenta';
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
    if (reasonError) {
      return;
    }
    setSending(true);
    const ok = await onSubmit(action, trimmed);
    setSending(false);
    if (ok) {
      setReason('');
      setTouched(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <p className={styles.note}>
        <span className={styles.required}>*</span> Campos obligatorios
      </p>
      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label htmlFor="reason" className={styles.label}>
            Motivo del cambio de estado<span className={styles.required}>*</span>
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
          required
        />
        {/* Error a la izquierda, justo debajo del motivo; botón a la derecha */}
        <div className={styles.fieldFooter}>
          <div>{touched && reasonError && <p className={styles.fieldError}>{reasonError}</p>}</div>
          <Button type="submit" disabled={sending}>
            {sending ? 'Guardando...' : label}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default StatusSelector;
