import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Boton from '../design-system/Boton';
import StatusMessage from '../design-system/StatusMessage';
import ui from '../design-system/ui.module.css';

function EditFormFooter({ cancelTo }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  return (
    <>
      {saved && (
        <StatusMessage>
          <strong>Cambios guardados.</strong> Tu perfil ya está actualizado.
        </StatusMessage>
      )}
      <div className={ui.formActions}>
        <Boton onClick={() => navigate(cancelTo)} variant="ghost">Cancelar</Boton>
        <div className={ui.inlineActions}>
          <Boton onClick={() => setSaved(true)}>Guardar cambios</Boton>
        </div>
      </div>
    </>
  );
}

export default EditFormFooter;
