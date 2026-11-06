import Icon from './Icon';
import styles from './EmptyState.module.css';

function EmptyState({ title, text }) {
  return (
    <div className={styles.empty}>
      <span><Icon name="briefcase" size={25} /></span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default EmptyState;
