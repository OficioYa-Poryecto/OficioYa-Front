import { deriveTitle, formatSchedule, getInitials } from '../requestForm';
import { imagesService } from '../services/imagesService';
import { BellIcon, CalendarIcon, ImageIcon, MapPinIcon, StarIcon } from './icons';
import styles from './ReviewStep.module.css';

function ReviewStep({ values, onEditWorkers, busy, error }) {
  const photo = values.photos[0];
  const neighborhood = values.neighborhood.trim();
  const address = values.exactAddress.trim();
  const count = values.workers.length;

  return (
    <div className={styles.review}>
      <section className={styles.hero} aria-label="Servicio solicitado">
        {photo ? (
          <img src={photo.dataUrl} alt="" className={styles.heroThumb} />
        ) : (
          <span className={`${styles.heroThumb} ${styles.heroThumbEmpty}`}>
            <ImageIcon size={24} />
          </span>
        )}
        <div className={styles.heroText}>
          <p className={styles.heroEyebrow}>Servicio solicitado</p>
          <h2>{deriveTitle(values.description)}</h2>
          <p className={styles.heroMeta}>
            {neighborhood} · {formatSchedule(values.date, values.time, { short: true })}
          </p>
        </div>
      </section>

      <div className={styles.columns}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>{count === 1 ? 'Trabajador elegido' : 'Trabajadores elegidos'}</h3>
            <button
              type="button"
              className={styles.edit}
              onClick={onEditWorkers}
              disabled={busy}
            >
              Editar
            </button>
          </div>
          <ul className={styles.list}>
            {values.workers.map((worker) => (
              <li key={worker.id} className={styles.workerRow}>
                <span className={styles.avatar} aria-hidden="true">
                  {getInitials(worker.name)}
                </span>
                <span className={styles.workerText}>
                  <strong>{worker.name}</strong>
                  <span>{worker.trade}</span>
                </span>
                <span className={styles.rating}>
                  <StarIcon size={14} />
                  {worker.rating.toFixed(1)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.card}>
          <h3>Detalles de la solicitud</h3>
          <ul className={styles.list}>
            <li className={styles.detailRow}>
              <ImageIcon size={18} />
              <span className={styles.detailText}>
                <span className={styles.detailLabel}>Descripción</span>
                <span className={styles.detailValue}>{values.description.trim()}</span>
              </span>
            </li>
            <li className={styles.detailRow}>
              <MapPinIcon size={18} />
              <span className={styles.detailText}>
                <span className={styles.detailLabel}>Dirección</span>
                <span className={styles.detailValue}>
                  {address}, {neighborhood}
                </span>
              </span>
            </li>
            <li className={styles.detailRow}>
              <CalendarIcon size={18} />
              <span className={styles.detailText}>
                <span className={styles.detailLabel}>Fecha y hora</span>
                <span className={styles.detailValue}>
                  {formatSchedule(values.date, values.time)}
                </span>
              </span>
            </li>
            {values.photos.length > 0 && (
              <li className={styles.detailRow}>
                <ImageIcon size={18} />
                <span className={styles.detailText}>
                  <span className={styles.detailLabel}>Fotografías</span>
                  <span className={styles.detailValue}>
                    {values.photos.length === 1
                      ? '1 foto adjunta'
                      : `${values.photos.length} fotos adjuntas`}
                  </span>
                </span>
              </li>
            )}
          </ul>
        </section>
      </div>

      {values.photos.length > 0 && !imagesService.connected && (
        <p className={styles.notice}>
          Las fotos aún no se pueden enviar: el servicio de imágenes del orquestador no está
          conectado. La solicitud sí se enviará.
        </p>
      )}

      <p className={styles.info}>
        <BellIcon size={18} />
        {count === 1
          ? 'Al enviar, el trabajador seleccionado recibirá una notificación inmediata.'
          : 'Al enviar, los trabajadores seleccionados recibirán una notificación inmediata.'}
      </p>

      {error && (
        <p role="alert" className={styles.sendError}>
          {error}
        </p>
      )}
    </div>
  );
}

export default ReviewStep;