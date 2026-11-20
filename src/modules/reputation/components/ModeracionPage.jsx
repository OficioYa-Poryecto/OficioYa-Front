import { useState } from 'react';
import Button from '../../core/design-system/Button';
import ErrorMessage from '../../core/components/ErrorMessage';
import { MOTIVOS_REPORTE } from '../config';
import { fecha } from '../formatos';
import { useModeracion } from '../hooks/useModeracion';
import * as reputationService from '../services/reputationService';
import { leerSesion } from '../sesion';
import Estrellas from './Estrellas';
import styles from './ModeracionPage.module.css';

const PESTANAS = [
  { valor: 'PENDIENTE', nombre: 'Pendientes' },
  { valor: 'RESUELTO', nombre: 'Resueltos' },
];

const RESULTADOS = {
  RESENA_RETIRADA: 'Reseña retirada',
  RESENA_MANTENIDA: 'Reseña mantenida',
};

function motivo(valor) {
  return MOTIVOS_REPORTE.find((opcion) => opcion.valor === valor)?.etiqueta ?? valor;
}

function TarjetaReporte({ reporte, resolviendo, alResolver }) {
  const { resena } = reporte;

  return (
    <article className={`card ${styles.reporte}`}>
      <div className={styles.cabecera}>
        <span className={styles.motivo}>{motivo(reporte.motivo)}</span>
        <small>Reportado el {fecha(reporte.fechaReporte)}</small>
      </div>

      <p className={styles.descripcion}>{reporte.descripcion}</p>

      <div className={styles.resena}>
        <span className="eyebrow">Reseña reportada</span>
        {resena ? (
          <>
            <Estrellas valor={resena.puntuacion} tamano={16} />
            <p>{resena.comentario || 'Sin comentario.'}</p>
            <small>Publicada el {fecha(resena.fechaCreacion)}</small>
          </>
        ) : (
          <p>No fue posible cargar el texto de la reseña.</p>
        )}
      </div>

      {reporte.estado === 'RESUELTO' ? (
        <p className={styles.resultado}>
          {RESULTADOS[reporte.resultado] ?? reporte.resultado}
          {reporte.fechaResolucion && ` · ${fecha(reporte.fechaResolucion)}`}
        </p>
      ) : (
        <div className={styles.acciones}>
          <Button
            variant="secondary"
            disabled={resolviendo}
            onClick={() => alResolver(reporte.id, 'RESENA_MANTENIDA')}
          >
            Mantener reseña
          </Button>
          <Button disabled={resolviendo} onClick={() => alResolver(reporte.id, 'RESENA_RETIRADA')}>
            Retirar reseña
          </Button>
        </div>
      )}
    </article>
  );
}

function ModeracionPage() {
  const { token } = leerSesion();
  const [estado, setEstado] = useState('PENDIENTE');
  const { cargando, error, reportes, recargar } = useModeracion(estado, token);
  const [resolviendo, setResolviendo] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [errorAccion, setErrorAccion] = useState(null);

  async function resolver(reporteId, resultado) {
    setResolviendo(reporteId);
    setErrorAccion(null);
    setMensaje(null);
    try {
      await reputationService.resolverReporte(reporteId, resultado, token);
      setMensaje(resultado === 'RESENA_RETIRADA' ? 'La reseña fue retirada.' : 'La reseña se mantiene publicada.');
      recargar();
    } catch (problema) {
      setErrorAccion(problema.message);
    } finally {
      setResolviendo(null);
    }
  }

  function cambiarPestana(valor) {
    setMensaje(null);
    setErrorAccion(null);
    setEstado(valor);
  }

  return (
    <section className={styles.pagina}>
      <div>
        <span className="eyebrow">Administración</span>
        <h1>Reseñas reportadas</h1>
        <p className={styles.subtitulo}>Revisa cada reporte y decide si la reseña se retira o se mantiene.</p>
      </div>

      <div className={styles.pestanas} role="tablist" aria-label="Estado de los reportes">
        {PESTANAS.map((pestana) => (
          <button
            key={pestana.valor}
            type="button"
            role="tab"
            aria-selected={estado === pestana.valor}
            className={estado === pestana.valor ? `${styles.pestana} ${styles.pestanaActiva}` : styles.pestana}
            onClick={() => cambiarPestana(pestana.valor)}
          >
            {pestana.nombre}
          </button>
        ))}
      </div>

      {mensaje && <p role="status" className={styles.mensaje}>{mensaje}</p>}
      <ErrorMessage error={errorAccion} />

      {error && (
        <div className={styles.estado}>
          <ErrorMessage error={error} />
          <Button variant="secondary" onClick={recargar}>
            Reintentar
          </Button>
        </div>
      )}
      {!error && cargando && <p className={styles.estado}>Cargando reportes…</p>}
      {!error && !cargando && reportes.length === 0 && (
        <p className={styles.estado}>
          {estado === 'PENDIENTE' ? 'No hay reportes pendientes. ¡Todo al día!' : 'Aún no hay reportes resueltos.'}
        </p>
      )}
      {!error && !cargando && reportes.length > 0 && (
        <div className={styles.lista}>
          {reportes.map((reporte) => (
            <TarjetaReporte
              key={reporte.id}
              reporte={reporte}
              resolviendo={resolviendo === reporte.id}
              alResolver={resolver}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ModeracionPage;
