import styles from './RequestStepper.module.css';

function RequestStepper({ steps, current, progressLabel }) {
  const total = steps.length;

  return (
    <div>
      <ol className={styles.tabs}>
        {steps.map((step) => {
          const active = step.id === current;
          return (
            <li
              key={step.id}
              className={active ? `${styles.tab} ${styles.active}` : styles.tab}
              aria-current={active ? 'step' : undefined}
            >
              <span className={styles.circle}>{step.id}</span>
              <span className={styles.label}>{step.label}</span>
            </li>
          );
        })}
      </ol>
      <div className={styles.progress}>
        <div className={styles.meta}>
          <span>{progressLabel}</span>
          <strong>
            {current} de {total}
          </strong>
        </div>
        <div
          className={styles.track}
          role="progressbar"
          aria-label="Progreso de la solicitud"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={current}
        >
          <div className={styles.fill} style={{ width: `${(current / total) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

export default RequestStepper;