import { useState } from 'react';
import Button from '../../core/design-system/Button';
import EmptyState from './ui/EmptyState';
import Icon from './ui/Icon';
import StatusMessage from './ui/StatusMessage';
import ui from './ui/ui.module.css';
import { useZones } from '../hooks/useCatalogs';
import { useMyWorker } from '../hooks/useMyWorker';
import { addZone, removeZone } from '../services/workersService';
import ProfileStatus from './ProfileStatus';
import PageHeading from './PageHeading';
import styles from './worker.module.css';

function CoveragePage() {
  const { data: profile, loading, error, refresh } = useMyWorker();
  const { data: zones } = useZones();
  const [search, setSearch] = useState('');
  // Selección en edición; null = todavía sin cambios (se muestra la guardada).
  const [selection, setSeleccion] = useState(null);
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  if (!profile) return <ProfileStatus error={error} loading={loading} />;

  const locked = profile.status === 'PAUSED';
  const zoneIds = selection ?? profile.zoneIds;
  const zoneOptions = zones ?? [];
  const zoneName = (id) => zoneOptions.find((zone) => zone.id === id)?.name ?? `Zona ${id}`;
  const visibleZones = zoneOptions.filter((zone) => zone.name.toLowerCase().includes(search.trim().toLowerCase()));

  const toggleZone = (id) => {
    setMessage(null);
    setSeleccion(zoneIds.includes(id) ? zoneIds.filter((zoneId) => zoneId !== id) : [...zoneIds, id]);
  };

  const noZones = zoneIds.length === 0;

  // El back agrega y quita zonas una por una.
  const handleSave = async () => {
    // RF-06: el área de cobertura necesita al menos una zona.
    if (noZones) {
      setMessage({ type: 'error', text: 'Selecciona al menos un barrio antes de guardar.' });
      return;
    }
    const toAdd = zoneIds.filter((id) => !profile.zoneIds.includes(id));
    const toRemove = profile.zoneIds.filter((id) => !zoneIds.includes(id));
    setSaving(true);
    try {
      await Promise.all([
        ...toAdd.map((id) => addZone(profile.id, id)),
        ...toRemove.map((id) => removeZone(profile.id, id)),
      ]);
      await refresh();
      setSeleccion(null);
      setMessage({ type: 'success', text: 'Área de cobertura guardada correctamente.' });
    } catch (e) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeading
        eyebrow="Dónde trabajas"
        title="Mi área de cobertura"
        description="Elige, entre los barrios habilitados en OficioYa, a cuáles puedes desplazarte. Los contratantes te encontrarán por estas zonas."
        action={(
          <Button type="button" disabled={locked || saving || !selection || noZones} onClick={handleSave}>
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        )}
      />
      {locked && (
        <StatusMessage className={styles.notice} variant="warning">
          Tu perfil está pausado por administración: no puedes editar tu cobertura.
        </StatusMessage>
      )}
      {message && <StatusMessage className={styles.notice} variant={message.type}>{message.text}</StatusMessage>}
      <section
        className={`${ui.infoCard} ${styles.coverageLayout} ${locked ? styles.locked : ''}`}
        inert={locked}
      >
        <div>
          <h2 className={styles.selectedTitle}>
            Barrios seleccionados <span aria-hidden="true" className={ui.requiredMark}>*</span>
          </h2>
          {zoneIds.length ? (
            <div className={styles.tags}>
              {zoneIds.map((id) => (
                <button aria-label={`Quitar ${zoneName(id)}`} key={id} onClick={() => toggleZone(id)} type="button">
                  {zoneName(id)} <b>×</b>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState title="Sin barrios" text="Debes tener al menos un barrio para aparecer en las búsquedas." />
          )}
          <p className={styles.adminNote}>
            <Icon name="shield" size={15} />
            <span>
              La lista de barrios la administra el equipo de OficioYa. Si tu barrio no aparece, solicita que lo agreguen.
            </span>
          </p>
        </div>
        <div className={styles.zoneList}>
          <label className={styles.searchBox}>
            <Icon name="search" size={18} />
            <input
              aria-label="Buscar barrio"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar barrio"
              value={search}
            />
          </label>
          {visibleZones.map((zone) => (
            <label className={styles.zoneRow} key={zone.id}>
              <span>{zone.name}</span>
              <input
                checked={zoneIds.includes(zone.id)}
                onChange={() => toggleZone(zone.id)}
                type="checkbox"
              />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CoveragePage;
