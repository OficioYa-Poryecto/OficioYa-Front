import { useState } from 'react';
import Button from '../../core/design-system/Button';
import ErrorMessage from '../../core/components/ErrorMessage';
import { leerSesion } from '../sesion';
import { useResumen } from '../hooks/useResumen';
import * as reportingService from '../services/reportingService';
import GraficoBarras from './GraficoBarras';
import Ranking from './Ranking';
import TablaFlujo from './TablaFlujo';
import TarjetaIndicador, { TarjetaCuentas } from './TarjetaIndicador';
import styles from './AdminReportesPage.module.css';

const INDICADORES = ['SERVICIOS_CUMPLIDOS', 'TRABAJADORES_PAUSADOS', 'RESENAS_REPORTADAS'];
const METRICAS = ['PROMEDIO_USUARIOS_ACTIVOS', 'CATEGORIA_MAS_APETECIDA', 'TARIFA_PROMEDIO'];
const pesos = (valor) => `$${Math.round(valor).toLocaleString('es-CO')}`;

function Tarjetas({ tipos, indicadores, children }) {
  return (
    <div className={styles.indicadores}>
      {children}
      {tipos.map((tipo) => {
        const indicador = indicadores.find((item) => item.tipo === tipo);
        return indicador && <TarjetaIndicador key={tipo} indicador={indicador} />;
      })}
    </div>
  );
}

function Panel({ estadistica, eyebrow, vacio, children }) {
  return (
    <div className={`card ${styles.grafico}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{estadistica?.nombre}</h2>
      {estadistica?.puntos.length ? children : <p>{vacio}</p>}
    </div>
  );
}

function descargar(archivo, nombre) {
  const url = URL.createObjectURL(archivo);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombre;
  enlace.click();
  URL.revokeObjectURL(url);
}

function AdminReportesPage() {
  const { token } = leerSesion();
  const { cargando, error, reporte, cambiarRango, reintentar } = useResumen(token);
  const [exportando, setExportando] = useState(false);
  const [errorExportar, setErrorExportar] = useState(null);

  async function exportar() {
    setExportando(true);
    setErrorExportar(null);
    try {
      const { desde, hasta } = reporte;
      const archivo = await reportingService.exportarCsv({ desde, hasta }, token);
      descargar(archivo, `reporte-general-${desde}-a-${hasta}.csv`);
    } catch (e) {
      setErrorExportar(e.message);
    } finally {
      setExportando(false);
    }
  }

  if (error) {
    return (
      <div className={styles.estado}>
        <ErrorMessage error={error} />
        <Button variant="secondary" onClick={reintentar}>
          Reintentar
        </Button>
      </div>
    );
  }
  if (!reporte) {
    return <p className={styles.estado}>Cargando resumen…</p>;
  }

  const estadistica = (tipo) => reporte.estadisticas.find((e) => e.tipo === tipo);
  const porDia = estadistica('SERVICIOS_CUMPLIDOS_POR_DIA');
  const flujo = estadistica('SOLICITUDES_POR_ESTADO');
  const zonas = estadistica('SOLICITUDES_POR_ZONA');
  const franjas = estadistica('SOLICITUDES_POR_FRANJA');
  const categorias = estadistica('SOLICITUDES_POR_OFICIO');
  const tarifas = estadistica('TARIFA_PROMEDIO_POR_OFICIO');
  const indicador = (tipo) => reporte.indicadores.find((item) => item.tipo === tipo);
  const activas = indicador('CUENTAS_ACTIVAS');
  const inactivas = indicador('CUENTAS_INACTIVAS');

  return (
    <section className={styles.pagina}>
      <div className={styles.encabezado}>
        <div>
          <span className="eyebrow">Administración</span>
          <h1>Resumen de la plataforma</h1>
          <p>Supervisa los servicios, el equipo y la calidad de la experiencia.</p>
        </div>
        <Button disabled={exportando} onClick={exportar}>
          Exportar reporte (.CSV)
        </Button>
      </div>
      <ErrorMessage error={errorExportar} />

      <div className={styles.periodo}>
        <label>
          Desde
          <input
            id="periodo-desde"
            max={reporte.hasta}
            onChange={(e) => e.target.value && cambiarRango({ desde: e.target.value, hasta: reporte.hasta })}
            type="date"
            value={reporte.desde}
          />
        </label>
        <label>
          Hasta
          <input
            id="periodo-hasta"
            min={reporte.desde}
            onChange={(e) => e.target.value && cambiarRango({ desde: reporte.desde, hasta: e.target.value })}
            type="date"
            value={reporte.hasta}
          />
        </label>
        <p>
          Comparado con {reporte.desdeComparacion} a {reporte.hastaComparacion}
          {cargando && ' · Actualizando…'}
        </p>
      </div>

      {reporte.fuentesSinDatos?.length > 0 && (
        <p role="status" className={styles.aviso}>
          Por ahora no hay datos de {reporte.fuentesSinDatos.join(', ')}: las cifras que dependen de{' '}
          {reporte.fuentesSinDatos.length === 1 ? 'ese servicio' : 'esos servicios'} aparecen en 0.
        </p>
      )}

      <Tarjetas tipos={INDICADORES} indicadores={reporte.indicadores} />

      <div className={`card ${styles.grafico}`}>
        <span className="eyebrow">Desempeño de la plataforma</span>
        <h2>Servicios cumplidos por día</h2>
        {porDia?.puntos.length ? (
          <GraficoBarras puntos={porDia.puntos} />
        ) : (
          <p>No hay servicios en este periodo.</p>
        )}
      </div>

      <div className={styles.seccion}>
        <span className="eyebrow">Usuarios y demanda</span>
        <h2>Cuentas, uso y demanda del periodo</h2>
      </div>
      <Tarjetas tipos={METRICAS} indicadores={reporte.indicadores}>
        {activas && inactivas && <TarjetaCuentas activas={activas} inactivas={inactivas} />}
      </Tarjetas>

      <div className={styles.dos}>
        <Panel estadistica={flujo} eyebrow="Solicitudes por etapa" vacio="No hay solicitudes en este periodo.">
          <TablaFlujo estadistica={flujo} />
        </Panel>
        <Panel estadistica={zonas} eyebrow="Solicitudes por zona" vacio="No hay solicitudes en este periodo.">
          <Ranking puntos={zonas?.puntos ?? []} />
        </Panel>
        <Panel estadistica={franjas} eyebrow="Solicitudes por franja horaria" vacio="No hay solicitudes en este periodo.">
          <Ranking puntos={franjas?.puntos ?? []} />
        </Panel>
        <Panel estadistica={categorias} eyebrow="Solicitudes por oficio" vacio="No hay solicitudes en este periodo.">
          <Ranking puntos={categorias?.puntos ?? []} />
        </Panel>
        <Panel estadistica={tarifas} eyebrow="Tarifas" vacio="No hay tarifas en este periodo.">
          <Ranking puntos={tarifas?.puntos ?? []} formato={pesos} />
        </Panel>
      </div>
    </section>
  );
}

export default AdminReportesPage;
