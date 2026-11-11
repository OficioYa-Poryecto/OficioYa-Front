// El body usa los nombres del contrato actual del servicio (RequestRequest).
// images va siempre vacío: las fotos las gestiona el orquestador (ownerType y ownerId)
// y se envían aparte; el controlador del servicio falla si la lista viene nula.
export function buildCreateRequestPayload(values) {
  return {
    workersId: values.workers.map((worker) => worker.id),
    description: values.description.trim(),
    neighborhood: values.neighborhood.trim(),
    exactAddress: values.exactAddress.trim(),
    scheduledDateTime: `${values.date}T${values.time.slice(0, 5)}:00`,
    images: [],
  };
}