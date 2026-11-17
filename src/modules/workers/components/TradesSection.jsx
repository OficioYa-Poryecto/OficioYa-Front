import { useState } from 'react';
import Button from '../../core/design-system/Button';
import EmptyState from './ui/EmptyState';
import Icon from './ui/Icon';
import SelectField from './ui/SelectField';
import StatusMessage from './ui/StatusMessage';
import ui from './ui/ui.module.css';
import { useTrades } from '../hooks/useCatalogs';
import { addTrade, removeTrade, setPrimaryTrade, updateTrade } from '../services/workersService';
import { validateRate } from './formats';
import RateFields from './RateFields';
import styles from './worker.module.css';

// La tarifa y la unidad se editan en la fila y se envían con "Guardar".
function TradeRow({ item, onSave, onPrimary, onRemove }) {
  const [rate, setRate] = useState(String(item.approxRate));
  const [unit, setUnit] = useState(item.rateUnit);
  const rateError = validateRate(rate);
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
function TradesSection({ profile, refresh, locked }) {
  const { data: activeTrades } = useTrades();
  const [tradeId, setTradeId] = useState('');
  const [rate, setRate] = useState('');
  const [unit, setUnit] = useState('PER_JOB');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const { primaryTrade, secondaryTrades } = profile;
  const offeredIds = [primaryTrade, ...secondaryTrades].map((item) => item.trade.id);
  const availableTrades = (activeTrades ?? []).filter((tradeItem) => !offeredIds.includes(tradeItem.id));

  // Ejecuta un cambio en el back y vuelve a consultar el perfil.
  const runAction = async (action, labelText = 'Cambios guardados correctamente.') => {
    setMessage(null);
    try {
      await action();
      await refresh();
      setMessage({ type: 'success', text: labelText });
      return true;
    } catch (e) {
      setMessage({ type: 'error', text: e.message });
      return false;
    }
  };

  const add = async (event) => {
    event.preventDefault();
    const foundErrors = {};
    if (!tradeId) foundErrors.tradeId = 'Selecciona un oficio';
    const rateValue = validateRate(rate);
    if (rateValue) foundErrors.rate = rateValue;
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length) return;
    const ok = await runAction(
      () => addTrade(profile.id, { tradeId, approxRate: Number(rate), rateUnit: unit }),
      'Oficio agregado correctamente.',
    );
    if (ok) {
      setTradeId('');
      setRate('');
    }
  };

  const saveTrade = (workerTradeId, changes) => runAction(() => updateTrade(profile.id, workerTradeId, changes));

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
            onPrimary={() => runAction(() => setPrimaryTrade(profile.id, item.id))}
            onRemove={() => runAction(() => removeTrade(profile.id, item.id), 'Oficio quitado.')}
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
            error={errors.tradeId}
            label="Oficio"
            onChange={(value) => { setTradeId(value); setErrors((e) => ({ ...e, tradeId: '' })); }}
            options={availableTrades.map((tradeItem) => ({ value: String(tradeItem.id), label: tradeItem.name }))}
            placeholder={availableTrades.length ? 'Selecciona un oficio' : 'Ya ofreces todos los oficios'}
            required
            value={tradeId}
          />
          <RateFields
            onRateChange={(value) => { setRate(value); setErrors((e) => ({ ...e, rate: '' })); }}
            onUnitChange={setUnit}
            rate={rate}
            rateError={errors.rate}
            unit={unit}
          />
          <Button disabled={!availableTrades.length} type="submit"><Icon name="plus" size={18} /> Agregar</Button>
        </div>
      </form>
    </div>
  );
}

export default TradesSection;
