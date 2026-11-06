import Icon from '../design-system/Icon';
import ui from '../design-system/ui.module.css';

function PrivateContactCard({ email, phones }) {
  return (
    <section className={ui.infoCard}>
      <h2>Datos de contacto</h2>
      <div className={ui.contactItem}>
        <span><Icon name="mail" size={18} /></span>
        <div><small>Correo</small><strong>{email}</strong></div>
      </div>
      {phones.map((phone, index) => (
        <div className={ui.contactItem} key={phone}>
          <span><Icon name="phone" size={18} /></span>
          <div>
            <small>{index === 0 ? 'Teléfono principal' : `Teléfono alterno ${index}`}</small>
            <strong>{phone}</strong>
          </div>
        </div>
      ))}
      <div className={ui.privacyNote}>
        <Icon name="lock" size={15} />
        <span>Datos protegidos. Solo administración puede consultarlos completos.</span>
      </div>
    </section>
  );
}

export default PrivateContactCard;
