import { useState } from 'react';
import Boton from '../../core/design-system/Boton';
import EmptyState from '../../core/design-system/EmptyState';
import Field from '../../core/design-system/Field';
import Icon from '../../core/design-system/Icon';
import SelectField from '../../core/design-system/SelectField';
import StatusMessage from '../../core/design-system/StatusMessage';
import ui from '../../core/design-system/ui.module.css';
import { useMiPerfil } from '../hooks/useMiPerfil';
import { useTrabajadores } from '../hooks/useTrabajadores';
import { UNIDADES } from './formatos';
import PageHeading from './PageHeading';
import PerfilRequerido from './PerfilRequerido';
import styles from './trabajador.module.css';

// La tarifa solo se guarda cuando es válida; mientras tanto se muestra el error en la fila.
function TradeRow({ item, onChange, onPrimary, onRemove }) {
  const [rate, setRate] = useState(String(item.approxRate));
  const invalid = !(Number(rate) > 0);

  const changeRate = (value) => {
    setRate(value);
    if (Number(value) > 0) onChange(item.id, { approxRate: Number(value) });
  };

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
        onChange={changeRate}
        type="number"
        value={rate}
      />
      <SelectField
        label="Unidad"
        onChange={(value) => onChange(item.id, { rateUnit: value })}
        options={UNIDADES}
        value={item.rateUnit}
      />
      <div className={styles.rowActions}>
        {onPrimary && <Boton onClick={onPrimary} variant="outline">Hacer principal</Boton>}
        {onRemove && <Boton icon="trash" onClick={onRemove} variant="ghost">Quitar</Boton>}
      </div>
    </div>
  );
}

function MisOficiosPage() {
  const { perfil, guardarPerfil } = useMiPerfil();
  const { oficiosActivos } = useTrabajadores();
  const [tradeId, setTradeId] = useState(String(oficiosActivos[0]?.id ?? ''));
  const [rate, setRate] = useState('60000');
  const [unit, setUnit] = useState('PER_JOB');
  const [message, setMessage] = useState(null);
  const [rateError, setRateError] = useState('');
  if (!perfil) return <PerfilRequerido />;

  const locked = perfil.status === 'PAUSED';
  const { primaryTrade, secondaryTrades } = perfil;

  const add = (event) => {
    event.preventDefault();
    const trade = oficiosActivos.find((oficio) => oficio.id === Number(tradeId));
    if ([primaryTrade, ...secondaryTrades].some((item) => item.trade.id === trade.id)) {
      setMessage('conflict');
      return;
    }
    if (!(Number(rate) > 0)) {
      setRateError('La tarifa debe ser mayor que 0');
      return;
    }
    guardarPerfil({
      ...perfil,
      secondaryTrades: [...secondaryTrades, { id: Date.now(), trade, approxRate: Number(rate), rateUnit: unit }],
    });
    setMessage('success');
  };

  const updateTrade = (id, cambios) => {
    guardarPerfil(primaryTrade.id === id
      ? { ...perfil, primaryTrade: { ...primaryTrade, ...cambios } }
      : { ...perfil, secondaryTrades: secondaryTrades.map((item) => (item.id === id ? { ...item, ...cambios } : item)) });
  };

  const makePrimary = (item) => {
    guardarPerfil({
      ...perfil,
      primaryTrade: item,
      secondaryTrades: [primaryTrade, ...secondaryTrades.filter((trade) => trade.id !== item.id)],
    });
    setMessage('success');
  };

  const remove = (item) => {
    guardarPerfil({ ...perfil, secondaryTrades: secondaryTrades.filter((trade) => trade.id !== item.id) });
  };

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
          <TradeRow item={primaryTrade} key={primaryTrade.id} onChange={updateTrade} />
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
              key={item.id}
              onChange={updateTrade}
              onPrimary={() => makePrimary(item)}
              onRemove={() => remove(item)}
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
              options={oficiosActivos.map((oficio) => ({ value: String(oficio.id), label: oficio.name }))}
              value={tradeId}
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
          {message === 'success' && <StatusMessage>Cambios guardados correctamente.</StatusMessage>}
          {message === 'conflict' && (
            <StatusMessage variant="error"><strong>Conflicto:</strong> Ya ofreces este oficio.</StatusMessage>
          )}
        </form>
      </div>
    </div>
  );
}

export default MisOficiosPage;
