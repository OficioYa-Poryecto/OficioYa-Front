import Boton from './Boton';
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
          <Boton onClick={onCancel} variant="outline">Cancelar</Boton>
          <Boton onClick={onConfirm} variant="danger">Confirmar</Boton>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
