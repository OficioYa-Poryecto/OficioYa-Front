import styles from './Skeleton.module.css';

// Rectángulos grises mientras la información carga o el back no responde
function Skeleton({ lines = 3, error }) {
  return (
    <div className={styles.wrapper} aria-busy="true">
      <div className={`${styles.bar} ${styles.title}`} />
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className={styles.bar} />
      ))}
      {error && <p className={styles.note}>No se pudo cargar la información ({error})</p>}
    </div>
  );
}

export default Skeleton;
