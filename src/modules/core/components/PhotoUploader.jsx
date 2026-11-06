import Boton from '../design-system/Boton';
import ui from '../design-system/ui.module.css';

function PhotoUploader() {
  return (
    <div className={ui.photoUploader}>
      <span className={`${ui.avatar} ${ui.avatarLarge}`}>TU</span>
      <div>
        <strong>Agrega una foto clara y reciente</strong>
        <p>Para este perfil es opcional. JPG o PNG, máximo 5 MB.</p>
        <div className={ui.inlineActions}>
          <Boton icon="upload" variant="outline">Subir foto</Boton>
          <Boton variant="ghost">Usar avatar</Boton>
        </div>
      </div>
    </div>
  );
}

export default PhotoUploader;
