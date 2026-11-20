// Las imágenes las gestiona el orquestador con ownerType y ownerId. Para solicitudes:
// ownerType = 'request' y ownerId = rootId de la solicitud creada.
// Todavía no se conoce la ruta ni el formato (multipart o base64) que expone el
// orquestador, así que no se inventan: hasta recibir el contrato, upload falla con un
// mensaje claro en vez de aparentar que guarda las fotos.
// Firma prevista: upload({ ownerType, ownerId, photos }, token).
export const imagesService = {
  connected: false,

  upload: async () => {
    throw new Error('el servicio de imágenes del orquestador aún no está conectado.');
  },
};