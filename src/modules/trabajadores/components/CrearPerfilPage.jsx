import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Boton from '../../core/design-system/Boton';
import Field from '../../core/design-system/Field';
import Icon from '../../core/design-system/Icon';
import SelectField from '../../core/design-system/SelectField';
import StatusMessage from '../../core/design-system/StatusMessage';
import Toggle from '../../core/design-system/Toggle';
import ui from '../../core/design-system/ui.module.css';
import { useTrades, useZones } from '../hooks/useCatalogos';
import { useMyWorker } from '../hooks/useMyWorker';
import { createWorker } from '../services/trabajadoresService';
import { UNIDADES } from './formatos';
import PageHeading from './PageHeading';
import styles from './trabajador.module.css';

function CrearPerfilPage() {
  const navigate = useNavigate();
  const { data: perfil, refresh } = useMyWorker();
  const { data: oficiosActivos } = useTrades();
  const { data: zonas } = useZones();
  const [tradeId, setTradeId] = useState('');
  const [rate, setRate] = useState('80000');
  const [unit, setUnit] = useState('PER_JOB');
  const [zoneIds, setZoneIds] = useState([]);
  const [availableNow, setAvailableNow] = useState(true);
  const [submitError, setSubmitError] = useState('');
  const [rateError, setRateError] = useState('');
  const [saving, setSaving] = useState(false);

  // Mientras no se elija otro, el oficio es el primero del catálogo.
  const selectedTradeId = tradeId || String(oficiosActivos?.[0]?.id ?? '');

  const toggleZone = (id) => {
    setZoneIds(zoneIds.includes(id) ? zoneIds.filter((zoneId) => zoneId !== id) : [...zoneIds, id]);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (perfil) {
      setSubmitError('Ya tienes un perfil de trabajador.');
      return;
    }
    if (!(Number(rate) > 0)) {
      setRateError('La tarifa debe ser mayor que 0');
      return;
    }
    setSaving(true);
    try {
      await createWorker({
        availableNow,
        zoneIds,
        primaryTrade: { tradeId: Number(selectedTradeId), approxRate: Number(rate), rateUnit: unit },
      });
      await refresh();
      navigate('/trabajador/panel');
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSaving(false);
    }
  };

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
        <div className={ui.formGrid}>
          <SelectField
            label="Oficio principal"
            onChange={setTradeId}
            options={(oficiosActivos ?? []).map((oficio) => ({ value: String(oficio.id), label: oficio.name }))}
            value={selectedTradeId}
          />
          <Field
            error={rateError}
            label="Tarifa aproximada en COP"
            min={1}
            onChange={(value) => { setRate(value); setRateError(''); }}
            type="number"
            value={rate}
          />
          <SelectField label="Unidad" onChange={setUnit} options={UNIDADES} value={unit} />
          {zonas && (
            <div className={`${ui.field} ${styles.span2}`}>
              <span className={ui.fieldLabel}>Zonas de cobertura <i className={styles.optional}>Opcional</i></span>
              <div className={styles.zonePicker}>
                {zonas.map((zona) => {
                  const selected = zoneIds.includes(zona.id);
                  return (
                    <button
                      aria-pressed={selected}
                      className={selected ? styles.zoneSelected : ''}
                      key={zona.id}
                      onClick={() => toggleZone(zona.id)}
                      type="button"
                    >
                      {selected && <Icon name="check" size={13} />}
                      {zona.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className={styles.formFooter}>
          <Toggle checked={availableNow} label="Disponible ahora" onChange={() => setAvailableNow(!availableNow)} />
          <Boton disabled={saving || !selectedTradeId} type="submit">{saving ? 'Creando…' : 'Crear perfil'}</Boton>
        </div>
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
