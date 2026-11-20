export function decimal(valor) {
  if (valor == null || Number.isNaN(Number(valor))) {
    return '—';
  }
  return Number(valor).toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function fecha(valor) {
  return new Date(valor).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}
