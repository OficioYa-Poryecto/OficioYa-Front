import { useState } from 'react';
import Button from '../../core/design-system/Button';
import ErrorMessage from '../../core/components/ErrorMessage';
import { MOTIVOS_REPORTE } from '../config';
import * as reputationService from '../services/reputationService';
import Modal from './Modal';
import styles from './Formulario.module.css';

const MINIMO_DESCRIPCION = 50;
const MAXIMO_DESCRIPCION = 500;

function ReportarModal({ resena, token, alReportar, alCerrar }) {
  const [motivo, setMotivo] = useState(MOTIVOS_REPORTE[0].valor);
  const [descripcion, setDescripcion] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const largo = descripcion.trim().length;
  const faltan = MINIMO_DESCRIPCION - largo;

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      await reputationService.reportarResena(resena.codigo, motivo, descripcion.trim(), token);
      alReportar();
    } catch (e) {
      setError(e.message);
      setEnviando(false);
    }
  }

  return (
    <Modal titulo="Reportar reseña" alCerrar={alCerrar}>
      <form className={styles.formulario} onSubmit={enviar}>
        <label>
          Motivo
          <select id="motivo-reporte" onChange={(e) => setMotivo(e.target.value)} value={motivo}>
            {MOTIVOS_REPORTE.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))}
          </select>
        </label>
        <label>
          Descripción
          <textarea
            id="descripcion-reporte"
            aria-describedby="ayuda-descripcion-reporte"
            maxLength={MAXIMO_DESCRIPCION}
            minLength={MINIMO_DESCRIPCION}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Cuéntale al administrador por qué reportas esta reseña."
            required
            rows={4}
            value={descripcion}
          />
          <small id="ayuda-descripcion-reporte" className={styles.contador}>
            {faltan > 0 ? `Faltan ${faltan} caracteres (mínimo ${MINIMO_DESCRIPCION})` : `${largo}/${MAXIMO_DESCRIPCION}`}
          </small>
        </label>
        <ErrorMessage error={error} />
        <div className={styles.acciones}>
          <Button type="button" variant="secondary" onClick={alCerrar}>
            Cancelar
          </Button>
          <Button type="submit" disabled={faltan > 0 || enviando}>
            Reportar
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ReportarModal;
