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
import { DIAS, formatoDinero, formatoFecha, nombreDia, nombreUnidad } from './formats';
import PageHeading from './PageHeading';
import ProfileStatus from './ProfileStatus';
import styles from './worker.module.css';

const DAY_ORDER = DIAS.map((day) => day.value);

function DashboardPage() {
  const { data: perfil, loading, error, refresh } = useMyWorker();
  const { data: zones } = useZones();
  const account = useAccount('/users/me');
  const [actionError, setActionError] = useState('');
  if (!perfil) return <ProfileStatus error={error} loading={loading} />;

  const paused = perfil.status === 'PAUSED';
  const { primaryTrade, secondaryTrades } = perfil;
  const firstName = account?.name?.trim().split(/\s+/)[0];
  const zoneNames = perfil.zoneIds.map((id) => zones?.find((zone) => zone.id === id)?.name ?? `Zona ${id}`);
  const today = new Date().toISOString().slice(0, 10);
  const slots = [...perfil.slots]
    .filter((slot) => slot.recurrenceType === 'RECURRING' || slot.startDate >= today)
    .sort((a, b) => {
      const fixedA = a.recurrenceType !== 'RECURRING';
      const fixedB = b.recurrenceType !== 'RECURRING';
      if (fixedA !== fixedB) return fixedA ? 1 : -1;
      if (fixedA) return a.startDate.localeCompare(b.startDate) || a.startTime.localeCompare(b.startTime);
      return DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek) || a.startTime.localeCompare(b.startTime);
    });

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
        description="Un vistazo rápido a lo que ven los contratantes de tu perfil."
        eyebrow="Resumen"
        title={firstName ? `Hola, ${firstName}` : 'Hola'}
      />
      {paused && (
        <StatusMessage className={styles.notice} variant="warning">
          <strong>Tu perfil está pausado por administración.</strong> No aparece en búsquedas y la edición está bloqueada mientras se revisa.
        </StatusMessage>
      )}
      {actionError && <StatusMessage className={styles.notice} variant="error">{actionError}</StatusMessage>}

      <div className={styles.dashGrid}>
        <div className={styles.dashCol}>
          <section className={ui.infoCard}>
            <header className={styles.dashHead}>
              <h2>Oficio principal</h2>
              <Link to="/worker/profile">Editar</Link>
            </header>
            <ul className={styles.dashList}>
              <li>
                <span className={styles.dashIcon}><Icon name="briefcase" size={18} /></span>
                <div>
                  <strong>{primaryTrade.trade.name}</strong>
                  <small>{primaryTrade.trade.category?.name}</small>
                </div>
                <b>{formatoDinero(primaryTrade.approxRate)}<small>{nombreUnidad(primaryTrade.rateUnit)}</small></b>
              </li>
            </ul>
          </section>

          {secondaryTrades.length > 0 && (
            <section className={ui.infoCard}>
              <header className={styles.dashHead}>
                <h2>Otros oficios</h2>
                <Link to="/worker/profile">Ver todos</Link>
              </header>
              <ul className={styles.dashList}>
                {secondaryTrades.slice(0, 3).map((item) => (
                  <li key={item.id}>
                    <span className={styles.dashIcon}><Icon name="briefcase" size={18} /></span>
                    <div><strong>{item.trade.name}</strong></div>
                    <b>{formatoDinero(item.approxRate)}<small>{nombreUnidad(item.rateUnit)}</small></b>
                  </li>
                ))}
              </ul>
              {secondaryTrades.length > 3 && <small className={styles.dashMore}>+{secondaryTrades.length - 3} más</small>}
            </section>
          )}

          <section className={ui.infoCard}>
            <header className={styles.dashHead}>
              <h2>Zonas de cobertura</h2>
              <Link to="/worker/coverage">Editar</Link>
            </header>
            {zoneNames.length === 0 ? (
              <p className={styles.mutedText}>Aún no has elegido zonas.</p>
            ) : (
              <div className={styles.miniChips}>
                {zoneNames.slice(0, 6).map((name) => <em key={name}>{name}</em>)}
                {zoneNames.length > 6 && <em>+{zoneNames.length - 6}</em>}
              </div>
            )}
          </section>
        </div>

        <div className={styles.dashCol}>
          <section className={ui.infoCard}>
            <header className={styles.dashHead}>
              <h2>Galería</h2>
              <Link to="/worker/gallery">Ver galería</Link>
            </header>
            {perfil.photos.length === 0 ? (
              <p className={styles.mutedText}>Aún no has subido fotos de tus trabajos.</p>
            ) : (
              <div className={styles.dashPhotos}>
                {perfil.photos.slice(0, 4).map((photo) => (
                  <img alt={photo.description || 'Trabajo realizado'} key={photo.id} src={photo.url} />
                ))}
              </div>
            )}
            {perfil.photos.length > 4 && <small className={styles.dashMore}>+{perfil.photos.length - 4} fotos más</small>}
          </section>

          <section className={ui.infoCard}>
            <header className={styles.dashHead}>
              <h2>Mi horario</h2>
              <Link to="/worker/availability">Editar</Link>
            </header>
            {slots.length === 0 ? (
              <p className={styles.mutedText}>Sin franjas: los contratantes no saben cuándo puedes atender.</p>
            ) : (
              <ul className={styles.dashList}>
                {slots.slice(0, 4).map((slot) => {
                  const fixed = slot.recurrenceType !== 'RECURRING';
                  return (
                    <li key={slot.id}>
                      <span className={`${styles.dayChip} ${fixed ? styles.dayChipFixed : ''}`}>
                        {fixed ? 'Fija' : nombreDia(slot.dayOfWeek).slice(0, 3)}
                      </span>
                      <div>
                        <strong>{slot.startTime.slice(0, 5)} – {slot.endTime.slice(0, 5)}</strong>
                        <small>{fixed ? formatoFecha(slot.startDate) : 'Cada semana'}</small>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            {slots.length > 4 && <small className={styles.dashMore}>+{slots.length - 4} franjas más</small>}
          </section>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;