import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Boton from '../../core/design-system/Boton';
import SelectField from '../../core/design-system/SelectField';
import StatusMessage from '../../core/design-system/StatusMessage';
import Toggle from '../../core/design-system/Toggle';
import ui from '../../core/design-system/ui.module.css';
import { useTrades, useZones } from '../hooks/useCatalogos';
import { useMyWorker } from '../hooks/useMyWorker';
import { createWorker } from '../services/trabajadoresService';
import { validarTarifa } from './formatos';
import PageHeading from './PageHeading';
import TarifaFields from './TarifaFields';
import ZonePicker from './ZonePicker';
import styles from './trabajador.module.css';

function validar({ tradeId, rate, unit, zoneIds }) {
  const errores = {};
  if (!tradeId) errores.tradeId = 'Selecciona tu oficio principal';
  const tarifa = validarTarifa(rate);
  if (tarifa) errores.rate = tarifa;
  if (!unit) errores.unit = 'Selecciona la unidad';
  // RF-06: el área de cobertura necesita al menos una zona.
  if (zoneIds.length === 0) errores.zoneIds = 'Selecciona al menos un barrio';
  return errores;
}

function CrearPerfilPage() {
  const navigate = useNavigate();
  const { data: perfil, loading, refresh } = useMyWorker();
  const { data: oficiosActivos } = useTrades();
  const { data: zonas } = useZones();
  const [tradeId, setTradeId] = useState('');
  const [rate, setRate] = useState('');
  const [unit, setUnit] = useState('PER_JOB');
  const [zoneIds, setZoneIds] = useState([]);
  const [availableNow, setAvailableNow] = useState(true);
  const [errores, setErrores] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);

  // Quien ya tiene perfil no vuelve a crearlo.
  if (!loading && perfil) return <Navigate replace to="/worker/profile" />;

  const limpiar = (campo) => setErrores((actual) => ({ ...actual, [campo]: '' }));

  const submit = async (event) => {
    event.preventDefault();
    const encontrados = validar({ tradeId, rate, unit, zoneIds });
    setErrores(encontrados);
    if (Object.keys(encontrados).length) return;
    setSaving(true);
    setSubmitError('');
    try {
      await createWorker({
        availableNow,
        zoneIds,
        primaryTrade: { tradeId, approxRate: Number(rate), rateUnit: unit },
      });
      await refresh();
      navigate('/worker/dashboard');
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const hayErrores = Object.values(errores).some(Boolean);

  return (
    <div>
      <PageHeading
        eyebrow="Empecemos"
        title="Crea tu perfil de trabajador"
        description="Define qué oficio ofreces y cómo quieres aparecer en OficioYa."
      />
      <form className={`${ui.formCard} ${styles.createCard}`} noValidate onSubmit={submit}>
        <div className={styles.formTitle}>
          <span>1</span>
          <div>
            <h2>Información del servicio</h2>
            <p>Estos datos serán visibles para los contratantes.</p>
          </div>
        </div>
        <p className={styles.requiredNote}><span aria-hidden="true">*</span> Campos obligatorios</p>
        <div className={ui.formGrid}>
          <div className={styles.span2}>
            <SelectField
              error={errores.tradeId}
              label="Oficio principal"
              onChange={(value) => { setTradeId(value); limpiar('tradeId'); }}
              options={(oficiosActivos ?? []).map((oficio) => ({ value: String(oficio.id), label: oficio.name }))}
              placeholder="Selecciona un oficio"
              required
              value={tradeId}
            />
          </div>
          <TarifaFields
            onRateChange={(value) => { setRate(value); limpiar('rate'); }}
            onUnitChange={(value) => { setUnit(value); limpiar('unit'); }}
            rate={rate}
            rateError={errores.rate}
            unit={unit}
            unitError={errores.unit}
          />
          <div className={styles.span2}>
            <ZonePicker
              error={errores.zoneIds}
              onChange={(ids) => { setZoneIds(ids); limpiar('zoneIds'); }}
              selected={zoneIds}
              zonas={zonas ?? []}
            />
          </div>
        </div>
        <div className={styles.formFooter}>
          <Toggle checked={availableNow} label="Disponible ahora" onChange={() => setAvailableNow(!availableNow)} />
          <Boton disabled={saving} type="submit">{saving ? 'Creando…' : 'Crear perfil'}</Boton>
        </div>
        {hayErrores && (
          <StatusMessage variant="error">Revisa los campos marcados antes de continuar.</StatusMessage>
        )}
        {submitError && (
          <StatusMessage variant="error">
            <strong>No se pudo crear el perfil:</strong> {submitError}
          </StatusMessage>
        )}
      </form>
    </div>
  );
}

export default CrearPerfilPage;
