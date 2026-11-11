import { getInitials } from '../requestForm';
import { StarIcon } from './icons';
import styles from './WorkerCard.module.css';

function WorkerCard({ worker, selected, onToggle }) {
  const distance = worker.distanceKm.toLocaleString('es-CO', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <label className={selected ? `${styles.card} ${styles.selected}` : styles.card}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={selected}
        onChange={() => onToggle(worker)}
      />
      <span className={styles.avatar} aria-hidden="true">
        {getInitials(worker.name)}
      </span>
      <span className={styles.info}>
        <strong className={styles.name}>{worker.name}</strong>
        <span className={styles.trade}>{worker.trade}</span>
        <span className={styles.rating}>
          <StarIcon size={14} />
          {worker.rating.toFixed(1)} · {worker.services} servicios
        </span>
      </span>
      <span className={styles.side}>
        <span className={styles.distance}>{distance} km</span>
        <span className={styles.availability}>{worker.availability}</span>
      </span>
    </label>
  );
}

export default WorkerCard;