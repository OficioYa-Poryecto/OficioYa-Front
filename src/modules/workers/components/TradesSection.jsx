import { useState } from 'react';
import Button from '../../core/design-system/Button';
import EmptyState from './ui/EmptyState';
import Icon from './ui/Icon';
import SelectField from './ui/SelectField';
import StatusMessage from './ui/StatusMessage';
import ui from './ui/ui.module.css';
import { useTrades } from '../hooks/useCatalogs';
import { addTrade, removeTrade, setPrimaryTrade, updateTrade } from '../services/workersService';
import { validarTarifa } from './formats';
import RateFields from './RateFields';
import styles from './worker.module.css';

// La tarifa y la unidad se editan en la fila y se envían con "Guardar".
function TradeRow({ item, onSave, onPrimary, onRemove }) {
  const [rate, setRate] = useState(String(item.approxRate));
  const [unit, setUnit] = useState(item.rateUnit);
  const rateError = validarTarifa(rate);
  const changed = Number(rate) !== Number(item.approxRate) || unit !== item.rateUnit;

  return (
    <div className={styles.tradeRow}>
      <div className={styles.tradeName}>
        <span><Icon name="briefcase" /></span>
        <div>
          <strong>{item.trade.name}</strong>
          {item.trade.category && <small>{item.trade.category.name}</small>}
        </div>
      </div>
      <RateFields onRateChange={setRate} onUnitChange={setUnit} rate={rate} rateError={rateError} unit={unit} />
      <div className={styles.rowActions}>
        {changed && !rateError && (
          <Button type="button" onClick={() => onSave(item.id, { approxRate: Number(rate), rateUnit: unit })}>Guardar</Button>
        )}
        {onPrimary && <Button type="button" onClick={onPrimary} variant="outline">Hacer principal</Button>}
        {onRemove && <Button type="button" onClick={onRemove} variant="ghost"><Icon name="trash" size={18} /> Quitar</Button>}
      </div>
    </div>
  );
}

// Manejo de oficios dentro de "Mi perfil": principal, secundarios y alta de uno nuevo (RF-03 y RF-04).
function TradesSection({ perfil, refresh, locked }) {
  const { data: oficiosActivos } = useTrades();
  const [tradeId, setTradeId] = useState('');
  const [rate, setRate] = useState('');
  const [unit, setUnit] = useState('PER_JOB');
  const [errores, setErrores] = useState({});
  const [message, setMessage] = useState(null);

  const { primaryTrade, secondaryTrades } = perfil;
  const ofrecidos = [primaryTrade, ...secondaryTrades].map((item) => item.trade.id);
  const disponibles = (oficiosActivos ?? []).filter((oficio) => !ofrecidos.includes(oficio.id));

  // Ejecuta un cambio en el back y vuelve a consultar el perfil.
  const ejecutar = async (accion, texto = 'Cambios guardados correctamente.') => {
    setMessage(null);
    try {
      await accion();
      await refresh();
      setMessage({ type: 'success', text: texto });
      return true;
    } catch (e) {
      setMessage({ type: 'error', text: e.message });
      return false;
    }
  };

  const add = async (event) => {
    event.preventDefault();
    const encontrados = {};
    if (!tradeId) encontrados.tradeId = 'Selecciona un oficio';
    const tarifa = validarTarifa(rate);
    if (tarifa) encontrados.rate = tarifa;
    setErrores(encontrados);
    if (Object.keys(encontrados).length) return;
    const ok = await ejecutar(
      () => addTrade(perfil.id, { tradeId, approxRate: Number(rate), rateUnit: unit }),
      'Oficio agregado correctamente.',
    );
    if (ok) {
      setTradeId('');
      setRate('');
    }
  };

  const saveTrade = (workerTradeId, cambios) => ejecutar(() => updateTrade(perfil.id, workerTradeId, cambios));

  return (
    <div className={`${styles.stack} ${locked ? styles.locked : ''}`} inert={locked}>
      {message && <StatusMessage variant={message.type}>{message.text}</StatusMessage>}
      <section className={ui.infoCard}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Oficio principal</h2>
            <p>Es el primero que verán los contratantes.</p>
          </div>
          <span className={styles.primaryTag}>Principal</span>
        </div>
        <TradeRow
          item={primaryTrade}
          key={`${primaryTrade.id}-${primaryTrade.approxRate}-${primaryTrade.rateUnit}`}
          onSave={saveTrade}
        />
      </section>
      <section className={ui.infoCard}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Oficios secundarios</h2>
            <p>Puedes cambiar la tarifa o convertir uno en principal.</p>
          </div>
        </div>
        {secondaryTrades.length === 0 ? (
          <EmptyState title="Sin oficios secundarios" text="Agrega otro oficio para ampliar tu oferta." />
        ) : secondaryTrades.map((item) => (
          <TradeRow
            item={item}
            key={`${item.id}-${item.approxRate}-${item.rateUnit}`}
            onPrimary={() => ejecutar(() => setPrimaryTrade(perfil.id, item.id))}
            onRemove={() => ejecutar(() => removeTrade(perfil.id, item.id), 'Oficio quitado.')}
            onSave={saveTrade}
          />
        ))}
      </section>
      <form className={ui.infoCard} noValidate onSubmit={add}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Agregar oficio secundario</h2>
            <p>Solo aparecen oficios activos del catálogo que aún no ofreces.</p>
          </div>
        </div>
        <div className={styles.inlineForm}>
          <SelectField
            error={errores.tradeId}
            label="Oficio"
            onChange={(value) => { setTradeId(value); setErrores((e) => ({ ...e, tradeId: '' })); }}
            options={disponibles.map((oficio) => ({ value: String(oficio.id), label: oficio.name }))}
            placeholder={disponibles.length ? 'Selecciona un oficio' : 'Ya ofreces todos los oficios'}
            required
            value={tradeId}
          />
          <RateFields
            onRateChange={(value) => { setRate(value); setErrores((e) => ({ ...e, rate: '' })); }}
            onUnitChange={setUnit}
            rate={rate}
            rateError={errores.rate}
            unit={unit}
          />
          <Button disabled={!disponibles.length} type="submit"><Icon name="plus" size={18} /> Agregar</Button>
        </div>
      </form>
    </div>
  );
}

export default TradesSection;
