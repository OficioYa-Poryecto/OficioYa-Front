import Button from '../../core/design-system/Button';
import styles from './RequestCard.module.css';

const STATE_META = {
  PENDING: { label: 'Pendiente', tone: 'info' },
  ACCEPTED: { label: 'Aceptada', tone: 'ok' },
  CONFLICT: { label: 'En conflicto', tone: 'warn' },
  CANCELED: { label: 'Cancelada', tone: 'bad' },
  REJECTED: { label: 'Rechazada', tone: 'bad' },
  COMPLETED: { label: 'Cumplida', tone: 'ok' },
  EXPIRED: { label: 'Expirada', tone: 'muted' },
};

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

function deriveTitle(description, maxLength = 60) {
  const text = (description ?? '').trim().replace(/\s+/g, ' ');
  if (!text) {
    return 'Solicitud de servicio';
  }
  const [firstSentence] = text.split(/[.!?]/);
  const base = firstSentence.trim() || text;
  return capitalize(base.length > maxLength ? `${base.slice(0, maxLength).trimEnd()}…` : base);
}

function splitSchedule(value) {
  const when = value ? new Date(value) : null;
  if (!when || Number.isNaN(when.getTime())) {
    return { date: 'Sin fecha', time: '' };
  }
  return {
    date: capitalize(
      when.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'long' }),
    ),
    time: when.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true }),
  };
}

function Icon({ children }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// Tarjeta de una solicitud: mismo lenguaje visual que las notificaciones del mockup
// (título, fecha, hora y ubicación con íconos, y el estado como etiqueta).
function RequestCard({ request, actions, onAction }) {
  const meta = STATE_META[request.state] ?? { label: request.state, tone: 'muted' };
  const { date, time } = splitSchedule(request.scheduledDateTime);

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <h3>{deriveTitle(request.description)}</h3>
        <span className={`${styles.badge} ${styles[meta.tone]}`}>{meta.label}</span>
      </div>

      <dl className={styles.facts}>
        <div className={styles.fact}>
          <Icon>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </Icon>
          <div>
            <dt>Fecha</dt>
            <dd>{date}</dd>
          </div>
        </div>
        <div className={styles.fact}>
          <Icon>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </Icon>
          <div>
            <dt>Hora</dt>
            <dd>{time || 'Sin hora'}</dd>
          </div>
        </div>
        <div className={`${styles.fact} ${styles.wide}`}>
          <Icon>
            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </Icon>
          <div>
            <dt>{request.neighborhood || 'Ubicación'}</dt>
            <dd>{request.exactAddress}</dd>
          </div>
        </div>
      </dl>

      {actions.length > 0 && (
        <div className={styles.actions}>
          {actions.map((action) => (
            <Button
              key={action.key}
              variant={action.variant}
              onClick={() => onAction(action.key, request.id)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </article>
  );
}

export default RequestCard;
