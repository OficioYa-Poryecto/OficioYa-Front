import { useEffect, useState } from 'react';
import { getProfilePhotoUrl } from '../../core/lib/imageService';
import { getToken } from '../../core/lib/session';

// Foto de perfil del usuario (la misma que muestra el Navbar); null si no tiene.
export function useProfilePhoto(userId) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!userId) return undefined;
    let active = true;
    getProfilePhotoUrl(userId, getToken()).then((found) => active && setUrl(found));
    return () => {
      active = false;
    };
  }, [userId]);

  return url;
}