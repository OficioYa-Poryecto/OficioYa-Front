import { useNavigate } from 'react-router-dom';
import Gallery from './Gallery';
import NeighborhoodCard from '../../core/components/NeighborhoodCard';
import PrivateContactCard from '../../core/components/PrivateContactCard';
import ProfileHero from '../../core/components/ProfileHero';
import ScheduleEditor from './ScheduleEditor';
import Boton from '../../core/design-system/Boton';
import Icon from '../../core/design-system/Icon';
import ui from '../../core/design-system/ui.module.css';
import { useTrabajadores } from '../hooks/useTrabajadores';
import styles from './trabajadores.module.css';

function TrabajadorDetallePage() {
  const navigate = useNavigate();
  const { trabajador, fotos } = useTrabajadores();

  return (
    <div className={`${ui.page} ${ui.profilePage}`}>
      <div className={ui.profileTop}>
        <ProfileHero initials={trabajador.initials} name={trabajador.name} roles={['Trabajador']} />
        <Boton icon="edit" onClick={() => navigate('/trabajador/editar')} variant="outline">
          Editar perfil
        </Boton>
      </div>
      <div className={styles.stats} aria-label="Reputación del trabajador">
        {trabajador.stats.map((stat) => (
          <div key={stat.label}>
            <span className={`${styles.statIcon} ${stat.icon === 'star' ? styles.star : ''}`}>
              <Icon name={stat.icon} size={20} />
            </span>
            <span><strong>{stat.value}</strong><small>{stat.label}</small></span>
          </div>
        ))}
      </div>
      <div className={`${ui.profileLayout} ${ui.contentFirst}`}>
        <aside className={ui.profileSidebar}>
          <PrivateContactCard email={trabajador.maskedEmail} phones={trabajador.maskedPhones} />
          <NeighborhoodCard
            label="Zona de cobertura"
            note="También atiendo barrios cercanos."
            zone={trabajador.zone}
          />
        </aside>
        <div className={ui.profileContent}>
          <section className={ui.infoCard}>
            <div className={ui.sectionHeader}>
              <div>
                <p className="eyebrow">Oficio principal</p>
                <h2>{trabajador.trade}</h2>
              </div>
              <div className={styles.rate}>
                <small>Desde</small>
                <strong>{trabajador.rate}</strong>
                <span>por visita</span>
              </div>
            </div>
            <p className={styles.description}>{trabajador.summary}</p>
            <div className={styles.skillTags}>
              {trabajador.skills.map((skill) => <span key={skill}>{skill}</span>)}
            </div>
          </section>
          <section className={ui.infoCard}>
            <div className={`${ui.sectionHeader} ${ui.sectionHeaderSimple}`}>
              <div>
                <p className="eyebrow">Esta semana</p>
                <h2>Disponibilidad</h2>
              </div>
              <span className={ui.availability}><span /> Disponible hoy</span>
            </div>
            <ScheduleEditor readOnly />
          </section>
          <section className={ui.infoCard}>
            <div className={`${ui.sectionHeader} ${ui.sectionHeaderSimple}`}>
              <div>
                <p className="eyebrow">Trabajo real</p>
                <h2>Galería</h2>
              </div>
              <span className={styles.photoCount}>{fotos.length} fotos</span>
            </div>
            <Gallery />
            <p className={styles.photoCredit}>
              Fotografías de trabajos · Imágenes por Timur Shakerzianov y Wesley Caribe en Unsplash
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TrabajadorDetallePage;
