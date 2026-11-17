import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '../../core/design-system/Button';
import SelectField from './ui/SelectField';
import StatusMessage from './ui/StatusMessage';
import Toggle from './ui/Toggle';
import ui from './ui/ui.module.css';
import { useTrades, useZones } from '../hooks/useCatalogs';
import { useMyWorker } from '../hooks/useMyWorker';
import { createWorker } from '../services/workersService';
import { validateRate } from './formats';
import PageHeading from './PageHeading';
import RateFields from './RateFields';
import ZonePicker from './ZonePicker';
import styles from './worker.module.css';

function validar({ tradeId, rate, unit, zoneIds }) {
  const errors = {};
  if (!tradeId) errors.tradeId = 'Selecciona tu oficio principal';
  const rateInput = validateRate(rate);
  if (rateInput) errors.rate = rateInput;
  if (!unit) errors.unit = 'Selecciona la unidad';
  // RF-06: el área de cobertura necesita al menos una zona.
  if (zoneIds.length === 0) errors.zoneIds = 'Selecciona al menos un barrio';
  return errors;
}

function CreateProfilePage() {
  const navigate = useNavigate();
  const { data: profile, loading, refresh } = useMyWorker();
  const { data: activeTrades } = useTrades();
  const { data: zones } = useZones();
  const [tradeId, setTradeId] = useState('');
  const [rate, setRate] = useState('');
  const [unit, setUnit] = useState('PER_JOB');
  const [zoneIds, setZoneIds] = useState([]);
  const [availableNow, setAvailableNow] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);

  // Quien ya tiene perfil no vuelve a crearlo.
  if (!loading && profile) return <Navigate replace to="/worker/profile" />;

  const clearError = (field) => setErrors((current) => ({ ...current, [field]: '' }));

  const submit = async (event) => {
    event.preventDefault();
    const foundErrors = validar({ tradeId, rate, unit, zoneIds });
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length) return;
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

  const hasErrors = Object.values(errors).some(Boolean);

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
              error={errors.tradeId}
              label="Oficio principal"
              onChange={(value) => { setTradeId(value); clearError('tradeId'); }}
              options={(activeTrades ?? []).map((trade) => ({ value: String(trade.id), label: trade.name }))}
              placeholder="Selecciona un oficio"
              required
              value={tradeId}
            />
          </div>
          <RateFields
            onRateChange={(value) => { setRate(value); clearError('rate'); }}
            onUnitChange={(value) => { setUnit(value); clearError('unit'); }}
            rate={rate}
            rateError={errors.rate}
            unit={unit}
            unitError={errors.unit}
          />
          <div className={styles.span2}>
            <ZonePicker
              error={errors.zoneIds}
              onChange={(ids) => { setZoneIds(ids); clearError('zoneIds'); }}
              selected={zoneIds}
              zones={zones ?? []}
            />
          </div>
        </div>
        <div className={styles.formFooter}>
          <Toggle checked={availableNow} label="Disponible ahora" onChange={() => setAvailableNow(!availableNow)} />
          <Button disabled={saving} type="submit">{saving ? 'Creando…' : 'Crear perfil'}</Button>
        </div>
        {hasErrors && (
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

export default CreateProfilePage;
