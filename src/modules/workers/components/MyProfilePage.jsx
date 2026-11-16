import { useNavigate } from 'react-router-dom';
import PrivateContactCard from './ui/PrivateContactCard';
import ProfileHero from './ui/ProfileHero';
import Icon from './ui/Icon';
import Button from '../../core/design-system/Button';
import StatusMessage from './ui/StatusMessage';
import ui from './ui/ui.module.css';
import { useMyWorker } from '../hooks/useMyWorker';
import ProfileStatus from './ProfileStatus';
import { enmascararCorreo, enmascararTelefono, formatoDinero, nombreUnidad, getInitials } from './formats';
import TradesSection from './TradesSection';
import styles from './worker.module.css';
import { useAccount } from '../hooks/useAccount';


// "Mi perfil": lo que ve el propio trabajador. Incluye su contacto enmascarado
// (viene de Identity, no de Worker) y el manejo de sus oficios.
function MyProfilePage() {
  const navigate = useNavigate();
  const { data: perfil, loading, error, refresh } = useMyWorker();
  const account = useAccount('/users/me');
  if (!perfil) return <ProfileStatus error={error} loading={loading} />;

  const rawPhone = account?.phones?.[0];
  const cuenta = {
    name: account?.name ?? 'Trabajador',
    initials: getInitials(account?.name),
    hasRealName: Boolean(account?.name),
    email: account?.email ?? null,
    phone: typeof rawPhone === 'string' ? rawPhone : (rawPhone?.number ?? null),
  };
  const paused = perfil.status === 'PAUSED';
  const { primaryTrade } = perfil;

  return (
    <div>
      <section className={`${ui.infoCard} ${styles.profileHeader}`}>
        <ProfileHero
          initials={cuenta.initials}
          name={cuenta.name}
          // Con el nombre genérico ("Trabajador") no se repite la etiqueta del rol.
          roles={cuenta.hasRealName ? ['Trabajador', primaryTrade.trade.name] : [primaryTrade.trade.name]}
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
            <Button type="button" onClick={() => navigate(`/workers/${perfil.id}`)} variant="outline">
              <Icon name="eye" size={18} />{' '}
              Ver perfil público
            </Button>
          </section>
        </aside>
        <div>
          <div className={styles.sectionTitle}>
            <h2>Mis oficios y tarifas</h2>
            <p>Tu oficio principal y los servicios adicionales que ofreces.</p>
          </div>
          <TradesSection locked={paused} perfil={perfil} refresh={refresh} />
        </div>
      </div>
    </div>
  );
}

export default MyProfilePage;
