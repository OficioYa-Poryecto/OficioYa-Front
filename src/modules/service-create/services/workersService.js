import { request } from '../../core/lib/httpClient';
import { tokenStorage } from '../../service/services/tokenStorage';

const NAME_PENDING = 'Trabajador';

const RATE_UNITS = {
  PER_HOUR: 'por hora',
  PER_JOB: 'por trabajo',
  PER_DAY: 'por día',
};

function formatRate(primaryTrade) {
  const rate = primaryTrade?.approxRate;
  if (rate == null) return '';
  const amount = `$${Number(rate).toLocaleString('es-CO')}`;
  const unit = RATE_UNITS[primaryTrade.rateUnit];
  return unit ? `Aprox. ${amount} ${unit}` : `Aprox. ${amount}`;
}

function toWorker(raw, index) {
  const trade = raw.primaryTrade?.trade?.name;
  return {
    id: raw.userId,
    name: `${NAME_PENDING} ${index + 1}`,
    trade: trade || 'Oficio sin especificar',
    rate: formatRate(raw.primaryTrade),
    availability: raw.availableNow ? 'Disponible ahora' : '',
  };
}

export const workersService = {
  isMock: false,
  notice:
    'El servicio de trabajadores aún no entrega nombre, calificación ni distancia. Los nombres son provisionales.',

  // GET /workers del servicio de Workers. Aún no filtra por barrio, fecha ni hora:
  // ese servicio solo filtra por tradeId, zoneId, maxRate y availableNow.
  search: async () => {
    const token = tokenStorage.get();
    const workers = await request('/workers', token ? { token } : undefined);
    return (workers ?? []).filter((w) => w.userId).map(toWorker);
  },
};