import PrivateContactCard from '../../core/components/PrivateContactCard';
import ProfileHero from '../../core/components/ProfileHero';
import Boton from '../../core/design-system/Boton';
import Icon from '../../core/design-system/Icon';
import ui from '../../core/design-system/ui.module.css';
import { useAuth } from '../hooks/useAuth';
import styles from './admin.module.css';

function AdminPerfilPage() {
  const { administrador } = useAuth();

  return (
    <div className={ui.page}>
      <div className={ui.profileTop}>
        <ProfileHero initials={administrador.initials} name={administrador.name} roles={['Administrador']} />
        <span className={styles.access}><Icon name="shield" size={16} /> Acceso interno</span>
      </div>
      <div className={styles.summary}>
        {administrador.summary.map((item) => (
          <section key={item.label}>
            <span><Icon name={item.icon} /></span>
            <div>
              <small>{item.label}</small>
              <strong>{item.value}</strong>
              <b>{item.note}</b>
            </div>
          </section>
        ))}
      </div>
      <div className={styles.layout}>
        <section className={ui.infoCard}>
          <div className={`${ui.sectionHeader} ${ui.sectionHeaderSimple}`}>
            <div>
              <p className="eyebrow">Moderación</p>
              <h2>Cola de revisión</h2>
            </div>
            <Boton variant="outline">Ver todos los casos</Boton>
          </div>
          <div className={styles.table}>
            <div className={styles.tableHead}>
              <span>Usuario</span><span>Motivo</span><span>Estado</span><span>Acción</span>
            </div>
            {administrador.reviewQueue.map((item) => (
              <div key={item.name}>
                <span><b>{item.name}</b><small>{item.detail}</small></span>
                <span>{item.reason}</span>
                <span><b className={`${ui.statusPill} ${ui[item.tone]}`}>{item.status}</b></span>
                <span><Boton variant="ghost">Revisar</Boton></span>
              </div>
            ))}
          </div>
        </section>
        <aside className={ui.profileSidebar}>
          <PrivateContactCard email={administrador.maskedEmail} phones={administrador.maskedPhones} />
          <section className={`${ui.infoCard} ${styles.permissions}`}>
            <h2>Permisos del rol</h2>
            {administrador.permissions.map((permission) => (
              <div key={permission}><Icon name="check" size={14} /> {permission}</div>
            ))}
          </section>
        </aside>
      </div>
    </div>
  );
}

export default AdminPerfilPage;
