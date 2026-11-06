import { useState } from 'react';
import Button from '../../core/design-system/Button';

const MAX_REASON = 500;

function StatusSelector({ isActive, onSubmit }) {
  const [reason, setReason] = useState('');
  const [sending, setSending] = useState(false);

  const action = isActive ? 'deactivate' : 'activate';
  const label = isActive ? 'Desactivar cuenta' : 'Activar cuenta';

  async function handleSubmit(event) {
    event.preventDefault();
    setSending(true);
    const ok = await onSubmit(action, reason.trim());
    setSending(false);
    if (ok) {
      setReason('');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="reason">Motivo del cambio de estado</label>
      <textarea
        id="reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        maxLength={MAX_REASON}
        rows={3}
        required
      />
      <p>{reason.length}/{MAX_REASON}</p>
      <Button type="submit" disabled={sending || reason.trim() === ''}>
        {sending ? 'Guardando...' : label}
      </Button>
    </form>
  );
}

export default StatusSelector;
