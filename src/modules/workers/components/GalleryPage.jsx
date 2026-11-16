import { useState } from 'react';
import Button from '../../core/design-system/Button';
import ConfirmModal from './ui/ConfirmModal';
import EmptyState from './ui/EmptyState';
import Icon from './ui/Icon';
import StatusMessage from './ui/StatusMessage';
import ui from './ui/ui.module.css';
import { FORMATOS_IMAGEN, validarArchivoImagen } from '../services/imagesClient';
import { useMyWorker } from '../hooks/useMyWorker';
import { eliminarFotoGaleria, subirFotoGaleria } from '../services/workersService';
import ProfileStatus from './ProfileStatus';
import { formatoFecha } from './formats';
import PageHeading from './PageHeading';
import styles from './worker.module.css';

const MAX_DESCRIPCION = 200;

function GalleryPage() {
  const { data: perfil, loading, error: loadError, refresh } = useMyWorker();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [inputKey, setInputKey] = useState(0);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  if (!perfil) return <ProfileStatus error={loadError} loading={loading} />;

  const locked = perfil.status === 'PAUSED';

  const elegirArchivo = (event) => {
    const elegido = event.target.files?.[0] ?? null;
    if (preview) URL.revokeObjectURL(preview);
    setFile(elegido);
    setPreview(elegido ? URL.createObjectURL(elegido) : '');
    setError(elegido ? validarArchivoImagen(elegido) : '');
    setSuccess(false);
  };

  const add = async (event) => {
    event.preventDefault();
    setSuccess(false);
    const invalido = validarArchivoImagen(file);
    if (invalido) {
      setError(invalido);
      return;
    }
    setSaving(true);
    try {
      await subirFotoGaleria(perfil.id, file, description);
      await refresh();
      if (preview) URL.revokeObjectURL(preview);
      setFile(null);
      setPreview('');
      setInputKey((key) => key + 1);
      setDescription('');
      setError('');
      setSuccess(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await eliminarFotoGaleria(perfil.id, perfil.photos.find((photo) => photo.id === deleting));
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <PageHeading
        eyebrow="Tu trabajo"
        title="Galería de trabajos"
        description="Muestra resultados reales con una foto y una descripción breve."
      />
      {locked && (
        <StatusMessage className={styles.notice} variant="warning">
          Tu perfil está pausado por administración: no puedes editar tu galería.
        </StatusMessage>
      )}
      <div className={locked ? styles.locked : ''} inert={locked}>
        <section className={styles.galleryGrid}>
          {perfil.photos.length === 0 ? (
            <div className={`${ui.infoCard} ${styles.galleryEmpty}`}>
              <EmptyState title="Galería vacía" text="Agrega una foto para mostrar tu trabajo." />
            </div>
          ) : perfil.photos.map((photo) => (
            <article className={`${ui.infoCard} ${styles.photoCard}`} key={photo.id}>
              <img alt={photo.description || 'Trabajo realizado'} src={photo.url} />
              <div>
                <span>{formatoFecha(photo.uploadedAt.slice(0, 10))}</span>
                <p>{photo.description || 'Sin descripción'}</p>
                <Button type="button" onClick={() => setDeleting(photo.id)} variant="ghost"><Icon name="trash" size={18} /> Eliminar</Button>
              </div>
            </article>
          ))}
        </section>
        <form className={`${ui.infoCard} ${styles.galleryForm}`} noValidate onSubmit={add}>
          <div className={styles.galleryIntro}>
            <h2>Agregar foto</h2>
            <p>JPG, PNG o WebP de hasta 5 MB.</p>
          </div>
          <div className={styles.galleryFields}>
            <div className={ui.field}>
              <span className={ui.fieldLabel}>Foto *</span>
              <label className={`${styles.filePicker} ${error ? styles.filePickerError : ''}`}>
                <input
                  accept={FORMATOS_IMAGEN.join(',')}
                  aria-invalid={error ? true : undefined}
                  key={inputKey}
                  onChange={elegirArchivo}
                  type="file"
                />
                <Icon name="upload" size={22} />
                <span>
                  <strong>{file ? file.name : 'Elegir una foto'}</strong>
                  <small>{file ? 'Haz clic para cambiarla' : 'JPG, PNG o WebP, hasta 5 MB'}</small>
                </span>
              </label>
              {error && <span className={ui.errorText}>{error}</span>}
            </div>
            {preview && <img alt="Vista previa de la foto" className={styles.galleryPreview} src={preview} />}
            <label className={ui.field}>
              <span className={ui.fieldLabel}>Descripción</span>
              <textarea
                className={ui.textarea}
                maxLength={MAX_DESCRIPCION}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe brevemente este trabajo"
                value={description}
              />
              <span className={styles.fieldMeta}>
                <span>Opcional</span>
                <span>{description.length}/{MAX_DESCRIPCION}</span>
              </span>
            </label>
            <Button disabled={saving} type="submit"><Icon name="upload" size={18} /> {saving ? 'Subiendo…' : 'Agregar foto'}</Button>
            {success && <StatusMessage>Foto agregada correctamente.</StatusMessage>}
          </div>
        </form>
      </div>
      {deleting && (
        <ConfirmModal
          onCancel={() => setDeleting(null)}
          onConfirm={confirmDelete}
          text="La foto dejará de aparecer en tu perfil."
          title="¿Eliminar esta foto?"
        />
      )}
    </div>
  );
}

export default GalleryPage;
