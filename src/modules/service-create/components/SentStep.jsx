import { deriveTitle, formatSchedule } from '../requestForm';
import { CheckIcon } from './icons';
import styles from './SentStep.module.css';

function workersText(count) {
  return count === 1 ? '1 trabajador' : `${count} trabajadores`;
}

function SentStep({ values, result }) {
  const selected = values.workers.length;

  return (
    <div className={styles.sent}>
      <div className={styles.badge}>
        <span className={styles.badgeInner}>
          <CheckIcon size={34} />
        </span>
      </div>
      <p className="eyebrow">Envío completado</p>
      <h2>¡Solicitud enviada!</h2>
      <p className={styles.lead}>
        Notificamos a {workersText(result.sent)}. Te avisaremos cuando respondan.
      </p>

      <dl className={styles.summary}>
        <div className={styles.row}>
          <dt>Servicio</dt>
          <dd>{deriveTitle(values.description)}</dd>
        </div>
        <div className={styles.row}>
          <dt>Programado para</dt>
          <dd>{formatSchedule(values.date, values.time, { short: true })}</dd>
        </div>
        <div className={styles.row}>
          <dt>Enviado a</dt>
          <dd>{workersText(result.sent)}</dd>
        </div>
      </dl>

      {result.sent < selected && (
        <p className={styles.notice}>
          Seleccionaste {workersText(selected)}, pero la solicitud solo se envió a{' '}
          {workersText(result.sent)}.
        </p>
      )}
      {result.photosWarning && (
        <p role="alert" className={styles.notice}>
          {result.photosWarning}
        </p>
      )}
    </div>
  );
}

export default SentStep;