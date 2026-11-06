import { useState } from 'react';
import Boton from '../../core/design-system/Boton';
import ConfirmModal from '../../core/design-system/ConfirmModal';
import EmptyState from '../../core/design-system/EmptyState';
import Field from '../../core/design-system/Field';
import StatusMessage from '../../core/design-system/StatusMessage';
import ui from '../../core/design-system/ui.module.css';
import { useMiPerfil } from '../hooks/useMiPerfil';
import { formatoFecha } from './formatos';
import PageHeading from './PageHeading';
import PerfilRequerido from './PerfilRequerido';
import styles from './trabajador.module.css';

const MAX_DESCRIPCION = 200;
// Misma validación que WorkPhotoRequest en el backend.
const URL_VALIDA = /^https?:\/\/\S+$/;

function GaleriaPage() {
  const { perfil, guardarPerfil } = useMiPerfil();
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [deleting, setDeleting] = useState(null);
  if (!perfil) return <PerfilRequerido />;

  const locked = perfil.status === 'PAUSED';

  const add = (event) => {
    event.preventDefault();
    setSuccess(false);
    if (!URL_VALIDA.test(url.trim())) {
      setError('La URL debe empezar por http o https y no tener espacios');
      return;
    }
    guardarPerfil({
      ...perfil,
      photos: [...perfil.photos, { id: Date.now(), url: url.trim(), description, uploadedAt: new Date().toISOString() }],
    });
    setUrl('');
    setDescription('');
    setError('');
    setSuccess(true);
  };

  const confirmDelete = () => {
    guardarPerfil({ ...perfil, photos: perfil.photos.filter((photo) => photo.id !== deleting) });
    setDeleting(null);
  };

  return (
    <div>
      <PageHeading
        eyebrow="Tu trabajo"
        title="Galería de trabajos"
        description="Muestra resultados reales con una URL y una descripción breve."
      />
      {locked && (
        <StatusMessage className={styles.notice} variant="warning">
          Reactiva tu perfil desde el panel para editar tu galería.
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
                <Boton icon="trash" onClick={() => setDeleting(photo.id)} variant="ghost">Eliminar</Boton>
              </div>
            </article>
          ))}
        </section>
        <form className={`${ui.infoCard} ${styles.galleryForm}`} onSubmit={add}>
          <div className={styles.galleryIntro}>
            <h2>Agregar foto</h2>
            <p>Usa una URL pública de la imagen.</p>
          </div>
          <div className={styles.galleryFields}>
            <Field
              error={error}
              label="URL de la foto"
              onChange={(value) => { setUrl(value); setError(''); }}
              placeholder="https://..."
              value={url}
            />
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
            <Boton type="submit">Agregar foto</Boton>
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

export default GaleriaPage;
