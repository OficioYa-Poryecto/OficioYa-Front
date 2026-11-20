import { useRef, useState } from 'react';
import { PHOTO_RULES } from '../config';
import { checkPhotoFile, photoId, readAsDataUrl } from '../photos';
import { CheckIcon, ImageIcon, XIcon } from './icons';
import styles from './PhotoPicker.module.css';

const ACCEPT = PHOTO_RULES.accepted.join(',');
const MAX_MB = PHOTO_RULES.maxBytes / 1024 / 1024;

function PhotoPicker({ photos, onChange }) {
  const [message, setMessage] = useState('');
  const [reading, setReading] = useState(false);
  const galleryInput = useRef(null);
  const full = photos.length >= PHOTO_RULES.maxFiles;

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) {
      return;
    }

    const problems = [];
    const accepted = [];
    for (const file of files) {
      const id = photoId(file);
      if (photos.some((p) => p.id === id) || accepted.some((a) => a.id === id)) {
        continue;
      }
      const problem = checkPhotoFile(file);
      if (problem) {
        problems.push(problem);
        continue;
      }
      if (photos.length + accepted.length >= PHOTO_RULES.maxFiles) {
        problems.push(`Solo puedes adjuntar hasta ${PHOTO_RULES.maxFiles} fotos.`);
        break;
      }
      accepted.push({ id, file });
    }

    setMessage(problems.join(' '));
    if (accepted.length === 0) {
      return;
    }

    setReading(true);
    try {
      const loaded = await Promise.all(
        accepted.map(async ({ id, file }) => ({
          id,
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: await readAsDataUrl(file),
        })),
      );
      onChange([...photos, ...loaded]);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setReading(false);
    }
  };

  const removePhoto = (id) => {
    setMessage('');
    onChange(photos.filter((p) => p.id !== id));
  };

  return (
    <div className={styles.picker} role="group" aria-labelledby="photo-label">
      <div className={styles.labelRow}>
        <span id="photo-label">Fotografía</span>
        <span className={styles.chip}>Recomendado</span>
      </div>

      {photos.length > 0 && (
        <div className={styles.grid}>
          {photos.map((photo, index) => (
            <div key={photo.id} className={styles.tile}>
              <img src={photo.dataUrl} alt={`Foto ${index + 1} del servicio`} />
              <span className={styles.badge}>
                <CheckIcon size={12} />
                Foto adjunta
              </span>
              <button
                type="button"
                className={styles.remove}
                onClick={() => removePhoto(photo.id)}
                disabled={reading}
                aria-label={`Quitar ${photo.name}`}
              >
                <XIcon size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.action}
          onClick={() => galleryInput.current?.click()}
          disabled={full || reading}
        >
          <ImageIcon size={18} />
          Galería
        </button>
      </div>

      <input ref={galleryInput} type="file" accept={ACCEPT} multiple hidden onChange={handleFiles} />

      <p className={styles.hint}>
        {reading
          ? 'Cargando fotos…'
          : `${photos.length} de ${PHOTO_RULES.maxFiles} fotos · Máximo ${MAX_MB} MB cada una (JPG, PNG o WebP).`}
      </p>
      {message && (
        <p role="alert" className={styles.error}>
          {message}
        </p>
      )}
    </div>
  );
}

export default PhotoPicker;