import { useState } from 'react';
import Boton from '../../core/design-system/Boton';
import EmptyState from '../../core/design-system/EmptyState';
import Icon from '../../core/design-system/Icon';
import StatusMessage from '../../core/design-system/StatusMessage';
import ui from '../../core/design-system/ui.module.css';
import { useZones } from '../hooks/useCatalogos';
import { useMyWorker } from '../hooks/useMyWorker';
import { addZone, removeZone } from '../services/trabajadoresService';
import EstadoPerfil from './EstadoPerfil';
import PageHeading from './PageHeading';
import styles from './trabajador.module.css';

function CoberturaPage() {
  const { data: perfil, loading, error, refresh } = useMyWorker();
  const { data: zonas } = useZones();
  const [search, setSearch] = useState('');
  // Selección en edición; null = todavía sin cambios (se muestra la guardada).
  const [seleccion, setSeleccion] = useState(null);
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  if (!perfil) return <EstadoPerfil error={error} loading={loading} />;

  const locked = perfil.status === 'PAUSED';
  const zoneIds = seleccion ?? perfil.zoneIds;
  const listaZonas = zonas ?? [];
  const nombreZona = (id) => listaZonas.find((zona) => zona.id === id)?.name ?? `Zona ${id}`;
  const visibles = listaZonas.filter((zona) => zona.name.toLowerCase().includes(search.trim().toLowerCase()));

  const toggleZone = (id) => {
    setMessage(null);
    setSeleccion(zoneIds.includes(id) ? zoneIds.filter((zoneId) => zoneId !== id) : [...zoneIds, id]);
  };

  // El back agrega y quita zonas una por una.
  const guardar = async () => {
    const agregar = zoneIds.filter((id) => !perfil.zoneIds.includes(id));
    const quitar = perfil.zoneIds.filter((id) => !zoneIds.includes(id));
    setSaving(true);
    try {
      await Promise.all([
        ...agregar.map((id) => addZone(perfil.id, id)),
        ...quitar.map((id) => removeZone(perfil.id, id)),
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
        title="Área de cobertura"
        description="Selecciona los barrios a los que puedes desplazarte."
        action={<Boton disabled={locked || saving || !seleccion} onClick={guardar}>{saving ? 'Guardando…' : 'Guardar cambios'}</Boton>}
      />
      {locked && (
        <StatusMessage className={styles.notice} variant="warning">
          Reactiva tu perfil desde el panel para editar tu cobertura.
        </StatusMessage>
      )}
      {message && <StatusMessage className={styles.notice} variant={message.type}>{message.text}</StatusMessage>}
      <section
        className={`${ui.infoCard} ${styles.coverageLayout} ${locked ? styles.locked : ''}`}
        inert={locked}
      >
        <div>
          <h2 className={styles.selectedTitle}>Barrios seleccionados</h2>
          {zoneIds.length ? (
            <div className={styles.tags}>
              {zoneIds.map((id) => (
                <button aria-label={`Quitar ${nombreZona(id)}`} key={id} onClick={() => toggleZone(id)} type="button">
                  {nombreZona(id)} <b>×</b>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState title="Sin barrios" text="Agrega al menos un barrio para indicar tu cobertura." />
          )}
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
          {visibles.map((zona) => (
            <label className={styles.zoneRow} key={zona.id}>
              <span>{zona.name}</span>
              <input
                checked={zoneIds.includes(zona.id)}
                onChange={() => toggleZone(zona.id)}
                type="checkbox"
              />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CoberturaPage;
