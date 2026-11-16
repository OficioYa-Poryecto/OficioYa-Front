import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './ui/Icon';
import StatusMessage from './ui/StatusMessage';
import Toggle from './ui/Toggle';
import ui from './ui/ui.module.css';
import { useAccount } from '../hooks/useAccount';
import { useZones } from '../hooks/useCatalogs';
import { useMyWorker } from '../hooks/useMyWorker';
import { updateAvailableNow } from '../services/workersService';
import { formatoDinero, nombreUnidad } from './formats';
import PageHeading from './PageHeading';
import ProfileStatus from './ProfileStatus';
import styles from './worker.module.css';

const WEEK = [
  ['MONDAY', 'L'],
  ['TUESDAY', 'M'],
  ['WEDNESDAY', 'X'],
  ['THURSDAY', 'J'],
  ['FRIDAY', 'V'],
  ['SATURDAY', 'S'],
  ['SUNDAY', 'D'],
];

function DashboardPage() {
  const { data: perfil, loading, error, refresh } = useMyWorker();
  const { data: zones } = useZones();
  const account = useAccount('/users/me');
  const [actionError, setActionError] = useState('');
  if (!perfil) return <ProfileStatus error={error} loading={loading} />;

  const paused = perfil.status === 'PAUSED';
  const { primaryTrade } = perfil;
  const firstName = account?.name?.trim().split(/\s+/)[0];
  const zoneNames = perfil.zoneIds.map((id) => zones?.find((zone) => zone.id === id)?.name ?? `Zona ${id}`);
  const activeDays = new Set(
    perfil.slots.filter((slot) => slot.recurrenceType === 'RECURRING').map((slot) => slot.dayOfWeek),
  );

  const steps = [
    { label: 'Oficio y tarifa', done: Boolean(primaryTrade.approxRate), to: '/worker/profile' },
    { label: 'Zonas de cobertura', done: perfil.zoneIds.length > 0, to: '/worker/coverage' },
    { label: 'Horario de disponibilidad', done: perfil.slots.length > 0, to: '/worker/availability' },
    { label: 'Fotos de tus trabajos', done: perfil.photos.length > 0, to: '/worker/gallery' },
  ];
  const progress = Math.round((steps.filter((step) => step.done).length / steps.length) * 100);

  const toggleNow = async () => {
    setActionError('');
    try {
      await updateAvailableNow(perfil.id, !perfil.availableNow);
      await refresh();
    } catch (e) {
      setActionError(e.message);
    }
  };

  return (
    <div>
      <PageHeading
        action={
          <div className={styles.nowSwitch}>
            <Toggle checked={perfil.availableNow} disabled={paused} label="Disponible ahora" onChange={toggleNow} />
          </div>
        }
        description="Así va tu perfil hoy y qué te falta para recibir más trabajos."
        eyebrow="Resumen"
        title={firstName ? `Hola, ${firstName}` : 'Hola'}
      />
      {paused && (
        <StatusMessage className={styles.notice} variant="warning">
          <strong>Tu perfil está pausado por administración.</strong> No aparece en búsquedas y la edición está bloqueada mientras se revisa.
        </StatusMessage>
      )}
      {actionError && <StatusMessage className={styles.notice} variant="error">{actionError}</StatusMessage>}

      <section className={`${ui.infoCard} ${styles.progressCard}`}>
        <div className={styles.progressTop}>
          <h2>Tu perfil está al {progress}%</h2>
          <span className={`${styles.statusPill} ${paused ? styles.statusPaused : ''}`}>{paused ? 'Pausado' : 'Activo'}</span>
        </div>
        <div className={styles.bar}><span style={{ width: `${progress}%` }} /></div>
        <ul className={styles.steps}>
          {steps.map((step) => (
            <li className={step.done ? styles.stepDone : ''} key={step.label}>
              <Icon name={step.done ? 'check' : 'arrow'} size={14} />
              <span>{step.label}</span>
              {!step.done && <Link to={step.to}>Completar</Link>}
            </li>
          ))}
        </ul>
      </section>

      <div className={styles.tiles}>
        <Link className={`${styles.tile} ${styles.tileRate}`} to="/worker/profile">
          <span>{primaryTrade.trade.name}</span>
          <strong>{formatoDinero(primaryTrade.approxRate)}</strong>
          <small>{nombreUnidad(primaryTrade.rateUnit)}</small>
        </Link>
        <Link className={styles.tile} to="/worker/coverage">
          <span>Zonas</span>
          <strong>{perfil.zoneIds.length}</strong>
          <div className={styles.miniChips}>
            {zoneNames.slice(0, 2).map((name) => <em key={name}>{name}</em>)}
            {zoneNames.length > 2 && <em>+{zoneNames.length - 2}</em>}
          </div>
        </Link>
        <Link className={styles.tile} to="/worker/gallery">
          <span>Fotos</span>
          <strong>{perfil.photos.length}</strong>
          <small>publicadas</small>
        </Link>
        <Link className={`${styles.tile} ${styles.tileWeek}`} to="/worker/availability">
          <span>Tu semana</span>
          <div className={styles.week}>
            {WEEK.map(([day, letter]) => (
              <b className={activeDays.has(day) ? styles.dayOn : ''} key={day}>{letter}</b>
            ))}
          </div>
          <small>{perfil.slots.length} franjas</small>
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;