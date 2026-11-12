import { getInitials } from '../requestForm';
import { StarIcon } from './icons';
import styles from './WorkerCard.module.css';

function WorkerCard({ worker, selected, onToggle }) {
  const initials = worker.initials || getInitials(worker.name);
  const rating = typeof worker.rating === 'string' ? worker.rating : worker.rating?.toFixed?.(1) ?? worker.rating;
  const jobs = worker.jobs || (worker.services ? `${worker.services} servicios` : '');
  const distance = worker.distance || (worker.distanceKm != null ? `${worker.distanceKm.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km` : '');
  const available = worker.available || worker.availability || '';

  return (
    <label className={selected ? `${styles.card} ${styles.selected}` : styles.card}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={selected}
        onChange={() => onToggle(worker)}
      />
      <span className={styles.avatar} aria-hidden="true">
        {initials}
      </span>
      <span className={styles.info}>
        <strong className={styles.name}>{worker.name}</strong>
        <span className={styles.trade}>{worker.trade}</span>
        <span className={styles.rating}>
          <StarIcon size={14} />
          {rating} · {jobs}
        </span>
      </span>
      <span className={styles.side}>
        <span className={styles.distance}>{distance}</span>
        <span className={styles.availability}>{available}</span>
      </span>
    </label>
  );
}

export default WorkerCard;