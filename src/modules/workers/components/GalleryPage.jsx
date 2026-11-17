import { useState } from 'react';
import Button from '../../core/design-system/Button';
import ConfirmModal from './ui/ConfirmModal';
import EmptyState from './ui/EmptyState';
import Icon from './ui/Icon';
import StatusMessage from './ui/StatusMessage';
import ui from './ui/ui.module.css';
import { IMAGE_FORMATS, validateImageFile } from '../services/imagesClient';
import { useMyWorker } from '../hooks/useMyWorker';
import { deleteGalleryPhoto, uploadGalleryPhoto } from '../services/workersService';
import ProfileStatus from './ProfileStatus';
import { formatDate } from './formats';
import PageHeading from './PageHeading';
import styles from './worker.module.css';

const MAX_DESCRIPTION = 200;

function GalleryPage() {
  const { data: profile, loading, error: loadError, refresh } = useMyWorker();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [inputKey, setInputKey] = useState(0);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  if (!profile) return <ProfileStatus error={loadError} loading={loading} />;

  const locked = profile.status === 'PAUSED';

  const pickFile = (event) => {
    const chosen = event.target.files?.[0] ?? null;
    if (preview) URL.revokeObjectURL(preview);
    setFile(chosen);
    setPreview(chosen ? URL.createObjectURL(chosen) : '');
    setError(chosen ? validateImageFile(chosen) : '');
    setSuccess(false);
  };

  const add = async (event) => {
    event.preventDefault();
    setSuccess(false);
    const invalidReason = validateImageFile(file);
    if (invalidReason) {
      setError(invalidReason);
      return;
    }
    setSaving(true);
    try {
      await uploadGalleryPhoto(profile.id, file, description);
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
      await deleteGalleryPhoto(profile.id, profile.photos.find((photo) => photo.id === deleting));
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
          {profile.photos.length === 0 ? (
            <div className={`${ui.infoCard} ${styles.galleryEmpty}`}>
              <EmptyState title="Galería vacía" text="Agrega una foto para mostrar tu trabajo." />
            </div>
          ) : profile.photos.map((photo) => (
            <article className={`${ui.infoCard} ${styles.photoCard}`} key={photo.id}>
              <img alt={photo.description || 'Trabajo realizado'} src={photo.url} />
              <div>
                <span>{formatDate(photo.uploadedAt.slice(0, 10))}</span>
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
                  accept={IMAGE_FORMATS.join(',')}
                  aria-invalid={error ? true : undefined}
                  key={inputKey}
                  onChange={pickFile}
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
                maxLength={MAX_DESCRIPTION}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe brevemente este trabajo"
                value={description}
              />
              <span className={styles.fieldMeta}>
                <span>Opcional</span>
                <span>{description.length}/{MAX_DESCRIPTION}</span>
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
