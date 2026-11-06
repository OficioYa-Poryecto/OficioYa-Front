import Boton from '../../core/design-system/Boton';
import StatusMessage from '../../core/design-system/StatusMessage';
import Toggle from '../../core/design-system/Toggle';
import ui from '../../core/design-system/ui.module.css';
import { useMiPerfil } from '../hooks/useMiPerfil';
import { formatoDinero, nombreUnidad } from './formatos';
import PageHeading from './PageHeading';
import PerfilRequerido from './PerfilRequerido';
import styles from './trabajador.module.css';

function PanelPage() {
  const { perfil, guardarPerfil } = useMiPerfil();
  if (!perfil) return <PerfilRequerido />;

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
          <strong>Tu perfil está pausado.</strong> No aparece en búsquedas y la edición está bloqueada. Reactívalo para continuar.
        </StatusMessage>
      )}
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
          <h2>Visibilidad del perfil</h2>
          <p>Controla si los contratantes pueden encontrarte y si estás disponible en este momento.</p>
        </div>
        <div className={styles.panelActions}>
          <Toggle
            checked={perfil.availableNow}
            disabled={paused}
            label="Disponible ahora"
            onChange={() => guardarPerfil({ ...perfil, availableNow: !perfil.availableNow })}
          />
          {paused ? (
            <Boton icon="play" onClick={() => guardarPerfil({ ...perfil, status: 'ACTIVE' })}>Reactivar perfil</Boton>
          ) : (
            <Boton
              icon="pause"
              onClick={() => guardarPerfil({ ...perfil, status: 'PAUSED', availableNow: false })}
              variant="outline"
            >
              Pausar perfil
            </Boton>
          )}
        </div>
      </section>
    </div>
  );
}

export default PanelPage;
