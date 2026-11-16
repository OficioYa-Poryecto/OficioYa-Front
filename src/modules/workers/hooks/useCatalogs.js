import { listTrades, listZones } from '../services/workersService';
import { useRequest } from './useRequest';

// Oficios activos del catálogo (TradeResponse[]).
export function useTrades() {
  return useRequest(listTrades);
}

// Zonas [{ id, name }] (dominio User).
export function useZones() {
  return useRequest(listZones);
}
