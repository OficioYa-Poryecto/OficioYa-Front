import EditFormFooter from '../../core/components/EditFormFooter';
import EditNav from '../../core/components/EditNav';
import PhoneFields from '../../core/components/PhoneFields';
import ProfileHero from '../../core/components/ProfileHero';
import WorkInfoSections from '../../trabajadores/components/WorkInfoSections';
import Field from '../../core/design-system/Field';
import FormSection from '../../core/design-system/FormSection';
import ui from '../../core/design-system/ui.module.css';
import { useAuth } from '../hooks/useAuth';

const WORKER_SECTIONS = ['Mi trabajo', 'Disponibilidad', 'Galería'];

function ContratanteEditarPage() {
  const { contratante, hasWorkerRole } = useAuth();

  return (
    <div className={`${ui.page} ${ui.editPage}`}>
      <div className={ui.editHeading}>
        <div>
          <p className="eyebrow">Mi cuenta</p>
          <h1>Editar perfil</h1>
          <p>
            Mantén tus datos al día
            {hasWorkerRole
              ? ' y completa la información de tus dos roles.'
              : ' para solicitar servicios con confianza.'}
          </p>
        </div>
      </div>
      <div className={ui.editLayout}>
        <EditNav items={['Datos personales', ...(hasWorkerRole ? WORKER_SECTIONS : [])]} />
        <section className={`${ui.formCard} ${ui.editForm}`}>
          <ProfileHero
            editing
            initials={contratante.initials}
            name={contratante.name}
            roles={hasWorkerRole ? ['Contratante', 'Trabajador'] : ['Contratante']}
          />
          <FormSection title="Datos personales">
            <div className={ui.formGrid}>
              <Field label="Nombre completo" value={contratante.name} />
              <Field
                hint="Por seguridad, el correo no se puede editar. Escríbenos si necesitas cambiarlo."
                label="Correo electrónico"
                locked
                value={contratante.email}
              />
              <PhoneFields initialPhones={contratante.phones} />
              <Field icon="map" label="Barrio o zona frecuente" value={contratante.zone} />
            </div>
          </FormSection>
          {hasWorkerRole && <WorkInfoSections about={contratante.about} zone={contratante.zone} />}
          <EditFormFooter cancelTo="/contratante/perfil" />
        </section>
      </div>
    </div>
  );
}

export default ContratanteEditarPage;
