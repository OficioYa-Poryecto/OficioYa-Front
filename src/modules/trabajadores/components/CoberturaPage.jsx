import { useState } from 'react';
import Boton from '../../core/design-system/Boton';
import EmptyState from '../../core/design-system/EmptyState';
import Icon from '../../core/design-system/Icon';
import StatusMessage from '../../core/design-system/StatusMessage';
import ui from '../../core/design-system/ui.module.css';
import { useMiPerfil } from '../hooks/useMiPerfil';
import { useTrabajadores } from '../hooks/useTrabajadores';
import PageHeading from './PageHeading';
import PerfilRequerido from './PerfilRequerido';
import styles from './trabajador.module.css';

function CoberturaPage() {
  const { perfil, guardarPerfil } = useMiPerfil();
  const { zonas } = useTrabajadores();
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState(false);
  if (!perfil) return <PerfilRequerido />;

  const locked = perfil.status === 'PAUSED';
  const nombreZona = (id) => zonas.find((zona) => zona.id === id)?.name ?? '';
  const visibles = zonas.filter((zona) => zona.name.toLowerCase().includes(search.trim().toLowerCase()));

  const toggleZone = (id) => {
    setSaved(false);
    guardarPerfil({
      ...perfil,
      zoneIds: perfil.zoneIds.includes(id) ? perfil.zoneIds.filter((zoneId) => zoneId !== id) : [...perfil.zoneIds, id],
    });
  };

  return (
    <div>
      <PageHeading
        eyebrow="Dónde trabajas"
        title="Área de cobertura"
        description="Selecciona los barrios a los que puedes desplazarte."
        action={<Boton disabled={locked} onClick={() => setSaved(true)}>Guardar cambios</Boton>}
      />
      {locked && (
        <StatusMessage className={styles.notice} variant="warning">
          Reactiva tu perfil desde el panel para editar tu cobertura.
        </StatusMessage>
      )}
      {saved && <StatusMessage className={styles.notice}>Área de cobertura guardada correctamente.</StatusMessage>}
      <section
        className={`${ui.infoCard} ${styles.coverageLayout} ${locked ? styles.locked : ''}`}
        inert={locked}
      >
        <div>
          <h2 className={styles.selectedTitle}>Barrios seleccionados</h2>
          {perfil.zoneIds.length ? (
            <div className={styles.tags}>
              {perfil.zoneIds.map((id) => (
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
                checked={perfil.zoneIds.includes(zona.id)}
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
