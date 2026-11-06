import { useNavigate } from 'react-router-dom';
import NeighborhoodCard from '../../core/components/NeighborhoodCard';
import PrivateContactCard from '../../core/components/PrivateContactCard';
import ProfileHero from '../../core/components/ProfileHero';
import Boton from '../../core/design-system/Boton';
import Icon from '../../core/design-system/Icon';
import StatusMessage from '../../core/design-system/StatusMessage';
import ui from '../../core/design-system/ui.module.css';
import SolicitudItem from '../../solicitudes/components/SolicitudItem';
import { useSolicitudes } from '../../solicitudes/hooks/useSolicitudes';
import { useAuth } from '../hooks/useAuth';
import styles from './contratante.module.css';

function ContratantePerfilPage() {
  const navigate = useNavigate();
  const { contratante, hasWorkerRole, addWorkerRole } = useAuth();
  const { solicitudes } = useSolicitudes();
  const roles = hasWorkerRole ? ['Contratante', 'Trabajador'] : ['Contratante'];

  return (
    <div className={`${ui.page} ${ui.profilePage}`}>
      <div className={ui.profileTop}>
        <ProfileHero initials={contratante.initials} name={contratante.name} roles={roles} />
        <div className={ui.profileActions}>
          {!hasWorkerRole && (
            <Boton icon="plus" onClick={addWorkerRole} variant="outline">
              Agregar rol de trabajador
            </Boton>
          )}
          <Boton icon="edit" onClick={() => navigate('/contratante/editar')} variant="outline">
            Editar perfil
          </Boton>
        </div>
      </div>
      {hasWorkerRole && (
        <StatusMessage className={ui.roleAddedMessage}>
          <strong>Rol de trabajador agregado.</strong> Ahora puedes completar tu información
          de trabajo con esta misma cuenta.
        </StatusMessage>
      )}
      <div className={ui.profileLayout}>
        <aside className={ui.profileSidebar}>
          <PrivateContactCard email={contratante.maskedEmail} phones={contratante.maskedPhones} />
          <NeighborhoodCard
            label="Zona frecuente"
            note="La dirección exacta solo se comparte al confirmar un servicio."
            zone={contratante.zone}
          />
        </aside>
        <div className={ui.profileContent}>
          <section className={ui.infoCard}>
            <div className={`${ui.sectionHeader} ${ui.sectionHeaderSimple}`}>
              <div>
                <p className="eyebrow">Mi actividad</p>
                <h2>Resumen como contratante</h2>
              </div>
              <span className={ui.availability}><span /> Cuenta verificada</span>
            </div>
            <div className={styles.stats}>
              {contratante.stats.map((stat) => (
                <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>
              ))}
            </div>
          </section>
          <section className={ui.infoCard}>
            <div className={`${ui.sectionHeader} ${ui.sectionHeaderSimple}`}>
              <div>
                <p className="eyebrow">Historial reciente</p>
                <h2>Mis servicios</h2>
              </div>
              <Boton variant="ghost">Ver todos</Boton>
            </div>
            <div>
              {solicitudes.map((solicitud) => (
                <SolicitudItem key={solicitud.title} solicitud={solicitud} />
              ))}
            </div>
          </section>
          <section className={`${ui.infoCard} ${styles.trustCard}`}>
            <span><Icon name="shield" size={24} /></span>
            <div>
              <h2>Tu privacidad va primero</h2>
              <p>
                Tu contacto y dirección exacta permanecen ocultos hasta que una solicitud sea
                aceptada.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ContratantePerfilPage;
