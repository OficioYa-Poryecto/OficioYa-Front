import { Link, useParams } from 'react-router-dom';
import EmptyState from '../../core/design-system/EmptyState';
import Icon from '../../core/design-system/Icon';
import StatusMessage from '../../core/design-system/StatusMessage';
import ui from '../../core/design-system/ui.module.css';
import { useZones } from '../hooks/useCatalogos';
import { useWorker } from '../hooks/useWorker';
import { getSession } from '../services/session';
import { formatoDinero, formatoFecha, nombreUnidad } from './formatos';
import ScheduleEditor from './ScheduleEditor';
import styles from './trabajador.module.css';

// Perfil público de un trabajador (RF-08): oficios, tarifas, cobertura, disponibilidad y fotos.
// No muestra datos de contacto: WorkerResponse no los trae y son de Identity.
function PerfilPublicoPage() {
  const { id } = useParams();
  const { data: perfil, loading, error, notFound } = useWorker(id);
  const { data: zonas } = useZones();

  if (loading) return <div className={styles.publicPage}><EmptyState title="Cargando…" text="Estamos consultando el perfil." /></div>;
  if (notFound || perfil?.status === 'PAUSED') {
    return (
      <div className={styles.publicPage}>
        <div className={ui.infoCard}>
          <EmptyState title="Perfil no disponible" text="Este trabajador no existe o no está visible en este momento." />
        </div>
      </div>
    );
  }
  if (error) return <div className={styles.publicPage}><StatusMessage variant="error">No pudimos cargar el perfil: {error}</StatusMessage></div>;

  const esPropio = perfil.userId === getSession().userId;
  const oficios = [perfil.primaryTrade, ...perfil.secondaryTrades];
  const nombreZona = (zoneId) => zonas?.find((zona) => zona.id === zoneId)?.name ?? `Zona ${zoneId}`;
  const { primaryTrade } = perfil;

  return (
    <div className={styles.publicPage}>
      {esPropio && (
        <div className={styles.previewBar}>
          <span><Icon name="eye" size={16} /> Así ven tu perfil los contratantes.</span>
          <Link to="/trabajador/perfil">Volver a mi perfil</Link>
        </div>
      )}
      <section className={`${ui.infoCard} ${styles.publicHero}`}>
        <span className={`${ui.avatar} ${ui.avatarProfile}`}><Icon name="wrench" size={34} /></span>
        <div>
          <p className="eyebrow">{primaryTrade.trade.category?.name ?? 'Trabajador de OficioYa'}</p>
          <h1>{primaryTrade.trade.name}</h1>
          <div className={`${ui.badges} ${ui.badgesWrap}`}>
            {perfil.secondaryTrades.map((item) => (
              <span className={ui.badgeNeutral} key={item.id}>{item.trade.name}</span>
            ))}
          </div>
        </div>
        <div className={styles.profileHeaderSide}>
          <span>Desde</span>
          <strong>{formatoDinero(primaryTrade.approxRate)}</strong>
          <small>{nombreUnidad(primaryTrade.rateUnit)}</small>
        </div>
      </section>

      <div className={styles.profileLayout}>
        <aside className={styles.stack}>
          <section className={ui.infoCard}>
            <h2>Cobertura</h2>
            {perfil.zoneIds.length ? (
              <div className={styles.zoneChips}>
                {perfil.zoneIds.map((zoneId) => (
                  <span key={zoneId}><Icon name="map" size={13} /> {nombreZona(zoneId)}</span>
                ))}
              </div>
            ) : (
              <p className={styles.mutedText}>Sin zonas publicadas.</p>
            )}
          </section>
          <section className={ui.infoCard}>
            <h2>Contacto</h2>
            <div className={ui.privacyNote}>
              <Icon name="lock" size={15} />
              <span>Por privacidad, los datos de contacto del trabajador no se muestran en su perfil público.</span>
            </div>
          </section>
        </aside>
        <div className={styles.stack}>
          <section className={ui.infoCard}>
            <h2>Oficios y tarifas</h2>
            <ul className={styles.rateList}>
              {oficios.map((item, index) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.trade.name}</strong>
                    {index === 0 && <span className={styles.primaryTag}>Principal</span>}
                  </div>
                  <span>{formatoDinero(item.approxRate)} <small>{nombreUnidad(item.rateUnit)}</small></span>
                </li>
              ))}
            </ul>
            <p className={styles.mutedText}>Las tarifas son aproximadas y pueden variar según el trabajo.</p>
          </section>
          <section className={ui.infoCard}>
            <h2>Disponibilidad</h2>
            <ScheduleEditor availableNow={perfil.availableNow} readOnly slots={perfil.slots} />
          </section>
          <section className={ui.infoCard}>
            <h2>Trabajos realizados</h2>
            {perfil.photos.length ? (
              <div className={styles.publicGallery}>
                {perfil.photos.map((photo) => (
                  <figure key={photo.id}>
                    <img alt={photo.description || 'Trabajo realizado'} loading="lazy" src={photo.url} />
                    <figcaption>
                      {photo.description || 'Sin descripción'}
                      <small>{formatoFecha(photo.uploadedAt.slice(0, 10))}</small>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <EmptyState title="Sin fotos" text="Este trabajador aún no ha publicado fotos de sus trabajos." />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default PerfilPublicoPage;
