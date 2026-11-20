import { useCallback, useEffect, useState } from 'react';
import { workersService } from '../services/workersService';

const LOADING = { status: 'loading', workers: [], error: '' };

export function useWorkerSearch({ neighborhood, date, time }) {
  const [state, setState] = useState(LOADING);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    workersService
      .search({ neighborhood, date, time })
      .then((workers) => {
        if (!cancelled) {
          setState({ status: 'ready', workers, error: '' });
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setState({ status: 'error', workers: [], error: e.message });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [neighborhood, date, time, attempt]);

  const retry = useCallback(() => {
    setState(LOADING);
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, retry };
}