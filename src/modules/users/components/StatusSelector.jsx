import { useState } from 'react';
import Button from '../../core/design-system/Button';
import styles from './Form.module.css';

// Mismo límite que valida el back (StatusChangeDTO)
const MAX_REASON = 500;

function StatusSelector({ isActive, onSubmit }) {
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);

  const action = isActive ? 'deactivate' : 'activate';
  const label = isActive ? 'Desactivar cuenta' : 'Activar cuenta';
  const reasonError = reason.trim() === '' ? 'El motivo es obligatorio' : null;

  async function handleSubmit(event) {
    event.preventDefault();
    setTouched(true);
    if (reasonError) {
      return;
    }
    setSending(true);
    const ok = await onSubmit(action, reason.trim());
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
        <label htmlFor="reason" className={styles.label}>
          Motivo del cambio de estado<span className={styles.required}>*</span>
        </label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          onBlur={() => setTouched(true)}
          maxLength={MAX_REASON}
          rows={3}
          required
        />
        <p className={styles.counter}>{reason.length}/{MAX_REASON}</p>
        {touched && reasonError && <p className={styles.fieldError}>{reasonError}</p>}
      </div>
      <div className={styles.actions}>
        <Button type="submit" disabled={sending}>
          {sending ? 'Guardando...' : label}
        </Button>
      </div>
    </form>
  );
}

export default StatusSelector;
