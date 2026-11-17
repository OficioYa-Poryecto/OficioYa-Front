import { useEffect, useState } from 'react';
import { request } from '../../core/lib/httpClient';

// Datos de cuenta (nombre, correo, teléfonos) desde Users, por el orquestador.
// path null = no consultar.
export function useAccount(path) {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (!path) return undefined;
    let active = true;
    request(path)
      .then((data) => active && setAccount(data))
      .catch(() => active && setAccount(null));
    return () => {
      active = false;
    };
  }, [path]);

  return account;
}