import { useEffect, useState } from 'react';
import { getToken } from '../../core/lib/session';
import { listUsers, getUser, changeStatus } from '../services/adminUserService';

// Listado de usuarios para /admin/users
export function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    listUsers(getToken())
      .then((data) => setUsers(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { users, loading, error };
}

// Detalle de un usuario y cambio de estado para /admin/users/:id
export function useAdminUser(id) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    getUser(id, getToken())
      .then((data) => setUser(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  // action: 'activate' | 'deactivate'
  async function updateStatus(action, reason) {
    setActionError(null);
    try {
      const updated = await changeStatus(id, action, reason, getToken());
      setUser(updated);
      return true;
    } catch (e) {
      setActionError(e.message);
      return false;
    }
  }

  return { user, loading, error, actionError, updateStatus };
}
