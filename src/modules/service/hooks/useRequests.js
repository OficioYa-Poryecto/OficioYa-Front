import { useCallback, useEffect, useState } from 'react';
import { requestsService } from '../services/requestsService';

// Carga las solicitudes del usuario y expone las acciones sobre ellas.
// action: 'accept' | 'reject' | 'complete' | 'acceptConflict' | 'cancel' | 'remove'
export function useRequests(token) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!token) {
      return undefined;
    }
    let cancelled = false;
    requestsService
      .listMine(token)
      .then((data) => {
        if (!cancelled) {
          setRequests(data);
          setError('');
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  const act = useCallback(
    async (action, id) => {
      setError('');
      try {
        await requestsService[action](id, token);
        reload();
      } catch (e) {
        setError(e.message);
      }
    },
    [token, reload],
  );

  return { requests, loading, error, reload, act };
}