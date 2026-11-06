import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Boton from '../../core/design-system/Boton';
import Field from '../../core/design-system/Field';
import Icon from '../../core/design-system/Icon';
import SelectField from '../../core/design-system/SelectField';
import StatusMessage from '../../core/design-system/StatusMessage';
import Toggle from '../../core/design-system/Toggle';
import ui from '../../core/design-system/ui.module.css';
import { useMiPerfil } from '../hooks/useMiPerfil';
import { useTrabajadores } from '../hooks/useTrabajadores';
import { UNIDADES } from './formatos';
import PageHeading from './PageHeading';
import styles from './trabajador.module.css';

function CrearPerfilPage() {
  const navigate = useNavigate();
  const { perfil, crearPerfil } = useMiPerfil();
  const { oficiosActivos, zonas } = useTrabajadores();
  const [tradeId, setTradeId] = useState(String(oficiosActivos[0]?.id ?? ''));
  const [rate, setRate] = useState('80000');
  const [unit, setUnit] = useState('PER_JOB');
  const [zoneIds, setZoneIds] = useState([]);
  const [availableNow, setAvailableNow] = useState(true);
  const [conflict, setConflict] = useState(false);
  const [rateError, setRateError] = useState('');

  const toggleZone = (id) => {
    setZoneIds(zoneIds.includes(id) ? zoneIds.filter((zoneId) => zoneId !== id) : [...zoneIds, id]);
  };

  const submit = (event) => {
    event.preventDefault();
    if (perfil) {
      setConflict(true);
      return;
    }
    if (!(Number(rate) > 0)) {
      setRateError('La tarifa debe ser mayor que 0');
      return;
    }
    crearPerfil({
      trade: oficiosActivos.find((oficio) => oficio.id === Number(tradeId)),
      approxRate: Number(rate),
      rateUnit: unit,
      zoneIds,
      availableNow,
    });
    navigate('/trabajador/panel');
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
            options={oficiosActivos.map((oficio) => ({ value: String(oficio.id), label: oficio.name }))}
            value={tradeId}
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
        </div>
        <div className={styles.formFooter}>
          <Toggle checked={availableNow} label="Disponible ahora" onChange={() => setAvailableNow(!availableNow)} />
          <Boton type="submit">Crear perfil</Boton>
        </div>
        {conflict && (
          <StatusMessage variant="error">
            <strong>Conflicto:</strong> Ya tienes un perfil de trabajador.
          </StatusMessage>
        )}
      </form>
    </div>
  );
}

export default CrearPerfilPage;
