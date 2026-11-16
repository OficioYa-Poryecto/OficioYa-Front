import { useState } from 'react';
import StatusMessage from '../../core/design-system/StatusMessage';
import Toggle from '../../core/design-system/Toggle';
import ui from '../../core/design-system/ui.module.css';
import { useMyWorker } from '../hooks/useMyWorker';
import { updateAvailableNow } from '../services/trabajadoresService';
import EstadoPerfil from './EstadoPerfil';
import { formatoDinero, nombreUnidad } from './formatos';
import PageHeading from './PageHeading';
import styles from './trabajador.module.css';

function PanelPage() {
  const { data: perfil, loading, error, refresh } = useMyWorker();
  const [actionError, setActionError] = useState('');
  if (!perfil) return <EstadoPerfil error={error} loading={loading} />;

  const paused = perfil.status === 'PAUSED';
  const estado = paused ? 'Pausado' : 'Activo';
  const { primaryTrade } = perfil;
  const stats = [
    { label: 'Estado', value: estado },
    { label: 'Oficio principal', value: primaryTrade.trade.name },
    { label: 'Tarifa', value: `${formatoDinero(primaryTrade.approxRate)} · ${nombreUnidad(primaryTrade.rateUnit)}` },
    { label: 'Zonas', value: `${perfil.zoneIds.length} seleccionadas` },
    { label: 'Franjas', value: `${perfil.slots.length} configuradas` },
    { label: 'Fotos', value: `${perfil.photos.length} publicadas` },
  ];

  const ejecutar = async (accion) => {
    setActionError('');
    try {
      await accion();
      await refresh();
    } catch (e) {
      setActionError(e.message);
    }
  };

  return (
    <div>
      <PageHeading
        eyebrow="Tu actividad"
        title="Mi panel"
        description="Una vista rápida de cómo está tu perfil hoy."
        action={<span className={`${styles.statusPill} ${paused ? styles.statusPaused : ''}`}>{estado}</span>}
      />
      {paused && (
        <StatusMessage className={styles.notice} variant="warning">
          <strong>Tu perfil está pausado por administración.</strong> No aparece en búsquedas y la edición está bloqueada mientras se revisa.
        </StatusMessage>
      )}
      {actionError && <StatusMessage className={styles.notice} variant="error">{actionError}</StatusMessage>}
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div className={`${ui.infoCard} ${styles.stat}`} key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>
      <section className={`${ui.infoCard} ${styles.panelControl}`}>
        <div>
          <h2>Disponible ahora</h2>
          <p>Indica a los contratantes que puedes atender un trabajo en este momento.</p>
        </div>
        <div className={styles.panelActions}>
          <Toggle
            checked={perfil.availableNow}
            disabled={paused}
            label="Disponible ahora"
            onChange={() => ejecutar(() => updateAvailableNow(perfil.id, !perfil.availableNow))}
          />
        </div>
      </section>
    </div>
  );
}

export default PanelPage;
