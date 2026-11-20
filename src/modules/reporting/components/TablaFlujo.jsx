import styles from './Metricas.module.css';

const ETAPAS = {
  PENDIENTE: 'Pendiente',
  ACEPTADA: 'Aceptada',
  CONFLICTO: 'Conflicto',
  CUMPLIDA: 'Cumplida',
  RECHAZADA: 'Rechazada',
  CANCELADA: 'Cancelada',
  EXPIRADA: 'Expirada',
  ELIMINADA: 'Eliminada',
};

function nombreEtapa(estado) {
  return ETAPAS[estado] ?? estado.charAt(0) + estado.slice(1).toLowerCase().replaceAll('_', ' ');
}

/** Tabla del flujo de trabajo: solicitudes del periodo por etapa, en el orden en que avanza una solicitud. */
function TablaFlujo({ estadistica }) {
  const { puntos, total } = estadistica;

  return (
    <div className={styles.tablaContenedor}>
      <table className={styles.tabla}>
        <thead>
          <tr>
            <th scope="col">Etapa</th>
            <th scope="col">Solicitudes</th>
            <th scope="col">% del total</th>
          </tr>
        </thead>
        <tbody>
          {puntos.map((punto) => {
            const porcentaje = total > 0 ? (punto.valor / total) * 100 : 0;
            return (
              <tr key={punto.etiqueta}>
                <th scope="row">{nombreEtapa(punto.etiqueta)}</th>
                <td>{punto.valor.toLocaleString('es-CO')}</td>
                <td>
                  <span className={styles.porcentaje}>
                    <span className={styles.pista} aria-hidden="true">
                      <span style={{ width: `${porcentaje}%` }} />
                    </span>
                    {porcentaje.toLocaleString('es-CO', { maximumFractionDigits: 1 })} %
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Total</th>
            <td>{total.toLocaleString('es-CO')}</td>
            <td>100 %</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default TablaFlujo;
