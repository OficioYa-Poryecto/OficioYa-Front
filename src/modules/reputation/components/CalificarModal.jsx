import { useState } from 'react';
import Button from '../../core/design-system/Button';
import ErrorMessage from '../../core/components/ErrorMessage';
import * as reputationService from '../services/reputationService';
import Estrellas from './Estrellas';
import Modal from './Modal';
import styles from './Formulario.module.css';

const TEXTOS = ['Elige una calificación', '1 de 5 · Muy malo', '2 de 5 · Malo', '3 de 5 · Regular', '4 de 5 · Bueno', '5 de 5 · Excelente'];
const LARGO_MAXIMO = 500;

function CalificarModal({ servicio, token, alCalificar, alCerrar }) {
  const [puntuacion, setPuntuacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      await reputationService.calificar(servicio.solicitudId, puntuacion, comentario.trim(), token);
      alCalificar();
    } catch (e) {
      setError(e.status === 409 ? 'Ya calificaste este servicio.' : e.message);
      setEnviando(false);
    }
  }

  return (
    <Modal titulo="Califica el servicio" alCerrar={alCerrar}>
      <form className={styles.formulario} onSubmit={enviar}>
        <p>Cuéntanos cómo fue tu experiencia con {servicio.contraparte}.</p>
        <div className={styles.centro}>
          <Estrellas valor={puntuacion} tamano={40} alElegir={setPuntuacion} />
          <span>{TEXTOS[puntuacion]}</span>
        </div>
        <label>
          Tu comentario (opcional)
          <textarea
            id="comentario-calificacion"
            maxLength={LARGO_MAXIMO}
            onChange={(e) => setComentario(e.target.value)}
            rows={4}
            value={comentario}
          />
          <small className={styles.contador}>{comentario.length}/{LARGO_MAXIMO}</small>
        </label>
        <ErrorMessage error={error} />
        <div className={styles.acciones}>
          <Button type="button" variant="secondary" onClick={alCerrar}>
            Cancelar
          </Button>
          <Button type="submit" disabled={puntuacion === 0 || enviando}>
            Enviar calificación
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CalificarModal;
