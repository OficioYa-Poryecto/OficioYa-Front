import Icon from '../../core/design-system/Icon';
import ui from '../../core/design-system/ui.module.css';
import styles from './SolicitudItem.module.css';

function SolicitudItem({ solicitud }) {
  return (
    <div className={styles.item}>
      <span className={styles.icon}><Icon name={solicitud.icon} /></span>
      <span className={styles.text}>
        <strong>{solicitud.title}</strong>
        <small>{solicitud.detail}</small>
      </span>
      <b className={`${ui.statusPill} ${ui[solicitud.tone]}`}>{solicitud.status}</b>
    </div>
  );
}

export default SolicitudItem;
