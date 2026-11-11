import { useState } from 'react';
import Button from '../../core/design-system/Button';
import { WORKERS_FORM_ID } from '../config';
import { useWorkerSearch } from '../hooks/useWorkerSearch';
import { deriveTitle, formatSchedule } from '../requestForm';
import { workersService } from '../services/workersService';
import { BellIcon, ImageIcon, MapPinIcon } from './icons';
import WorkerCard from './WorkerCard';
import styles from './WorkersStep.module.css';

function blockingMessage(status, total, chosen) {
  if (status === 'loading') {
    return 'Estamos buscando trabajadores. Espera un momento.';
  }
  if (status === 'error') {
    return 'No pudimos cargar los trabajadores. Reintenta la búsqueda.';
  }
  if (total === 0) {
    return 'No hay trabajadores disponibles para esta solicitud.';
  }
  if (chosen === 0) {
    return 'Selecciona al menos un trabajador para continuar.';
  }
  return '';
}

function ServiceMini({ values }) {
  const photo = values.photos[0];

  return (
    <div className={styles.mini}>
      {photo ? (
        <img src={photo.dataUrl} alt="" className={styles.thumb} />
      ) : (
        <span className={`${styles.thumb} ${styles.thumbEmpty}`}>
          <ImageIcon size={20} />
        </span>
      )}
      <div className={styles.miniText}>
        <strong>{deriveTitle(values.description)}</strong>
        <span>{formatSchedule(values.date, values.time)}</span>
        <span className={styles.miniPlace}>
          <MapPinIcon size={14} />
          {values.neighborhood.trim()}
        </span>
      </div>
    </div>
  );
}

function WorkersStep({ values, onChange, onSubmit, onEditRequest }) {
  const { status, workers, error, retry } = useWorkerSearch(values);
  const [submitted, setSubmitted] = useState(false);

  const selectedIds = new Set(values.workers.map((w) => w.id));
  const chosen = workers.filter((w) => selectedIds.has(w.id));
  const neighborhood = values.neighborhood.trim();
  const message = blockingMessage(status, workers.length, chosen.length);

  const toggle = (worker) => {
    const next = selectedIds.has(worker.id)
      ? values.workers.filter((w) => w.id !== worker.id)
      : [...values.workers, worker];
    onChange({ workers: next });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (message) {
      return;
    }
    onChange({ workers: chosen });
    onSubmit();
  };

  return (
    <form id={WORKERS_FORM_ID} className={styles.form} onSubmit={handleSubmit} noValidate>
      {workersService.isMock && (
        <p className={styles.notice}>
          Datos de prueba: la búsqueda real de trabajadores aún no está conectada.
        </p>
      )}

      <div className={styles.heading}>
        <h2>Trabajadores cerca de {neighborhood}</h2>
        <span className={styles.count}>
          {chosen.length} {chosen.length === 1 ? 'seleccionado' : 'seleccionados'}
        </span>
      </div>

      {status === 'loading' && (
        <div role="status" aria-label="Buscando trabajadores" className={styles.list}>
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
        </div>
      )}

      {status === 'error' && (
        <div className={styles.state}>
          <h3>No pudimos cargar los trabajadores</h3>
          <p>{error}</p>
          <Button type="button" variant="secondary" onClick={retry}>
            Reintentar
          </Button>
        </div>
      )}

      {status === 'ready' && workers.length === 0 && (
        <div className={styles.state}>
          <h3>No hay trabajadores disponibles en {neighborhood}</h3>
          <p>Prueba con otro barrio, otra fecha u otra hora.</p>
          <Button type="button" variant="secondary" onClick={onEditRequest}>
            Cambiar datos de la solicitud
          </Button>
        </div>
      )}

      {status === 'ready' && workers.length > 0 && (
        <ul className={styles.list}>
          {workers.map((worker) => (
            <li key={worker.id}>
              <WorkerCard
                worker={worker}
                selected={selectedIds.has(worker.id)}
                onToggle={toggle}
              />
            </li>
          ))}
        </ul>
      )}

      <ServiceMini values={values} />

      <p className={styles.info}>
        <BellIcon size={18} />
        Enviaremos la solicitud únicamente a los perfiles seleccionados.
      </p>

      {submitted && message && (
        <p role="alert" className={styles.error}>
          {message}
        </p>
      )}
    </form>
  );
}

export default WorkersStep;