import { useNavigate } from 'react-router-dom';
import PrivateContactCard from '../../core/components/PrivateContactCard';
import ProfileHero from '../../core/components/ProfileHero';
import Boton from '../../core/design-system/Boton';
import StatusMessage from '../../core/design-system/StatusMessage';
import ui from '../../core/design-system/ui.module.css';
import { useMyWorker } from '../hooks/useMyWorker';
import { getSession } from '../services/session';
import EstadoPerfil from './EstadoPerfil';
import { enmascararCorreo, enmascararTelefono, formatoDinero, nombreUnidad } from './formatos';
import OficiosSection from './OficiosSection';
import styles from './trabajador.module.css';

// "Mi perfil": lo que ve el propio trabajador. Incluye su contacto enmascarado
// (viene de Identity, no de Worker) y el manejo de sus oficios.
function MiPerfilPage() {
  const navigate = useNavigate();
  const { data: perfil, loading, error, refresh } = useMyWorker();
  if (!perfil) return <EstadoPerfil error={error} loading={loading} />;

  const cuenta = getSession();
  const paused = perfil.status === 'PAUSED';
  const { primaryTrade } = perfil;

  return (
    <div>
      <section className={`${ui.infoCard} ${styles.profileHeader}`}>
        <ProfileHero
          initials={cuenta.initials}
          name={cuenta.name}
          roles={['Trabajador', primaryTrade.trade.name]}
          statusLabel={paused ? 'Perfil pausado' : 'Perfil activo'}
          statusMuted={paused}
        />
        <div className={styles.profileHeaderSide}>
          <span>Desde</span>
          <strong>{formatoDinero(primaryTrade.approxRate)}</strong>
          <small>{nombreUnidad(primaryTrade.rateUnit)}</small>
        </div>
      </section>
      {paused && (
        <StatusMessage className={styles.notice} variant="warning">
          Tu perfil está pausado por administración: no aparece en búsquedas y no puedes editar tus oficios.
        </StatusMessage>
      )}
      <div className={styles.profileLayout}>
        <aside className={styles.stack}>
          <PrivateContactCard
            email={cuenta.email ? enmascararCorreo(cuenta.email) : 'Sin correo registrado'}
            phones={cuenta.phone ? [enmascararTelefono(cuenta.phone)] : []}
          />
          <section className={ui.infoCard}>
            <h2>Vista pública</h2>
            <p className={styles.mutedText}>
              Así te ven los contratantes: oficios, tarifas, cobertura y disponibilidad, sin tus datos de contacto.
            </p>
            <Boton icon="eye" onClick={() => navigate(`/trabajadores/${perfil.id}`)} variant="outline">
              Ver perfil público
            </Boton>
          </section>
        </aside>
        <div>
          <div className={styles.sectionTitle}>
            <h2>Mis oficios y tarifas</h2>
            <p>Tu oficio principal y los servicios adicionales que ofreces.</p>
          </div>
          <OficiosSection locked={paused} perfil={perfil} refresh={refresh} />
        </div>
      </div>
    </div>
  );
}

export default MiPerfilPage;
