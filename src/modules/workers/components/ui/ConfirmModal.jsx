import Button from '../../../core/design-system/Button';
import Icon from './Icon';
import styles from './ConfirmModal.module.css';

function ConfirmModal({ title, text, onCancel, onConfirm }) {
  return (
    <div className={styles.backdrop} role="presentation">
      <div aria-label={title} aria-modal="true" className={styles.modal} role="dialog">
        <span className={styles.icon}><Icon name="warning" size={25} /></span>
        <h2>{title}</h2>
        <p>{text}</p>
        <div className={styles.actions}>
          <Button type="button" onClick={onCancel} variant="outline">Cancelar</Button>
          <Button type="button" onClick={onConfirm} variant="danger">Confirmar</Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
