import styles from './worker.module.css';

function PageHeading({ eyebrow, title, description, action }) {
  const words = title.split(' ');
  const last = words.pop();
  return (
    <header className={styles.pageHeading}>
      <div>
        <span className={styles.eyebrowPill}>{eyebrow}</span>
        <h1>
          {words.length > 0 && `${words.join(' ')} `}
          <span className={styles.accent}>{last}</span>
        </h1>
        <p>{description}</p>
      </div>
      {action}
    </header>
  );
}

export default PageHeading;