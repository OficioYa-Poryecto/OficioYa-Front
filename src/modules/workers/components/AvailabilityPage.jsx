import { useState } from 'react';
import StatusMessage from '../../core/design-system/StatusMessage';
import Toggle from '../../core/design-system/Toggle';
import ui from '../../core/design-system/ui.module.css';
import { useMyWorker } from '../hooks/useMyWorker';
import { updateAvailableNow } from '../services/trabajadoresService';
import EstadoPerfil from './EstadoPerfil';
import PageHeading from './PageHeading';
import ScheduleEditor from './ScheduleEditor';
import styles from './trabajador.module.css';

function DisponibilidadPage() {
  const { data: perfil, loading, error, refresh } = useMyWorker();
  const [toggleError, setToggleError] = useState('');
  const [cambiando, setCambiando] = useState(false);
  if (!perfil) return <EstadoPerfil error={error} loading={loading} />;

  const locked = perfil.status === 'PAUSED';

  const cambiarAhora = async () => {
    setToggleError('');
    setCambiando(true);
    try {
      await updateAvailableNow(perfil.id, !perfil.availableNow);
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
            checked={perfil.availableNow}
            disabled={cambiando}
            label={perfil.availableNow ? 'Disponible' : 'No disponible'}
            onChange={cambiarAhora}
          />
        </section>
        {toggleError && <StatusMessage className={styles.notice} variant="error">{toggleError}</StatusMessage>}
        <ScheduleEditor onChange={refresh} slots={perfil.slots} workerId={perfil.id} />
      </div>
    </div>
  );
}

export default DisponibilidadPage;
