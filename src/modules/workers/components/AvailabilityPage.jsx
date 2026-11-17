import { useState } from 'react';
import StatusMessage from './ui/StatusMessage';
import Toggle from './ui/Toggle';
import ui from './ui/ui.module.css';
import { useMyWorker } from '../hooks/useMyWorker';
import { updateAvailableNow } from '../services/workersService';
import ProfileStatus from './ProfileStatus';
import PageHeading from './PageHeading';
import ScheduleEditor from './ScheduleEditor';
import styles from './worker.module.css';

function AvailabilityPage() {
  const { data: profile, loading, error, refresh } = useMyWorker();
  const [toggleError, setToggleError] = useState('');
  const [cambiando, setCambiando] = useState(false);
  if (!profile) return <ProfileStatus error={error} loading={loading} />;

  const locked = profile.status === 'PAUSED';

  const switchAvailableNow = async () => {
    setToggleError('');
    setCambiando(true);
    try {
      await updateAvailableNow(profile.id, !profile.availableNow);
      await refresh();
    } catch (e) {
      setToggleError(e.message);
    } finally {
      setCambiando(false);
    }
  };

  return (
    <div>
      <PageHeading
        eyebrow="Tu agenda"
        title="Disponibilidad"
        description="Configura franjas fijas o repetitivas y avisa cuando estés disponible en este momento."
      />
      {locked && (
        <StatusMessage className={styles.notice} variant="warning">
          Tu perfil está pausado por administración: no puedes editar tu disponibilidad.
        </StatusMessage>
      )}
      <div className={locked ? styles.locked : ''} inert={locked}>
        <section className={`${ui.infoCard} ${styles.nowCard}`}>
          <div>
            <h2>Disponible ahora</h2>
            <p>Actívalo cuando puedas atender un trabajo de inmediato, aunque estés fuera de tus franjas.</p>
          </div>
          <Toggle
            checked={profile.availableNow}
            disabled={cambiando}
            label={profile.availableNow ? 'Disponible' : 'No disponible'}
            onChange={switchAvailableNow}
          />
        </section>
        {toggleError && <StatusMessage className={styles.notice} variant="error">{toggleError}</StatusMessage>}
        <ScheduleEditor onChange={refresh} slots={profile.slots} workerId={profile.id} />
      </div>
    </div>
  );
}

export default AvailabilityPage;
