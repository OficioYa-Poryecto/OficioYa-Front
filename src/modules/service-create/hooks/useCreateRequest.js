import { useCallback, useRef, useState } from 'react';
import { buildCreateRequestPayload } from '../requestPayload';
import { createRequestService, describeSendError } from '../services/createRequestService';
import { imagesService } from '../services/imagesService';

const IDLE = { sending: false, error: '', result: null };

async function attachPhotos(photos, rootId, token) {
  if (photos.length === 0) {
    return '';
  }
  try {
    await imagesService.upload({ ownerType: 'request', ownerId: rootId, photos }, token);
    return '';
  } catch (error) {
    return `La solicitud se envió, pero no se pudieron adjuntar las fotos: ${error.message}`;
  }
}

export function useCreateRequest(token) {
  const [state, setState] = useState(IDLE);
  const inFlight = useRef(false);

  const send = useCallback(
    async (values) => {
      if (inFlight.current) {
        return false;
      }
      inFlight.current = true;
      setState({ sending: true, error: '', result: null });
      try {
        const created = await createRequestService.create(buildCreateRequestPayload(values), token);
        const photosWarning = await attachPhotos(values.photos, created.rootId, token);
        setState({ sending: false, error: '', result: { ...created, photosWarning } });
        return true;
      } catch (error) {
        setState({ sending: false, error: describeSendError(error), result: null });
        return false;
      } finally {
        inFlight.current = false;
      }
    },
    [token],
  );

  const reset = useCallback(() => setState(IDLE), []);

  return { ...state, send, reset };
}