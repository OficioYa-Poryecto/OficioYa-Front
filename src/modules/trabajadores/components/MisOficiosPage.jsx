import { useState } from 'react';
import Boton from '../../core/design-system/Boton';
import EmptyState from '../../core/design-system/EmptyState';
import Field from '../../core/design-system/Field';
import Icon from '../../core/design-system/Icon';
import SelectField from '../../core/design-system/SelectField';
import StatusMessage from '../../core/design-system/StatusMessage';
import ui from '../../core/design-system/ui.module.css';
import { useTrades } from '../hooks/useCatalogos';
import { useMyWorker } from '../hooks/useMyWorker';
import { addTrade, removeTrade, setPrimaryTrade, updateTrade } from '../services/trabajadoresService';
import EstadoPerfil from './EstadoPerfil';
import { UNIDADES } from './formatos';
import PageHeading from './PageHeading';
import styles from './trabajador.module.css';

// La tarifa y la unidad se editan en la fila y se envían con "Guardar".
function TradeRow({ item, onSave, onPrimary, onRemove }) {
  const [rate, setRate] = useState(String(item.approxRate));
  const [unit, setUnit] = useState(item.rateUnit);
  const invalid = !(Number(rate) > 0);
  const changed = Number(rate) !== Number(item.approxRate) || unit !== item.rateUnit;

  return (
    <div className={styles.tradeRow}>
      <div className={styles.tradeName}>
        <span><Icon name="briefcase" /></span>
        <strong>{item.trade.name}</strong>
      </div>
      <Field
        error={invalid ? 'Debe ser mayor que 0' : ''}
        label="Tarifa en COP"
        min={1}
        onChange={setRate}
        type="number"
        value={rate}
      />
      <SelectField label="Unidad" onChange={setUnit} options={UNIDADES} value={unit} />
      <div className={styles.rowActions}>
        {changed && !invalid && (
          <Boton onClick={() => onSave(item.id, { approxRate: Number(rate), rateUnit: unit })}>Guardar</Boton>
        )}
        {onPrimary && <Boton onClick={onPrimary} variant="outline">Hacer principal</Boton>}
        {onRemove && <Boton icon="trash" onClick={onRemove} variant="ghost">Quitar</Boton>}
      </div>
    </div>
  );
}

function MisOficiosPage() {
  const { data: perfil, loading, error, refresh } = useMyWorker();
  const { data: oficiosActivos } = useTrades();
  const [tradeId, setTradeId] = useState('');
  const [rate, setRate] = useState('60000');
  const [unit, setUnit] = useState('PER_JOB');
  const [message, setMessage] = useState(null);
  const [rateError, setRateError] = useState('');
  if (!perfil) return <EstadoPerfil error={error} loading={loading} />;

  const locked = perfil.status === 'PAUSED';
  const { primaryTrade, secondaryTrades } = perfil;
  const selectedTradeId = tradeId || String(oficiosActivos?.[0]?.id ?? '');

  // Ejecuta un cambio en el back y vuelve a consultar el perfil.
  const ejecutar = async (accion) => {
    setMessage(null);
    try {
      await accion();
      await refresh();
      setMessage({ type: 'success', text: 'Cambios guardados correctamente.' });
    } catch (e) {
      setMessage({ type: 'error', text: e.message });
    }
  };

  const add = (event) => {
    event.preventDefault();
    if ([primaryTrade, ...secondaryTrades].some((item) => item.trade.id === Number(selectedTradeId))) {
      setMessage({ type: 'error', text: 'Ya ofreces este oficio.' });
      return;
    }
    if (!(Number(rate) > 0)) {
      setRateError('La tarifa debe ser mayor que 0');
      return;
    }
    ejecutar(() => addTrade(perfil.id, { tradeId: Number(selectedTradeId), approxRate: Number(rate), rateUnit: unit }));
  };

  const saveTrade = (workerTradeId, cambios) => ejecutar(() => updateTrade(perfil.id, workerTradeId, cambios));

  return (
    <div>
      <PageHeading
        eyebrow="Tu oferta"
        title="Mis oficios"
        description="Administra tu oficio principal y los servicios adicionales que ofreces."
      />
      {locked && (
        <StatusMessage className={styles.notice} variant="warning">
          Reactiva tu perfil desde el panel para editar tus oficios.
        </StatusMessage>
      )}
      <div className={`${styles.stack} ${locked ? styles.locked : ''}`} inert={locked}>
        <section className={ui.infoCard}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Oficio principal</h2>
              <p>Es el primero que verán los contratantes.</p>
            </div>
            <span className={styles.primaryTag}>Principal</span>
          </div>
          <TradeRow item={primaryTrade} key={`${primaryTrade.id}-${primaryTrade.approxRate}-${primaryTrade.rateUnit}`} onSave={saveTrade} />
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
              onSave={saveTrade}
              onPrimary={() => ejecutar(() => setPrimaryTrade(perfil.id, item.id))}
              onRemove={() => ejecutar(() => removeTrade(perfil.id, item.id))}
            />
          ))}
        </section>
        <form className={ui.infoCard} noValidate onSubmit={add}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Agregar oficio secundario</h2>
              <p>Solo puedes elegir oficios activos.</p>
            </div>
          </div>
          <div className={styles.inlineForm}>
            <SelectField
              label="Oficio"
              onChange={(value) => { setTradeId(value); setMessage(null); }}
              options={(oficiosActivos ?? []).map((oficio) => ({ value: String(oficio.id), label: oficio.name }))}
              value={selectedTradeId}
            />
            <Field
              error={rateError}
              label="Tarifa en COP"
              min={1}
              onChange={(value) => { setRate(value); setRateError(''); }}
              type="number"
              value={rate}
            />
            <SelectField label="Unidad" onChange={setUnit} options={UNIDADES} value={unit} />
            <Boton icon="plus" type="submit">Agregar</Boton>
          </div>
          {message && (
            <StatusMessage variant={message.type}>{message.text}</StatusMessage>
          )}
        </form>
      </div>
    </div>
  );
}

export default MisOficiosPage;
