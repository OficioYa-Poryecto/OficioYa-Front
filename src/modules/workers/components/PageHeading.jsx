import styles from './worker.module.css';

function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className={styles.pageHeading}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

export default PageHeading;
