import Icon from '../../core/design-system/Icon';
import ui from '../../core/design-system/ui.module.css';
// Maqueta con fotos de ejemplo: solo la usa la pantalla de contratante (modules/auth).
import { FOTOS_EJEMPLO } from '../services/mockWorkerApi';

function Gallery({ editable = false }) {
  const fotos = FOTOS_EJEMPLO;

  return (
    <div className={ui.gallery}>
      {fotos.map((foto, index) => (
        <figure className={ui.galleryItem} key={foto.src}>
          <img alt={foto.alt} src={foto.src} />
          {index === 0 && <figcaption>Portada</figcaption>}
          {editable && <button aria-label="Eliminar foto" type="button">×</button>}
        </figure>
      ))}
      {editable && (
        <button className={ui.galleryAdd} type="button">
          <Icon name="image" size={24} />
          <span>Agregar foto</span>
          <small>{fotos.length} de 7</small>
        </button>
      )}
    </div>
  );
}

export default Gallery;
